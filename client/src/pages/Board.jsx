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
import { fetchRecommendedPosts, likePost, unlikePost } from '../api/posts'
import { useAuth } from '../context/AuthContext'
import { formatRelativeTime, truncate, formatCompactCount } from '../utils/format'

function toDisplayBoard(board) {
  return {
    id: board.id,
    title: board.name,
    image: boardImagesByName[board.name],
    heat: formatCompactCount(board.heat),
    postCount: board.postCount,
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
    likeCount: post.likeCount,
    commentCount: post.commentCount,
    likedByMe: post.likedByMe,
  }
}

function Board() {
  const navigate = useNavigate()
  const { mode, status, getToken } = useAuth()
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

    fetchRecommendedPosts(getToken())
      .then((data) => setPosts(data.map(toDisplayPost)))
      .catch((err) => setPostsError(err.message ?? '文章載入失敗'))
  }, [mode, getToken])

  const toggleFavorite = (id) => {
    setFavoritedKeys((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const applyLikeChange = (postId, liked) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, likedByMe: liked, likeCount: post.likeCount + (liked ? 1 : -1) }
          : post,
      ),
    )
  }

  const handleLikeClick = async (post) => {
    if (status !== 'authenticated') {
      navigate('/login')
      return
    }

    const nextLiked = !post.likedByMe
    applyLikeChange(post.id, nextLiked)

    if (mode !== 'real') return // 假模式沒有後端可寫入，僅本地展示切換

    try {
      const token = getToken()
      if (nextLiked) {
        await likePost(post.id, token)
      } else {
        await unlikePost(post.id, token)
      }
    } catch (err) {
      applyLikeChange(post.id, !nextLiked) // 失敗還原剛剛的樂觀更新
      console.error('按讚失敗', err)
    }
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
              commentCount={post.commentCount}
              likedByMe={post.likedByMe}
              onClick={() => navigate(`/posts/${post.id}`)}
              onLikeClick={() => handleLikeClick(post)}
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
              onClick={() => navigate(`/board/${board.id}`)}
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
