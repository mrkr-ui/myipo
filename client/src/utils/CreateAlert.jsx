import React, { useState } from 'react'
import supabase from '../superbaseClient.js';
import { UserAuth } from '../authcontext.jsx';

function CreateAlert() {
    const { session } = UserAuth();
	const [form, setForm] = useState({
		ipoName: '',
		alertDate: '',
		alertTime: '',
		subscriptionOp: '>',
		subscriptionValue: '',
		gmpOp: '>',
		gmpValue: ''
	})

	const handleChange = (e) => {
		const { name, value } = e.target
		setForm((p) => ({ ...p, [name]: value }))
	}

	const createAlert = async (e) => {
		e.preventDefault()
		const payload = {
			ipoName: form.ipoName.trim(),
			alertAt:
				form.alertDate && form.alertTime ? new Date(`${form.alertDate}T${form.alertTime}`).toISOString() : null,
			filters: {
				subscription:
					form.subscriptionValue === '' ? null : { op: form.subscriptionOp, value: Number(form.subscriptionValue) },
				gmp: form.gmpValue === '' ? null : { op: form.gmpOp, value: Number(form.gmpValue) }
			}
		}
		// replace with API call as needed
		console.log('Create alert payload:', payload)
        
        if ( !session?.user ) return;
        //insert data
        const {data, error} = await supabase
            .from('ipo_alerts')
            .insert({
                user_id: session.user.id,
                ipo_name: payload.ipoName,
                alert_at: payload.alertAt,
                filter: payload.filters
            })
        if ( error ) {
            console.error("error while creating alert: ", error)
            return { success:false, error}
        }else{
            console.log("alert created successfully: ", data)
        }
		// reset
		setForm({
			ipoName: '',
			alertDate: '',
			alertTime: '',
			subscriptionOp: '>',
			subscriptionValue: '',
			gmpOp: '>',
			gmpValue: ''
		})
	}

	return (
		<div>
			<div>
				<form action="" method="post" className="flex space-x-4" onSubmit={createAlert}>
					{/* Basic details section */}
					<div>
						<h3 className="text-lg text-red-600">Basic details</h3>

						<div className="flex flex-col">
							<label htmlFor="ipoName">IPO Name:</label>
							<input
								type="text"
								className="border border-gray-300 rounded-md py-1 mt-2"
								name="ipoName"
								required
								id="ipoName"
								placeholder="Enter IPO Name"
								value={form.ipoName}
								onChange={handleChange}
							/>
						</div>

						<div className="flex flex-col">
							<label htmlFor="alertDate">Alert date:</label>
							<input
								type="date"
								className="border border-gray-300 rounded-md py-1 mt-2"
								name="alertDate"
								required
								id="alertDate"
								value={form.alertDate}
								onChange={handleChange}
							/>
						</div>

						<div className="flex flex-col">
							<label htmlFor="alertTime">Alert time:</label>
							<input
								type="time"
								className="border border-gray-300 rounded-md py-1 mt-2"
								name="alertTime"
								required
								id="alertTime"
								value={form.alertTime}
								onChange={handleChange}
							/>
						</div>
					</div>

					{/* Filters section */}
					<div>
						<h3 className="text-lg text-red-600">Filters</h3>

						<div className="flex items-center space-x-2">
							<div className="flex flex-col">
								<label htmlFor="subscriptionOp">Subscription:</label>
								<select
									id="subscriptionOp"
									name="subscriptionOp"
									value={form.subscriptionOp}
									onChange={handleChange}
									className="border border-gray-300 rounded-md py-1 mt-2"
								>
									<option value=">">{'>'} Greater than</option>
									<option value="<">{'<' } Less than</option>
									<option value=">=">{'>='} Greater or equal</option>
									<option value="<=">{'<='} Less or equal</option>
									<option value="=">= Equal</option>
								</select>
							</div>

							<div className="flex flex-col">
								<label htmlFor="subscriptionValue" className="invisible">value</label>
								<input
									type="number"
									className="border border-gray-300 rounded-md py-1 mt-2"
									name="subscriptionValue"
									id="subscriptionValue"
									placeholder="e.g. 10"
									value={form.subscriptionValue}
									onChange={handleChange}
								/>
							</div>
						</div>

						<div className="flex items-center space-x-2 mt-4">
							<div className="flex flex-col">
								<label htmlFor="gmpOp">GMP (%):</label>
								<select
									id="gmpOp"
									name="gmpOp"
									value={form.gmpOp}
									onChange={handleChange}
									className="border border-gray-300 rounded-md py-1 mt-2"
								>
									<option value=">">{'>'} Greater than</option>
									<option value="<">{'<' } Less than</option>
									<option value=">=">{'>='} Greater or equal</option>
									<option value="<=">{'<='} Less or equal</option>
									<option value="=">= Equal</option>
								</select>
							</div>

							<div className="flex flex-col">
								<label htmlFor="gmpValue" className="invisible">value</label>
								<input
									type="number"
									className="border border-gray-300 rounded-md py-1 mt-2"
									name="gmpValue"
									id="gmpValue"
									placeholder="e.g. 10"
									value={form.gmpValue}
									onChange={handleChange}
								/>
							</div>
						</div>
					</div>

					<button type="submit" className="bg-red-700 text-white px-3 py-1 rounded-md hover:bg-red-800 transition">
						Create Alert
					</button>
				</form>
			</div>
		</div>
	)
}

export default CreateAlert