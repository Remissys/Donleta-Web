import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  distDir: "dist",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'genshin-impact.fandom.com',
        pathname: '/wiki/Special:Filepath/***'
      },
      {
        protocol: 'http',
        hostname: 'localhost'
      }
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          {
              key: 'Content-Security-Policy',
              value: `                  
                  connect-src 'self' 
                  http://localhost:*
                  https://donleta-service.discloud.app; 
              `
              .replace(/\s{2,}/g, ' ')
              .trim(),
          },
        ],
      }
    ]
  }
};

export default nextConfig;
