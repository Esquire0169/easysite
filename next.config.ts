import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin Turbopack root to this project (avoids parent lockfile confusion)
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
