import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Assicura che CSS sia processato correttamente
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;


