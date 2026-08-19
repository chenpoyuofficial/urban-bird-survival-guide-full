import prisma from '../lib/prisma.js'
import AppError from '../utils/AppError.js'
import { getPostById } from './postService.js'

const AUTHOR_SELECT = { id: true, nickname: true, habitat: true }

export async function listComments(postId) {
  await getPostById(postId)
  return prisma.comment.findMany({
    where: { postId },
    orderBy: { createdAt: 'asc' },
    include: { author: { select: AUTHOR_SELECT } },
  })
}

export async function createComment(postId, authorId, { content }) {
  await getPostById(postId)
  if (!content?.trim()) {
    throw new AppError('請輸入留言內容', 400, 'VALIDATION_ERROR')
  }

  return prisma.comment.create({
    data: { content, postId, authorId },
    include: { author: { select: AUTHOR_SELECT } },
  })
}

export async function deleteComment(id, userId) {
  const comment = await prisma.comment.findUnique({ where: { id } })
  if (!comment) {
    throw new AppError('找不到此留言', 404, 'COMMENT_NOT_FOUND')
  }
  if (comment.authorId !== userId) {
    throw new AppError('沒有權限刪除此留言', 403, 'FORBIDDEN')
  }
  await prisma.comment.delete({ where: { id } })
}
