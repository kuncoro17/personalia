# Multi-stage build for production
ARG NODE_IMAGE=node:20-alpine
FROM ${NODE_IMAGE} AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (include devDependencies needed for build)
RUN npm install --include=dev --no-audit --no-fund && npm cache clean --force

# Copy source code
COPY . .

# Build-time env for Vite (values can be overridden from docker-compose args)
ARG VITE_API_URL=http://localhost:3001
ARG VITE_CLERK_PUBLISHABLE_KEY=
ARG VITE_CLERK_SIGN_IN_URL=
ARG VITE_CLERK_DOMAIN=
ARG VITE_CLERK_IS_SATELLITE=true

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_CLERK_SIGN_IN_URL=$VITE_CLERK_SIGN_IN_URL
ENV VITE_CLERK_DOMAIN=$VITE_CLERK_DOMAIN
ENV VITE_CLERK_IS_SATELLITE=$VITE_CLERK_IS_SATELLITE

# Build the application
RUN npm run build

# Production stage
FROM ${NODE_IMAGE} AS production

WORKDIR /app

# Install dumb-init for proper signal handling.
RUN if command -v apk >/dev/null 2>&1; then \
      apk add --no-cache dumb-init; \
    else \
      apt-get update && apt-get install -y --no-install-recommends dumb-init && rm -rf /var/lib/apt/lists/*; \
    fi

# Install serve to serve static files
RUN npm install -g serve

# Create non-root user
RUN if command -v addgroup >/dev/null 2>&1 && addgroup --system nodejs >/dev/null 2>&1; then \
      adduser --system --uid 1001 --ingroup nodejs reactjs; \
    else \
      groupadd --system --gid 1001 nodejs && useradd --system --uid 1001 --gid nodejs reactjs; \
    fi

# Copy built files from builder stage
COPY --from=builder --chown=reactjs:nodejs /app/dist ./dist

# Switch to non-root user
USER reactjs

# Expose production port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start the application
ENTRYPOINT ["dumb-init", "--"]
CMD ["serve", "-s", "dist", "-l", "3000"]
