import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/lib/db';
import { adminUsers } from '@/lib/db/schema';

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  session: { strategy: 'jwt' },
  pages: { signIn: '/admin/login' },
  providers: [Credentials({
    credentials: { email: { type: 'email' }, password: { type: 'password' } },
    async authorize(credentials) {
      const parsed = z.object({ email: z.string().email(), password: z.string().min(1) }).safeParse(credentials);
      if (!parsed.success) return null;
      const [user] = await db.select().from(adminUsers).where(eq(adminUsers.email, parsed.data.email.toLowerCase())).limit(1);
      if (!user || !(await compare(parsed.data.password, user.passwordHash))) return null;
      return { id: user.id, email: user.email, name: 'Administrator' };
    },
  })],
});
