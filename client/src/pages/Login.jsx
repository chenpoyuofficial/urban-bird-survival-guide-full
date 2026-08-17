import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Header from '../components/ui/Header'
import Field from '../components/ui/Field'
import Button from '../components/ui/Button'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('login', { email, password })
  }

  return (
    <div className="flex min-h-screen max-w-md mx-auto flex-col bg-paper px-6 pt-[144px]">
      <div className="fixed inset-x-0 top-0 z-10">
        <Header actionIcon="arrow_back" actionLabel="回上頁" onActionClick={() => navigate(-1)} className="mx-auto max-w-md" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-[26px]">
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

        <div className="flex flex-col items-center gap-2">
          <Button label="登入" type="submit" />
          <Link to="/register" className="px-1 py-3 text-base font-medium text-ink underline">
            還沒有帳號嗎？點此註冊
          </Link>
        </div>
      </form>
    </div>
  )
}

export default Login
