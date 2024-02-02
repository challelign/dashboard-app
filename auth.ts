import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
import type { User as UserInterface } from '@/app/lib/definitions';
import bcrypt from 'bcryptjs';

async function getUser(email: string): Promise<UserInterface | undefined> {
  try {
    // const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    const userData = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    console.log(userData);
    return userData;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  } finally {
    // Close the Prisma client connection
    await prisma.$disconnect();
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          console.log(user);
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;

          if (!user) return null;
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});
