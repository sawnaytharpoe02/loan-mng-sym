# Stage 1: Build
FROM node:20-alpine

WORKDIR /app

# Copy root package.json and workspace package.jsons
COPY package*.json ./
COPY shared/package*.json ./shared/
COPY frontend/package*.json ./frontend/

# Install all dependencies (handles linking)
RUN npm install

# Copy source code
COPY shared/ ./shared/
COPY frontend/ ./frontend/

# Build shared then frontend
RUN npm run build -w @loan-mng/shared
RUN npm run build -w @loan-mng/frontend

EXPOSE 4173

# Serve the built application using vite preview
CMD ["npm", "run", "preview", "-w", "@loan-mng/frontend", "--", "--host"]

