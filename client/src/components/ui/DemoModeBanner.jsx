function DemoModeBanner({ className = '' }) {
  return (
    <div
      className={`flex items-center gap-1.5 rounded-full bg-secondary/15 px-3 py-1.5 text-xs font-medium text-secondary ${className}`}
    >
      <span className="material-symbols-outlined text-sm leading-none">wifi_off</span>
      展示模式：目前未連接伺服器，畫面顯示為示範用假資料
    </div>
  )
}

export default DemoModeBanner
