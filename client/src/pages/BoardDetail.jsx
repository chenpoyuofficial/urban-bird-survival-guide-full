import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../components/ui/Header'
import BottomNavBar from '../components/ui/BottomNavBar'
import Breadcrumb from '../components/ui/Breadcrumb'
import StatTag from '../components/ui/StatTag'
import Button from '../components/ui/Button'
import DemoModeBanner from '../components/ui/DemoModeBanner'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import PostCard from '../components/features/PostCard'
import { mockNavItems, navRoutes } from '../mock/navItems'
import { mockBoards } from '../mock/boards'
import { mockRecommendedPosts } from '../mock/posts'
import { fetchBoardById } from '../api/boards'
import { fetchPostsByBoard, likePost, unlikePost } from '../api/posts'
import { useAuth } from '../context/AuthContext'
import { formatRelativeTime, truncate, formatCompactCount } from '../utils/format'

function toDisplayPost(post) {
  return {
    id: post.id,
    authorName: post.author.nickname,
    createdAt: formatRelativeTime(post.createdAt),
    tag: post.tag,
    title: post.title,
    excerpt: truncate(post.content, 80),
    likeCount: post.likeCount,
    commentCount: post.commentCount,
    likedByMe: post.likedByMe,
  }
}

function BoardDetail() {
  const { boardId } = useParams()
  const navigate = useNavigate()
  const { mode, status, getToken } = useAuth()
  const [board, setBoard] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')

    if (mode === 'fake') {
      const mockBoard = mockBoards.find((b) => b.id === boardId)
      if (!mockBoard) {
        setError('找不到此討論區')
        setLoading(false)
        return
      }
      setBoard(mockBoard)
      setPosts(mockRecommendedPosts.filter((p) => p.boardName === mockBoard.title))
      setLoading(false)
      return
    }

    Promise.all([fetchBoardById(boardId), fetchPostsByBoard(boardId, getToken())])
      .then(([boardData, postsData]) => {
        setBoard({
          id: boardData.id,
          title: boardData.name,
          heat: formatCompactCount(boardData.heat),
          postCount: boardData.postCount,
        })
        setPosts(postsData.map(toDisplayPost))
      })
      .catch((err) => setError(err.message ?? '討論區載入失敗'))
      .finally(() => setLoading(false))
  }, [boardId, mode, getToken])

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

    if (mode !== 'real') return

    try {
      const token = getToken()
      if (nextLiked) {
        await likePost(post.id, token)
      } else {
        await unlikePost(post.id, token)
      }
    } catch (err) {
      applyLikeChange(post.id, !nextLiked)
      console.error('按讚失敗', err)
    }
  }

  const handleNewPostClick = () => {
    if (status !== 'authenticated') {
      navigate('/login')
      return
    }
    navigate(`/board/${boardId}/posts/new`)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="flex flex-col min-h-screen bg-paper pb-24 pt-28 max-w-md mx-auto gap-4 px-6 overflow-x-clip">
      <div className="fixed inset-x-0 top-0 z-10">
        <Header actionLabel="搜尋文章" className="mx-auto max-w-md" />
      </div>

      {mode === 'fake' && <DemoModeBanner />}
      <Breadcrumb />

      {error && <p className="text-sm font-medium text-alert">{error}</p>}

      {board && (
        <>
          <section className="flex flex-col gap-3">
            <h1 className="text-2xl font-bold text-ink">{board.title}</h1>
            <div className="flex items-center gap-3">
              <StatTag icon="local_fire_department" value={board.heat} />
              <StatTag icon="article" value={board.postCount} />
            </div>
            <Button label="發表新文章" onClick={handleNewPostClick} className="self-start px-6 py-3 text-lg" />
          </section>

          <section className="flex flex-col gap-4">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                width="100%"
                authorName={post.authorName}
                createdAt={post.createdAt}
                tag={post.tag}
                title={post.title}
                excerpt={post.excerpt}
                likeCount={post.likeCount}
                commentCount={post.commentCount}
                likedByMe={post.likedByMe}
                onClick={() => navigate(`/posts/${post.id}`)}
                onLikeClick={() => handleLikeClick(post)}
              />
            ))}
          </section>
        </>
      )}

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

export default BoardDetail
