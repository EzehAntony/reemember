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
  callbacks: {
    async session({ session, user }: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      if (user?.id && session?.user) {
        session.user.id = user.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};

