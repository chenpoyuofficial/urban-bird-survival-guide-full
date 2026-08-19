import prisma from '../lib/prisma.js'
import AppError from '../utils/AppError.js'
import { getBoardById } from './boardService.js'

const AUTHOR_SELECT = { id: true, nickname: true, habitat: true }
const BOARD_SELECT = { id: true, name: true }
const RECOMMENDED_LIMIT = 10
const VALID_TAGS = ['注意', '好康', '閒聊', '求助', '心得', '目擊', '揪團', '交易', '提問', '公告']

function assertValidTag(tag) {
  if (!VALID_TAGS.includes(tag)) {
    throw new AppError('標籤不合法', 400, 'VALIDATION_ERROR')
  }
}

function assertValidContent({ title, content }) {
  if (!title?.trim()) {
    throw new AppError('請輸入標題', 400, 'VALIDATION_ERROR')
  }
  if (!content?.trim()) {
    throw new AppError('請輸入內容', 400, 'VALIDATION_ERROR')
  }
}

async function assertOwnership(postId, userId) {
  const post = await prisma.post.findUnique({ where: { id: postId } })
  if (!post) {
    throw new AppError('找不到此文章', 404, 'POST_NOT_FOUND')
  }
  if (post.authorId !== userId) {
    throw new AppError('沒有權限操作此文章', 403, 'FORBIDDEN')
  }
  return post
}

export async function getRecommended() {
  return prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    take: RECOMMENDED_LIMIT,
    include: {
      board: { select: BOARD_SELECT },
      author: { select: AUTHOR_SELECT },
    },
  })
}

export async function listPostsByBoard(boardId) {
  await getBoardById(boardId)
  return prisma.post.findMany({
    where: { boardId },
    orderBy: { createdAt: 'desc' },
    include: { author: { select: AUTHOR_SELECT } },
  })
}

export async function createPost(boardId, authorId, { title, content, tag }) {
  await getBoardById(boardId)
  assertValidContent({ title, content })
  assertValidTag(tag)

  return prisma.post.create({
    data: { title, content, tag, boardId, authorId },
    include: {
      board: { select: BOARD_SELECT },
      author: { select: AUTHOR_SELECT },
    },
  })
}

export async function getPostById(id) {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      board: { select: BOARD_SELECT },
      author: { select: AUTHOR_SELECT },
    },
  })
  if (!post) {
    throw new AppError('找不到此文章', 404, 'POST_NOT_FOUND')
  }
  return post
}

export async function updatePost(id, userId, { title, content, tag }) {
  await assertOwnership(id, userId)
  assertValidContent({ title, content })
  assertValidTag(tag)

  return prisma.post.update({
    where: { id },
    data: { title, content, tag },
    include: {
      board: { select: BOARD_SELECT },
      author: { select: AUTHOR_SELECT },
    },
  })
}

export async function deletePost(id, userId) {
  await assertOwnership(id, userId)
  await prisma.post.delete({ where: { id } })
}
