import React from 'react'
import { Navigate } from 'react-router-dom'
import { UserAuth } from '../authcontext.jsx'

function PrivateRoute({ children }) {
	// include loading if your auth context provides it; undefined is fine if not present
	const { name, userData, loading } = UserAuth();

	if (loading) {
		// lightweight loading indicator — replace with spinner if desired
		return <>Loading...</>;
	}

	if (!name || !userData) {
		// redirect to login when not authenticated
		return <Navigate to="/login" replace />;
	}

	return <>{children}</>;
}

export default PrivateRoute