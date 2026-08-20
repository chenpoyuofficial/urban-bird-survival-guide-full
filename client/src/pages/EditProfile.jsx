import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/ui/Header'
import Field from '../components/ui/Field'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import LoginRequiredNotice from '../components/ui/LoginRequiredNotice'
import { genderOptions } from '../mock/profile'
import { useAuth } from '../context/AuthContext'

function EditProfile() {
  const navigate = useNavigate()
  const { status, user, updateProfile } = useAuth()

  if (status === 'loading') {
    return <LoadingSpinner />
  }

  if (status === 'guest') {
    return (
      <div className="flex min-h-screen max-w-md mx-auto flex-col bg-paper px-6 pt-[144px]">
        <div className="fixed inset-x-0 top-0 z-10">
          <Header actionIcon="arrow_back" actionLabel="回上頁" onActionClick={() => navigate(-1)} className="mx-auto max-w-md" />
        </div>
        <LoginRequiredNotice onLoginClick={() => navigate('/login')} />
      </div>
    )
  }

  return <EditProfileForm user={user} updateProfile={updateProfile} navigate={navigate} />
}

function EditProfileForm({ user, updateProfile, navigate }) {
  const [nickname, setNickname] = useState(user.nickname)
  const [habitat, setHabitat] = useState(user.habitat ?? '')
  const [gender, setGender] = useState(user.gender)
  const [bio, setBio] = useState(user.bio ?? '')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await updateProfile({ nickname, habitat, gender, bio })
      navigate('/settings')
    } catch (err) {
      setError(err.message ?? '更新失敗，請稍後再試')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen max-w-md mx-auto flex-col bg-paper px-6 pt-[144px] pb-12">
      <div className="fixed inset-x-0 top-0 z-10">
        <Header actionIcon="arrow_back" actionLabel="回上頁" onActionClick={() => navigate(-1)} className="mx-auto max-w-md" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-[26px]">
        <h1 className="text-2xl font-medium text-ink">編輯基本資料</h1>

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
            label="棲息地"
            value={habitat}
            onChange={setHabitat}
            variant="editable"
            placeholder="你最常出沒的地方"
          />
          <Field
            label="性別"
            value={gender}
            onChange={setGender}
            variant="editable"
            type="select"
            options={genderOptions}
          />
          <Field
            label="簡介"
            value={bio}
            onChange={setBio}
            variant="editable"
            type="textarea"
            placeholder="跟大家介紹一下自己吧！"
            maxLength={100}
          />
        </div>

        {error && <p className="text-sm font-medium text-alert">{error}</p>}

        <Button label={submitting ? '儲存中...' : '儲存'} type="submit" disabled={submitting} />
      </form>
    </div>
  )
}

export default EditProfile
