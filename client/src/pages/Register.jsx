import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/ui/Header'
import Field from '../components/ui/Field'
import Button from '../components/ui/Button'

function Register() {
  const navigate = useNavigate()
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('register', { nickname, email, password, confirmPassword })
  }

  return (
    <div className="flex min-h-screen max-w-md mx-auto flex-col bg-paper px-6 pt-[144px]">
      <div className="fixed inset-x-0 top-0 z-10">
        <Header actionIcon="arrow_back" actionLabel="回上頁" onActionClick={() => navigate(-1)} className="mx-auto max-w-md" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-[26px]">
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

        <Button label="註冊" type="submit" />
      </form>
    </div>
  )
}

export default Register
