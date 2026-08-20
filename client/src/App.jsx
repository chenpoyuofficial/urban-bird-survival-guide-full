import { Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import LoadingSpinner from './components/ui/LoadingSpinner'

function App() {
  const { status } = useAuth()

  if (status === 'loading') {
    return <LoadingSpinner />
  }

  return <Navigate to={status === 'authenticated' ? '/board' : '/welcome'} replace />
}

export default App
