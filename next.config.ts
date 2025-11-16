import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'genshin-impact.fandom.com',
        port: '',
        pathname: '/wiki/Special:Filepath/***'
      }
    ]
  }
};

export default nextConfig;
