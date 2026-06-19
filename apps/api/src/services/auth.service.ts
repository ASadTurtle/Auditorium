import { prisma } from '@auditorium/db';
import { hashSync, compareSync } from 'bcrypt-ts';
import { createHash } from 'node:crypto';

export function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export async function register(username: string, password: string) {
  const existingUser = await prisma.user.findUnique({ where: { userName: username } });
  if (existingUser) {
    throw new Error('User already exists');
  }
  const hashedPassword = hashSync(password, 10);
  const user = await prisma.user.create({ data: { userName:username, passwordHash: hashedPassword } });
  
  const token = `${user.id}-${Date.now()}`;
  await prisma.session.create({
    data: {
      tokenHash: hashToken(token),
      authUserId: user.id,
      expiresAt: new Date((Date.now() + 7 * 24 * 60 * 60 * 1000)), // 7 days
    }
  });

  return token
}

export async function login(username: string, password: string) {
  const user = await prisma.user.findUnique({ where: { userName: username } });
  if (!user) {
    throw new Error('Invalid username or password');
  }

  if (!compareSync(password, user.passwordHash)) {
    throw new Error('Invalid username or password');
  }

  const token = `${user.id}-${Date.now()}`;
  await prisma.session.create({
    data: {
      tokenHash: hashToken(token),
      authUserId: user.id,
      expiresAt: new Date((Date.now() + 7 * 24 * 60 * 60 * 1000)), // 7 days
    }
  });

  return token
}

export async function logout(token: string) {
  const tokenHash = hashToken(token);
  await prisma.session.deleteMany({ where: { tokenHash } });
}

