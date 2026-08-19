import * as commentService from '../services/commentService.js'

export async function listComments(req, res) {
  const comments = await commentService.listComments(req.params.postId)
  res.status(200).json({ comments })
}

export async function createComment(req, res) {
  const comment = await commentService.createComment(req.params.postId, req.user.id, req.body)
  res.status(201).json({ comment })
}

export async function deleteComment(req, res) {
  await commentService.deleteComment(req.params.id, req.user.id)
  res.status(204).send()
}
