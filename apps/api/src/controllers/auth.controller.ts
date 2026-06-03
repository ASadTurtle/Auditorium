import { Request, Response } from 'express';
import * as authService from '../services/auth.service.js';

export async function register(req: Request, res: Response) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  try {
    const token = await authService.register(username, password);
    return res.status(201).json({ token });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}