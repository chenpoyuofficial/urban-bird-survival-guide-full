function SosButton({ onClick, className = '' }) {
  return (
    <div className={`${className}`}>
        {/* 陰影只在超出導覽列矩形範圍的圓弧部分顯示，其餘裁掉 */}
        <div
          className="absolute inset-0 rounded-full shadow-[0px_-1px_4px_theme(colors.ink/25%)]"
          style={{ clipPath: 'inset(-24px -24px 60px -24px)' }}
          aria-hidden="true"
        />
        <button
          type="button"
          onClick={onClick}
          aria-label="緊急求助"
          className="relative p-3 flex items-center justify-center rounded-full border-4 border-white bg-secondary"
        >
          <span className="material-symbols-outlined text-4xl leading-none text-paper">sos</span>
        </button>
    </div>
  )
}

export default SosButton
