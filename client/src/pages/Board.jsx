import { useState } from 'react'
import Header from '../components/ui/Header'
import BoardCard from '../components/ui/BoardCard'
import BottomNavBar from '../components/ui/BottomNavBar'
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

const mockRecommendedPosts = [
  {
    key: 'post-1',
    authorName: '愛吃櫻桃的小綠',
    createdAt: '2 小時前',
    tag: '注意',
    boardName: '生存指南',
    title: '亞灣區某新蓋大樓玻璃帷幕反射太強，經過請減速繞道！',
    excerpt:
      '今天早上沿著輕軌線飛過亞灣區那幾棟新大樓時，差點撞上高空大片落地窗，海天一色的反射真的太逼真了...。請南高雄的大家互相提醒家族成員，特別是剛學飛的幼鳥，經過那一帶盡量貼近公園樹冠層，安全第一！',
    likeCount: 596,
    viewCount: 1500,
    shareCount: 8,
  },
  {
    key: 'post-2',
    authorName: '衛武營的阿強',
    createdAt: '20 分鐘前',
    tag: '熱門',
    boardName: '鳥友聚會',
    title: '週末美術館生態池「雀躍穀物」野餐大會，高捷直達有人要跟嗎？',
    excerpt:
      '約好幾隻老朋友這週末在美術館生態池辦野餐大會，現場會有穀物分享跟賞鳥導覽，高捷直達生態園區站，走路五分鐘就到，還有位置歡迎揪團！',
    likeCount: 56,
    viewCount: 722,
    shareCount: 15,
  },
  {
    key: 'post-3',
    authorName: '澄清湖翠鳥哥',
    createdAt: '昨天',
    tag: '好康',
    boardName: '覓食情報',
    title: '澄清湖後門私人果園的桑椹熟透了，根本吃不完！',
    excerpt:
      '低調分享！澄清湖後山小路進去的那片私人果園，最近紫黑色的桑椹掉了一地，果肉甜到不行而且完全沒有農藥。今天早上我和家族成員去那裡吃到肚子圓滾滾才飛得動，趁果農還沒來採收，大家趕快衝一波！',
    likeCount: 954,
    viewCount: 2234,
    shareCount: 15,
  },
  {
    key: 'post-4',
    authorName: '柴山老白頭',
    createdAt: '5 小時前',
    tag: '閒聊',
    boardName: '日常分享',
    title: '今天在西子灣被猴子搶走嘴邊的麵包屑，氣死我了！',
    excerpt:
      '大家評評理！我好不容易在中山大學長椅下發現一塊剛掉落的波羅麵包屑，才剛準備開動，旁邊的獼猴竟然一巴掌就把整塊奪走。現在的猴子連鳥類的點心都要搶了嗎？有沒有北高雄的鳥友要一起組隊去討公道？',
    likeCount: 2234,
    viewCount: 2234,
    shareCount: 2,
  },
]

function Board() {
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
    <div className="flex flex-col min-h-screen bg-paper pb-24 pt-28 max-w-md mx-auto gap-6 px-6 overflow-x-clip">
      <div className="fixed inset-x-0 top-0 z-10">
        <Header actionLabel="搜尋文章" className="mx-auto max-w-md"/>
      </div>
      <section>
        <h2 className="mb-3 text-xl font-medium text-ink">推薦文章</h2>
        <div className="pb-1 -mx-6 px-6 scrollbar-hide grid grid-flow-col grid-rows-2 gap-4 overflow-x-auto">
          {mockRecommendedPosts.map((post) => (
            <PostCard 
              key={post.key}
              authorName={post.authorName}
              createdAt={post.createdAt}
              tag={post.tag}
              boardName={post.boardName}
              title={post.title}
              excerpt={post.excerpt}
              likeCount={post.likeCount}
              viewCount={post.viewCount}
              shareCount={post.shareCount}
              onClick={() => console.log('open post', post.key)}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-medium text-ink">主題討論區</h2>
        <div className="flex flex-col gap-4">
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
      <div className="fixed inset-x-0 bottom-0 z-10 w-full">
        <BottomNavBar items={mockNavItems} activeKey="board" className="mx-auto max-w-md"/>
      </div>
    </div>
  )
}

export default Board
