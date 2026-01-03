/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      // Serve the legacy SPA from /public/app/index.html at the clean path /app
      { source: '/app', destination: '/app/index.html' },
      { source: '/app/', destination: '/app/index.html' },
    ];
  },
};
module.exports = nextConfig;
