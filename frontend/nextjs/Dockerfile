###############################################
# 1) Dependencies layer
###############################################
FROM node:24.11.1-alpine AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with npm 11.6.2
RUN npm install --legacy-peer-deps

###############################################
# 2) Builder layer – builds Next.js (.next)
###############################################
FROM node:24.11.1-alpine AS builder
WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source
COPY . .

# Build Next.js application
RUN npm run build

###############################################
# 3) Runner layer – production image serving Next.js
###############################################
FROM node:24.11.1-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

# Expose port (Next.js default)
EXPOSE 3000

# Start the Next.js production server
CMD ["npm", "run", "start"]