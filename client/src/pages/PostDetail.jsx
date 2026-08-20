import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../components/ui/Header'
import BottomNavBar from '../components/ui/BottomNavBar'
import Breadcrumb from '../components/ui/Breadcrumb'
import StatTag from '../components/ui/StatTag'
import IconButton from '../components/ui/IconButton'
import Button from '../components/ui/Button'
import DemoModeBanner from '../components/ui/DemoModeBanner'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import UserInfo from '../components/ui/UserInfo'
import CommentCard from '../components/features/CommentCard'
import CommentModal from '../components/features/CommentModal'
import { mockNavItems, navRoutes } from '../mock/navItems'
import { mockBoards } from '../mock/boards'
import { mockRecommendedPosts, mockPostContentById } from '../mock/posts'
import { mockCommentsByPostId } from '../mock/comments'
import { fetchPost, likePost, unlikePost } from '../api/posts'
import { fetchComments, createComment, deleteComment } from '../api/comments'
import { useAuth } from '../context/AuthContext'
import { formatRelativeTime } from '../utils/format'

function toDisplayPost(post) {
  return {
    id: post.id,
    authorId: post.authorId,
    authorName: post.author.nickname,
    createdAt: formatRelativeTime(post.createdAt),
    tag: post.tag,
    title: post.title,
    content: post.content,
    likeCount: post.likeCount,
    commentCount: post.commentCount,
    likedByMe: post.likedByMe,
    boardId: post.board.id,
    boardName: post.board.name,
  }
}

function toDisplayComment(comment) {
  return {
    id: comment.id,
    authorId: comment.authorId,
    authorName: comment.author.nickname,
    createdAt: formatRelativeTime(comment.createdAt),
    content: comment.content,
  }
}

