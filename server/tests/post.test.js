import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import request from 'supertest'
import app from '../app.js'
import prisma from '../lib/prisma.js'
import { resetDatabase, registerUser } from './helpers.js'

let boardId

const validPost = {
  title: '今天在公園看到一隻五色鳥',
  content: '停在樹上好久，超可愛',
  tag: '目擊',
}

beforeEach(async () => {
  await resetDatabase()
  const res = await request(app).get('/api/boards')
  boardId = res.body.boards[0].id
})

afterAll(async () => {
  await resetDatabase()
  await prisma.$disconnect()
})

describe('POST /api/boards/:boardId/posts', () => {
  it('登入使用者可以成功發文', async () => {
    const { token } = await registerUser(app)
    const res = await request(app)
      .post(`/api/boards/${boardId}/posts`)
      .set('Authorization', `Bearer ${token}`)
      .send(validPost)

    expect(res.status).toBe(201)
    expect(res.body.post.title).toBe(validPost.title)
    expect(res.body.post.tag).toBe(validPost.tag)
    expect(res.body.post.board.id).toBe(boardId)
  })

  it('未登入回傳 401 UNAUTHORIZED', async () => {
    const res = await request(app).post(`/api/boards/${boardId}/posts`).send(validPost)

    expect(res.status).toBe(401)
    expect(res.body.error.code).toBe('UNAUTHORIZED')
  })

  it('標籤不合法回傳 400 VALIDATION_ERROR', async () => {
    const { token } = await registerUser(app)
    const res = await request(app)
      .post(`/api/boards/${boardId}/posts`)
      .set('Authorization', `Bearer ${token}`)
      .send({ ...validPost, tag: '不存在的標籤' })

    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('VALIDATION_ERROR')
  })

  it('討論區不存在回傳 404 BOARD_NOT_FOUND', async () => {
    const { token } = await registerUser(app)
    const res = await request(app)
      .post('/api/boards/nonexistent-id/posts')
      .set('Authorization', `Bearer ${token}`)
      .send(validPost)

    expect(res.status).toBe(404)
    expect(res.body.error.code).toBe('BOARD_NOT_FOUND')
  })
})

describe('GET /api/boards/:boardId/posts', () => {
  it('列出該討論區的文章', async () => {
    const { token } = await registerUser(app)
    await request(app)
      .post(`/api/boards/${boardId}/posts`)
      .set('Authorization', `Bearer ${token}`)
      .send(validPost)

    const res = await request(app).get(`/api/boards/${boardId}/posts`)

    expect(res.status).toBe(200)
    expect(res.body.posts).toHaveLength(1)
  })
})

describe('GET /api/posts/recommended', () => {
  it('跨 board 回傳最新文章', async () => {
    const { token } = await registerUser(app)
    await request(app)
      .post(`/api/boards/${boardId}/posts`)
      .set('Authorization', `Bearer ${token}`)
      .send(validPost)

    const res = await request(app).get('/api/posts/recommended')

    expect(res.status).toBe(200)
    expect(res.body.posts.length).toBeGreaterThanOrEqual(1)
  })
})

describe('GET /api/posts/:id', () => {
  it('回傳單篇文章詳情', async () => {
    const { token } = await registerUser(app)
    const createRes = await request(app)
      .post(`/api/boards/${boardId}/posts`)
      .set('Authorization', `Bearer ${token}`)
      .send(validPost)

    const res = await request(app).get(`/api/posts/${createRes.body.post.id}`)

    expect(res.status).toBe(200)
    expect(res.body.post.title).toBe(validPost.title)
  })

  it('找不到文章回傳 404 POST_NOT_FOUND', async () => {
    const res = await request(app).get('/api/posts/nonexistent-id')

    expect(res.status).toBe(404)
    expect(res.body.error.code).toBe('POST_NOT_FOUND')
  })
})

describe('PUT /api/posts/:id', () => {
  it('本人可以編輯自己的文章', async () => {
    const { token } = await registerUser(app)
    const createRes = await request(app)
      .post(`/api/boards/${boardId}/posts`)
      .set('Authorization', `Bearer ${token}`)
      .send(validPost)

    const res = await request(app)
      .put(`/api/posts/${createRes.body.post.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ ...validPost, title: '更新後的標題' })

    expect(res.status).toBe(200)
    expect(res.body.post.title).toBe('更新後的標題')
  })

  it('非本人編輯回傳 403 FORBIDDEN', async () => {
    const { token: ownerToken } = await registerUser(app)
    const createRes = await request(app)
      .post(`/api/boards/${boardId}/posts`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send(validPost)

    const { token: otherToken } = await registerUser(app)
    const res = await request(app)
      .put(`/api/posts/${createRes.body.post.id}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ ...validPost, title: '想偷改別人的文章' })

    expect(res.status).toBe(403)
    expect(res.body.error.code).toBe('FORBIDDEN')
  })
})

describe('DELETE /api/posts/:id', () => {
  it('本人可以刪除自己的文章', async () => {
    const { token } = await registerUser(app)
    const createRes = await request(app)
      .post(`/api/boards/${boardId}/posts`)
      .set('Authorization', `Bearer ${token}`)
      .send(validPost)

    const res = await request(app)
      .delete(`/api/posts/${createRes.body.post.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(204)

    const getRes = await request(app).get(`/api/posts/${createRes.body.post.id}`)
    expect(getRes.status).toBe(404)
  })

  it('非本人刪除回傳 403 FORBIDDEN', async () => {
    const { token: ownerToken } = await registerUser(app)
    const createRes = await request(app)
      .post(`/api/boards/${boardId}/posts`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send(validPost)

    const { token: otherToken } = await registerUser(app)
    const res = await request(app)
      .delete(`/api/posts/${createRes.body.post.id}`)
      .set('Authorization', `Bearer ${otherToken}`)

    expect(res.status).toBe(403)
    expect(res.body.error.code).toBe('FORBIDDEN')
  })
})
