# Single multi-stage Dockerfile with named stages for `dev`, `builder` and `runtime`.
# Build dev image: `docker build --target dev -t be-express:dev .`
# Build production image (default): `docker build -t be-express:prod .`

FROM node:20-bullseye-slim AS deps
WORKDIR /usr/src/app
COPY package.json package-lock.json* ./
RUN npm ci

FROM deps AS dev
ENV NODE_ENV=development
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM deps AS builder
COPY . .
RUN npm run build

FROM gcr.io/distroless/nodejs:20 AS runtime
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json
ENV NODE_ENV=production
EXPOSE 3000
CMD ["dist/index.js"]
