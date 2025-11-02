/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Output standalone for Docker deployment
  output: 'standalone',
  
  // Standalone sitebuilder app configuration
  basePath: process.env.NODE_ENV === 'production' ? '/sitebuilder' : '',
  
  // API proxy to backend (for development)
  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:8001/api/:path*', // Django backend (nginx proxy)
        },
        // Proxy all platform routes EXCEPT iframe-preview to Django
        {
          source: '/platform/((?!sites/iframe-preview).)*',
          destination: 'http://localhost:8001/platform/$1', // Django platform routes
        },
      ];
    }
    return [];
  },
  
  // Enable CSS modules and regular CSS
  // experimental: {
  //   appDir: false, // Use pages directory (deprecated option removed)
  // },
  
  // Transpile the local package
  transpilePackages: ['@afya/sites'],
  
  // Webpack configuration for local development
  webpack: (config, { isServer }) => {
    // Handle CSS imports from src directory
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

