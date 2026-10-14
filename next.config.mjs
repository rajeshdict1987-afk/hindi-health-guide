if (process.env.npm_lifecycle_event === 'build' || process.argv.includes('build')) {
  process.env.NODE_ENV = 'production';
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
