import { NextAuthConfig } from "next-auth";
import prisma from "./db";

export const NextAuthEdgeConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // runs on every request with middleware
    authorized: ({ request, auth }) => {
      const isLoggedIn = Boolean(auth?.user);
      const isTryingToAcessApp = request.nextUrl.pathname.includes("/app");

      if (!isLoggedIn && isTryingToAcessApp) {
        return false;
      }

      if (isLoggedIn && isTryingToAcessApp && !auth?.user.hasAccess) {
        return Response.redirect(new URL("/payment", request.nextUrl));
      }
      if (isLoggedIn && isTryingToAcessApp && auth?.user.hasAccess) {
        return true;
      }

      if (
        isLoggedIn &&
        (request.nextUrl.pathname.includes("/login") ||
          request.nextUrl.pathname.includes("/signup")) &&
        auth?.user.hasAccess
      ) {
        return Response.redirect(new URL("/app/dashboard", request.nextUrl));
      }

      if (isLoggedIn && !isTryingToAcessApp && !auth?.user.hasAccess) {
        if (
          request.nextUrl.pathname.includes("/login") ||
          request.nextUrl.pathname.includes("/signup")
        ) {
          return Response.redirect(new URL("/payment", request.url));
        }
        return true;
      }

      if (!isLoggedIn && !isTryingToAcessApp) {
        return true;
      }
      return false;
    },
    jwt: async ({ token, user, trigger }) => {
      if (user) {
        token.userId = user.id;
        token.email = user.email!;
        token.hasAccess = user.hasAccess;
      }
      if (trigger === "update") {
        const useFromDb = await prisma.user.findUnique({
          where: {
            email: token.email,
          },
        });
        if (useFromDb) {
          token.hasAccess = useFromDb.hasAccess;
        }
      }
      return token;
    },
    session: ({ session, token }) => {
      session.user.id = token.userId;
      session.user.hasAccess = token.hasAccess;

      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
