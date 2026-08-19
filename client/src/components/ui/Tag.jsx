function Tag({ label, variant = 'filled' }) {
  const isOutline = variant === 'outline'
  return (
    <span
      className={`whitespace-nowrap rounded-full px-2 py-[5px] text-center text-xs font-medium ${
        isOutline ? 'border border-primary text-primary' : 'bg-secondary text-white'
      }`}
    >
      {label}
    </span>
  )
}

export default Tag
