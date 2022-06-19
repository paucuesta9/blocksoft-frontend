import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import useUser from '../hooks/useUser'

const PrivateRoute = ({ children }) => {
  const { isLogged } = useUser()
  const location = useLocation()

  return isLogged
    ? (
        children
      )
    : (
      <Navigate to='/' state={{ from: location, requireLogin: true }} replace />
      )
}

export default PrivateRoute
