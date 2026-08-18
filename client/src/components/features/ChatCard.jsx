import Avatar from '../ui/Avatar'

function ChatCard({ avatarSrc, name, status, preview, unreadCount, onClick, className = '' }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick?.()
      }}
      className={`flex w-full cursor-pointer items-end gap-2 rounded-xl bg-white p-3.5 shadow-soft ${className}`}
    >
      <div className="relative shrink-0 size-[50px]">
        <Avatar src={avatarSrc} size="lg" />
        {unreadCount != null && (
          <span className="absolute -right-1 -top-1 flex min-w-[17px] items-center justify-center rounded-full border-2 border-white bg-secondary px-1 py-0.5 text-xs font-medium leading-none text-white">
            {unreadCount}
          </span>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-start gap-2.5">
        <div className="flex w-full items-end justify-between gap-2">
          <p className="shrink-0 text-base font-medium text-ink">{name}</p>
          <p className="shrink-0 text-[10px] text-ink/50">{status}</p>
        </div>
        <p className="pt-0.5 line-clamp-2 w-full text-xs leading-[1.35] text-ink/75">{preview}</p>
      </div>
    </div>
  )
}

export default ChatCard
