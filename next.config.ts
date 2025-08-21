import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    domains: ["localhost", "images.unsplash.com"],
    // Allow optimization of local images
    unoptimized: false,
  },
  // Enable static exports for better performance
  trailingSlash: false,
};

export default withNextIntl(nextConfig);
