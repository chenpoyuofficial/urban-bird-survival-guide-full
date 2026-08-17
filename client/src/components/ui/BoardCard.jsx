function BoardCard({
  title,
  image,
  heat,
  postCount,
  favorited = false,
  onToggleFavorite,
  onClick,
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
      className={`relative flex h-[147px] w-full cursor-pointer flex-col items-end justify-between overflow-hidden rounded-xl px-3 py-2 shadow-soft ${className}`}
    >
      <img src={image} alt="" className="absolute inset-0 size-full object-cover" />

      <div className="relative flex w-full items-center justify-between">
        <span className="rounded-full bg-paper px-3 py-2 text-base font-medium text-ink shadow-soft">
          {title}
        </span>
        <button
          type="button"
          aria-label={favorited ? '取消最愛' : '加入最愛'}
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite?.()
          }}
          className="flex size-9 items-center justify-center rounded-full bg-paper shadow-soft"
        >
          <span
            className={`material-symbols-outlined text-2xl leading-none ${
              favorited ? 'text-secondary' : 'text-primary'
            }`}
            style={favorited ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            favorite
          </span>
        </button>
      </div>

      <div className="relative flex items-center gap-2 rounded-full bg-paper px-2 py-1 shadow-soft">
        <span className="flex items-center gap-0.5">
          <span className="material-symbols-outlined text-base leading-none text-ink">
            local_fire_department
          </span>
          <span className="text-xs font-medium text-ink">{heat}</span>
        </span>
        <span className="flex items-center gap-0.5">
          <span className="material-symbols-outlined text-base leading-none text-ink">
            article
          </span>
          <span className="text-xs font-medium text-ink">{postCount}</span>
        </span>
      </div>
    </div>
  )
}

export default BoardCard
