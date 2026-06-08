/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // ── TEMPORARY DEBUGGING OVERRIDE ──
  webpack: (config) => {
    config.optimization.minimize = false;
    return config;
  },

  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/',
      },
    ];
  },
}

module.exports = nextConfig;