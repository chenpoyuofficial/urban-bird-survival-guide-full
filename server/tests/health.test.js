import { describe, it, expect, vi, afterEach } from 'vitest'
import request from 'supertest'
import app from '../app.js'
import prisma from '../lib/prisma.js'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('GET /api/health', () => {
  it('伺服器與資料庫都正常時回傳 200', async () => {
    const res = await request(app).get('/api/health')

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ status: 'ok' })
  })

  it('資料庫連線異常時回傳 503 DATABASE_UNAVAILABLE', async () => {
    vi.spyOn(prisma, '$queryRaw').mockRejectedValueOnce(new Error('連線失敗'))

    const res = await request(app).get('/api/health')

    expect(res.status).toBe(503)
    expect(res.body.error.code).toBe('DATABASE_UNAVAILABLE')
  })
})
