import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  //output: "export",
  trailingSlash: true,

  // ✅ Only for GitHub Pages (production build)
  ...(isProd && {
    basePath: "/my-portfolio",
    assetPrefix: "/my-portfolio/",
  }),

  reactStrictMode: true,

  images: {
    unoptimized: true,
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Performance optimizations
  compiler: {
    removeConsole: isProd,
  },

  experimental: {
    optimizePackageImports: ["react-icons", "framer-motion", "lucide-react"],
  },

  // Disable server-side features for static export
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Bundle optimization - compatible with Next.js 15
  webpack: (config, { isServer }) => {
    // Optimize bundle size for client-side only
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // Optimize module resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": "./.",
    };

    // Split chunks for better caching - optimized for PageSpeed
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: "all",
        maxInitialRequests: 10,
        maxAsyncRequests: 10,
        cacheGroups: {
          framework: {
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
            name: "framework",
            priority: 40,
            enforce: true,
          },
          mermaid: {
            test: /[\\/]node_modules[\\/]mermaid[\\/]/,
            name: "mermaid",
            priority: 35,
            enforce: true,
          },
          uiLibs: {
            test: /[\\/]node_modules[\\/](@radix-ui|framer-motion)[\\/]/,
            name: "ui-libs",
            priority: 30,
            enforce: true,
          },
          markdown: {
            test: /[\\/]node_modules[\\/](react-markdown|remark-gfm)[\\/]/,
            name: "markdown",
            priority: 25,
            enforce: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendor",
            priority: 10,
            enforce: true,
          },
          common: {
            name: "common",
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      },
    };

    return config;
  },
};

export default withBundleAnalyzer(nextConfig);