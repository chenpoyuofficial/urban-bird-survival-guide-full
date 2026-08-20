import { ApiError } from './client'

const USERS_KEY = 'bird_fake_users'
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function readUsers() {
  try {
    return JSON.parse(sessionStorage.getItem(USERS_KEY)) ?? {}
  } catch {
    return {}
  }
}

function writeUsers(users) {
  sessionStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function toSafeUser(user) {
  const { password: _password, ...safeUser } = user
  return safeUser
}

// 假模式下的驗證規則跟後端 authService 對齊，只是驗證發生在前端而非真的打 API
export function registerFakeUser({ email, password, nickname }) {
  if (!email || !EMAIL_REGEX.test(email)) {
    throw new ApiError('請輸入有效的 email', 'VALIDATION_ERROR', 400)
  }
  if (!password || password.length < 8) {
    throw new ApiError('密碼至少需要 8 個字元', 'VALIDATION_ERROR', 400)
  }
  if (!nickname) {
    throw new ApiError('請輸入暱稱', 'VALIDATION_ERROR', 400)
  }

  const users = readUsers()
  if (users[email]) {
    throw new ApiError('此 email 已被註冊', 'EMAIL_EXISTS', 409)
  }

  const user = {
    id: `fake-${crypto.randomUUID()}`,
    email,
    password,
    nickname,
    habitat: null,
    gender: 'UNDISCLOSED',
    bio: null,
  }
  users[email] = user
  writeUsers(users)
  return toSafeUser(user)
}

export function loginFakeUser(email, password) {
  const users = readUsers()
  const user = users[email]
  if (!user || user.password !== password) {
    throw new ApiError('email 或密碼錯誤', 'INVALID_CREDENTIALS', 401)
  }
  return toSafeUser(user)
}

export function getFakeUserByEmail(email) {
  const users = readUsers()
  const user = users[email]
  return user ? toSafeUser(user) : null
}
