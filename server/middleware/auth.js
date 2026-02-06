import { jwtVerify } from "jose";
import { getjwks } from "./supabaseJWKS.js";
import { ApiError } from "../utils/apiError.js";

export async function authenticateToken(req, res, next) {
  const token = req.cookies['access_token'];
  if (!token) {
    return next(new ApiError(401, "Access token is missing"));
  }
  
  try {
    const {payload} = await jwtVerify(token, await getjwks(), {
      issuer:  `${process.env.SUPABASE_URL}/auth/v1`,
      audience: 'authenticated',
    });
    if (!payload || !payload.sub) {
      return next(new ApiError(401, "Invalid token payload"));
    }
    console.log("Token verified successfully", payload);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token auth.js' })
  }
}