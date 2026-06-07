import supabase from "../utils/supabase.js";
import { ApiError } from "../utils/apiError.js";

export async function registerUser(req, res, next) {
    try {
        const { email, password, name } = req.body;
        if (!email || !password) {
            return next(new ApiError(400, "Email and password are required"));
        }

        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        })
        if(error){
            return next(new ApiError(400, "User registration failed", [error?.message]));
        }

        const { data: profileData, error: profileError } = await supabase
            .from('user_profile')
            .update({name: name})
            .eq('id', data.user.id)
            .select()
            .single();
        if (profileError) {
            return next(new ApiError(500, "Failed to create user profile", [profileError.message]));
        }
        
    
        if (data?.session) {
            res.cookie('access_token', data.session.access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',//TODO: change NODE_ENV TO production when deploying 
                sameSite: 'lax',//TODO: change sameSite attribute to strict, lax or none as per your requirement in production
                path: '/',
                maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
            });
        }
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: profileData
        });
    } catch (error) {
        return next(new ApiError(500, "error while registering user", [error.message]));
    }
}


export async function loginUser(req, res, next) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new ApiError(400, "Email and password are required"));
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        if (error || !data?.user) {
            return next(new ApiError(400, "User login failed", [error?.message]));
        }
        
        res.cookie('access_token', data.session.access_token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // TODO:change NODE_ENV TO production when deploying 
            sameSite: 'lax',//TODO: change sameSite attribute to strict, lax or none as per your requirement in production
            path: '/',
            maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
        })
        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            //user: data.user
        })

    } catch (error) {
        return next(new ApiError(500, "error while logging in user", [error.message]));
    }
}


export async function getCurrentUser(req, res, next) {
    try {
        const userId = req.user?.sub;
        console.log("userId in getCurrentUser:", userId);
        if(!userId){
            return next(new ApiError(401, "Unauthorized : No access id from token provided"));
        }

        const { data, error } = await supabase
            .from('user_profile')
            .select()
            .eq('id', userId)
            .single();
        if (error || !data) {
            return next(new ApiError(401, "Unauthorized: Invalid access token", [error?.message]));
        }
        console.log("Fetched current user data:", data);
        return res.status(200).json({
            success: true,
            message: "Current user fetched successfully",
            user: data
        }).redirect('/dashboard');
    } catch (error) {
        return next(new ApiError(500, "error while fetching current user", [error.message]));
    }

}


export async function logoutUser(req, res, next) {
    try {
        //const token = req.cookies.access_token
        const id = req.user?.sub;
        const { error } = await supabase.auth.signOut(id);
        if ( error ) {
            return next(new ApiError(400, "No access token provided"));
        }
        // const { error } = await supabase.auth.admin.invalidateUserByAccessToken(token);
        if (error) {
            return next(new ApiError(500, "Failed to logout user", [error.message]));
        }

        res.clearCookie('access_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // TODO:change NODE_ENV TO production when deploying 
            sameSite: 'lax', //TODO: change sameSite attribute to strict, lax or none as per your requirement in production
            path: '/'
        });

        return res.status(200).json({
            success: true,
            message: "User logged out successfully"
        }).redirect('/');
    } catch (error) {
        return next(new ApiError(500, "error while logging out user", [error.message]));
    }
} 


export async function updateUserData(req, res, next) {
    try {
        //TODO: REPLACE USERID WITH ID FETCHED USING COOKIE TOKEN TO AVOID RLS ISSUES
        const userId = req.user?.sub;
        if (!userId) {
            return next(new ApiError(401, "Unauthorized: No access token provided"));
        }

        const { newData } = req.body;

        if (!userId) {
            return next(new ApiError(400, "User ID is required"));
        }

        if ( newData && Object.keys(newData).length > 0 ) {
            const {data,error} = await supabase
            .from('user_profile')
            .update(newData)
            .eq('id', userId)
            .select()
            .single();

            if(error){
                return next(new ApiError(500, "Failed to update user profile", [error.message]));
            };
            
            console.log("updated rows", data);
            return res.status(200).json({
                success: true,
                message: "User profile updated successfully",
                user: data
            });
        }else{
            return res.status(400).json({
            success: false,
            message: "alertData is required",
            });
        }
    } catch (error) {
        return next(new ApiError(500, "error while updating user profile", [error.message]));
    }
}


export async function updateUserAlerts(req, res, next) {
    try {
        //TODO: REPLACE USERID WITH ID FETCHED USING COOKIE TOKEN TO AVOID RLS ISSUES
        const userId = req.user?.sub;
        const email = req.user?.email; 
        const { alertData } = req.body;
        if ( alertData && Object.keys(alertData).length > 0 ){
            const { error, data } = await supabase
            .from('ipo_alerts')
            .insert({
                user_id: userId,
                ipo_name: alertData.ipoName,
                alert_at: alertData.alertAt,
                filter: alertData.filters,
                email: email,
                status: 'pending'
            })
            .select()
            .single();
            if(error) {
                return next(new ApiError(500, "Failed to alert data", [error.message]));
            }
            return res.status(200).json({
                success: true,
                message: "User alert data updated successfully",
                data: data
            })};
    } catch (error) {
        return next(new ApiError(500, "error while updating user alerts", [error.message]));
    }
}


export async function fetchUserAlerts(req, res, next) {
    try {
        const  userId = req.user?.sub;
        //const userId = req.cookies.id;
        //console.log("userId in fetchUserAlerts:", req.cookies.id);
        if (!userId) {
            return res.status(401).json({
            success: false,
            message: "Unauthorized",
            });
        }
        const { data, error } = await supabase
            .from('ipo_alerts')
            .select('ipo_name, alert_at, filter, status')
            .eq('user_id', userId);
        if (error) {
            return res.status(500).json({
            success: false,
            message: "Failed to fetch user alerts",
            error: error.message,
        });
        }
        return res.status(200).json({
            success: true,
            message: "User alerts fetched successfully",
            alerts: data
        });
    } catch (error) {
        return res.status(500).json({
        success: false,
        message: "Unexpected server error",
        });
    }
}