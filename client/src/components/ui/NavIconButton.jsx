function NavIconButton({ icon, label, active = false, badgeCount, onClick, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex size-12 flex-col items-center justify-center gap-1.5 ${className}`}
    >
      <span className="relative inline-flex size-6">
        <span
          className={`material-symbols-outlined text-2xl leading-none ${
            active ? 'text-primary' : 'text-ink/40'
          }`}
        >
          {icon}
        </span>
        {badgeCount != null && (
          <div className={`absolute -top-1 left-4 min-w-[14px] rounded-full border border-paper px-0.5 text-center text-[8px] font-medium leading-normal text-paper ${
              active ? 'bg-secondary' : 'bg-secondary/60'
            }`}>
            <span>{badgeCount}</span>
          </div>
        )}
      </span>
      <span
        className={`text-xs ${
          active ? 'font-medium text-primary' : 'font-normal text-ink/40'
        }`}
      >
        {label}
      </span>
    </button>
  )
}

export default NavIconButton
