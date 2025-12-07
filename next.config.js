/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Output standalone for Docker deployment
  output: 'standalone',
  
  // Standalone sitebuilder app configuration
  // basePath is hardcoded because it's the same in all environments (dev/staging/prod)
  // This is DevOps "Build Once" compatible - the path /sitebuilder is constant everywhere
  basePath: '/sitebuilder',
  
  // API proxy to backend (for development)
  async rewrites() {
    // In development we proxy API/platform calls to a backend host.
    // Use NEXT_PUBLIC_API_URL as the single source of truth for the backend base URL.
    const devBackendHost = process.env.NEXT_PUBLIC_API_URL
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: `${devBackendHost}/:path*`, // Django backend (nginx proxy)
        },
        // Proxy all platform routes EXCEPT iframe-preview to Django
        {
          source: '/platform/((?!sites/iframe-preview).)*',
          destination: `${devBackendHost}/platform/$1`, // Django platform routes
        },
      ];
    }
    else {
      return [
        {
          source: '/api/:path*',
          destination: `${devBackendHost}/:path*`, // Django backend (nginx proxy)
        },
        {
          source: '/platform/((?!sites/iframe-preview).)*',
          destination: `${devBackendHost}/platform/$1`, // Django platform routes
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

