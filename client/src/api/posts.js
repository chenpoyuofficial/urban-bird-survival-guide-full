import { request } from './client'

export async function fetchRecommendedPosts(token) {
  const { posts } = await request('/posts/recommended', { token })
  return posts
}

export async function fetchPostsByBoard(boardId, token) {
  const { posts } = await request(`/boards/${boardId}/posts`, { token })
  return posts
}

export async function fetchPost(id, token) {
  const { post } = await request(`/posts/${id}`, { token })
  return post
}

export async function createPost(boardId, payload, token) {
  const { post } = await request(`/boards/${boardId}/posts`, { method: 'POST', body: payload, token })
  return post
}

export async function updatePost(id, payload, token) {
  const { post } = await request(`/posts/${id}`, { method: 'PUT', body: payload, token })
  return post
}

export function likePost(id, token) {
  return request(`/posts/${id}/like`, { method: 'POST', token })
}

export function unlikePost(id, token) {
  return request(`/posts/${id}/like`, { method: 'DELETE', token })
}
