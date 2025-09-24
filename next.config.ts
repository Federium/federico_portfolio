import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Assicura che CSS sia processato correttamente
  experimental: {
    optimizeCss: true,
  },
  
  // Configurazione per il CSS processing
  webpack: (config, { dev }) => {
    if (!dev) {
      // In produzione, assicurati che PostCSS processi Tailwind
      config.optimization.splitChunks.cacheGroups.styles = {
        name: 'styles',
        test: /\.(css|scss)$/,
        chunks: 'all',
        enforce: true,
      };
    }
    return config;
  },
};

export default nextConfig;


