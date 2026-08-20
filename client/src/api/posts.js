import { request } from './client'

export async function fetchRecommendedPosts() {
  const { posts } = await request('/posts/recommended')
  return posts
}
