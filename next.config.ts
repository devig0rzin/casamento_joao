import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "img.elo7.com.br",
      },
      {
        protocol: "https",
        hostname: "www.guiadecompra.com",
      },
      {
        protocol: "https",
        hostname: "i.gdm.net.br",
      },
    ],
  },
};

export default nextConfig;
