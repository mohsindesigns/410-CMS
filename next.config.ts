import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
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
        hostname: '410-muscletherapy.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/contact',
        destination: '/contact-us/',
        permanent: true,
      },
      {
        source: '/blog',
        destination: '/blogs/',
        statusCode: 301,
      },
      {
        source: '/blog/:path*',
        destination: '/blogs/:path*/',
        statusCode: 301,
      },
    ];
  },
  async rewrites() {
    return [
      {
        // Proxy /cdn-images/:path* → Cloudinary
        source: '/cdn-images/:path*',
        destination: 'https://res.cloudinary.com/dytytwyp6/image/upload/:path*',
      },
      {
        // Fallback proxy for /uploads/:path* to dynamic handler
        source: '/uploads/:path*',
        destination: '/api/uploads/:path*',
      },
    ];

  },
};

export default nextConfig;