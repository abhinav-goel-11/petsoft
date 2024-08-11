import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "./server-utils";
import { authSchema } from "./validations";
const config = {
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      //runs on login attempt
      async authorize(credentials) {
        //validations
        const validatedFormData = authSchema.safeParse(credentials);
        if (!validatedFormData.success) {
          return null;
        }

        // extract values
        const { email, password } = validatedFormData.data;

        const user = await getUserByEmail(email);
        if (!user) {
          console.log("No user found");
          return null;
        }
        const passwordMatches = await bcrypt.compare(
          password,
          user.hashedPassword
        );

        if (!passwordMatches) {
          console.log("Invalid credentials");
          return null;
        }

        return user;
      },
    }),
  ],
  callbacks: {
    // runs on every request with middleware
    authorized: ({ request, auth }) => {
      const isLoggedIn = Boolean(auth?.user);
      const isTryingToAcessApp = request.nextUrl.pathname.includes("/app");

      if (!isLoggedIn && isTryingToAcessApp) {
        return false;
      }

      if (isLoggedIn && isTryingToAcessApp) {
        return true;
      }

      if (isLoggedIn && !isTryingToAcessApp) {
        return Response.redirect(new URL("/app/dashboard", request.url));
      }

      if (!isLoggedIn && !isTryingToAcessApp) {
        return true;
      }
      return false;
    },
    jwt: ({ token, user }) => {
      if (user) {
        token.userId = user.id;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (session.user) {
        session.user.id = token.userId;
      }

      return session;
    },
  },
} satisfies NextAuthConfig;

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(config);
