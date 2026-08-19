import express from 'express'
import * as postController from '../controllers/postController.js'
import * as commentController from '../controllers/commentController.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

// 必須寫在 /:id 之前，否則 recommended 會被當成 :id 吃掉
router.get('/recommended', postController.getRecommended)

router.get('/:id', postController.getPost)
router.put('/:id', requireAuth, postController.updatePost)
router.delete('/:id', requireAuth, postController.deletePost)

// 巢狀路由：新增/列出某文章底下的留言
router.get('/:postId/comments', commentController.listComments)
router.post('/:postId/comments', requireAuth, commentController.createComment)

export default router
