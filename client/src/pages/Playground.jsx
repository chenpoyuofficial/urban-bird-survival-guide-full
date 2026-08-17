import { useState } from 'react'
import NavIconButton from '../components/ui/NavIconButton'
import BottomNavBar from '../components/ui/BottomNavBar'
import Header from '../components/ui/Header'
import BoardCard from '../components/ui/BoardCard'
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
    </div>
  )
}

export default Playground
