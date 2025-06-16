/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['upload.wikimedia.org', 'placehold.jp'],
  },
  experimental: {
    allowedDevOrigins: ["http://match-test"],
  },
}

export default nextConfig
