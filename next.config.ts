import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    unoptimized: true,
  },
  // Ensure consistent routing on Vercel
  trailingSlash: false,
};

export default nextConfig;
