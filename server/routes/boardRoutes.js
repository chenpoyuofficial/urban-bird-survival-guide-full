import express from 'express'
import * as boardController from '../controllers/boardController.js'
import * as postController from '../controllers/postController.js'
import { requireAuth, optionalAuth } from '../middleware/auth.js'

const router = express.Router()

router.get('/', boardController.listBoards)
router.get('/:boardId', boardController.getBoard)

// 巢狀路由：新增/列出某討論區底下的文章
router.get('/:boardId/posts', optionalAuth, postController.listPostsByBoard)
router.post('/:boardId/posts', requireAuth, postController.createPost)

export default router
