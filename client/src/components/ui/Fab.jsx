function Fab({ icon = 'add', onClick, ariaLabel = '新增', className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`flex size-[68px] items-center justify-center rounded-full bg-ink shadow-soft ${className}`}
    >
      <span className="material-symbols-outlined text-4xl leading-none text-paper">{icon}</span>
    </button>
  )
}

export default Fab
