import prisma from '../lib/prisma.js'
import AppError from '../utils/AppError.js'

export async function listBoards() {
  return prisma.board.findMany({ orderBy: { createdAt: 'asc' } })
}

export async function getBoardById(boardId) {
  const board = await prisma.board.findUnique({ where: { id: boardId } })
  if (!board) {
    throw new AppError('找不到此討論區', 404, 'BOARD_NOT_FOUND')
  }
  return board
}
