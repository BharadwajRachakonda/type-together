import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    POSTGRES_URL: process.env.POSTGRES_URL,
    NEXT_AUTH_SECRET: process.env.NEXT_AUTH_SECRET,
    NEXT_PUBLIC_SNOW: process.env.NEXT_PUBLIC_SNOW,
  },
};

export default nextConfig;
