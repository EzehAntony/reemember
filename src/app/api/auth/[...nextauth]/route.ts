import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth/next";
import type { JWT } from "next-auth/jwt";

type UserWithId = { id?: string };
type TokenWithId = JWT & { id?: string };

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET!,
  callbacks: {
    async session({ session, token }) {
      if (token?.sub && session?.user) {
        (session.user as UserWithId).id = token.sub as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user?.id) {
        (token as TokenWithId).id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
});

export { handler as GET, handler as POST };
