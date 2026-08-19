import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../app.js'

describe('GET /api/boards', () => {
  it('回傳固定的討論區清單', async () => {
    const res = await request(app).get('/api/boards')

    expect(res.status).toBe(200)
    const names = res.body.boards.map((b) => b.name)
    expect(names).toEqual(expect.arrayContaining(['育雛資訊', '生存指南', '日常分享', '覓食情報']))
  })
})

describe('GET /api/boards/:boardId', () => {
  it('回傳單一討論區資訊', async () => {
    const listRes = await request(app).get('/api/boards')
    const board = listRes.body.boards[0]

    const res = await request(app).get(`/api/boards/${board.id}`)

    expect(res.status).toBe(200)
    expect(res.body.board.id).toBe(board.id)
  })

  it('找不到討論區回傳 404 BOARD_NOT_FOUND', async () => {
    const res = await request(app).get('/api/boards/nonexistent-id')

    expect(res.status).toBe(404)
    expect(res.body.error.code).toBe('BOARD_NOT_FOUND')
  })
})
