import { createContext, useContext, useEffect, useState } from 'react'
import { checkHealth } from '../api/client'
import * as realAuth from '../api/auth'
import * as fakeAuth from '../api/fakeAuth'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const TOKEN_KEY = 'bird_token'
const FAKE_SESSION_KEY = 'bird_fake_session'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [mode, setMode] = useState('checking') // 'checking' | 'real' | 'fake'
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState('loading') // 'loading' | 'authenticated' | 'guest'

  useEffect(() => {
    async function init() {
      const forceFake = import.meta.env.VITE_USE_MOCK === 'true'
      const isHealthy = forceFake ? false : await checkHealth()

      if (isHealthy) {
        setMode('real')
        const token = localStorage.getItem(TOKEN_KEY)
        if (!token) {
          setStatus('guest')
          return
        }
        try {
          const { user: me } = await realAuth.getMe(token)
          setUser(me)
          setStatus('authenticated')
        } catch {
          localStorage.removeItem(TOKEN_KEY)
          setStatus('guest')
        }
        return
      }

      setMode('fake')
      const savedEmail = sessionStorage.getItem(FAKE_SESSION_KEY)
      const fakeUser = savedEmail ? fakeAuth.getFakeUserByEmail(savedEmail) : null
      if (fakeUser) {
        setUser(fakeUser)
        setStatus('authenticated')
      } else {
        sessionStorage.removeItem(FAKE_SESSION_KEY)
        setStatus('guest')
      }
    }

    init()
  }, [])

  async function login(email, password) {
    if (mode === 'real') {
      const { user: loggedInUser, token } = await realAuth.login(email, password)
      localStorage.setItem(TOKEN_KEY, token)
      setUser(loggedInUser)
      setStatus('authenticated')
      return loggedInUser
    }

    const loggedInUser = fakeAuth.loginFakeUser(email, password)
    sessionStorage.setItem(FAKE_SESSION_KEY, email)
    setUser(loggedInUser)
    setStatus('authenticated')
    return loggedInUser
  }

  async function register(payload) {
    if (mode === 'real') {
      const { user: newUser, token } = await realAuth.register(payload)
      localStorage.setItem(TOKEN_KEY, token)
      setUser(newUser)
      setStatus('authenticated')
      return newUser
    }

    const newUser = fakeAuth.registerFakeUser(payload)
    sessionStorage.setItem(FAKE_SESSION_KEY, payload.email)
    setUser(newUser)
    setStatus('authenticated')
    return newUser
  }

  async function updateProfile(payload) {
    if (mode === 'real') {
      const token = localStorage.getItem(TOKEN_KEY)
      const { user: updatedUser } = await realAuth.updateMe(payload, token)
      setUser(updatedUser)
      return updatedUser
    }

    const updatedUser = fakeAuth.updateFakeUser(user.email, payload)
    setUser(updatedUser)
    return updatedUser
  }

  // 給頁面在 mode === 'real' 時打其他需登入 API 用（例如按讚），假模式沒有真正的 token
  function getToken() {
    return mode === 'real' ? localStorage.getItem(TOKEN_KEY) : null
  }

  function logout() {
    if (mode === 'real') {
      localStorage.removeItem(TOKEN_KEY)
    } else {
      sessionStorage.removeItem(FAKE_SESSION_KEY)
    }
    setUser(null)
    setStatus('guest')
  }

  if (mode === 'checking') {
    return <LoadingSpinner />
  }

  return (
    <AuthContext.Provider value={{ mode, user, status, login, register, updateProfile, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
