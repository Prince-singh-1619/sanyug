import './App.css'
import Register from './pages/Register'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Slide, ToastContainer } from 'react-toastify'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import Conversations from './pages/Conversations'
import Message from './pages/Message'
import MyProfile from './pages/MyProfile'
import { Toaster } from "react-hot-toast";
import MessageEvents from './socket/MessageEvents'
import TypingEvents from './socket/TypingEvents'
import Status from './pages/Status'
import Setting from './pages/Setting'
// import useIsMobile from './hooks/useIsMobile'
import PublicOnlyRoute from './helpers/PublicOnlyRoute '
import ProtectedRoute from './helpers/ProtectedRoute'
import ConvoEvents from './socket/ConvoEvents'
import { useEffect } from 'react'
import { connectSocket } from './socket/socket'
// import useIsMobile from './hooks/useIsMobile'
import ScreenLayout from './helpers/ScreenLayout'


const App = () => {
  
  useEffect(() => {
    connectSocket(); // initialize once
  }, []);

  return (
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
      {/* socket events */}
      <MessageEvents/>
      <TypingEvents/>
      <ConvoEvents/>

      <main className='px-2 py-1 max-h-screen '>
        <Routes>
          <Route path="/register" element={<PublicOnlyRoute> <Register/> </PublicOnlyRoute>} />
          <Route path="/login" element={<PublicOnlyRoute> <Login/> </PublicOnlyRoute>} />
          <Route path="/forgot-password" element={<PublicOnlyRoute> <ForgotPassword/> </PublicOnlyRoute>} />
          
          <Route path="/" element={<ProtectedRoute> <Navigate to="/conversations"/> </ProtectedRoute> } /> 
          <Route path="/*" element={ <ScreenLayout/> } /> 
          
          {/* <Route path="/conversations" element={<ProtectedRoute> <Conversations/> </ProtectedRoute>} >
            <Route path=":convoId" element={<ProtectedRoute> <Message/> </ProtectedRoute>} />
          </Route> */}

          <Route path="/status" element={<ProtectedRoute> <Status/> </ProtectedRoute> } />
          <Route path="/my-profile" element={<ProtectedRoute> <MyProfile/> </ProtectedRoute> } />
          <Route path="/setting" element={<ProtectedRoute> <Setting/> </ProtectedRoute> } />
          {/* <Route path="/test" element={<ProtectedRoute> <NextUserProfile/> </ProtectedRoute> } /> */}
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App
