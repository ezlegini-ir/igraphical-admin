import { UserRole } from "@prisma/client";
import { DefaultSession, NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getUserByIdentifier } from "./data/user";

declare module "next-auth" {
  interface Session {
    user: {
      role: UserRole;
    } & DefaultSession["user"];
  }
}

export default {
  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },

    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as UserRole;
      return session;
    },
  },
  providers: [
    Credentials({
      id: "user-login",
      name: "User Login",
      credentials: {
        identifier: {},
      },
      authorize: async (credentials) => {
        const { identifier } = credentials as {
          identifier: string;
        };

        if (!identifier) {
          throw new Error("Invalid Credentials");
        }

        const user = await getUserByIdentifier(identifier);
        if (!user) throw new Error("User Not Found");

        return { id: user.id.toString(), role: user.role };
      },
    }),
  ],
} satisfies NextAuthConfig;
