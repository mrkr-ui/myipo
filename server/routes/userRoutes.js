import express from 'express';
import { registerUser, loginUser, logoutUser, getCurrentUser, updateUserData, updateUserAlerts, fetchUserAlerts } from '../controllers/userController.js';
import {authenticateToken} from '../middleware/auth.js';
const router = express.Router();

//routes
router.get('/me', authenticateToken, getCurrentUser);
router.post('/register', registerUser) ;//working
router.post('/login', loginUser);//working
router.post('/logout',authenticateToken, logoutUser);//working
router.patch('/update', authenticateToken, updateUserData);//working
router.post('/update/alerts',authenticateToken, updateUserAlerts);
//router.get('/profile/:userId', authenticateToken, fetchUserProfile);
router.get('/alerts', authenticateToken, fetchUserAlerts);

export default router;