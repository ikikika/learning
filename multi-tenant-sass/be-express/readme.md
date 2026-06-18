## Notes

### Starting commands
`npm init -y`

### Install dependencies
```
npm install express
npm install -D typescript ts-node-dev @types/node @types/express
```
If you already use ts-node-dev → You do NOT need nodemon
ts-node-dev does everything nodemon does, plus:
- Watches files for changes
- Restarts the server automatically
- Understands TypeScript natively
- Faster restarts than nodemon + ts-node

### Initialise TypeScript
`npx tsc --init`
Update tsconfig.json (important parts):
```
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "rootDir": "src",
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

### Add npm scripts
```
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

### Add dotenv
`npm install dotenv`

### Add ESLint (TypeScript‑aware)
`npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin`

#### Create .eslintrc.cjs
```
module.exports = {
  root: true,
  env: {
    node: true,
    es2020: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
  rules: {
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/no-floating-promises": "error",
  },
};
```

#### Create .eslintignore
```
dist
node_modules
```

#### Add Prettier (Formatting only)
`npm install -D prettier eslint-config-prettier eslint-plugin-prettier`

#### Create .prettierrc
```
{
  "semi": true,
  "singleQuote": true,
  "printWidth": 100,
  "trailingComma": "all"
}
```

#### Update .eslintrc.cjs:
```
extends: [
  "eslint:recommended",
  "plugin:@typescript-eslint/recommended",
  "plugin:@typescript-eslint/recommended-requiring-type-checking",
  "plugin:prettier/recommended"
],
```

#### Update package.json
```
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "lint": "eslint . --ext .ts",
    "lint:fix": "eslint . --ext .ts --fix",
    "format": "prettier --write ."
  }
}
```

### Commands
#### Run dev server
`npm run dev`
#### Run lint
`npm run lint`
#### Auto-fix issues
`npm run lint:fix`
#### Format code
`npm run format`

## MySQL (Docker)

Quick instructions to run a local MySQL for development using Docker Compose.

Start MySQL:
```bash
docker compose up -d
```

Stop and remove volumes:
```bash
docker compose down -v
```

Environment variables are defined in `.env.sample`. Copy to `.env` and adjust as needed:

```bash
cp .env.sample .env
# then edit .env
```

The service exposes port `3306` on the host. Use `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` from `.env` to connect.

## Docker notes

- version: 3.8 — selects the Compose file format / feature set the file uses.
- services: top-level section that defines containerized services (here mysql and api).
- mysql.image: mysql:8.0 — base image used for the DB.
- mysql.container_name: mts_mysql — friendly container name (optional).
- mysql.restart: unless-stopped — restart policy if container exits.
- mysql.environment: environment variables passed to MySQL (e.g. MYSQL_ROOT_PASSWORD, MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD) — uses shell-style interpolation like ${MYSQL_ROOT_PASSWORD:-rootpass} to provide defaults when .env vars are missing.
- mysql.ports: 3306:3306 — maps container MySQL port to host for local access.
- mysql.volumes: mysql_data:/var/lib/mysql — named volume to persist database files across restarts.
- mysql.healthcheck: a small mysqladmin ping check so Docker can report service health (used by orchestration/monitoring).
- api.build: . — build an image from the Dockerfile in the project root.
- api.container_name: mts_api — friendly name for the API container.
- api.depends_on: - mysql — start order hint: Compose starts mysql before api (note: this does NOT wait for DB readiness, only start order).
- api.ports: 3000:3000 — exposes the Express app on host port 3000.
- api.environment: forwards app and DB config (e.g. NODE_ENV, PORT, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME). Important: DB_HOST is set to mysql (service name) so the app connects via Docker internal DNS.
- api.volumes:
./:/usr/src/app:cached — mounts source for live development inside container (so ts-node-dev restarts on changes).
/usr/src/app/node_modules — anonymous volume to avoid host/node_modules conflicts.
api.command: overrides the container CMD to run npm run dev (development mode with live reload).
- volumes: mysql_data: — named volume declaration that Compose will create and manage for persistent DB data.

