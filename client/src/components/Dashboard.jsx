import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserAuth } from '../authcontext.jsx'
//import  { updateData } from "../superbaseClient.js";
import CreateAlert from '../utils/CreateAlert.jsx';
import { api } from '../utils/api.js';
import AlertList from '../utils/alertList.jsx';
 
function Dashboard() {
	//const [name, setName] = useState('User');
	const { name, userData, signOut,fetchUser, isUserAutologin } = UserAuth();
	//const [session, setSession] = useState(null);
	const navigate = useNavigate();
	//const location = useLocation(); // <-- new
	//const [loading, setLoading] = useState(true);

 
 	const signOutUser = async () => {
 		try {
			await signOut();
			navigate('/');
 		} catch (error) {
 			console.error("Error signing out user:", error.message);
 		}
 	}
	//console.log("userData in Dashboard:", userData);
 	
	useEffect(() => {
		if (isUserAutologin && !userData) {
			fetchUser();
		}
	}, [isUserAutologin]);
		
	
	// toggle visibility for CreateAlert
	const [showCreateAlert, setShowCreateAlert] = useState(false);
	const toggleCreateAlert = () => setShowCreateAlert(v => !v);
	
   	
 	return (
 		<div className="min-h-screen bg-green-700 text-gray-900">
 			<header className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
 				{/* User name */}
 				<div className="text-white text-lg font-semibold">Hello, {isUserAutologin ? userData?.name : name}</div>
 
 				{/* Top-right actions */}
 				<div className="flex items-center gap-3">
 					<button
 						className="bg-red-700 text-white px-3 py-1 rounded-md hover:bg-red-800 transition"
 						onClick={signOutUser}
 					>
 						Logout
 					</button>
 				</div>
 			</header>
 
 			<main className="max-w-6xl mx-auto px-4 pb-8">
 				<div className="bg-white rounded-lg shadow-md p-6">
 					<div className="flex items-center justify-between mb-4">
 						<h2 className="text-xl font-semibold text-red-600">Your Alerts</h2>
 						<button
 							className="bg-green-700 text-white px-3 py-1 rounded-md hover:bg-green-800 transition"
 							onClick={toggleCreateAlert}
 						>
 							{showCreateAlert ? 'Close' : 'Add Alerts'}
 						</button>
 					</div>
 
 					<div className="space-y-4 text-gray-600 ">
 						{showCreateAlert && <CreateAlert />}
 						{/* ...existing code... */}
 					</div>
					<div>
						{/* Alert List Component */}
						<AlertList />
					</div>
 				</div>
 			</main>
 		</div>
 	)
 }
 
 export default Dashboard