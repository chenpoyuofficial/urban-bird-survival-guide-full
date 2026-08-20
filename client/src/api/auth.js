import { request } from './client'

export function login(email, password) {
  return request('/auth/login', { method: 'POST', body: { email, password } })
}

export function register(payload) {
  return request('/auth/register', { method: 'POST', body: payload })
}

export function getMe(token) {
  return request('/auth/me', { token })
}
