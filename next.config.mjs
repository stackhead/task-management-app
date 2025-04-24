/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      // If you're using App Router:
      serverComponentsExternalPackages: ['your-package-name'], // Add problematic packages here
    },
    // Optional: Skip problematic routes during build
    skipMiddlewareUrlNormalize: true,
    skipTrailingSlashRedirect: true,
  };
  
  export default nextConfig;