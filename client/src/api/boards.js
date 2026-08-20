import { request } from './client'

export async function fetchBoards() {
  const { boards } = await request('/boards')
  return boards
}

export async function fetchBoardById(boardId) {
  const { board } = await request(`/boards/${boardId}`)
  return board
}
