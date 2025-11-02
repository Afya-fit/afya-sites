#!/usr/bin/env bash

# Replace placeholders with actual environment variables at runtime
# This allows the same Docker image to work in dev, staging, and prod
# Pattern matches afya-frontend deployment strategy

echo "🚀 Starting Afya Sitebuilder..."
echo "📝 Replacing environment variables..."

# Replace API URL
if [ ! -z "$NEXT_PUBLIC_API_URL" ]; then
  echo "   NEXT_PUBLIC_API_URL: $NEXT_PUBLIC_API_URL"
  find ./.next/ -type f -exec sed -i "s|!!NEXT_PUBLIC_API_URL!!|$NEXT_PUBLIC_API_URL|g" {} +
else
  echo "   ⚠️  NEXT_PUBLIC_API_URL not set, using placeholder"
fi

# Replace WebSocket URL
if [ ! -z "$NEXT_PUBLIC_WS_URL" ]; then
  echo "   NEXT_PUBLIC_WS_URL: $NEXT_PUBLIC_WS_URL"
  find ./.next/ -type f -exec sed -i "s|!!NEXT_PUBLIC_WS_URL!!|$NEXT_PUBLIC_WS_URL|g" {} +
else
  echo "   ⚠️  NEXT_PUBLIC_WS_URL not set, using placeholder"
fi

echo "✅ Environment variables replaced"
echo "🌐 Starting Next.js server on port ${PORT:-3001}..."

# Start the Next.js server
node server.js
