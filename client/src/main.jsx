import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import App from './App.jsx'
import Playground from './pages/Playground.jsx'
import Board from './pages/Board.jsx'
import BoardDetail from './pages/BoardDetail.jsx'
import PostDetail from './pages/PostDetail.jsx'
import PostForm from './pages/PostForm.jsx'
import Map from './pages/Map.jsx'
import Friends from './pages/Friends.jsx'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import Welcome from './pages/Welcome.jsx'
import Settings from './pages/Settings.jsx'
import EditProfile from './pages/EditProfile.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/board" element={<Board />} />
          <Route path="/board/:boardId" element={<BoardDetail />} />
          <Route path="/board/:boardId/posts/new" element={<PostForm />} />
          <Route path="/posts/:postId" element={<PostDetail />} />
          <Route path="/posts/:postId/edit" element={<PostForm />} />
          <Route path="/map" element={<Map />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/edit" element={<EditProfile />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dev/playground" element={<Playground />} />
        </Routes>
      </AuthProvider>
    </HashRouter>
  </StrictMode>,
)
