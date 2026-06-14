import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv';
dotenv.config();

// Create a single supabase client for interacting with your database
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
if(!supabase){
    throw new ApiError(500, err.message || "Failed to create supabase client")
}
export default supabase