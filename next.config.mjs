/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  // Removed output: 'export' for SSR support
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
