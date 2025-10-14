/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "fakestoreapi.com" }],
  },

  async rewrites() {
    const backend = process.env.BACKEND_ORIGIN || "http://localhost:3001";
    return [{ source: "/api/:path*", destination: `${backend}/:path*` }];
  },
};

export default nextConfig;
