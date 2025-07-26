import express from 'express';
import { register, login, logout, updateProfile } from '../controllers/user.controller.js';
import { verifyToken } from '../middlewares/auth.js';
import upload from '../middlewares/multer.js'; // multer config as above

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);



// Protected route with upload fields for profile photo and resume
router.put('/update-profile', verifyToken, upload.fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'resume', maxCount: 1 }
]), updateProfile);

export default router;
