import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// User Registration
router.post('/register', authenticate, authController.register);

// User Login
router.post('/login', async (request, response) => {
  const { email, password } = request.body;
  // Implementation for user login
});

// User Logout
router.post('/logout', async (request, response) => {
  // Implementation for user logout
});

export default router;