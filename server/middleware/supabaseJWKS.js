import {createLocalJWKSet} from 'jose';
import { ApiError } from '../utils/apiError.js';

let jwks = null;
let jwksPromise = null;
const supabaseUrl = process.env.SUPABASE_URL;
const jwsUrl = `${supabaseUrl}/auth/v1/.well-known/jwks.json`

export async function loadSupabaseJWKS() {
    

    if (!jwsUrl) {
        throw new ApiError(500, "SUPABASE_JWKS URL is not defined in environment variables");
    }
    const res = await fetch(jwsUrl)
    
    if(!res.ok){
        throw new ApiError(500, `Failed to fetch JWKS from Supabase: ${res.status} ${res.statusText}`);
    }
    const keys = await res.json();
    jwks = createLocalJWKSet(keys);

    //console.log("Supabase JWKS loaded successfully", keys);
}

export async function getjwks(){
    if (!jwks) {
        if (!jwksPromise) {
            jwksPromise = loadSupabaseJWKS()
        }

        try {
            await jwksPromise;
        } catch (error) {
            jwksPromise = null; // reset promise on failure
            throw error;
        }
        
        if (!jwks) {
            throw new ApiError(500, 'Failed to initialize Supabase JWKS')
        }
    }
    return jwks;
}