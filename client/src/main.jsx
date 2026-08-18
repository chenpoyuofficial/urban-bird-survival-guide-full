import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Playground from './pages/Playground.jsx'
import Board from './pages/Board.jsx'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import Welcome from './pages/Welcome.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/board" element={<Board />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dev/playground" element={<Playground />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
