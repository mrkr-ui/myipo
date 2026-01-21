import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { UserAuth } from '../authcontext.jsx'
import { useNavigate } from 'react-router-dom';
import supabase from "../superbaseClient.js";
import { updateName } from '../superbaseClient.js';

//signup component 234
function Signup() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { session, signUpNewUser } = UserAuth();
	const [name, setName] = useState('');
	const navigate = useNavigate();
	
	console.log(email, password);
	
	const handleSignup = async (e) =>{ 
		e.preventDefault();
		try {
			const result = await signUpNewUser(email, password);
			// try multiple possible shapes for returned user id
			const userId =
				result?.user?.id ||
				result?.data?.user?.id ||
				result?.id ||
				result?.userId ||
				result?.data?.id;

			if (!userId) {
				console.error("Signup did not return a user id:", result);
				return;
			}

			const persistNavName = async () => {
				try {
					const res = await updateName(name, userId);
					console.log("session data is", session)
					if (res){
						console.log("Name updated in profile:", res);
					}
					if (!res?.success) console.warn('updateName result:', res);
				} catch (err) {
					console.error('Error updating name in profile:', err);
				}
			} 
		
			persistNavName();
			
			// navigate to dashboard and pass name in state so Dashboard can show it immediately
			navigate('/dashboard', { state: { name } });
		} catch (err) {
			console.error("Signup error:", err.message || err);
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-green-700">
			<div className="bg-white rounded-lg shadow-md w-full max-w-md mx-4 p-8">
				<h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Create an account</h2>

				<form className="space-y-4" action="" method="post" onSubmit={handleSignup}>
					<div>
						<label htmlFor="name"
						className="block text-gray-700 text-sm mb-1 font-medium">Name</label>
							<input type="text" 
							id='name'
							placeholder="jane doe"
							required
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"/>
					</div>
					<div>
						<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
						<input
							id="email"
							name="email"
							type="email"
							onChange={(e)=> setEmail(e.target.value)}
							placeholder="you@example.com"
							required
							className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
						/>
					</div>

					<div>
						<label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
						<input
							id="password"
							name="password"
							type="password"
							onChange={(e) => setPassword(e.target.value)}
							placeholder="••••••••"
							required
							className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
						/>
					</div>

					<button
						type="submit"
						className="w-full bg-green-700 text-white py-2 rounded-md font-medium hover:bg-green-800 transition"
					>
						Sign Up
					</button>
				</form>

				<p className="text-center text-sm text-gray-600 mt-4">
					Already have an account?{' '}
					<Link to="/Login" className="text-green-900 font-medium hover:underline">
						Login
					</Link>
				</p>

        <p className="text-center text-sm text-gray-600 mt-4">
					Go to{' '}
					<Link to="/" className="text-green-900 font-medium hover:underline">
						Home
					</Link>
				</p>
			</div>
		</div>
	)
}

export default Signup