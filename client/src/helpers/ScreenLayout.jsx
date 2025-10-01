import React from 'react'
import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import ProtectedRoute from './ProtectedRoute';
import Conversations from '../pages/Conversations';
import Message from '../pages/Message';

const ScreenLayout = () => {
    function useIsDesktop() {
        const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);

        useEffect(() => {
            const handleResize = () => setIsDesktop(window.innerWidth > 768);
            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        }, []);

        return isDesktop;
    }
    const isDesktop = useIsDesktop();

  return (
    <Routes>
      {isDesktop ? (
        // Desktop routes (nested structure)
        <Route path="/conversations" element={<ProtectedRoute> <Conversations/> </ProtectedRoute>} >
          <Route path=":convoId" element={<ProtectedRoute> <Message/> </ProtectedRoute>} />
        </Route>
      ) : (
        // Mobile routes (flat structure)
        <>
          <Route path="/conversations" element={<ProtectedRoute> <Conversations/> </ProtectedRoute>} />
          <Route path="/conversations/:convoId" element={<ProtectedRoute> <Message/> </ProtectedRoute>} />
        </>
      )}
    </Routes>
  )
}

export default ScreenLayout