import { useNavigate } from 'react-router-dom'
import Header from '../components/ui/Header'
import BottomNavBar from '../components/ui/BottomNavBar'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import LoginRequiredNotice from '../components/ui/LoginRequiredNotice'
import ChatCard from '../components/features/ChatCard'
import { mockNearbyFriends, mockRecentContacts, mockFriendList } from '../mock/friends'
import { mockNavItems, navRoutes } from '../mock/navItems'
import { useAuth } from '../context/AuthContext'

function FriendSection({ title, friends }) {
  return (
    <section>
      <h2 className="mb-3 text-xl font-medium text-ink">{title}</h2>
      <div className="flex flex-col gap-2.5">
        {friends.map((friend) => (
          <ChatCard
            key={friend.key}
            avatarSrc={friend.avatarSrc}
            name={friend.name}
            status={friend.status}
            preview={friend.preview}
            unreadCount={friend.unreadCount}
            onClick={() => console.log('open chat', friend.key)}
          />
        ))}
      </div>
    </section>
  )
}

function Friends() {
  const navigate = useNavigate()
  const { status } = useAuth()

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
            activeKey="friends"
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
        <Header
          actionIcon="person_add"
          actionLabel="新增好友"
          className="mx-auto max-w-md"
          onActionClick={() => console.log('add friend')}
        />
      </div>

      <FriendSection title="附近鳥友" friends={mockNearbyFriends} />
      <FriendSection title="最近聯絡" friends={mockRecentContacts} />
      <FriendSection title="好友列表" friends={mockFriendList} />

      <div className="fixed inset-x-0 bottom-0 z-10 w-full">
        <BottomNavBar
          items={mockNavItems}
          activeKey="friends"
          onItemClick={(key) => navRoutes[key] && navigate(navRoutes[key])}
          className="mx-auto max-w-md"
        />
      </div>
    </div>
  )
}

export default Friends
