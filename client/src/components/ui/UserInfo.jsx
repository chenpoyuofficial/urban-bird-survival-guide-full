import Avatar from './Avatar'
import Tag from './Tag'

function UserInfo({ name, time, tag, boardName, avatarSrc, variant = 'multi', className = '' }) {
  if (variant === 'single') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Avatar src={avatarSrc} size="sm" />
        <p className="text-base font-medium text-ink">{name}</p>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Avatar src={avatarSrc} size="md" />
      <div className="flex flex-col items-start gap-2 pt-0.5">
        <div className="flex items-end gap-1.5">
          <p className="text-sm font-medium text-ink">{name}</p>
          <p className="text-[10px] text-ink/50">{time}</p>
        </div>
        {(tag || boardName) && (
          <div className="flex items-start gap-1">
            {tag && <Tag label={tag} variant="filled" />}
            {boardName && <Tag label={boardName} variant="outline" />}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserInfo
