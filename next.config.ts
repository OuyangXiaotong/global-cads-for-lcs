import type { NextConfig } from "next";

const isCI = process.env.GITHUB_ACTIONS === 'true'
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? ''

const nextConfig: NextConfig = {
  output: isCI ? 'export' : undefined,
  basePath: isCI && repo ? `/${repo}` : '',
  trailingSlash: isCI,
  images: { unoptimized: true },
};

export default nextConfig;
