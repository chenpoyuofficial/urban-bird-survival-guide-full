import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import request from 'supertest'
import bcrypt from 'bcrypt'
import app from '../app.js'
import prisma from '../lib/prisma.js'
import { resetDatabase } from './helpers.js'

const validUser = {
  email: 'birdwatcher@example.com',
  password: 'password123',
  nickname: '賞鳥新手',
}

beforeEach(async () => {
  await resetDatabase()
})

afterAll(async () => {
  await resetDatabase()
  await prisma.$disconnect()
})

describe('POST /api/auth/register', () => {
  it('註冊成功回傳 user（不含密碼）與 token', async () => {
    const res = await request(app).post('/api/auth/register').send(validUser)

    expect(res.status).toBe(201)
    expect(res.body.user.email).toBe(validUser.email)
    expect(res.body.user.nickname).toBe(validUser.nickname)
    expect(res.body.user.password).toBeUndefined()
    expect(typeof res.body.token).toBe('string')
  })

  it('email 重複註冊回傳 409 EMAIL_EXISTS', async () => {
    await request(app).post('/api/auth/register').send(validUser)
    const res = await request(app).post('/api/auth/register').send(validUser)

    expect(res.status).toBe(409)
    expect(res.body.error.code).toBe('EMAIL_EXISTS')
  })

  it('email 格式錯誤回傳 400 VALIDATION_ERROR', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...validUser, email: 'not-an-email' })

    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('VALIDATION_ERROR')
  })

  it('密碼少於 8 碼回傳 400 VALIDATION_ERROR', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...validUser, password: '1234567' })

    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('VALIDATION_ERROR')
  })

  it('資料庫裡存的密碼是 bcrypt hash，不是明文', async () => {
    const res = await request(app).post('/api/auth/register').send(validUser)

    const storedUser = await prisma.user.findUnique({ where: { id: res.body.user.id } })

    expect(storedUser.password).not.toBe(validUser.password)
    expect(storedUser.password).toMatch(/^\$2[aby]\$/)
    await expect(bcrypt.compare(validUser.password, storedUser.password)).resolves.toBe(true)
  })
})

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app).post('/api/auth/register').send(validUser)
  })

  it('帳密正確回傳 200 與 token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: validUser.email, password: validUser.password })

    expect(res.status).toBe(200)
    expect(typeof res.body.token).toBe('string')
  })

  it('密碼錯誤回傳 401 INVALID_CREDENTIALS', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: validUser.email, password: 'wrongpassword' })

    expect(res.status).toBe(401)
    expect(res.body.error.code).toBe('INVALID_CREDENTIALS')
  })

  it('email 不存在回傳 401 INVALID_CREDENTIALS', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: validUser.password })

    expect(res.status).toBe(401)
    expect(res.body.error.code).toBe('INVALID_CREDENTIALS')
  })
})

describe('GET /api/auth/me', () => {
  async function getToken() {
    const res = await request(app).post('/api/auth/register').send(validUser)
    return res.body.token
  }

  it('帶有效 token 回傳目前使用者資訊', async () => {
    const token = await getToken()
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.user.email).toBe(validUser.email)
  })

  it('沒帶 token 回傳 401 UNAUTHORIZED', async () => {
    const res = await request(app).get('/api/auth/me')

    expect(res.status).toBe(401)
    expect(res.body.error.code).toBe('UNAUTHORIZED')
  })

  it('token 無效回傳 401 UNAUTHORIZED', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', 'Bearer invalid.token.here')

    expect(res.status).toBe(401)
    expect(res.body.error.code).toBe('UNAUTHORIZED')
  })
})

describe('PATCH /api/auth/me', () => {
  async function getToken() {
    const res = await request(app).post('/api/auth/register').send(validUser)
    return res.body.token
  }

  it('更新個人資料成功回傳新資料', async () => {
    const token = await getToken()
    const res = await request(app)
      .patch('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ nickname: '賞鳥老手', habitat: '愛河沿岸', gender: 'FEMALE', bio: '喜歡在河堤散步' })

    expect(res.status).toBe(200)
    expect(res.body.user.nickname).toBe('賞鳥老手')
    expect(res.body.user.habitat).toBe('愛河沿岸')
    expect(res.body.user.gender).toBe('FEMALE')
    expect(res.body.user.bio).toBe('喜歡在河堤散步')
  })

  it('habitat/bio 傳空字串會存成 null', async () => {
    const token = await getToken()
    const res = await request(app)
      .patch('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ nickname: '賞鳥老手', habitat: '', gender: 'MALE', bio: '' })

    expect(res.status).toBe(200)
    expect(res.body.user.habitat).toBeNull()
    expect(res.body.user.bio).toBeNull()
  })

  it('gender 不合法時 fallback 成 UNDISCLOSED，不回錯誤', async () => {
    const token = await getToken()
    const res = await request(app)
      .patch('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ nickname: '賞鳥老手', gender: 'NOT_A_GENDER' })

    expect(res.status).toBe(200)
    expect(res.body.user.gender).toBe('UNDISCLOSED')
  })

  it('nickname 空白回傳 400 VALIDATION_ERROR', async () => {
    const token = await getToken()
    const res = await request(app)
      .patch('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ nickname: '  ' })

    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('VALIDATION_ERROR')
  })

  it('bio 超過 100 字回傳 400 VALIDATION_ERROR', async () => {
    const token = await getToken()
    const res = await request(app)
      .patch('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ nickname: '賞鳥老手', bio: '長'.repeat(101) })

    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('VALIDATION_ERROR')
  })

  it('不接受變更 email/password', async () => {
    const token = await getToken()
    const res = await request(app)
      .patch('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ nickname: '賞鳥老手', email: 'hacked@example.com', password: 'newpassword123' })

    expect(res.status).toBe(200)
    expect(res.body.user.email).toBe(validUser.email)

    const storedUser = await prisma.user.findUnique({ where: { email: validUser.email } })
    await expect(bcrypt.compare(validUser.password, storedUser.password)).resolves.toBe(true)
  })

  it('沒帶 token 回傳 401 UNAUTHORIZED', async () => {
    const res = await request(app).patch('/api/auth/me').send({ nickname: '賞鳥老手' })

    expect(res.status).toBe(401)
    expect(res.body.error.code).toBe('UNAUTHORIZED')
  })
})
