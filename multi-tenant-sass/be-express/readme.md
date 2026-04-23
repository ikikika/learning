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