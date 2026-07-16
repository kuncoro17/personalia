# Multi-stage build for production
ARG NODE_IMAGE=node:20-alpine
FROM ${NODE_IMAGE} AS builder

WORKDIR /app

# Copy package files first so dependency install can be cached separately.
COPY package*.json ./

# Build needs devDependencies such as TypeScript and Vite.
# `npm ci` has been flaky in this Alpine-based image on local Docker,
# so use `npm install` for a more reliable builder setup.
RUN npm install --include=dev --no-audit --no-fund && npm cache clean --force

# Copy source code
COPY . .

# Build-time env for Vite (values can be overridden from docker-compose args)
ARG VITE_API_URL=http://localhost:3001
ARG VITE_CLERK_PUBLISHABLE_KEY=
ARG VITE_CLERK_SIGN_IN_URL=
ARG VITE_CLERK_DOMAIN=
ARG VITE_CLERK_IS_SATELLITE=true
ARG VITE_SAS_PORTAL_URL=

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_CLERK_SIGN_IN_URL=$VITE_CLERK_SIGN_IN_URL
ENV VITE_CLERK_DOMAIN=$VITE_CLERK_DOMAIN
ENV VITE_CLERK_IS_SATELLITE=$VITE_CLERK_IS_SATELLITE
ENV VITE_SAS_PORTAL_URL=$VITE_SAS_PORTAL_URL

# Build the production assets, then drop node_modules from the builder layer.
RUN npm run build && rm -rf node_modules

# Production stage
FROM ${NODE_IMAGE} AS production

WORKDIR /app
ENV PORT=3002

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
EXPOSE 3002

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD ["sh", "-c", "wget --no-verbose --tries=1 --spider http://localhost:${PORT}/ || exit 1"]

# Start the application
ENTRYPOINT ["dumb-init", "--"]
CMD ["sh", "-c", "serve -s dist -l ${PORT}"]
