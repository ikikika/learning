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
version: 3.8 — selects the Compose file format / feature set the file uses.

services: top-level section that defines containerized services (here mysql and api).

mysql.image: mysql:8.0 — base image used for the DB.

mysql.container_name: mts_mysql — friendly container name (optional).

mysql.restart: unless-stopped — restart policy if container exits.

mysql.environment: environment variables passed to MySQL (e.g. MYSQL_ROOT_PASSWORD, MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD) — uses shell-style interpolation like ${MYSQL_ROOT_PASSWORD:-rootpass} to provide defaults when .env vars are missing.

mysql.ports: 3306:3306 — maps container MySQL port to host for local access.

mysql.volumes: mysql_data:/var/lib/mysql — named volume to persist database files across restarts.

mysql.healthcheck: a small mysqladmin ping check so Docker can report service health (used by orchestration/monitoring).

api.build: . — build an image from the Dockerfile in the project root.

api.container_name: mts_api — friendly name for the API container.

api.depends_on: - mysql — start order hint: Compose starts mysql before api (note: this does NOT wait for DB readiness, only start order).

api.ports: 3000:3000 — exposes the Express app on host port 3000.

api.environment: forwards app and DB config (e.g. NODE_ENV, PORT, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME). Important: DB_HOST is set to mysql (service name) so the app connects via Docker internal DNS.

api.volumes:

./:/usr/src/app:cached — mounts source for live development inside container (so ts-node-dev restarts on changes).
/usr/src/app/node_modules — anonymous volume to avoid host/node_modules conflicts.
api.command: overrides the container CMD to run npm run dev (development mode with live reload).

volumes: mysql_data: — named volume declaration that Compose will create and manage for persistent DB data.
