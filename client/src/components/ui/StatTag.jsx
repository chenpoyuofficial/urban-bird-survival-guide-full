function StatTag({ icon, value, muted = false, active = false, onClick, ariaLabel }) {
  const Tag = onClick ? 'button' : 'span'
  const color = active ? 'text-secondary' : muted ? 'text-ink/40' : 'text-ink'

  return (
    <Tag
      type={onClick ? 'button' : undefined}
      aria-label={onClick ? ariaLabel : undefined}
      onClick={onClick}
      className={`flex items-center gap-0.5 ${onClick ? 'cursor-pointer' : ''}`}
    >
      <span
        className={`material-symbols-outlined text-base leading-none ${color}`}
        style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
      >
        {icon}
      </span>
      <span className={`text-xs font-medium ${color}`}>{value}</span>
    </Tag>
  )
}

export default StatTag
