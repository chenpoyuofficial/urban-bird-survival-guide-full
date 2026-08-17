import NavIconButton from '../components/ui/NavIconButton'
import BottomNavBar from '../components/ui/BottomNavBar'
import Header from '../components/ui/Header'

const mockNavItems = [
  { key: 'board', icon: 'forum', label: '討論區', badgeCount: 12 },
  { key: 'map', icon: 'map', label: '地圖' },
  { key: 'friends', icon: 'group', label: '好友', badgeCount: 1 },
  { key: 'settings', icon: 'settings', label: '設定' },
]

function Playground() {
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
    </div>
  )
}

export default Playground
