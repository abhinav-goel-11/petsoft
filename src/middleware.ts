import NextAuth from "next-auth";
import { NextAuthEdgeConfig } from "./lib/auth-edge";

export default NextAuth(NextAuthEdgeConfig).auth;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
