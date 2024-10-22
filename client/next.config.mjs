// /** @type {import('next').NextConfig} */
// const nextConfig = {};
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      remotePatterns: [
        {
          protocol: "http",
          hostname: "localhost",
          port: "8747",
        },
      ],
    },
  };
  
export default nextConfig;
