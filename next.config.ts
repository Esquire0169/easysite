import type { NextConfig } from "next";

/** Project site: https://esquire0169.github.io/easysite/ */
const repoName = "easysite";
const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Pin Turbopack root to this project (avoids parent lockfile confusion)
  turbopack: {
    root: process.cwd(),
  },
  ...(isGithubPages
    ? {
        basePath: `/${repoName}`,
        assetPrefix: `/${repoName}`,
      }
    : {}),
};

export default nextConfig;
