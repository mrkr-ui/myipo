import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient( supabaseUrl, supabaseAnonKey );

// helper: update auth user's metadata (best-effort)
// usage: await updateAuthUserName('Jane Doe');
export const updateAuthUserName = async (name) => {
	await supabase.auth.updateUser({ data: { name } });
    
};

export const updateName = async (name, id) => {
    const { error } = await supabase
        .from('user_profile')
        .update({ name })
        .eq('id', id);
    
    if ( error ) {
        console.error("error while updating name: ", error)
        return { success:false, error}
    }
    return { success : true };
};

// export const updateName = async (name) => {
//   // Get the currently logged-in user
//   const {
//     data: { user } = {},
//     error: authError
//   } = await supabase.auth.getUser();

//   if (authError || !user) {
//     console.error("No logged-in user or auth error", authError);
//     return { success: false, error: authError || "No logged-in user" };
//   }

//   // Update the row for the current user
//   const { data, error } = await supabase
//     .from('user_profile')
//     .update({ name })
//     .eq("id", user.id); // necessary WHERE clause

//   if (error) {
//     console.error("Error updating name in profile:", error);
//     return { success: false, error };
//   }};



export default supabase;