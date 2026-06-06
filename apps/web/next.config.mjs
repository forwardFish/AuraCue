/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  transpilePackages: ["@auracue/ui-tokens"]
};

export default nextConfig;
