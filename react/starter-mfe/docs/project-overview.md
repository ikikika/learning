# Project overview

<!--
  PURPOSE
  Evergreen product framing for humans and agents (IDE-agnostic).
  Fill in the sections below; delete or shorten guidance comments as you go.

  RELATED DOCS (do not duplicate their jobs here)
  - docs/coding-conventions.md → how to write code
  - docs/ui-context.md         → tokens, theming, components
  - AGENTS.md                  → short agent checklist
  - .specify/memory/constitution.md → engineering principles
  - specs/<feature>/spec.md → per-feature requirements when using Speckit
    (starter feature folders are removed on opt-in prune)

  AFTER A SESSION that changes product intent, update this file
  (same habit as updating coding-conventions.md / ui-context.md / AGENTS.md).
-->

## What it is

<!--
  2–4 sentences: what this product/repo is in plain language.
  Include the delivery model if relevant (e.g. in-repo starter vs generator).
  Avoid implementation detail (webpack, folder names) — that belongs in
  architecture / conventions docs.
-->

_TODO: Describe the product._

## Who it is for

<!--
  Primary and secondary users (e.g. app developers, platform teams).
  Note skill assumptions (React familiarity, MFE experience) if useful.
  Optional: personas or “not for” audiences.
-->

_TODO: List audiences and their goals._

## Problem / why it exists

<!--
  What pain does this solve? What happens without it?
  Keep this short; link out if you have a longer brief.
-->

_TODO: State the problem and outcome._

## Core flows

<!--
  The main happy paths a user can complete. Prefer numbered flows or a short
  list. Example shape for this starter (replace with your real flows):

  1. Init as standalone → run locally → extend a feature
  2. Init as host → compose a remote with fallback
  3. Init as remote → standalone + federated ./Demo

  Each flow: actor → steps → successful outcome.
  Detail and acceptance criteria stay in specs/<feature>/spec.md.
-->

_TODO: List 3–7 core flows._

## In scope (product)

<!--
  Capabilities the product intentionally includes at this stage (v1 / now).
  Bullet list. Prefer user-visible outcomes over tech stack.
-->

_TODO: In-scope capabilities._

## Out of scope

<!--
  Explicit non-goals so agents and contributors do not invent them.
  Examples: auth, backends, published npm contract packages, full offline apps,
  monorepo multi-app, etc. — only list what YOU have decided is out.
  Align with Complexity Tracking / deferred items in the constitution or specs
  when relevant, but keep this product-facing.
-->

_TODO: Out of scope / non-goals._

## Success looks like

<!--
  Optional. How you know the product is working for its audience
  (e.g. “new clone → init → running demo in <N minutes”).
-->

_TODO: Success criteria (optional)._

## Glossary (optional)

<!--
  Domain terms that confuse newcomers (host, remote, embedded, role, etc.).
  One line per term.
-->

_TODO: Key terms (optional)._

## Links

<!--
  Keep this table updated as docs grow.
-->

| Doc                                                   | Role                        |
| ----------------------------------------------------- | --------------------------- |
| [README.md](../README.md)                             | Quick start & scripts       |
| [docs/coding-conventions.md](./coding-conventions.md) | Coding conventions          |
| [docs/ui-context.md](./ui-context.md)                 | UI / tokens / components    |
| [AGENTS.md](../AGENTS.md)                             | Agent must-follow checklist |
| [Constitution](../.specify/memory/constitution.md)    | Engineering principles      |
| [Theming contract](./contracts/theming.md)            | Theme / token rules         |
| [A11y contract](./contracts/a11y-wcag.md)             | WCAG AA CI                  |
