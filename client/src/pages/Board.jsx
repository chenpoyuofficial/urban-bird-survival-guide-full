import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/ui/Header'
import BoardCard from '../components/ui/BoardCard'
import BottomNavBar from '../components/ui/BottomNavBar'
import DemoModeBanner from '../components/ui/DemoModeBanner'
import PostCard from '../components/features/PostCard'
import { mockNavItems, navRoutes } from '../mock/navItems'
import { mockBoards, boardImagesByName } from '../mock/boards'
import { mockRecommendedPosts } from '../mock/posts'
import { fetchBoards } from '../api/boards'
import { fetchRecommendedPosts } from '../api/posts'
import { useAuth } from '../context/AuthContext'
import { hashToRange } from '../utils/hash'
import { formatRelativeTime, truncate, formatCompactCount } from '../utils/format'

// 熱度/文章數/讚數等純展示假數字，資料庫沒有這些欄位（見 CLAUDE.md），
// 用真實資料的 id 做確定性 hash，避免重新渲染時數字亂跳
function toDisplayBoard(board) {
  return {
    id: board.id,
    title: board.name,
    image: boardImagesByName[board.name],
    heat: formatCompactCount(hashToRange(board.id, 300, 8000)),
    postCount: hashToRange(`${board.id}-count`, 10, 300),
  }
}

function toDisplayPost(post) {
  return {
    id: post.id,
    authorName: post.author.nickname,
    createdAt: formatRelativeTime(post.createdAt),
    tag: post.tag,
    boardName: post.board.name,
    title: post.title,
    excerpt: truncate(post.content, 80),
    likeCount: hashToRange(`${post.id}-like`, 20, 3000),
    viewCount: hashToRange(`${post.id}-view`, 100, 3000),
    shareCount: hashToRange(`${post.id}-share`, 1, 50),
  }
}

function Board() {
  const navigate = useNavigate()
  const { mode } = useAuth()
  const [boards, setBoards] = useState([])
  const [posts, setPosts] = useState([])
  const [boardsError, setBoardsError] = useState('')
  const [postsError, setPostsError] = useState('')
  const [favoritedKeys, setFavoritedKeys] = useState(() => new Set())

  useEffect(() => {
    if (mode === 'fake') {
      setBoards(mockBoards)
      setPosts(mockRecommendedPosts)
      return
    }

    fetchBoards()
      .then((data) => setBoards(data.map(toDisplayBoard)))
      .catch((err) => setBoardsError(err.message ?? '看板載入失敗'))

    fetchRecommendedPosts()
      .then((data) => setPosts(data.map(toDisplayPost)))
      .catch((err) => setPostsError(err.message ?? '文章載入失敗'))
  }, [mode])

  const toggleFavorite = (id) => {
    setFavoritedKeys((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="flex flex-col min-h-screen bg-paper pb-24 pt-28 max-w-md mx-auto gap-6 px-6 overflow-x-clip">
      <div className="fixed inset-x-0 top-0 z-10">
        <Header actionLabel="搜尋文章" className="mx-auto max-w-md" />
      </div>

      {mode === 'fake' && <DemoModeBanner />}

      <section>
        <h2 className="mb-3 text-xl font-medium text-ink">推薦文章</h2>
        {postsError && <p className="mb-2 text-sm font-medium text-alert">{postsError}</p>}
        <div className="pb-1 -mx-6 px-6 scrollbar-hide grid grid-flow-col grid-rows-2 gap-4 overflow-x-auto">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              authorName={post.authorName}
              createdAt={post.createdAt}
              tag={post.tag}
              boardName={post.boardName}
              title={post.title}
              excerpt={post.excerpt}
              likeCount={post.likeCount}
              viewCount={post.viewCount}
              shareCount={post.shareCount}
              onClick={() => console.log('open post', post.id)}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-medium text-ink">主題討論區</h2>
        {boardsError && <p className="mb-2 text-sm font-medium text-alert">{boardsError}</p>}
        <div className="flex flex-col gap-4">
          {boards.map((board) => (
            <BoardCard
              key={board.id}
              title={board.title}
              image={board.image}
              heat={board.heat}
              postCount={board.postCount}
              favorited={favoritedKeys.has(board.id)}
              onToggleFavorite={() => toggleFavorite(board.id)}
              onClick={() => console.log('open board', board.id)}
            />
          ))}
        </div>
      </section>
      <div className="fixed inset-x-0 bottom-0 z-10 w-full">
        <BottomNavBar
          items={mockNavItems}
          activeKey="board"
          onItemClick={(key) => navRoutes[key] && navigate(navRoutes[key])}
          className="mx-auto max-w-md"
        />
      </div>
    </div>
  )
}

export default Board
