import request from 'supertest'
import prisma from '../lib/prisma.js'

export async function resetDatabase() {
  await prisma.comment.deleteMany()
  await prisma.post.deleteMany()
  await prisma.user.deleteMany()
}

export async function registerUser(app, overrides = {}) {
  const payload = {
    email: `tester_${Date.now()}_${Math.random().toString(36).slice(2)}@example.com`,
    password: 'password123',
    nickname: '測試使用者',
    ...overrides,
  }
  const res = await request(app).post('/api/auth/register').send(payload)
  return { token: res.body.token, user: res.body.user }
}
