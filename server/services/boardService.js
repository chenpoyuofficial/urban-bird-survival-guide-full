import prisma from '../lib/prisma.js'
import AppError from '../utils/AppError.js'

// 熱度：文章數 x100 + 留言數 x10 + 讚數 x1，即時計算，不快取（見 CLAUDE.md）
async function withStats(board) {
  const [postCount, commentCount, likeCount] = await Promise.all([
    prisma.post.count({ where: { boardId: board.id } }),
    prisma.comment.count({ where: { post: { boardId: board.id } } }),
    prisma.like.count({ where: { post: { boardId: board.id } } }),
  ])

  return {
    ...board,
    postCount,
    heat: postCount * 100 + commentCount * 10 + likeCount,
  }
}

export async function listBoards() {
  const boards = await prisma.board.findMany({ orderBy: { createdAt: 'asc' } })
  return Promise.all(boards.map(withStats))
}

export async function getBoardById(boardId) {
  const board = await prisma.board.findUnique({ where: { id: boardId } })
  if (!board) {
    throw new AppError('找不到此討論區', 404, 'BOARD_NOT_FOUND')
  }
  return board
}

// 給 GET /api/boards/:boardId 用，額外算熱度/文章數；內部單純檢查看板是否存在
// 的情境（例如發文前檢查）用上面輕量版的 getBoardById 就好，不用多算這些
export async function getBoardWithStats(boardId) {
  const board = await getBoardById(boardId)
  return withStats(board)
}
