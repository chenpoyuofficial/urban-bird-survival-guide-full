function Header({
  title = '城市鳥類的生存指南',
  logoIcon = 'map',
  actionIcon = 'search',
  actionLabel = '搜尋',
  onActionClick,
  className = '',
}) {
  return (
    <header
      className={`flex items-center justify-between bg-primary px-6 pb-3 pt-3 ${className}`}
    >
      <div className="flex shrink-0 items-center gap-2.5">
        <span className="material-symbols-outlined text-2xl leading-none text-paper">
          {logoIcon}
        </span>
        <p className="shrink-0 whitespace-nowrap text-xl font-bold tracking-[1.6px] text-paper">
          {title}
        </p>
      </div>
      {actionLabel && (
        <button
          type="button"
          onClick={onActionClick}
          className="flex shrink-0 items-center gap-1 rounded-full bg-paper px-2.5 py-1 shadow-soft"
        >
          <span className="material-symbols-outlined text-xl leading-none text-ink">
            {actionIcon}
          </span>
          <span className="text-base font-medium text-ink">{actionLabel}</span>
        </button>
      )}
    </header>
  )
}

export default Header
