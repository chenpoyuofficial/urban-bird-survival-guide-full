import express from 'express'
import cors from 'cors'
import prisma from './lib/prisma.js'
import AppError from './utils/AppError.js'
import authRoutes from './routes/authRoutes.js'
import boardRoutes from './routes/boardRoutes.js'
import postRoutes from './routes/postRoutes.js'
import commentRoutes from './routes/commentRoutes.js'

const app = express()

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
  }),
)
app.use(express.json())

app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
  } catch {
    throw new AppError('資料庫連線異常', 503, 'DATABASE_UNAVAILABLE')
  }
  res.json({ status: 'ok' })
})

app.use('/api/auth', authRoutes)
app.use('/api/boards', boardRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/comments', commentRoutes)

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      code: err.code || 'INTERNAL_ERROR',
    },
  })
})

export default app
