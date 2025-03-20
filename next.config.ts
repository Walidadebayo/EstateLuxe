import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true,
    // remotePatterns: [
    //   {
    //     protocol: "https",
    //     hostname: "images.unsplash.com",
    //   },
    //   {
    //     protocol: "https",
    //     hostname: "placehold.co",
    //   }
    // ],
  }  
};

export default nextConfig;
