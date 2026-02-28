# Notes app (Amplify + S3)

Paste text in the browser, click **Save**, and each save becomes a new `.txt` file in Amazon S3 under `notes/`. Built for AWS Amplify Hosting: static HTML/JS frontend + Amplify Function (Lambda) + S3.

## How it works

1. The page loads `amplify_outputs.json` and reads `custom.notesApiUrl`.
2. **Save** sends `POST {notesApiUrl}/notes` with `{ "content": "..." }`.
3. The `save-note` Lambda writes `notes/note-<timestamp>.txt` to the Amplify Storage bucket.

There is no auth on the API — anyone who knows the URL can save notes. Fine for a learning demo; not for private data.

## Project layout

| Path | Role |
|------|------|
| `index.html`, `app.js`, `styles.css` | Static UI |
| `amplify/storage/` | S3 bucket (`notes/*` writable by the function) |
| `amplify/functions/save-note/` | Lambda that creates each `.txt` |
| `amplify/backend.ts` | Wires storage, function, and public REST API |
| `amplify.yml` | Amplify Hosting / Gen 2 pipeline |

## Prerequisites

- Node.js 20+
- AWS account and [configured credentials](https://docs.amplify.aws/react/start/account-setup/) (`aws configure` or SSO)
- Amplify CLI toolchain comes via `@aws-amplify/backend-cli` (`npx ampx`)

## Local development

```bash
npm install
npx ampx sandbox
```

Keep the sandbox running. It provisions S3, Lambda, and API Gateway, and writes `amplify_outputs.json` at the project root (gitignored).

In another terminal:

```bash
npm run serve
```

Open the printed local URL, paste text, click **Save**. In the AWS console, open the sandbox S3 bucket → `notes/` to see files like `note-2026-09-11T06-56-00-123Z.txt`.

Stop the sandbox with `Ctrl+C` (or `npx ampx sandbox delete` to tear down cloud resources).

## Deploy on AWS Amplify

This git repo (`learning`) is treated as a **monorepo**: the app lives in `notesapp/`. The build spec is [`amplify.yml`](../amplify.yml) at the **repository root**, with `applications[].appRoot: notesapp`.

1. Push this repo to GitHub/GitLab/Bitbucket (or Amplify’s git host).
2. In [Amplify Console](https://console.aws.amazon.com/amplify/) → **Create new app** → connect the repository.
3. When asked for the app root / monorepo path, use `notesapp`.
4. In **Hosting → Environment variables**, set:
   - `AMPLIFY_MONOREPO_APP_ROOT` = `notesapp`  
   (must match `appRoot` in `amplify.yml`)
5. Deploy. After a successful build:
   - Hosting serves `index.html`, `app.js`, `styles.css`, and generated `amplify_outputs.json`.
   - Backend creates the bucket, function, and API; `custom.notesApiUrl` points at API Gateway.

Open the Amplify app URL and save a note. Confirm the object in S3 under `notes/`.

## API contract

`POST /notes`

```json
{ "content": "your pasted text" }
```

Success:

```json
{ "ok": true, "key": "notes/note-2026-09-11T06-56-00-123Z.txt" }
```

Empty content returns `400`. Raw text bodies (non-JSON) are also accepted as the file contents.
