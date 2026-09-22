import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Override with NEXT_DIST_DIR when .next cache is corrupted/locked (Windows). */
  distDir: process.env.NEXT_DIST_DIR ?? '.next',
  trailingSlash: false,
  env: {
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ?? '',
    NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '923314937412',
  },
  /** Do not bundle these on the server — faster compiles and smaller server graphs. */
  serverExternalPackages: ['mongoose', 'bcryptjs', 'nodemailer', 'cloudinary', 'google-auth-library'],
  experimental: {
    serverActions: {
      bodySizeLimit: '55mb',
    },
    /** Tree-shake heavy chart/UI imports instead of pulling full packages. */
    optimizePackageImports: ['recharts'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
    /** Avoid broken gallery when optimization fails on edge URLs */
    dangerouslyAllowSVG: false,
  },
};

export default nextConfig;
