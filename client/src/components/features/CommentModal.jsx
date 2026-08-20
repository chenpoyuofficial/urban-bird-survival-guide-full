import { useState } from 'react'
import Button from '../ui/Button'

// 半版 bottom-sheet，純粹用來輸入一則新留言；留言列表本身顯示在文章詳情頁上，不在這裡
function CommentModal({ open, onClose, onSubmit, submitting = false, error = '' }) {
  const [content, setContent] = useState('')

  if (!open) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = await onSubmit(content)
    if (ok) setContent('')
  }

  return (
    <div className="fixed inset-0 z-30 bg-ink/40" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="absolute inset-x-0 bottom-0 mx-auto flex h-1/2 max-w-md flex-col gap-3 rounded-t-2xl bg-paper px-6 pt-4 pb-6 shadow-strong"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-ink">新增留言</h2>
          <button type="button" aria-label="關閉" onClick={onClose}>
            <span className="material-symbols-outlined text-2xl leading-none text-ink/60">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="留下你的想法..."
            required
            autoFocus
            className="flex-1 resize-none rounded-xl bg-white p-3 text-sm text-ink shadow-soft outline-none"
          />
          {error && <p className="text-sm font-medium text-alert">{error}</p>}
          <Button
            label={submitting ? '送出中...' : '送出留言'}
            type="submit"
            disabled={submitting}
            className="self-end px-6 py-2.5 text-base"
          />
        </form>
      </div>
    </div>
  )
}

export default CommentModal
