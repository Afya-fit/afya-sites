# Build stage
FROM node:18-alpine AS builder

# Set build-time environment variables with placeholders
ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL $NEXT_PUBLIC_API_URL

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including devDependencies for build)
RUN npm ci && \
    npm cache clean --force

# Copy source code
COPY . .

# Build Next.js standalone output
RUN npm run build

# Production stage
FROM node:18-slim AS runner

WORKDIR /app

# Install bash for entrypoint script (Alpine uses ash by default)
RUN apt-get update && apt-get install -y bash

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
EXPOSE 3000

# Start via entrypoint script (replaces placeholders with actual env vars)
ENTRYPOINT ["./entrypoint.sh"]
