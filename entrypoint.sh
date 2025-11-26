#!/usr/bin/env bash

# Replace placeholders with actual environment variables at runtime
# This allows the same Docker image to work in dev, staging, and prod
# Pattern matches afya-frontend deployment strategy

echo "🚀 Starting Afya Sitebuilder..."
echo "📝 Replacing environment variables..."

# Replace NODE_ENV
find ./.next/ -type f -exec sed -i "s|!!NODE_ENV!!|$NODE_ENV|g" {} +

# Replace API URL
find ./.next/ -type f -exec sed -i "s|!!NEXT_PUBLIC_API_URL!!|$NEXT_PUBLIC_API_URL|g" {} +

echo "✅ Environment variables replaced"
echo "🌐 Starting Next.js server on port ${PORT:-3000}..."

# Start the Next.js server
node server.js
