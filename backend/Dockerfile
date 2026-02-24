# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package.json and workspace package.jsons
COPY package*.json ./
COPY shared/package*.json ./shared/
COPY backend/package*.json ./backend/

# Install all dependencies (handles linking)
RUN npm install

# Copy source code
COPY shared/ ./shared/
COPY backend/ ./backend/

# Build shared then backend
RUN npm run build -w @loan-mng/shared
RUN npm run build -w @loan-mng/backend

# Stage 2: Production
FROM node:20-alpine

RUN apk add --no-cache tini

ENV NODE_ENV=production
ENV PORT=8080

WORKDIR /app

COPY --from=builder /app/shared/dist ./shared/dist
COPY --from=builder /app/shared/package.json ./shared/package.json
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/package.json ./backend/package.json
COPY --from=builder /app/package.json ./package.json

# Install production dependencies only
# Using --omit=dev in the root will prune correctly
RUN npm install --omit=dev && npm cache clean --force

RUN mkdir -p /app/backend/logs && chown -R node:node /app

USER node

EXPOSE 8080

ENTRYPOINT ["/sbin/tini", "--"]

CMD ["node", "backend/dist/server.js"]
