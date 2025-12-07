/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Static export configuration for S3 deployment
  output: 'export',
  basePath: '/sitebuilder',
  
  // Image optimization disabled for static export
  images: {
    unoptimized: true,
  },
  
  // Trailing slash for S3 compatibility
  trailingSlash: true,
  
  // API calls go directly to production backend
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '',
  },
  
  // Transpile the local package
  transpilePackages: ['@afya/sites'],
  
  // Webpack configuration
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@afya/sites': require('path').resolve(__dirname, './src'),
      };
    }
    return config;
  },
};

module.exports = nextConfig;


