/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: process.env.NODE_ENV === "production"
          ? "influenergybucket.s3.us-west-1.amazonaws.com"
          : "influenergy.s3.ap-south-1.amazonaws.com",
        protocol: "https",
        pathname: "**",
      },
      {
        hostname: "scontent.cdninstagram.com",
        protocol: "https",
        pathname: "**",
      },
      {
        hostname: "www.instagram.com",
        protocol: "https",
        pathname: "**",
      }
    ],
  },
};

export default nextConfig;
