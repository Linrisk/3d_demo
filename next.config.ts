import type { NextConfig } from "next";



const nextConfig: NextConfig = {
   eslint: {
    ignoreDuringBuilds: true,
  },
  // Désactive TypeScript
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
