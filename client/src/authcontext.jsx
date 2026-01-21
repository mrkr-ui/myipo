import { createContext, useState, useEffect, useContext } from "react";
import supabase from "./superbaseClient.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(undefined);

    //signUp function
    const signUpNewUser = async (email, password) =>{
        const {data, error} = await supabase.auth.signUp({
            email,
            password,
            //options: { emailRedirectTo: window.location.origin } 
            // optional, disable confirmation
            // TODO: remove emailRedirectTo or set it to your app URL during production 
        });
        if ( error ) {
            console.error("Error signing up:", error.message);
            return {success:false, error};
        }
        setSession(data.session);
        console.log("signUp successful");
        return {success: true, data}
    }

    useEffect(() =>{
        // Get initial session
        supabase.auth.getSession().then(({data: {session}}) => {
            setSession(session);
        });

        // Listen for auth changes
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            setSession(session);
        });

        //cleanup
        return () => {
            authListener.subscription.unsubscribe();
        }
    },[])

    //signIn function
    const signIn = async ( email, password ) => {
        try{
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if ( error ) {
                console.error("Error signing in:", error.message);
                return {success:false, error};
            }
            console.log("signIn successful");
            setSession(data.session);
            return { success:true, data }
        } catch (err) {
            console.error("Error signing in:", err.message);
            return {success:false, error: err.message};
        }
    }

    //chnage password
    const changePassword = async ( newPassword ) =>{
        try {
            const {data, error} = await supabase.auth.updateUser({
                password: newPassword
            });
            if (error){
                console.error("error while updating password: ", error)
                return {success: false, error}
            }
            return {success: true, data}
        } catch (err) {
            console.error("something went wrong: ", err.message )
            return {success:false}
        }
    }

    
    //cahnge name
    // const changeName = async () => {
    //     const { data: userData, error: userError } = await supabase.auth.getUser()

    //     if(userError || !userData?.user){
    //         console.error("error while getting user")
    //         return
    //     }
        
    //     const userId = userData.user.id
    //     await supabase
    //     .from("user_profile")
    //     .update({ name })
    //     .eq("id", user.id);
    //     const { data, error } = await supabase
    //     .from('user_profile')
    //     .update({name: "new name"})
    //     .eq("id", userId)
        
    //     if ( error ) {
    //         console.error("error while updating name: ", error)
    //         return { success:false, error}
    //     }
    //     return { success : true, data }
    // }

    //signOut function
    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if ( error ) {
                console.error("Error signing out:", error.message);
                return {success:false, error};
            }
            console.log("signOut successful");

            // Immediately update UI
            setSession(null);
            return {success:true};
            
        } catch (err) {
            // unexpected failures (network, library bug, etc.)
            console.error("Error signing out:", err.message);
            return {success:false, error: err.message};
        }
    }

    return <AuthContext.Provider value={{ session, signUpNewUser, signOut, signIn, changePassword }}>{children}</AuthContext.Provider>
    
}

//custom hook to use the auth context. it uses useContext to access the AuthContext
export const UserAuth = () => {
    return useContext(AuthContext)
}