import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getAdminByIdentifier } from "./data/admin";
import { getUserById } from "./data/user";

export default {
  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const existingUser = await getUserById(+user.id!);

        if (!existingUser) return token;

        token.id = user.id;

        return token;
      }

      return token;
    },

    session({ session, token }) {
      session.user.id = token.id as string;

      return session;
    },
  },
  providers: [
    Credentials({
      id: "admin-login",
      name: "Admin Login",
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

        const user = await getAdminByIdentifier(identifier);
        if (!user) throw new Error("User Not Found");

        return { id: user.id.toString() };
      },
    }),
  ],
} satisfies NextAuthConfig;