This project uses a single multi-stage `Dockerfile` that contains named stages for `dev`, `builder` and a minimal `runtime` stage. The development `docker-compose.override.yml` builds the `dev` stage for fast local development; production images are built from the final stage (distroless runtime).

Key points:

- Compose file format: `version: '3.8'` is used in the repository.
- The `mysql` service still uses the official `mysql:8.0` image and a named `mysql_data` volume for persistence.
- The API is built from the single `Dockerfile`. The dev compose override sets `build.target: dev` so it uses the `dev` stage (installs dev deps and runs `ts-node-dev`).
- The dev compose override mounts the project source into the container and mounts a named `dev_node_modules` volume at `/usr/src/app/node_modules` so container-installed packages (like `sequelize`) aren't hidden by a host-mounted `node_modules` directory.
- For production we build the final stage which contains only the built `dist` and production `node_modules` (the runtime stage is distroless to reduce OS attack surface).

Why two behaviors (dev vs prod)?

- Development (`dev` stage): installs devDependencies, runs hot-reload (`ts-node-dev`), and mounts the source for immediate feedback.
- Production (final stage): uses a compiled `dist/`, includes only production dependencies, and uses a minimal runtime image for security and smaller size.

Commands

- Start development environment (compose uses the dev target):

```bash
docker compose up --build
```

- Avoid stale node_modules after any future npm install, run this instead of just restarting

```bash
docker-compose up --build --force-recreate
```

- Build dev image without compose (optional):

```bash
docker build --target dev -t be-express:dev .
```

- Build production image (final runtime stage):

```bash
docker build -t be-express:prod .
```

- Rebuild and start services detached:

```bash
docker compose up --build -d
```

- View API logs:

```bash
docker compose logs -f api
```

Security / vulnerabilities

- After building a production image, scan it with `docker scan` or `trivy`:

```bash
docker scan be-express:prod
trivy image be-express:prod
```

- If high/critical findings remain, run `npm audit` and `npm audit fix` locally, upgrade direct dependencies, or pin patched versions in `package.json`.

Notes about removed files

- `Dockerfile.dev` has been removed — the `dev` stage is now part of the single `Dockerfile` and is selected with `--target dev` or via the compose override.

## Run the app and seed the database

1. Copy `.env.sample` to `.env` and adjust values if needed:

```bash
cp .env.sample .env
# edit .env to confirm DB credentials if necessary
```

2. Start services (MySQL, API, Adminer):

```bash
docker compose up --build --force-recreate -d
```

If you added or changed npm packages and still see module resolution errors, reset the dev dependency volume once:

```bash
docker compose down -v
docker compose up --build --force-recreate -d
```

3. Install dependencies locally (needed to run the migration script from host):

```bash
npm ci
```

4. Run migrations and seed data:

```bash
npm run migrate
```

