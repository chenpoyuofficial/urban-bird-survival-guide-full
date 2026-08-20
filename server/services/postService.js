import prisma from '../lib/prisma.js'
import AppError from '../utils/AppError.js'
import { getBoardById } from './boardService.js'

const AUTHOR_SELECT = { id: true, nickname: true, habitat: true }
const BOARD_SELECT = { id: true, name: true }
const RECOMMENDED_LIMIT = 10
const BOARD_POSTS_LIMIT = 20
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

// 訪客（userId 為 undefined）不查 likes 關聯，likedByMe 一律 false
function postInclude(userId) {
  return {
    board: { select: BOARD_SELECT },
    author: { select: AUTHOR_SELECT },
    _count: { select: { likes: true, comments: true } },
    likes: userId ? { where: { userId }, select: { id: true } } : false,
  }
}

function toPostResponse(post) {
  const { _count, likes, ...rest } = post
  return {
    ...rest,
    likeCount: _count.likes,
    commentCount: _count.comments,
    likedByMe: (likes?.length ?? 0) > 0,
  }
}

export async function getRecommended(userId) {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    take: RECOMMENDED_LIMIT,
    include: postInclude(userId),
  })
  return posts.map(toPostResponse)
}

export async function listPostsByBoard(boardId, userId) {
  await getBoardById(boardId)
  const posts = await prisma.post.findMany({
    where: { boardId },
    orderBy: { createdAt: 'desc' },
    take: BOARD_POSTS_LIMIT,
    include: postInclude(userId),
  })
  return posts.map(toPostResponse)
}

export async function createPost(boardId, authorId, { title, content, tag }) {
  await getBoardById(boardId)
  assertValidContent({ title, content })
  assertValidTag(tag)

  const post = await prisma.post.create({
    data: { title, content, tag, boardId, authorId },
    include: postInclude(authorId),
  })
  return toPostResponse(post)
}

export async function getPostById(id, userId) {
  const post = await prisma.post.findUnique({
    where: { id },
    include: postInclude(userId),
  })
  if (!post) {
    throw new AppError('找不到此文章', 404, 'POST_NOT_FOUND')
  }
  return toPostResponse(post)
}

export async function updatePost(id, userId, { title, content, tag }) {
  await assertOwnership(id, userId)
  assertValidContent({ title, content })
  assertValidTag(tag)

  const post = await prisma.post.update({
    where: { id },
    data: { title, content, tag },
    include: postInclude(userId),
  })
  return toPostResponse(post)
}

export async function deletePost(id, userId) {
  await assertOwnership(id, userId)
  await prisma.post.delete({ where: { id } })
}

async function assertPostExists(postId) {
  const post = await prisma.post.findUnique({ where: { id: postId } })
  if (!post) {
    throw new AppError('找不到此文章', 404, 'POST_NOT_FOUND')
  }
}

export async function likePost(postId, userId) {
  await assertPostExists(postId)
  await prisma.like.upsert({
    where: { postId_userId: { postId, userId } },
    create: { postId, userId },
    update: {},
  })
}

export async function unlikePost(postId, userId) {
  await assertPostExists(postId)
  await prisma.like.deleteMany({ where: { postId, userId } })
}
