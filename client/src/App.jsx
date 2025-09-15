import './App.css'
import Register from './pages/Register'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Slide, ToastContainer } from 'react-toastify'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import Home from './pages/Home'
import Conversations from './pages/Conversations'
import Message from './pages/Message'
import MyProfile from './pages/MyProfile'
import { Toaster } from "react-hot-toast";
import MessageEvents from './socket/MessageEvents'
import TypingEvents from './socket/TypingEvents'

const App = () => {

  return (
    // <ThemeProvider>
    <BrowserRouter>
      <Toaster /> {/* for react-hot-toast */}
      <ToastContainer
        position='top-center'
        hideProgressBar={true}
        transition={Slide}
        autoClose={3000}
        toastClassName="!max-w-[80vw] text-sm md:text-base break-words"
        bodyClassName="flex items-center"
      />
      <MessageEvents/>
      <TypingEvents/>

      <main className='px-2 py-1 max-h-screen '>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/" element={<Home />} />
          <Route path="/conversations" element={<Conversations />}>
            <Route path=":convoId" element={<Message />} />
          </Route>
          <Route path="/my-profile" element={<MyProfile />} />
        </Routes>
      </main>
    </BrowserRouter>
    // </ThemeProvider>
  );
}

export default App
