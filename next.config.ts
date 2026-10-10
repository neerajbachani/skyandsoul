import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 85],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async rewrites() {
    return [
      { source: "/blankets", destination: "/collections/blankets" },
      { source: "/toys", destination: "/collections/toys" },
      { source: "/frames", destination: "/collections/frames" },
      { source: "/little-extras", destination: "/collections/little-extras" },
    ];
  },
};

export default nextConfig;
