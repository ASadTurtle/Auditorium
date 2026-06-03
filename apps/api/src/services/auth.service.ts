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
      createdAt: new Date(Date.now()),
      expiresAt: new Date((Date.now() + 7 * 24 * 60 * 60 * 1000)), // 7 days
    }
  });

  return { token }
}

