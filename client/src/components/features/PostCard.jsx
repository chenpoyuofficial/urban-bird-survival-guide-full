import UserInfo from '../ui/UserInfo'
import StatTag from '../ui/StatTag'

function PostCard({
  authorName,
  authorAvatar,
  createdAt,
  tag,
  boardName,
  title,
  excerpt,
  likeCount,
  viewCount,
  shareCount,
  onClick,
  width = '267px',
  className = '',
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick?.()
      }}
      style={{ width }}
      className={`flex shrink-0 cursor-pointer flex-col gap-3 rounded-xl bg-white px-4 py-2 shadow-soft ${className}`}
    >
      <UserInfo name={authorName} time={createdAt} tag={tag} boardName={boardName} avatarSrc={authorAvatar} />

      <div className="flex flex-col gap-2">
        <h3 className="line-clamp-2 text-base font-bold tracking-[1.28px] text-ink pt-1">{title}</h3>
        <p className="line-clamp-2 text-xs leading-[1.35] text-ink/80 py-[2px]">{excerpt}</p>
        <div className="flex items-start gap-4">
          <StatTag icon="thumb_up" value={likeCount} muted />
          <StatTag icon="visibility" value={viewCount} muted />
          <StatTag icon="send" value={shareCount} muted />
        </div>
      </div>
    </div>
  )
}

export default PostCard
