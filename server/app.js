import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import userRoutes from './routes/userRoutes.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
})); //cors middleware for handling cross-origin requests

app.use(express.json()); // built-in middleware for parsing JSON request bodies


app.use(cookieParser(process.env.COOKIE_SECRET)); // cookie parser middleware for secure cookie handling

// root route
app.get('/ipoData', (_req, res) => {
  const db = JSON.parse(readFileSync(join(__dirname, 'sampleData/db.json'), 'utf8'));
  res.json(db.ipoData);
});

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