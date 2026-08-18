const severityClasses = {
  normal: 'bg-primary text-white',
  warning: 'bg-secondary text-white',
  danger: 'bg-alert text-white',
}

function FilterChip({
  icon,
  label,
  size = 'lg',
  selected = false,
  severity = 'normal',
  onClick,
  className = '',
}) {
  const isLg = size === 'lg'
  let specialized;
  if(isLg){
    specialized = selected
      ? `${severityClasses[severity]} py-1 pl-2 pr-3 text-base`
      : "py-0.5 pl-[6px] pr-[10px] text-base border-2 border-ink bg-white text-ink"
  } else {
    specialized = selected
      ? `${severityClasses[severity]} py-1 pl-1 pr-[7px] text-xs`
      : "border-2 border-ink bg-white text-ink py-0.5 pl-0.5 pr-[5px] text-xs"
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex shrink-0 items-center whitespace-nowrap rounded-full shadow-soft ${specialized} ${className}`}
    >
      <span className={`material-symbols-outlined leading-none ${isLg ? 'text-2xl' : 'text-base'}`}>
        {icon}
      </span>
      <span className="font-medium">{label}</span>
    </button>
  )
}

export default FilterChip
