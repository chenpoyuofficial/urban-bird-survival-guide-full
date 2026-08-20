import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import request from 'supertest'
import app from '../app.js'
import prisma from '../lib/prisma.js'
import { resetDatabase, registerUser } from './helpers.js'

const validPost = {
  title: '今天在公園看到一隻五色鳥',
  content: '停在樹上好久，超可愛',
  tag: '目擊',
}

describe('GET /api/boards', () => {
  it('回傳固定的討論區清單', async () => {
    const res = await request(app).get('/api/boards')

    expect(res.status).toBe(200)
    const names = res.body.boards.map((b) => b.name)
    expect(names).toEqual(expect.arrayContaining(['育雛資訊', '生存指南', '日常分享', '覓食情報']))
  })

  it('每個看板都回傳 postCount 與 heat', async () => {
    const res = await request(app).get('/api/boards')

    res.body.boards.forEach((board) => {
      expect(board).toHaveProperty('postCount')
      expect(board).toHaveProperty('heat')
    })
  })
})

describe('GET /api/boards 的 heat 計算', () => {
  beforeEach(async () => {
    await resetDatabase()
  })

  afterAll(async () => {
    await resetDatabase()
    await prisma.$disconnect()
  })

  it('熱度 = 文章數 x100 + 留言數 x10 + 讚數 x1', async () => {
    const { token } = await registerUser(app)
    const boardsRes = await request(app).get('/api/boards')
    const boardId = boardsRes.body.boards[0].id

    const postRes = await request(app)
      .post(`/api/boards/${boardId}/posts`)
      .set('Authorization', `Bearer ${token}`)
      .send(validPost)
    const postId = postRes.body.post.id

    await request(app)
      .post(`/api/posts/${postId}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: '留言一則' })
    await request(app).post(`/api/posts/${postId}/like`).set('Authorization', `Bearer ${token}`)

    const res = await request(app).get('/api/boards')
    const board = res.body.boards.find((b) => b.id === boardId)

    // 1 篇文章 x100 + 1 則留言 x10 + 1 個讚 x1 = 111
    expect(board.postCount).toBe(1)
    expect(board.heat).toBe(111)
  })

  it('沒有文章/留言/讚的看板 heat 為 0', async () => {
    const res = await request(app).get('/api/boards')

    res.body.boards.forEach((board) => {
      expect(board.postCount).toBe(0)
      expect(board.heat).toBe(0)
    })
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

  it('也回傳 postCount 與 heat', async () => {
    const listRes = await request(app).get('/api/boards')
    const boardId = listRes.body.boards[0].id

    const res = await request(app).get(`/api/boards/${boardId}`)

    expect(res.body.board).toHaveProperty('postCount')
    expect(res.body.board).toHaveProperty('heat')
  })

  it('找不到討論區回傳 404 BOARD_NOT_FOUND', async () => {
    const res = await request(app).get('/api/boards/nonexistent-id')

    expect(res.status).toBe(404)
    expect(res.body.error.code).toBe('BOARD_NOT_FOUND')
  })
})
