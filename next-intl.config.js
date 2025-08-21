// next-intl.config.js (create this in your project root)
const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "images.unsplash.com"],
  },
};

module.exports = withNextIntl(nextConfig);
