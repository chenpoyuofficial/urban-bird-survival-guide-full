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
import Field from '../components/ui/Field'
import PaginationDots from '../components/ui/PaginationDots'
import FilterChip from '../components/ui/FilterChip'
import MapPin from '../components/ui/MapPin'
import IconButton from '../components/ui/IconButton'
import Fab from '../components/ui/Fab'
import raisingChicksImg from '../assets/boards/raising-chicks.jpg'
import survivalGuideImg from '../assets/boards/survival-guide.jpg'
import dailySharingImg from '../assets/boards/daily-sharing.jpg'
import foragingInfoImg from '../assets/boards/foraging-info.jpg'
import { mockNavItems } from '../mock/navItems'
import { genderOptions } from '../mock/profile'

const mockBoards = [
  { key: 'raising-chicks', title: '育雛資訊', image: raisingChicksImg, heat: '2.2k', postCount: 95, favorited: true },
  { key: 'survival-guide', title: '生存指南', image: survivalGuideImg, heat: '1.3k', postCount: 64 },
  { key: 'daily-sharing', title: '日常分享', image: dailySharingImg, heat: '5.7k', postCount: 258 },
  { key: 'foraging-info', title: '覓食情報', image: foragingInfoImg, heat: '0.6k', postCount: 35 },
]

function Playground() {
  const [nickname, setNickname] = useState('美術東路小麻雀')
  const [gender, setGender] = useState('MALE')
  const [bio, setBio] = useState('手邊隨時備有紙箱與毛巾，澄清湖附近需要支援請啾我！')
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

  const [likedKeys, setLikedKeys] = useState(() => new Set())
  const toggleLike = (key) => {
    setLikedKeys((prev) => {
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
            likeCount={likedKeys.has('demo-1') ? 597 : 596}
            commentCount={42}
            likedByMe={likedKeys.has('demo-1')}
            onLikeClick={() => toggleLike('demo-1')}
          />
          <PostCard
            authorName="澄清湖翠鳥哥"
            createdAt="昨天"
            tag="好康"
            boardName="覓食情報"
            title="澄清湖後門私人果園的桑椹熟透了，根本吃不完！"
            excerpt="低調分享！澄清湖後山小路進去的那片私人果園，最近紫黑色的桑椹掉了一地，果肉..."
            likeCount={955}
            commentCount={88}
            likedByMe
            onLikeClick={() => {}}
          />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-sm font-medium text-ink/60 mb-3">PaginationDots</h2>
        <div className="flex flex-col gap-4 rounded-lg border border-ink/10 bg-paper p-4 shadow-soft">
          <PaginationDots count={5} activeIndex={0} onDotClick={(i) => console.log('jump to', i)} />
          <PaginationDots count={5} activeIndex={2} onDotClick={(i) => console.log('jump to', i)} />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-sm font-medium text-ink/60 mb-3">FilterChip</h2>
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-ink/10 bg-paper p-4 shadow-soft">
          <FilterChip icon="e911_emergency" label="救難" severity="danger" selected />
          <FilterChip icon="emergency_home" label="警示" severity="warning" selected />
          <FilterChip icon="eco" label="資源" severity="normal" selected />
          <FilterChip icon="fork_spoon" label="食物" />
          <FilterChip size="sm" icon="precision_manufacturing" label="工事" />
          <FilterChip size="sm" icon="brand_awareness" label="噪音" severity="warning" selected />
          <FilterChip size="sm" icon="water_drop" label="乾淨水源" severity="normal" selected />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-sm font-medium text-ink/60 mb-3">MapPin</h2>
        <div className="flex items-end gap-6 rounded-lg border border-ink/10 bg-paper p-4 shadow-soft">
          <MapPin icon="eco" severity="normal" />
          <MapPin icon="emergency_home" severity="warning" />
          <MapPin icon="e911_emergency" severity="danger" />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-sm font-medium text-ink/60 mb-3">IconButton / Fab</h2>
        <div className="flex items-center gap-4 rounded-lg border border-ink/10 bg-paper p-4 shadow-soft">
          <IconButton icon="explore" ariaLabel="定向" />
          <IconButton icon="my_location" ariaLabel="定位" />
          <IconButton icon="edit" ariaLabel="編輯" variant="plain" />
          <Fab />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-sm font-medium text-ink/60 mb-3">Field</h2>
        <div className="flex flex-col items-start gap-4 rounded-lg border border-ink/10 bg-paper p-4 shadow-soft">
          <Field label="暱稱" value="美術東路小麻雀" variant="display" />
          <Field
            label="暱稱"
            value={nickname}
            variant="editable"
            onChange={setNickname}
            className="w-full"
          />
          <Field
            label="性別"
            value={gender}
            variant="editable"
            type="select"
            options={genderOptions}
            onChange={setGender}
            className="w-full"
          />
          <Field
            label="簡介"
            value={bio}
            variant="editable"
            type="textarea"
            maxLength={100}
            onChange={setBio}
            className="w-full"
          />
        </div>
      </section>
    </div>
  )
}

export default Playground
