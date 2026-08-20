import * as postService from '../services/postService.js'

export async function getRecommended(req, res) {
  const posts = await postService.getRecommended(req.user?.id)
  res.status(200).json({ posts })
}

export async function listPostsByBoard(req, res) {
  const posts = await postService.listPostsByBoard(req.params.boardId, req.user?.id)
  res.status(200).json({ posts })
}

export async function createPost(req, res) {
  const post = await postService.createPost(req.params.boardId, req.user.id, req.body)
  res.status(201).json({ post })
}

export async function getPost(req, res) {
  const post = await postService.getPostById(req.params.id, req.user?.id)
  res.status(200).json({ post })
}

export async function updatePost(req, res) {
  const post = await postService.updatePost(req.params.id, req.user.id, req.body)
  res.status(200).json({ post })
}

export async function deletePost(req, res) {
  await postService.deletePost(req.params.id, req.user.id)
  res.status(204).send()
}

export async function likePost(req, res) {
  await postService.likePost(req.params.id, req.user.id)
  res.status(204).send()
}

export async function unlikePost(req, res) {
  await postService.unlikePost(req.params.id, req.user.id)
  res.status(204).send()
}
