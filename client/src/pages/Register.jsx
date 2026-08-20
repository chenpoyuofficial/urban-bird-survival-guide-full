import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Header from '../components/ui/Header'
import Field from '../components/ui/Field'
import Button from '../components/ui/Button'
import DemoModeBanner from '../components/ui/DemoModeBanner'
import { useAuth } from '../context/AuthContext'

function Register() {
  const navigate = useNavigate()
  const { mode, register } = useAuth()
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('兩次輸入的密碼不一致')
      return
    }

    setSubmitting(true)
    try {
      await register({ nickname, email, password })
      navigate('/board')
    } catch (err) {
      setError(err.message ?? '註冊失敗，請稍後再試')
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
        <h1 className="text-2xl font-medium text-ink">請填寫基本資料</h1>

        <div className="flex w-full flex-col gap-2">
          <Field
            label="暱稱"
            value={nickname}
            onChange={setNickname}
            variant="editable"
            placeholder="幫自己取個好記的暱稱"
            required
          />
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
            placeholder="至少 8 個字元"
            required
          />
          <Field
            label="確認密碼"
            type="password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            variant="editable"
            placeholder="再輸入一次密碼"
            required
          />
        </div>

        {error && <p className="text-sm font-medium text-alert">{error}</p>}

        <div className="flex flex-col items-center gap-2">
          <Button label={submitting ? '註冊中...' : '註冊'} type="submit" disabled={submitting} />
          <Link to="/login" className="px-1 py-3 text-base font-medium text-ink underline">
            已經有帳號了嗎？點此登入
          </Link>
        </div>
      </form>
    </div>
  )
}

export default Register
