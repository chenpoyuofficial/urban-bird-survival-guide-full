function Button({ label, type = 'button', onClick, disabled = false, className = '' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full bg-secondary px-10 py-4 text-2xl font-bold leading-tight text-white shadow-soft disabled:opacity-50 ${className}`}
    >
      {label}
    </button>
  )
}

export default Button
