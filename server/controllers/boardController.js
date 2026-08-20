import * as boardService from '../services/boardService.js'

export async function listBoards(req, res) {
  const boards = await boardService.listBoards()
  res.status(200).json({ boards })
}

export async function getBoard(req, res) {
  const board = await boardService.getBoardWithStats(req.params.boardId)
  res.status(200).json({ board })
}
