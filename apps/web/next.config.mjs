/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  devIndicators: false,
  transpilePackages: ["@auracue/ui-tokens"]
};

export default nextConfig;
