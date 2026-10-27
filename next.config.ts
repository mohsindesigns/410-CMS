import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  poweredByHeader: false,
  compress: true,
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'date-fns'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
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
        // There is no standalone contact page - the contact form is a section of the home page.
        source: '/contact',
        destination: '/#contact',
        permanent: true,
      },
      {
        source: '/contact-us',
        destination: '/#contact',
        permanent: true,
      },
      // Removed / mistyped URLs that were linked from articles -> closest live page (the old rule sent one of them to the homepage)
      { source: '/russian-massage-maryland', destination: '/blogs/what-is-russian-massage/', permanent: true },
      { source: '/blogs/muscle-therapy-maryland-guide', destination: '/blogs/complete-natural-guide-to-muscle-therapy/', permanent: true },
      { source: '/health-wellness/deep-tissue-massage-for-muscle-knots', destination: '/deep-tissue-massage-maryland/', permanent: true },
      { source: '/health-wellness/myofascial-release-therapy-benefits', destination: '/myofascial-release-maryland/', permanent: true },
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
        // Proxy /cdn-images/:path* → Cloudinary with modern format and compression (WebP/AVIF)
        source: '/cdn-images/:path*',
        destination: 'https://res.cloudinary.com/dytytwyp6/image/upload/f_auto,q_auto/:path*',
      },
      {
        // Route legacy WordPress uploads to uploads API / Cloudinary CDN
        source: '/wp-content/uploads/:path*',
        destination: '/api/uploads/blog/:path*',
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