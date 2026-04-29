import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: any = { // eslint-disable-line @typescript-eslint/no-explicit-any
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET!,
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      if (token?.sub && session?.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
    async jwt({ token, user }: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      if (user?.id) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};

