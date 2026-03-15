
import type { NextConfig } from "next";

const IS_PROD = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: IS_PROD ? "export" : undefined,
  basePath: "/kopis",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://www.kopis.or.kr/openApi/restful/:path*",
      },
    ];
  },
};

export default nextConfig;
