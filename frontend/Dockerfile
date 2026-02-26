# Stage 1: Build
FROM node:20 AS builder

WORKDIR /app

# Copy all files first to ensure workspaces are correctly linked and built
COPY package*.json ./
COPY shared/package*.json ./shared/
COPY frontend/package*.json ./frontend/

# Install dependencies for the whole monorepo
RUN npm install

# Work around npm optional dependency bug for Rollup and other native tooling by explicitly
# installing Linux x64 binary packages in the frontend workspace.
RUN npm install @rollup/rollup-linux-x64-gnu lightningcss-linux-x64-gnu @tailwindcss/oxide-linux-x64-gnu --workspace @loan-mng/frontend

COPY shared/ ./shared/
COPY frontend/ ./frontend/

# Build shared
RUN npm run build -w @loan-mng/shared
RUN npm run build -w @loan-mng/frontend

# Stage 2: Production
FROM node:20-alpine

RUN apk add --no-cache tini \
  && npm install -g serve

WORKDIR /app

# Copy built frontend assets only; they already contain shared code.
COPY --from=builder /app/frontend/dist ./frontend/dist

EXPOSE 5173

ENTRYPOINT ["/sbin/tini", "--"]

CMD ["serve", "-s", "frontend/dist", "-l", "5173"]
