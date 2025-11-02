# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including devDependencies for build)
RUN npm ci && \
    npm cache clean --force

# Set build-time environment variables with placeholders
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=!!NEXT_PUBLIC_API_URL!!
ENV NEXT_PUBLIC_WS_URL=!!NEXT_PUBLIC_WS_URL!!

# Copy source code
COPY . .

# Build Next.js standalone output
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Install bash for entrypoint script (Alpine uses ash by default)
RUN apk add --no-cache bash

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone build from builder
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy entrypoint script
COPY --chown=nextjs:nodejs entrypoint.sh ./
RUN chmod +x ./entrypoint.sh

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3001

# Set environment variables (will be replaced at runtime by entrypoint.sh)
ENV NODE_ENV=production
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"
ENV NEXT_PUBLIC_API_URL=!!NEXT_PUBLIC_API_URL!!
ENV NEXT_PUBLIC_WS_URL=!!NEXT_PUBLIC_WS_URL!!

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start via entrypoint script (replaces placeholders with actual env vars)
ENTRYPOINT ["./entrypoint.sh"]
