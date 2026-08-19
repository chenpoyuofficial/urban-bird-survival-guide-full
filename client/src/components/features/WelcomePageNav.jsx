import PaginationDots from '../ui/PaginationDots'

function WelcomePageNav({
  count,
  activeIndex,
  onDotClick,
  onRegisterClick,
  showRegisterCta = true,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {showRegisterCta && (
        <button
          type="button"
          onClick={onRegisterClick}
          className="flex h-10 w-28 shrink-0 cursor-pointer items-center justify-center rounded-full border-[3px] border-secondary bg-paper text-base font-medium text-secondary shadow-soft"
        >
          立即註冊
        </button>
      )}
      <PaginationDots count={count} activeIndex={activeIndex} onDotClick={onDotClick} />
    </div>
  )
}

export default WelcomePageNav
