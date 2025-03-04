
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // domains: ["influenergy.s3.ap-south-1.amazonaws.com"],
    domains: ["influenergybucket.s3.us-west-1.amazonaws.com"], // Match your actual S3 bucket domain

  },
};

export default nextConfig;
