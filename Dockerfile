FROM node:23-alpine

# Create app directory and set permissions
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production \
    PORT=8080

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy application files
COPY . .

RUN pnpm install --frozen-lockfile && \
    pnpm run build

EXPOSE ${PORT}

CMD ["pnpm", "start"]
