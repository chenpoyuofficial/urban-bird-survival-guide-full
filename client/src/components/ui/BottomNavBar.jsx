import NavIconButton from './NavIconButton'
import SosButton from './SosButton'

function NavItem({ item, activeKey, onItemClick }) {
  return (
    <NavIconButton
      icon={item.icon}
      label={item.label}
      badgeCount={item.badgeCount}
      active={activeKey === item.key}
      onClick={() => onItemClick?.(item.key)}
    />
  )
}

function BottomNavBar({ items, activeKey, onItemClick, onSosClick, className = '' }) {
  const [left1, left2, right1, right2] = items

  return (
    <nav
      className={`flex w-full items-center justify-between bg-paper px-6 py-3 shadow-[0px_-1px_4px_theme(colors.ink/25%)] ${className}`}
    >
      <NavItem item={left1} activeKey={activeKey} onItemClick={onItemClick} />
      <NavItem item={left2} activeKey={activeKey} onItemClick={onItemClick} />
      <div className="relative h-12">
        <SosButton className="relative -top-5" onClick={onSosClick} />
      </div>
      <NavItem item={right1} activeKey={activeKey} onItemClick={onItemClick} />
      <NavItem item={right2} activeKey={activeKey} onItemClick={onItemClick} />
    </nav>
  )
}

export default BottomNavBar
