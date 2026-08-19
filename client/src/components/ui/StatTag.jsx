function StatTag({ icon, value, muted = false }) {
  return (
    <span className="flex items-center gap-0.5">
      <span
        className={`material-symbols-outlined text-base leading-none ${
          muted ? 'text-ink/40' : 'text-ink'
        }`}
      >
        {icon}
      </span>
      <span className={`text-xs font-medium ${muted ? 'text-ink/40' : 'text-ink'}`}>{value}</span>
    </span>
  )
}

export default StatTag
