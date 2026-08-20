import Button from './Button'

function LoginRequiredNotice({ message = '此功能需要登入才能使用', onLoginClick, className = '' }) {
  return (
    <div className={`flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center ${className}`}>
      <span className="material-symbols-outlined text-5xl text-primary/50">lock</span>
      <p className="text-base font-medium text-ink">{message}</p>
      <Button label="前往登入" onClick={onLoginClick} />
    </div>
  )
}

export default LoginRequiredNotice
