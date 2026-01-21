import React from 'react'
import { Navigate } from 'react-router-dom'
import { UserAuth } from '../authcontext.jsx'

function PrivateRoute({children}) {
    const { session } = UserAuth();
    if ( session === undefined ) {
        return <p>Loading...</p>; // or a spinner/loading indicator
    }
  return (
    <>{session ? <>{children}</> : <Navigate to="/" />}</>
  )
}

export default PrivateRoute