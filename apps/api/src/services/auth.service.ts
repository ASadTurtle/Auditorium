import { prisma } from '@auditorium/db';
const bcrypt = require('bcrypt');

export async function register(username: string, password: string) {
  const existingUser = await prisma.user.findUnique({ where: { userName: username } });
  if (existingUser) {
    throw new Error('User already exists');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { userName:username, passwordHash: hashedPassword } });
  
  const token = `${user.id}-${Date.now()}`;
  await prisma.session.create({
    data: {
      tokenHash: bcrypt.hashSync(token, 10),
      authUserId: user.id,
      createdAt: Date.now().toString(),
      expiresAt: (Date.now() + 7 * 24 * 60 * 60 * 1000).toString(), // 7 days
    }
  });

  return { token };
}

