import React, { useEffect, } from 'react'
import { data, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { UserAuth } from '../authcontext.jsx'

function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { signIn } = UserAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const result = await signIn( email, password );
			if(!result?.success) {
				console.error("user does not exist")
				return { success: false, error: 'No user' };
			}
			navigate('/dashboard');
			return {sucess: true };
		} catch (err) {
			console.error("error while loggong in: ", {err} )
			return {sucess:false, err}
		}
		
	
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-green-700">
			<div className="bg-white rounded-lg shadow-md w-full max-w-md mx-4 p-8">
				<h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Welcome back</h2>

				<form className="space-y-4" 
				action="" 
				method="post"
				onSubmit={handleSubmit}>
					<div>
						<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
						<input
							id="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							name="email"
							type="email"
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
							value={password} 
							onChange={(e)=> setPassword(e.target.value)}
							type="password"
							placeholder="••••••••"
							required
							className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
						/>
					</div>

					<button
						type="submit"
						className="w-full bg-green-700 text-white py-2 rounded-md font-medium hover:bg-green-800 transition"
					>
						Log In
					</button>
				</form>

				<p className="text-center text-sm text-gray-600 mt-4">
					Don&apos;t have an account?{' '}
					<Link to="/signup" className="text-green-900 font-medium hover:underline">
						Sign up
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

export default Login