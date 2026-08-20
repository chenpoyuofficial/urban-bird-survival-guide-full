import { request } from './client'

export async function fetchComments(postId) {
  const { comments } = await request(`/posts/${postId}/comments`)
  return comments
}

export async function createComment(postId, content, token) {
  const { comment } = await request(`/posts/${postId}/comments`, { method: 'POST', body: { content }, token })
  return comment
}

export function deleteComment(commentId, token) {
  return request(`/comments/${commentId}`, { method: 'DELETE', token })
}
