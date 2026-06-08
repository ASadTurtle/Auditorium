import { prisma } from '@auditorium/db';
import { hashSync } from 'bcrypt-ts';

export async function register(username: string, password: string) {
  const existingUser = await prisma.user.findUnique({ where: { userName: username } });
  if (existingUser) {
    throw new Error('User already exists');
  }
  const hashedPassword = await hashSync(password, 10);
  const user = await prisma.user.create({ data: { userName:username, passwordHash: hashedPassword } });
  
  const token = `${user.id}-${Date.now()}`;
  await prisma.session.create({
    data: {
      tokenHash: hashSync(token, 10),
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

  if (hashSync(password, 10) !== user.passwordHash) {
    throw new Error('Invalid username or password');
  }

  const token = `${user.id}-${Date.now()}`;
  await prisma.session.create({
    data: {
      tokenHash: hashSync(token, 10),
      authUserId: user.id,
      expiresAt: new Date((Date.now() + 7 * 24 * 60 * 60 * 1000)), // 7 days
    }
  });

  return token
}

export async function logout(token: string) {
  const tokenHash = hashSync(token, 10);
  await prisma.session.deleteMany({ where: { tokenHash } });
}

