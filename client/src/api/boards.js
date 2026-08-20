import { request } from './client'

export async function fetchBoards() {
  const { boards } = await request('/boards')
  return boards
}
