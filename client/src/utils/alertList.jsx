import React from 'react'
import {  UserAuth } from '../authcontext.jsx';
import { api } from './api.js';

function AlertList() {
    const { alertList } = UserAuth();
    //const [alerts, setAlerts] = useState([]);

    // async function getAllUserAlerts(){
    //     try {
    //         const res = await api.get("/api/user/alerts", { withCredentials: true })
    //         const list = res?.data?.alerts || [];
    //         setAlerts(list);
    //     }catch(error){
    //         console.error("Error fetching alerts:", error.message);
    //     }
    // }

    // useEffect(() => {
    //     getAllUserAlerts();

    //     // handle created alerts from CreateAlert
    //     const handler = (e) => {
    //         const newAlert = e?.detail;
    //         if (!newAlert) return;
    //         setAlerts((prev) => [newAlert, ...prev]);
    //     }
    //     window.addEventListener('alert:created', handler);
    //     return () => window.removeEventListener('alert:created', handler);
    // }, []);

    if(alertList.length === 0){
        return <p className="italic">No events yet. Click "Add Event" to create one.</p>
    }else{
        return (
            <div className="space-y-2">
                {alertList.map((a, idx) => (
                    <div key={a.id || a.createdAt || idx} className="p-3 border rounded-md">
                        <div className="font-semibold">{a.ipoName}</div>
                        <div className="text-sm text-gray-600">Alert at: {a.alertAt || '—'}</div>
                        <div className="text-sm text-gray-600">Filters: {JSON.stringify(a.filters)}</div>
                    </div>
                ))}
            </div>
        )
    }
  
}

export default AlertList