import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

// Minimal local types to avoid implicit any without relying on next-auth types
interface JwtToken {
  sub?: string;
  id?: string;
  [key: string]: unknown;
}

interface SessionUser {
  id?: string;
  [key: string]: unknown;
}

interface AppSession {
  user?: SessionUser;
  [key: string]: unknown;
}

const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async session(params: unknown) {
      const { session, token } = params as {
        session: AppSession;
        token: JwtToken;
      };
      if (token?.sub && session?.user) {
        (session.user as SessionUser).id = token.sub;
      }
      return session as unknown as AppSession;
    },
    async jwt(params: unknown) {
      const { token, user } = params as {
        token: JwtToken;
        user?: { id?: string };
      };
      if (user?.id) {
        (token as JwtToken).id = user.id;
      }
      return token as unknown as JwtToken;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};

// @ts-expect-error - next-auth v4 type mismatch in App Router route handler
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
