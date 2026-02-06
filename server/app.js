import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import { loadSupabaseJWKS } from './middleware/supabaseJWKS.js';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
})); //cors middleware for handling cross-origin requests

app.use(express.json()); // built-in middleware for parsing JSON request bodies


app.use(cookieParser(process.env.COOKIE_SECRET)); // cookie parser middleware for secure cookie handling

await loadSupabaseJWKS(); // Load JWKS at server startup

// root route
app.use('/api/user', userRoutes);

//error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
  });
});


export default app;