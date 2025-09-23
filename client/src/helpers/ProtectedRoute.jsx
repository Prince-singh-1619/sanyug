import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router'

const ProtectedRoute = ({children}) => {
  // const isLoggedIn = localStorage.getItem("authToken")
  const location = useLocation()
  const { authToken } = useSelector(state => state.user)

  if(!authToken){
    return <Navigate to='/login' replace state={{from: location}}/>
  }
  // else{
  //   return <Navigate to='/' replace />
  // }

  return children
}

export default ProtectedRoute