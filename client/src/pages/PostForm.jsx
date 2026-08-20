import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../components/ui/Header'
import Field from '../components/ui/Field'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { fetchBoardById } from '../api/boards'
import { fetchPost, createPost, updatePost } from '../api/posts'
import { mockBoards } from '../mock/boards'
import { mockRecommendedPosts, mockPostContentById } from '../mock/posts'
import { useAuth } from '../context/AuthContext'

const TAG_OPTIONS = ['注意', '好康', '閒聊', '求助', '心得', '目擊', '揪團', '交易', '提問', '公告'].map((tag) => ({
  value: tag,
  label: tag,
}))

function PostForm() {
  const { boardId, postId } = useParams()
  const navigate = useNavigate()
  const { mode, getToken } = useAuth()
  const isEdit = Boolean(postId)

  const [boardName, setBoardName] = useState('')
  const [targetBoardId, setTargetBoardId] = useState(boardId ?? '')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tag, setTag] = useState(TAG_OPTIONS[0].value)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError('')

    if (isEdit) {
      if (mode === 'fake') {
        const mockPost = mockRecommendedPosts.find((p) => p.id === postId)
        if (mockPost) {
          setTitle(mockPost.title)
          setContent(mockPostContentById[mockPost.id] ?? mockPost.excerpt)
          setTag(mockPost.tag)
          setBoardName(mockPost.boardName)
        } else {
          setError('找不到此文章')
        }
        setLoading(false)
        return
      }
      fetchPost(postId, getToken())
        .then((post) => {
          setTitle(post.title)
          setContent(post.content)
          setTag(post.tag)
          setBoardName(post.board.name)
          setTargetBoardId(post.board.id)
        })
        .catch((err) => setError(err.message ?? '文章載入失敗'))
        .finally(() => setLoading(false))
      return
    }

    if (mode === 'fake') {
      const board = mockBoards.find((b) => b.id === boardId)
      setBoardName(board?.title ?? '')
      setLoading(false)
      return
    }
    fetchBoardById(boardId)
      .then((board) => setBoardName(board.name))
      .catch((err) => setError(err.message ?? '討論區載入失敗'))
      .finally(() => setLoading(false))
  }, [isEdit, postId, boardId, mode, getToken])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      if (mode !== 'real') {
        // 假模式沒有後端可寫入，純展示用，直接導回原本該去的頁面
        navigate(isEdit ? `/posts/${postId}` : `/board/${targetBoardId}`)
        return
      }

      const token = getToken()
      const payload = { title, content, tag }
      const savedPost = isEdit
        ? await updatePost(postId, payload, token)
        : await createPost(targetBoardId, payload, token)
      navigate(`/posts/${savedPost.id}`)
    } catch (err) {
      setError(err.message ?? '送出失敗，請稍後再試')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="flex min-h-screen max-w-md mx-auto flex-col bg-paper px-6 pt-[144px] pb-12">
      <div className="fixed inset-x-0 top-0 z-10">
        <Header actionIcon="arrow_back" actionLabel="回上頁" onActionClick={() => navigate(-1)} className="mx-auto max-w-md" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-[26px]">
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-2xl font-medium text-ink">{isEdit ? '編輯文章' : '發表新文章'}</h1>
          {boardName && <p className="text-sm text-ink/60">看板：{boardName}</p>}
        </div>

        <div className="flex w-full flex-col gap-2">
          <Field label="標題" value={title} onChange={setTitle} variant="editable" placeholder="幫文章下一個標題" required />
          <Field label="標籤" value={tag} onChange={setTag} variant="editable" type="select" options={TAG_OPTIONS} />
          <Field
            label="內容"
            value={content}
            onChange={setContent}
            variant="editable"
            type="textarea"
            placeholder="想跟大家分享什麼呢？"
            required
          />
        </div>

        {error && <p className="text-sm font-medium text-alert">{error}</p>}

        <Button label={submitting ? '送出中...' : isEdit ? '儲存' : '發表'} type="submit" disabled={submitting} />
      </form>
    </div>
  )
}

export default PostForm
