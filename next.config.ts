import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  ...(process.env.VERCEL ? {} : { output: "standalone" as const }),
  typescript: { ignoreBuildErrors: true },
  reactStrictMode: false,
};
export default nextConfig;
