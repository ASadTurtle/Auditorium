import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// User Registration
router.post('/register', authController.register);

// User Login
router.post('/login', authController.login);

// User Logout
router.post('/logout', authenticate, authController.logout);

export default router;