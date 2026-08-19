const variantClasses = {
  outline: 'size-10 border-2 border-ink bg-white',
  plain: 'size-9 border-0 bg-paper',
}

function IconButton({ icon, onClick, ariaLabel, variant = 'outline', className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`flex items-center justify-center rounded-full shadow-soft ${variantClasses[variant]} ${className}`}
    >
      <span className="material-symbols-outlined text-2xl leading-none text-ink">{icon}</span>
    </button>
  )
}

export default IconButton