Alternative: run the migration script from inside the `api` container (uses the container's Node):

```bash
docker compose exec api npm run migrate
```

5. Open Adminer to inspect the DB: http://localhost:8080 (Server: `mysql`, Database: value from `.env`, Username/Password from `.env`)

6. Run the app in development mode (host):

```bash
npm run dev
```

Or access the containerized API at http://localhost:3000

## Bootstrap Superadmin

Usage:

1. Ensure your database env vars are set (see existing project README).
2. Run the migration + seed (optional):

```bash
npm run db:migrate
npm run db:seed
```

3. Bootstrap (create or update) the platform superadmin:

```bash
npm run bootstrap:superadmin -- --email admin@platform.local --password "YourP@ssw0rd" --name "Admin Name"
```

Notes:
- The script creates a user with `tenant_id = NULL` and a `superadmin` role at platform scope.
- Passwords are hashed using bcrypt.
- If a user with the provided email exists at platform scope, the script updates the password and name.

## Class based models

As of Sequelize v6 (the current stable version), **class-based models are the officially recommended approach** when using TypeScript. Here's why:

**Class-based (`extends Model`) — recommended for TypeScript projects:**
- Full static typing on instances (e.g., `user.id` is `number`, not `any`)
- Works naturally with `instanceof` checks
- Clean separation of attribute interfaces and the model class
- Official Sequelize TypeScript docs use this pattern

**`sequelize.define()` — fine for plain JavaScript:**
- Less boilerplate, but no proper TypeScript typing
- Attributes are typed as `any` unless you do extra work
- Still works in v6 but is the "JS-first" API

**Sequelize v7 (alpha) changes this again:**
- v7 drops the class-based model entirely and moves to a decorator-based approach (`@Table`, `@Column`, like TypeORM)
- But v7 is still in alpha and not production-ready

**Bottom line for your project:** You're on v6 with TypeScript, so class-based `extends Model` with `Model.init()` — exactly what you have now — is correct and matches what the official docs recommend. The refactor you just did is the right call.

If you ever migrate to v7, the pattern will change to decorators, but that's a future concern.

## Folder structure

From https://softwareontheroad.com/ideal-nodejs-project-structure/

Here's the full breakdown of the current structure:

```
src/
  api/          ← HTTP layer
  config/       ← Environment & app settings
  loaders/      ← Startup modules
  middleware/   ← Express middleware
  models/       ← Database schema
  services/     ← Business logic
  subscribers/  ← Async event handlers
  types/        ← TypeScript declarations
  utils/        ← Pure helper functions
```

---

### `api/`
**Purpose:** Receive HTTP requests, validate input, call a service, return a response. Nothing more.

**Create a file here when:** You're adding a new route group (e.g. `api/users.ts`, `api/invoices.ts`).

**Rule:** No database calls. No business logic. If you find yourself writing `await Model.findOne(...)` here, it belongs in `services/` instead.

---

### `services/`
**Purpose:** All business logic lives here. Orchestrates models, applies rules, makes decisions.

**Create a file here when:** You need logic that doesn't belong on a route — e.g. `authService.ts` knows how to validate passwords and issue tokens, `tenantService.ts` knows how to create/find tenants.

**Rule:** No `req` or `res` objects. No HTTP status codes. Just plain functions that take data in and return data out.

---

### `models/`
**Purpose:** Defines your database tables/collections and their shape (Sequelize models in your case).

**Create a file here when:** You're adding a new database table — e.g. `invoiceModel.ts`, `planModel.ts`.

**Rule:** Only schema definition and associations here. No business logic.

---

### `loaders/`
**Purpose:** Initializes external connections and services at startup (DB, Redis, queues, etc.).

**Create a file here when:** You're connecting to a new external system — e.g. `redis.ts`, `agenda.ts` (job scheduler). Each one is a self-contained startup module.

**Rule:** These run once at boot. server.ts calls them in order.

---

### `middleware/`
**Purpose:** Express functions that run between the request and the route handler — auth guards, tenant resolution, request logging.

**Create a file here when:** You need logic that applies across multiple routes — e.g. `rateLimiter.ts`, `requestLogger.ts`.

**Rule:** Should only inspect/modify `req`/`res` or call `next()`. Not for business logic.

---

### `config/`
**Purpose:** Reads environment variables and exports them as typed, named values.

**Create a file here when:** You're adding a new group of config values — e.g. `email.ts` for SMTP settings, `stripe.ts` for payment keys.

**Rule:** Never scatter `process.env.SOME_VAR` throughout the codebase. Always go through `config/`.

---

### `subscribers/`
**Purpose:** Event listeners that react to things that happened — decouples side effects from your services.

**Create a file here when:** A service emits an event and you want to react to it elsewhere — e.g. when a user signs up, send a welcome email, notify analytics, create a default workspace. Each subscriber handles one concern.

**Rule:** A service should emit an event like `user_signup`. It should NOT directly call `EmailService` and `AnalyticsService` itself.

---

### `types/`
**Purpose:** TypeScript type augmentations and shared interface/type declarations.

**Create a file here when:** You need to extend a third-party type (like `express.d.ts` adding `req.tenant`) or define shared interfaces used across multiple layers.

---

### `utils/`
**Purpose:** Pure, stateless helper functions with no side effects.

**Create a file here when:** You have a reusable function that doesn't belong to any specific domain — e.g. `jwt.ts`, `pagination.ts`, `slugify.ts`.

**Rule:** No database access, no business logic, no `req`/`res`.