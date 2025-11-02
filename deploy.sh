#!/bin/bash

#######################################################
# afya-sites Standalone Deployment Script
# Deploys sitebuilder as a static site to S3
# No dependencies on other applications
#######################################################

set -e

# Configuration
BUCKET_NAME="${S3_BUCKET:-afya-sitebuilder}"
CLOUDFRONT_ID="${CLOUDFRONT_DISTRIBUTION_ID:-}"
API_URL="${API_URL:-https://api.afya.com}"
BUILD_DIR="out"

echo "🚀 Deploying afya-sites to S3..."
echo "   Bucket: $BUCKET_NAME"
echo "   API URL: $API_URL"
echo ""

# Step 1: Build static export
echo "📦 Building static export..."
export NEXT_PUBLIC_API_URL=$API_URL
cp next.config.deploy.js next.config.js.bak
cp next.config.deploy.js next.config.js
npm run build

# Restore original config
mv next.config.js.bak next.config.js

# Step 2: Upload to S3
echo "☁️  Uploading to S3..."
aws s3 sync $BUILD_DIR/ s3://$BUCKET_NAME/sitebuilder/ \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "*.html" \
  --acl public-read

# Upload HTML with no cache
aws s3 sync $BUILD_DIR/ s3://$BUCKET_NAME/sitebuilder/ \
  --exclude "*" \
  --include "*.html" \
  --cache-control "public, max-age=0, must-revalidate" \
  --content-type "text/html" \
  --acl public-read

echo "✅ Upload complete!"

# Step 3: Invalidate CloudFront (optional)
if [ -n "$CLOUDFRONT_ID" ]; then
  echo "🔄 Invalidating CloudFront cache..."
  aws cloudfront create-invalidation \
    --distribution-id $CLOUDFRONT_ID \
    --paths "/sitebuilder/*"
  echo "✅ Cache invalidated!"
fi

echo ""
echo "🎉 Deployment complete!"
echo "🔗 URL: https://$BUCKET_NAME.s3.amazonaws.com/sitebuilder/index.html"
if [ -n "$CLOUDFRONT_ID" ]; then
  echo "🔗 CDN: https://your-cloudfront-domain.com/sitebuilder/"
fi


