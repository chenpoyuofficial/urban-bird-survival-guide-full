const severityClasses = {
  normal: 'bg-primary',
  warning: 'bg-secondary',
  danger: 'bg-alert',
}

function MapPin({ icon, severity = 'normal', onClick, position = 'relative', className = '', style }) {
  const isLarge = severity === 'danger'

  return (
    <button
      type="button"
      onClick={onClick}
      style={style}
      className={`${position} flex items-center justify-center rounded-full shadow-soft ${
        isLarge ? 'size-14' : 'size-10'
      } ${severityClasses[severity]} ${className}`}
    >
      <span
        aria-hidden="true"
        className="absolute -bottom-1 left-1/2 size-3 -translate-x-1/2 rotate-45 rounded-[2px]"
        style={{ backgroundColor: 'inherit' }}
      />
      <span
        className={`material-symbols-outlined relative leading-none text-white ${
          isLarge ? 'text-2xl' : 'text-base'
        }`}
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        {icon}
      </span>
    </button>
  )
}

export default MapPin
