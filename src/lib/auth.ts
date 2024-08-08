import NextAuth, { NextAuthConfig } from "next-auth";

const config = {
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    authorized: ({ request }) => {
      const isTryingToAcessApp = request.nextUrl.pathname.includes("/app");

      if (isTryingToAcessApp) {
        return false;
      } else {
        return true;
      }
    },
  },
} satisfies NextAuthConfig;

export const { auth } = NextAuth(config);