function PostDetail() {
  const { postId } = useParams()
  const navigate = useNavigate()
  const { mode, status, user, getToken } = useAuth()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [commentModalOpen, setCommentModalOpen] = useState(false)
  const [commentSubmitting, setCommentSubmitting] = useState(false)
  const [commentError, setCommentError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')

    if (mode === 'fake') {
      const mockPost = mockRecommendedPosts.find((p) => p.id === postId)
      if (!mockPost) {
        setError('找不到此文章')
        setLoading(false)
        return
      }
      const board = mockBoards.find((b) => b.title === mockPost.boardName)
      setPost({
        id: mockPost.id,
        authorId: mockPost.authorId,
        authorName: mockPost.authorName,
        createdAt: mockPost.createdAt,
        tag: mockPost.tag,
        title: mockPost.title,
        content: mockPostContentById[mockPost.id] ?? mockPost.excerpt,
        likeCount: mockPost.likeCount,
        commentCount: mockPost.commentCount,
        likedByMe: mockPost.likedByMe,
        boardId: board?.id,
        boardName: mockPost.boardName,
      })
      setComments(mockCommentsByPostId[postId] ?? [])
      setLoading(false)
      return
    }

    Promise.all([fetchPost(postId, getToken()), fetchComments(postId)])
      .then(([postData, commentsData]) => {
        setPost(toDisplayPost(postData))
        setComments(commentsData.map(toDisplayComment))
      })
      .catch((err) => setError(err.message ?? '文章載入失敗'))
      .finally(() => setLoading(false))
  }, [postId, mode, getToken])

  const handleLikeClick = async () => {
    if (status !== 'authenticated') {
      navigate('/login')
      return
    }

    const nextLiked = !post.likedByMe
    setPost((prev) => ({ ...prev, likedByMe: nextLiked, likeCount: prev.likeCount + (nextLiked ? 1 : -1) }))

    if (mode !== 'real') return

    try {
      const token = getToken()
      if (nextLiked) {
        await likePost(post.id, token)
      } else {
        await unlikePost(post.id, token)
      }
    } catch (err) {
      setPost((prev) => ({ ...prev, likedByMe: !nextLiked, likeCount: prev.likeCount + (nextLiked ? -1 : 1) }))
      console.error('按讚失敗', err)
    }
  }

  const handleCommentButtonClick = () => {
    if (status !== 'authenticated') {
      navigate('/login')
      return
    }
    setCommentError('')
    setCommentModalOpen(true)
  }

  const handleCommentSubmit = async (content) => {
    setCommentError('')
    setCommentSubmitting(true)
    try {
      if (mode === 'real') {
        const token = getToken()
        const created = await createComment(post.id, content, token)
        setComments((prev) => [...prev, toDisplayComment(created)])
      } else {
        setComments((prev) => [
          ...prev,
          { id: `local-${Date.now()}`, authorId: user?.id, authorName: user?.nickname, createdAt: '剛剛', content },
        ])
      }
      setPost((prev) => ({ ...prev, commentCount: prev.commentCount + 1 }))
      setCommentModalOpen(false)
      return true
    } catch (err) {
      setCommentError(err.message ?? '留言失敗，請稍後再試')
      return false
    } finally {
      setCommentSubmitting(false)
    }
  }

  const handleDeleteComment = async (comment) => {
    setComments((prev) => prev.filter((c) => c.id !== comment.id))
    setPost((prev) => ({ ...prev, commentCount: prev.commentCount - 1 }))

    if (mode !== 'real') return

    try {
      await deleteComment(comment.id, getToken())
    } catch (err) {
      console.error('刪除留言失敗', err)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="flex flex-col min-h-screen bg-paper pb-24 pt-28 max-w-md mx-auto gap-4 px-6 overflow-x-clip">
      <div className="fixed inset-x-0 top-0 z-10">
        <Header
          actionIcon="forum"
          actionLabel="回討論區"
          onActionClick={() => post?.boardId && navigate(`/board/${post.boardId}`)}
          className="mx-auto max-w-md"
        />
      </div>

      {mode === 'fake' && <DemoModeBanner />}

      {error && <p className="text-sm font-medium text-alert">{error}</p>}

      {post && (
        <>
          <Breadcrumb boardName={post.boardName} boardId={post.boardId} />

          <section className="flex flex-col gap-3 rounded-xl bg-white px-4 py-4 shadow-soft">
            <UserInfo name={post.authorName} time={post.createdAt} tag={post.tag} />
            <h1 className="text-xl font-bold text-ink">{post.title}</h1>
            <p className="whitespace-pre-wrap text-sm leading-[1.6] text-ink/90">{post.content}</p>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-4">
                <StatTag
                  icon="thumb_up"
                  value={post.likeCount}
                  muted
                  active={post.likedByMe}
                  ariaLabel={post.likedByMe ? '取消讚' : '按讚'}
                  onClick={handleLikeClick}
                />
                <StatTag icon="chat_bubble" value={post.commentCount} muted />
              </div>
              <div className="flex items-center gap-2">
                {status === 'authenticated' && user?.id === post.authorId && (
                  <IconButton
                    icon="edit"
                    ariaLabel="編輯文章"
                    variant="plain"
                    onClick={() => navigate(`/posts/${post.id}/edit`)}
                  />
                )}
                <Button label="留言" onClick={handleCommentButtonClick} className="px-4 py-2 text-sm" />
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-medium text-ink">留言（{comments.length}）</h2>
            {comments.length === 0 && <p className="text-sm text-ink/50">還沒有留言，當第一個留言的人吧！</p>}
            <div className="flex flex-col gap-2.5">
              {comments.map((comment) => (
                <CommentCard
                  key={comment.id}
                  authorName={comment.authorName}
                  createdAt={comment.createdAt}
                  content={comment.content}
                  canDelete={status === 'authenticated' && user?.id === comment.authorId}
                  onDelete={() => handleDeleteComment(comment)}
                />
              ))}
            </div>
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

      <CommentModal
        open={commentModalOpen}
        onClose={() => setCommentModalOpen(false)}
        onSubmit={handleCommentSubmit}
        submitting={commentSubmitting}
        error={commentError}
      />
    </div>
  )
}

export default PostDetail
