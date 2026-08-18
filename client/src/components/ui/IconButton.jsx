function IconButton({ icon, onClick, ariaLabel, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`flex size-10 items-center justify-center rounded-full border-2 border-ink bg-white shadow-soft ${className}`}
    >
      <span className="material-symbols-outlined text-2xl leading-none text-ink">{icon}</span>
    </button>
  )
}

export default IconButton
