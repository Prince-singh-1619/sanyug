import './App.css'
import Register from './pages/Register'
import ThemeToggle from './components/ThemeToggle'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import Home from './pages/Home'
import Conversations from './pages/Conversations'
import Message from './pages/Message'
import Header from './components/Header'
import MyProfile from './pages/MyProfile'

function App() {

  return (
    <BrowserRouter>
      <ToastContainer />
      {/* <ThemeToggle /> */}
      <main className='px-2 py-1 max-h-screen'>
        {/* <Header /> */}
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/" element={<Home />} />
          <Route path="/conversations" element={<Conversations />} />
          <Route path="/my-profile" element={<MyProfile />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App
