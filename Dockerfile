# ---------- Build frontend ----------
FROM node:20-alpine AS frontend-build

WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# ---------- Build backend ----------
FROM node:20-alpine AS backend-build

WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json* ./
RUN npm install
COPY backend/ ./

# ---------- Production image ----------
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy backend code
COPY --from=backend-build /app/backend ./

# Copy frontend build to backend's public directory
RUN mkdir -p ./public
COPY --from=frontend-build /app/frontend/dist ./public

# Copy .env file (if you want to build with secrets, otherwise mount at runtime)
COPY backend/.env .env

# Expose backend port
EXPOSE 5000

# Start backend server
CMD ["node", "server.js"]