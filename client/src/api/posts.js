import { request } from './client'

export async function fetchRecommendedPosts() {
  const { posts } = await request('/posts/recommended')
  return posts
}

export function likePost(id, token) {
  return request(`/posts/${id}/like`, { method: 'POST', token })
}

export function unlikePost(id, token) {
  return request(`/posts/${id}/like`, { method: 'DELETE', token })
}
