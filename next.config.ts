import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const isStaticExport = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  basePath,
  assetPrefix: basePath || undefined,
  output: isStaticExport ? "export" : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
