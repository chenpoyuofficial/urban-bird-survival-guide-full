import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import request from 'supertest'
import app from '../app.js'
import prisma from '../lib/prisma.js'
import { resetDatabase, registerUser } from './helpers.js'

let boardId

beforeEach(async () => {
  await resetDatabase()
  const res = await request(app).get('/api/boards')
  boardId = res.body.boards[0].id
})

afterAll(async () => {
  await resetDatabase()
  await prisma.$disconnect()
})

async function createPost(token) {
  const res = await request(app)
    .post(`/api/boards/${boardId}/posts`)
    .set('Authorization', `Bearer ${token}`)
    .send({ title: '測試文章', content: '測試內容', tag: '閒聊' })
  return res.body.post
}

describe('POST /api/posts/:postId/comments', () => {
  it('登入使用者可以成功留言', async () => {
    const { token } = await registerUser(app)
    const post = await createPost(token)

    const res = await request(app)
      .post(`/api/posts/${post.id}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: '好可愛喔！' })

    expect(res.status).toBe(201)
    expect(res.body.comment.content).toBe('好可愛喔！')
  })

  it('未登入回傳 401 UNAUTHORIZED', async () => {
    const { token } = await registerUser(app)
    const post = await createPost(token)

    const res = await request(app).post(`/api/posts/${post.id}/comments`).send({ content: '好可愛喔！' })

    expect(res.status).toBe(401)
    expect(res.body.error.code).toBe('UNAUTHORIZED')
  })

  it('內容空白回傳 400 VALIDATION_ERROR', async () => {
    const { token } = await registerUser(app)
    const post = await createPost(token)

    const res = await request(app)
      .post(`/api/posts/${post.id}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: '   ' })

    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('VALIDATION_ERROR')
  })

  it('文章不存在回傳 404 POST_NOT_FOUND', async () => {
    const { token } = await registerUser(app)
    const res = await request(app)
      .post('/api/posts/nonexistent-id/comments')
      .set('Authorization', `Bearer ${token}`)
      .send({ content: '好可愛喔！' })

    expect(res.status).toBe(404)
    expect(res.body.error.code).toBe('POST_NOT_FOUND')
  })
})

describe('GET /api/posts/:postId/comments', () => {
  it('列出該文章的留言', async () => {
    const { token } = await registerUser(app)
    const post = await createPost(token)
    await request(app)
      .post(`/api/posts/${post.id}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: '第一則留言' })

    const res = await request(app).get(`/api/posts/${post.id}/comments`)

    expect(res.status).toBe(200)
    expect(res.body.comments).toHaveLength(1)
  })
})

describe('DELETE /api/comments/:id', () => {
  it('本人可以刪除自己的留言', async () => {
    const { token } = await registerUser(app)
    const post = await createPost(token)
    const commentRes = await request(app)
      .post(`/api/posts/${post.id}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: '要被刪除的留言' })

    const res = await request(app)
      .delete(`/api/comments/${commentRes.body.comment.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(204)
  })

  it('非本人刪除回傳 403 FORBIDDEN', async () => {
    const { token: ownerToken } = await registerUser(app)
    const post = await createPost(ownerToken)
    const commentRes = await request(app)
      .post(`/api/posts/${post.id}/comments`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ content: '別人的留言' })

    const { token: otherToken } = await registerUser(app)
    const res = await request(app)
      .delete(`/api/comments/${commentRes.body.comment.id}`)
      .set('Authorization', `Bearer ${otherToken}`)

    expect(res.status).toBe(403)
    expect(res.body.error.code).toBe('FORBIDDEN')
  })

  it('留言不存在回傳 404 COMMENT_NOT_FOUND', async () => {
    const { token } = await registerUser(app)
    const res = await request(app).delete('/api/comments/nonexistent-id').set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(404)
    expect(res.body.error.code).toBe('COMMENT_NOT_FOUND')
  })
})
