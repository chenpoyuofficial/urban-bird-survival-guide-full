import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma.js'
import AppError from '../utils/AppError.js'

const SALT_ROUNDS = 10
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

function toSafeUser(user) {
  const { password, ...safeUser } = user
  return safeUser
}

export async function register({ email, password, nickname }) {
  if (!email || !EMAIL_REGEX.test(email)) {
    throw new AppError('請輸入有效的 email', 400, 'VALIDATION_ERROR')
  }
  if (!password || password.length < 8) {
    throw new AppError('密碼至少需要 8 個字元', 400, 'VALIDATION_ERROR')
  }
  if (!nickname) {
    throw new AppError('請輸入暱稱', 400, 'VALIDATION_ERROR')
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    throw new AppError('此 email 已被註冊', 409, 'EMAIL_EXISTS')
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, nickname },
  })

  return { user: toSafeUser(user), token: signToken(user.id) }
}

export async function login({ email, password }) {
  if (!email || !password) {
    throw new AppError('請輸入 email 與密碼', 400, 'VALIDATION_ERROR')
  }

  const user = await prisma.user.findUnique({ where: { email } })
  const passwordMatches = user && (await bcrypt.compare(password, user.password))
  if (!passwordMatches) {
    throw new AppError('email 或密碼錯誤', 401, 'INVALID_CREDENTIALS')
  }

  return { user: toSafeUser(user), token: signToken(user.id) }
}

export async function getMe(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    throw new AppError('使用者不存在', 404, 'USER_NOT_FOUND')
  }
  return toSafeUser(user)
}
