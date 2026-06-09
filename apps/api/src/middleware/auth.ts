import { NextFunction, Request, Response } from 'express';
import { prisma } from '@auditorium/db';
import { createHash } from 'node:crypto';

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  const hashedToken = createHash('sha256').update(token).digest('hex')

  try {
    const session = await prisma.session.findUnique({ where: { tokenHash: hashedToken } });
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const user = await prisma.user.findUnique({ where: {id: session.authUserId }}); 
    req.user = user!;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}