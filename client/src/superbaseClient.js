//import { createClient } from '@supabase/supabase-js';
import {api} from './utils/api.js';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// const supabase = createClient( supabaseUrl, supabaseAnonKey );


export const updateData = async (userId, updates) => {

   try {
    const response = await api.patch('/api/user/update', {
        userId,
        newData: updates
    });
    if (!response.data) {
        console.error("No response data received from server");
        return { success: false, error: "No response data" };
    }
    return { success : true };
    } catch (error) {
        console.error("Error updating data:", error);
        return { success: false, error };
    }
};


//export default supabase;