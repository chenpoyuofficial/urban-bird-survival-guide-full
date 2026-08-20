import { useNavigate } from 'react-router-dom'
import Header from '../components/ui/Header'
import BottomNavBar from '../components/ui/BottomNavBar'
import IconButton from '../components/ui/IconButton'
import Field from '../components/ui/Field'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import LoginRequiredNotice from '../components/ui/LoginRequiredNotice'
import profileBird from '../assets/settings/profile-bird.png'
import { mockNavItems, navRoutes } from '../mock/navItems'
import { mockProfile, genderLabels } from '../mock/profile'
import { useAuth } from '../context/AuthContext'

function Settings() {
  const navigate = useNavigate()
  const { status, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (status === 'loading') {
    return <LoadingSpinner />
  }

  if (status === 'guest') {
    return (
      <div className="flex flex-col min-h-screen bg-paper pb-24 pt-28 max-w-md mx-auto px-6 overflow-x-clip">
        <div className="fixed inset-x-0 top-0 z-10">
          <Header actionLabel="" className="mx-auto max-w-md" />
        </div>
        <LoginRequiredNotice onLoginClick={() => navigate('/login')} />
        <div className="fixed inset-x-0 bottom-0 z-10 w-full">
          <BottomNavBar
            items={mockNavItems}
            activeKey="settings"
            onItemClick={(key) => navRoutes[key] && navigate(navRoutes[key])}
            className="mx-auto max-w-md"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-paper pb-24 pt-28 max-w-md mx-auto gap-6 px-6 overflow-x-clip">
      <div className="fixed inset-x-0 top-0 z-10">
        <Header actionLabel="搜尋設定" className="mx-auto max-w-md" />
      </div>

      <section className="flex flex-col items-start gap-3">
        <h2 className="text-xl font-medium text-ink">基本資料</h2>
        <div className="relative flex w-full items-center gap-[3px] rounded-xl bg-white px-3 py-4 shadow-soft">
          <img src={profileBird} alt="" className="size-[120px] shrink-0 object-contain" />
          <div className="flex flex-1 flex-col items-start gap-2 min-w-0">
            <Field label="暱稱" value={mockProfile.nickname} />
            <div className="flex items-center gap-2">
              <Field label="棲息地" value={mockProfile.habitat} />
              <Field label="性別" value={genderLabels[mockProfile.gender]} />
            </div>
            <Field label="簡介" value={mockProfile.bio} className="w-full" />
          </div>
          <IconButton
            icon="edit"
            ariaLabel="編輯基本資料"
            variant="plain"
            onClick={() => navigate('/settings/edit')}
            className="absolute right-3 top-2.5"
          />
        </div>
      </section>

      <Button label="登出" onClick={handleLogout} className="self-center" />

      <div className="fixed inset-x-0 bottom-0 z-10 w-full">
        <BottomNavBar
          items={mockNavItems}
          activeKey="settings"
          onItemClick={(key) => navRoutes[key] && navigate(navRoutes[key])}
          className="mx-auto max-w-md"
        />
      </div>
    </div>
  )
}

export default Settings
