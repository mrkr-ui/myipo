import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { UserAuth } from '../authcontext.jsx'
import supabase, { updateName } from "../superbaseClient.js";
import CreateAlert from '../utils/CreateAlert.jsx';
 
function Dashboard() {
	const [name, setName] = useState('User');
	const { session, signOut } = UserAuth();
	//const [session, setSession] = useState(null);
	const navigate = useNavigate();
	const location = useLocation(); // <-- new
	//const [loading, setLoading] = useState(true);

 
 	const signOutUser = async () => {
 		try {
			await signOut();
			navigate('/');
 		} catch (error) {
 			console.error("Error signing out user:", error.message);
 		}
 	}
	
 	useEffect( () => {
 		// if navigated here with a name (immediate update after signup), use it first
 		// const navName = location?.state?.name;
		// if (navName) {
		// 	setName(navName);
		// }

		
		// wait for session to be present to persist the name; effect re-runs when session changes
		// else {
		// 	setName('User');
		// 	return;
		// }
		
		// persist navigated name to profile once session is available
		// const persistNavName = async () => {
		// 	try {
		// 		const res = await updateName(navName, session.user.id);
		// 		console.log("session data is", session)
		// 		if (res){
		// 			console.log("Name updated in profile:", res);
		// 		}
		// 		if (!res?.success) console.warn('updateName result:', res);
		// 	} catch (err) {
		// 		console.error('Error updating name in profile:', err);
		// 	}
		// } 
 
		// persistNavName(); 
		// best-effort; don't block UI

		// fetch the name from profile to show in dashboard
		if (!session?.user?.id) return;

		const fetchData = async () => {
		const {data, error} = await supabase
			.from('user_profile')
			.select('name')
			.eq('id', session.user.id)
			.single();
		if ( error ) {
			console.error("error fetching user name from profile:", error);
			return;
		}
		if ( data?.name ) {
			setName(data.name);
		}};

		fetchData();
		console.log("session changed",{session});	
 	}, [ session ]);
	
	
   	
 	return (
 		<div className="min-h-screen bg-green-700 text-gray-900">
 			<header className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
 				{/* User name */}
 				<div className="text-white text-lg font-semibold">Hello, {name}</div>
 
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
 						<button className="bg-green-700 text-white px-3 py-1 rounded-md hover:bg-green-800 transition">
 							Add Alerts
 						</button>
 					</div>
 
 					<div className="space-y-4 text-gray-600 ">
						< CreateAlert />
 						<p className="italic">No events yet. Click "Add Event" to create one.</p>
 						{/* ...existing code... */}
 					</div>
 				</div>
 			</main>
 		</div>
 	)
 }
 
 export default Dashboard