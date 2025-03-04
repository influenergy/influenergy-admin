/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains:
      process.env.NODE_ENV === "production"
        ?
        ["influenergybucket.s3.us-west-1.amazonaws.com"]
        :
        ["influenergy.s3.ap-south-1.amazonaws.com"], // Development S3 bucket
  },
};

export default nextConfig;
