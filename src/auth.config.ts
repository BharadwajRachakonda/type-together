import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnType =
        nextUrl.pathname.startsWith("/type") &&
        !nextUrl.pathname.startsWith("/type-together");
      console.log(
        "isLoggedIn:",
        isLoggedIn,
        "isOnType:",
        isOnType,
        nextUrl.pathname
      );
      if (isOnType) {
        if (!isLoggedIn) return false;
        return true;
      } else if (nextUrl.pathname.startsWith("/login") && isLoggedIn) {
        return Response.redirect(new URL("/profile", nextUrl));
      } else if (nextUrl.pathname.startsWith("/signup") && isLoggedIn) {
        return Response.redirect(new URL("/profile", nextUrl));
      }
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
