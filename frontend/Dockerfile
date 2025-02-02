FROM oven/bun:latest

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY bun.lockb ./
RUN bun install

# Copy application
COPY . .

# Set environment variables
ENV PORT=3000
EXPOSE 3000

# Start the application in development mode
CMD ["bun", "run", "dev"]
