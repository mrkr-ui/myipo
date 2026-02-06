import { createContext, useState, useEffect, useContext } from "react";
import {api} from "./utils/api.js";
//import { use } from "react";
const AuthContext = createContext();
let isUserAutologin = true;

export const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState();
    const [name, setName] = useState("");
    const [alertList, setAlertList] = useState([]);

    //signUp function
    const signUpNewUser = async (email, password, name) =>{
        try {
            const response = await api.post("/api/user/register", {
                email,
                password,
                name
            })
            console.log("signUp response:", response);
            if(!response?.data?.success){
                return { success:false, error: response.error };
            }
            console.log("name from signUp response:", response?.data?.user?.name);
            setName(response?.data?.user?.name || "");
            isUserAutologin = false;
            return { success:true, data: response?.data?.user };
        } catch (error) {
            console.error("Error signing up:", error.message);
            return { success:false, error: error.message };
        }
    }

   
    // Get initial user
    const fetchUser = async () =>{
        try {
            const response = await api.get("/api/user/me", { withCredentials: true })

            if(!response?.data?.success || !response?.data?.user){
                setUserData(null);
                return { success:false, error: "No user found" };
            }
            setUserData(response?.data?.user);
            //setName(response?.data?.user?.name || "");
            return { success:true, data: response?.data?.user};
        } catch (error) {
            //setUserData(null);
            
            console.error("Error fetching user:", error.message);
            return { success:false, error: error.message };
        }
            
    }
    
    //alertlist
    const insertAlertToList = async (payload) => {
        try {
            const rsponse = await api.post("/api/user/update/alerts", {
                alertData: payload
            })
            if(!rsponse?.data?.success){
                console.error("Error creating alert:", rsponse.error);
                return { success:false, error: rsponse.error };
            }
            //setAlertList((prev) => [payload, ...prev]); 
        } catch (error) { console.error("Error creating alert:", error.message);}
    }

    //fetch alerts
    useEffect( () => {
        async function fetchAlerts() {
            try {
                
                const response = await api.get('/api/user/alerts');
                console.log("alerts response:", response.data);
                const alerts = response?.data?.alerts || [];
                const normalized = alerts.map(a => ({
                id: a.id,
                ipoName: a.ipo_name,
                alertAt: a.alert_at,
                filters: a.filter,
                status: a.status
            }));

            setAlertList(normalized);
            } catch (error) {
                console.error("Fetch alerts failed:", error);
            }
        }

        fetchAlerts();
    }, [name]);

    //signIn function
    const signIn = async ( email, password ) => {
        try{
            const response = await api.post("/api/user/login", {
                email,
                password,
            });
            if ( !response?.data?.success ) {
                console.error("Error signing in:");
                return {success:false};
            }
            //isUserAutologin = false;
            //console.log("signIn successful");
            //setUserData(response?.data?.user);
            //setName(response?.data?.user?.name || "");
            return { success:true };// , data: response?.data?.user
        } catch (err) {
            console.error("Error signing in:", err.message);
            return {success:false, error: err.message};
        }
    }

    //signOut function
    const signOut = async () => {
        try {
            const response = await api.post("/api/user/logout", { withCredentials: true });

            if(!response.data.success){
                console.error("Error getting response:");
                return {success:false};
            }

            // Immediately update UI
            setUserData(null);
            setAlertList([]);
            setName("");
            return {success:true};
            
        } catch (err) {
            // unexpected failures (network, library bug, etc.)
            console.error("unexpected error signing out:", err.message);
            return {success:false, error: err.message};
        }
    }

    return <AuthContext.Provider value={{ userData, name, signUpNewUser, signOut, signIn, fetchUser, isUserAutologin, insertAlertToList, alertList }}>{children}</AuthContext.Provider>
    
}

//custom hook to use the auth context. it uses useContext to access the AuthContext
export const UserAuth = () => {
    return useContext(AuthContext)
}