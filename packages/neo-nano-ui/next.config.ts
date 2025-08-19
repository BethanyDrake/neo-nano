import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   transpilePackages: ['@auth0/nextjs-auth0', 'jose', 'oauth4webapi', '@panva']
};

export default nextConfig;
