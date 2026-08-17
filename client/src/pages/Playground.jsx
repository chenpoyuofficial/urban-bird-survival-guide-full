import { useState } from 'react'
import NavIconButton from '../components/ui/NavIconButton'
import BottomNavBar from '../components/ui/BottomNavBar'
import Header from '../components/ui/Header'
import BoardCard from '../components/ui/BoardCard'
import Tag from '../components/ui/Tag'
import StatTag from '../components/ui/StatTag'
import Avatar from '../components/ui/Avatar'
import UserInfo from '../components/ui/UserInfo'
import PostCard from '../components/features/PostCard'
import raisingChicksImg from '../assets/boards/raising-chicks.jpg'
import survivalGuideImg from '../assets/boards/survival-guide.jpg'
import dailySharingImg from '../assets/boards/daily-sharing.jpg'
import foragingInfoImg from '../assets/boards/foraging-info.jpg'

const mockNavItems = [
  { key: 'board', icon: 'forum', label: '討論區', badgeCount: 12 },
  { key: 'map', icon: 'map', label: '地圖' },
  { key: 'friends', icon: 'group', label: '好友', badgeCount: 1 },
  { key: 'settings', icon: 'settings', label: '設定' },
]

const mockBoards = [
  { key: 'raising-chicks', title: '育雛資訊', image: raisingChicksImg, heat: '2.2k', postCount: 95, favorited: true },
  { key: 'survival-guide', title: '生存指南', image: survivalGuideImg, heat: '1.3k', postCount: 64 },
  { key: 'daily-sharing', title: '日常分享', image: dailySharingImg, heat: '5.7k', postCount: 258 },
  { key: 'foraging-info', title: '覓食情報', image: foragingInfoImg, heat: '0.6k', postCount: 35 },
]

function Playground() {
  const [favoritedKeys, setFavoritedKeys] = useState(
    () => new Set(mockBoards.filter((b) => b.favorited).map((b) => b.key)),
  )

  const toggleFavorite = (key) => {
    setFavoritedKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <div className="min-h-screen max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold text-ink mb-2">元件 Playground</h1>
      <p className="text-ink/60 mb-8">
        僅供開發期比對外觀使用，每刻好一個共用元件就在此列出主要狀態。
      </p>

      <section className="mb-10">
        <h2 className="text-sm font-medium text-ink/60 mb-3">NavIconButton</h2>
        <div className="flex items-center gap-4 rounded-lg border border-ink/10 bg-paper p-4 shadow-soft">
          <NavIconButton icon="forum" label="討論區" active />
          <NavIconButton icon="forum" label="討論區" active badgeCount={12} />
          <NavIconButton icon="forum" label="討論區" />
          <NavIconButton icon="forum" label="討論區" badgeCount={12} />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-sm font-medium text-ink/60 mb-3">BottomNavBar</h2>
        <div className="rounded-lg border border-ink/10 pt-3">
          <BottomNavBar items={mockNavItems} activeKey="board" />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-sm font-medium text-ink/60 mb-3">Header</h2>
        <div className="flex flex-col gap-3 overflow-hidden rounded-lg border border-ink/10">
          <Header />
          <Header actionIcon="add" actionLabel="發文" />
          <Header actionLabel={null} />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-sm font-medium text-ink/60 mb-3">BoardCard</h2>
        <div className="flex flex-col gap-3 rounded-lg border border-ink/10 p-4">
          {mockBoards.map((board) => (
            <BoardCard
              key={board.key}
              title={board.title}
              image={board.image}
              heat={board.heat}
              postCount={board.postCount}
              favorited={favoritedKeys.has(board.key)}
              onToggleFavorite={() => toggleFavorite(board.key)}
              onClick={() => console.log('open board', board.key)}
            />
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-sm font-medium text-ink/60 mb-3">Tag</h2>
        <div className="flex items-center gap-2 rounded-lg border border-ink/10 bg-paper p-4 shadow-soft">
          <Tag label="注意" variant="filled" />
          <Tag label="生存指南" variant="outline" />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-sm font-medium text-ink/60 mb-3">StatTag</h2>
        <div className="flex items-center gap-4 rounded-lg border border-ink/10 bg-paper p-4 shadow-soft">
          <StatTag icon="thumb_up" value={2234} />
          <StatTag icon="thumb_up" value={2234} muted />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-sm font-medium text-ink/60 mb-3">Avatar</h2>
        <div className="flex items-center gap-4 rounded-lg border border-ink/10 bg-paper p-4 shadow-soft">
          <Avatar size="md" />
          <Avatar size="sm" />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-sm font-medium text-ink/60 mb-3">UserInfo</h2>
        <div className="flex flex-col gap-4 rounded-lg border border-ink/10 bg-paper p-4 shadow-soft">
          <UserInfo
            name="愛吃櫻桃的小綠"
            time="2 小時前"
            tag="注意"
            boardName="生存指南"
          />
          <UserInfo name="使用者名稱" variant="single" />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-sm font-medium text-ink/60 mb-3">PostCard</h2>
        <div className="flex gap-3 overflow-x-auto rounded-lg border border-ink/10 p-4">
          <PostCard
            authorName="愛吃櫻桃的小綠"
            createdAt="2 小時前"
            tag="注意"
            boardName="生存指南"
            title="亞灣區某新蓋大樓玻璃帷幕反射太強，經過請減速繞道！"
            excerpt="今天早上沿著輕軌線飛過亞灣區那幾棟新大樓時，差點撞上高空大片落地窗，海天一色的反射真的太逼真了...。請南高雄的大家互相提醒家族成員。"
            likeCount={596}
            viewCount={1500}
            shareCount={8}
          />
          <PostCard
            authorName="澄清湖翠鳥哥"
            createdAt="昨天"
            tag="好康"
            boardName="覓食情報"
            title="澄清湖後門私人果園的桑椹熟透了，根本吃不完！"
            excerpt="低調分享！澄清湖後山小路進去的那片私人果園，最近紫黑色的桑椹掉了一地，果肉..."
            likeCount={954}
            viewCount={2234}
            shareCount={15}
          />
        </div>
      </section>
    </div>
  )
}

export default Playground
