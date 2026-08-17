function Field({
  label,
  value,
  variant = 'display',
  type = 'text',
  placeholder,
  required = false,
  onChange,
  className = '',
}) {
  if (variant === 'editable') {
    return (
      <div className={`flex flex-col items-start gap-2 p-1 ${className}`}>
        <p className="text-xs text-ink/75">{label}</p>
        <div className="w-full rounded bg-white px-2 pb-4 pt-3 shadow-soft">
          <input
            type={type}
            value={value}
            placeholder={placeholder}
            required={required}
            onChange={(e) => onChange?.(e.target.value)}
            className="w-full bg-transparent text-base font-medium leading-[1.5] text-ink outline-none"
          />
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col items-start gap-2.5 p-1 ${className}`}>
      <p className="text-xs text-ink/50">{label}</p>
      <p className="text-base font-medium leading-[1.5] text-ink">{value}</p>
    </div>
  )
}

export default Field
