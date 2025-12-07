#!/usr/bin/env bash

# Replace placeholders with actual environment variables at runtime
# This allows the same Docker image to work in dev, staging, and prod
# Pattern matches afya-frontend deployment strategy

echo "🚀 Starting Afya Sitebuilder..."
echo "📝 Configuring runtime environment..."

# Replace API URL placeholder with actual environment value
# This is the only runtime config needed - basePath is hardcoded at build time
if [ -n "$NEXT_PUBLIC_API_URL" ]; then
  find ./.next/ -type f -exec sed -i "s|http://PLACEHOLDER_API_URL|$NEXT_PUBLIC_API_URL|g" {} +
  
  # Also update server.js for rewrites
  if [ -f ./server.js ]; then
    sed "s|http://PLACEHOLDER_API_URL|$NEXT_PUBLIC_API_URL|g" ./server.js > ./server.js.tmp && mv ./server.js.tmp ./server.js
  fi
  
  echo "✅ API URL configured: $NEXT_PUBLIC_API_URL"
else
  echo "⚠️  NEXT_PUBLIC_API_URL not set, using placeholder"
fi

echo "✅ Environment variables replaced"
echo "🌐 Starting Next.js server on port ${PORT:-3000}..."

# Start the Next.js server
node server.js
