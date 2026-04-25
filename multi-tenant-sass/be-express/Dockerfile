FROM node:20-alpine

WORKDIR /usr/src/app

# Install dependencies (including dev for easier development inside container)
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source
COPY . ./

EXPOSE 3000

# Default to development run (ts-node-dev). For production build, use `npm run build && npm start`.
CMD ["npm", "run", "dev"]
