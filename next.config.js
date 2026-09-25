/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  poweredByHeader: false,

  async rewrites() {
    return {
      // Keep the legacy client-side route fallback, but allow real
      // filesystem/API routes such as /healthz to resolve first.
      fallback: [
        {
          source: '/:path((?!api(?:/|$)).*)',
          destination: '/',
        },
      ],
    };
  },
};

module.exports = nextConfig;
