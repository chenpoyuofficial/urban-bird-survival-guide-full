import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Header from '../components/ui/Header'
import Field from '../components/ui/Field'
import Button from '../components/ui/Button'
import DemoModeBanner from '../components/ui/DemoModeBanner'
import { useAuth } from '../context/AuthContext'

function Login() {
  const navigate = useNavigate()
  const { mode, login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email, password)
      navigate('/board')
    } catch (err) {
      setError(err.message ?? '登入失敗，請稍後再試')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen max-w-md mx-auto flex-col bg-paper px-6 pt-[144px]">
      <div className="fixed inset-x-0 top-0 z-10">
        <Header actionIcon="arrow_back" actionLabel="回上頁" onActionClick={() => navigate(-1)} className="mx-auto max-w-md" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-[26px]">
        {mode === 'fake' && <DemoModeBanner />}
        <h1 className="text-2xl font-medium text-ink">請輸入信箱與密碼</h1>

        <div className="flex w-full flex-col gap-2">
          <Field
            label="電子信箱"
            type="email"
            value={email}
            onChange={setEmail}
            variant="editable"
            placeholder="sparrow@example.com"
            required
          />
          <Field
            label="密碼"
            type="password"
            value={password}
            onChange={setPassword}
            variant="editable"
            placeholder="請輸入密碼"
            required
          />
        </div>

        {error && <p className="text-sm font-medium text-alert">{error}</p>}

        <div className="flex flex-col items-center gap-2">
          <Button label={submitting ? '登入中...' : '登入'} type="submit" disabled={submitting} />
          <Link to="/register" className="px-1 py-3 text-base font-medium text-ink underline">
            還沒有帳號嗎？點此註冊
          </Link>
        </div>
      </form>
    </div>
  )
}

export default Login
