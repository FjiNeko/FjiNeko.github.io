import type { NextConfig } from "next";

const isExport = process.env.STATIC_EXPORT === "true" || process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  compress: true,
  output: isExport ? "export" : undefined,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  images: isExport
    ? { unoptimized: true }
    : {
        formats: ["image/avif", "image/webp"],
        remotePatterns: [
          { protocol: "https", hostname: "avatars.githubusercontent.com" },
          { protocol: "https", hostname: "github.com" },
          { protocol: "https", hostname: "fjineko.oss-ap-southeast-1.aliyuncs.com" },
          { protocol: "https", hostname: "picsum.photos" },
          { protocol: "http", hostname: "wfqqreader-1252317822.image.myqcloud.com" },
        ],
      },

  ...(isExport
    ? {}
    : {
        async rewrites() {
          return [
            {
              source: "/api/:path*",
              destination: "http://127.0.0.1:19010/api/:path*",
            },
            {
              source: "/v2/:path*",
              destination: "http://127.0.0.1:19010/v2/:path*",
            },
            {
              source: "/uploads/:path*",
              destination: "http://127.0.0.1:19010/uploads/:path*",
            },
            {
              source: "/reader3/:path*",
              destination: `${process.env.NOVEL_API_URL || "http://localhost:8085"}/reader3/:path*`,
            },
          ];
        },
      }),

  experimental: {
    optimizePackageImports: [
      "framer-motion",
      "lucide-react",
      "@dnd-kit/core",
      "@dnd-kit/sortable",
      "@dnd-kit/utilities",
    ],
  },
};

export default nextConfig;
