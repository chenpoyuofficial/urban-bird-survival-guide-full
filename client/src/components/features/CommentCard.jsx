import Avatar from '../ui/Avatar'

function CommentCard({ authorName, authorAvatar, createdAt, content, canDelete = false, onDelete, className = '' }) {
  return (
    <div className={`flex gap-2.5 rounded-xl bg-white px-3 py-3 shadow-soft ${className}`}>
      <Avatar src={authorAvatar} size="sm" />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-baseline gap-1.5">
            <p className="text-sm font-medium text-ink">{authorName}</p>
            <p className="text-[10px] text-ink/50">{createdAt}</p>
          </div>
          {canDelete && (
            <button
              type="button"
              aria-label="刪除留言"
              onClick={onDelete}
              className="shrink-0 text-ink/40 hover:text-alert"
            >
              <span className="material-symbols-outlined text-base leading-none">delete</span>
            </button>
          )}
        </div>
        <p className="whitespace-pre-wrap break-words text-sm leading-[1.5] text-ink/90">{content}</p>
      </div>
    </div>
  )
}

export default CommentCard
