import express from 'express'
import * as commentController from '../controllers/commentController.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.delete('/:id', requireAuth, commentController.deleteComment)

export default router
