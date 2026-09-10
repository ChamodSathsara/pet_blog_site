/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [{ protocol: 'https', hostname: '*.public.blob.vercel-storage.com' }],
  },
  async redirects() {
    return [
      // Preserve any old trailing-slash or index-style URLs from the SPA build.
    ];
  },
};

export default nextConfig;
