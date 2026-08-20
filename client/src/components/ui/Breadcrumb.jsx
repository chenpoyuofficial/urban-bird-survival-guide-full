import { Link } from 'react-router-dom'

function Breadcrumb({ boardName, boardId, className = '' }) {
  return (
    <nav className={`flex items-center gap-1.5 text-sm ${className}`}>
      <Link to="/board" className="font-medium text-primary hover:underline">
        首頁
      </Link>
      {boardName && (
        <>
          <span className="text-ink/40">/</span>
          <Link to={`/board/${boardId}`} className="font-medium text-primary hover:underline">
            {boardName}
          </Link>
        </>
      )}
    </nav>
  )
}

export default Breadcrumb
