function Button({ label, type = 'button', onClick, className = '' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`rounded-full bg-secondary px-10 py-4 text-2xl font-bold leading-tight text-white shadow-soft ${className}`}
    >
      {label}
    </button>
  )
}

export default Button
