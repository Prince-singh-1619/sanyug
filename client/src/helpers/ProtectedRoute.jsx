import React from 'react'
import { Navigate, useLocation } from 'react-router'

const ProtectedRoute = ({children}) => {
  const isLoggedIn = localStorage.getItem("authToken")
  const location = useLocation()

  if(!isLoggedIn){
    return <Navigate to='/login' replace state={{from: location}}/>
  }
  // else{
  //   return <Navigate to='/' replace />
  // }

  return children
}

export default ProtectedRoute