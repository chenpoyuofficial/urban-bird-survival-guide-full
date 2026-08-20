function LoadingSpinner({ className = '' }) {
  return (
    <div className={`flex min-h-screen items-center justify-center bg-paper ${className}`}>
      <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
    </div>
  )
}

export default LoadingSpinner
