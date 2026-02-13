# syntax=docker.io/docker/dockerfile:1

FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache \
    libc6-compat \
    vips-dev \
    fftw-dev \
    build-base \
    python3
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci --legacy-peer-deps; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules

# Copy application source code (including .env file)
COPY . .
COPY ../.env .env


ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_APP_URL
ARG OPENWEATHERAPIKEY

# Set build-time environment variables (only public, safe for build)
ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
ENV OPENWEATHERAPIKEY=${OPENWEATHERAPIKEY}

# Build with optimized settings for speed
RUN \
  if [ -f yarn.lock ]; then yarn run build:production; \
  elif [ -f package-lock.json ]; then npm run build:production; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build:production; \
  else echo "Lockfile not found." && exit 1; \
  fi

## Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

# Install curl for health checks and other utilities
RUN apk add --no-cache curl 

ENV NODE_ENV=production
# Disable telemetry during runtime
ENV NEXT_TELEMETRY_DISABLED=1

# Add metadata labels using build args
ARG BUILD_DATE
ARG VCS_REF  
ARG VERSION

LABEL org.opencontainers.image.title="Amader Krishok Frontend"
LABEL org.opencontainers.image.description="Next.js frontend for Amader Krishok agricultural platform"
LABEL org.opencontainers.image.vendor="Amader Krishok"
LABEL org.opencontainers.image.authors="sakibxvz"
LABEL org.opencontainers.image.created="${BUILD_DATE}"
LABEL org.opencontainers.image.revision="${VCS_REF}"
LABEL org.opencontainers.image.version="${VERSION}"
LABEL maintainer="sakibxvz"
LABEL app.name="amader-krishok-frontend"
LABEL app.version="${VERSION}"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/config /app/config

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
CMD ["node", "server.js"]
