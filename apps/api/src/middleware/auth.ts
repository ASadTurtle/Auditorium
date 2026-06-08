import { NextFunction, Request, Response } from 'express';
import { prisma } from '@auditorium/db';
import { hashSync } from 'bcrypt-ts';

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  const hashedToken = hashSync(token, 10);

  try {
    const user = await prisma.user.findUnique({ where: { id: hashedToken } });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}