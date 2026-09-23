import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  ...(process.env.VERCEL ? {} : { output: "standalone" as const }),
  reactStrictMode: true,
};
export default nextConfig;
