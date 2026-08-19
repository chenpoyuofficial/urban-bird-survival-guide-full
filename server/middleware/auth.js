import jwt from 'jsonwebtoken'
import AppError from '../utils/AppError.js'

export function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    throw new AppError('請先登入', 401, 'UNAUTHORIZED')
  }

  const token = header.slice('Bearer '.length)
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = { id: payload.userId }
    next()
  } catch {
    throw new AppError('登入已失效，請重新登入', 401, 'UNAUTHORIZED')
  }
}
