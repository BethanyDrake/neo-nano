import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['@auth0/nextjs-auth0', 'jose', 'oauth4webapi', '@panva'],

  images: {
    remotePatterns: [new URL('https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/**')],
  },
}

export default nextConfig
