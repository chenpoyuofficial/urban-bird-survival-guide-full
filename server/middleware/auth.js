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

// 給訪客也能瀏覽的 GET route 用：有帶有效 token 就設定 req.user，
// 沒帶或無效一律當訪客放行，不擋請求（用來判斷 likedByMe 之類的個人化欄位）
export function optionalAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return next()
  }

  const token = header.slice('Bearer '.length)
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = { id: payload.userId }
  } catch {
    // 忽略無效 token，視為訪客
  }
  next()
}
