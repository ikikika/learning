# sdlc-ai

**Anthropic's [AI-Native SDLC Playbook](https://claude.com/blog/the-ai-native-sdlc-playbook),
packaged as something you can install into a repository.**

The playbook describes a good process, but it is published as prose. In a large organisation, prose
gets applied inconsistently: each team reads it, agrees with it, and then builds its own partial
version with its own file names. This repository turns the playbook into a set of files that one
command installs into a repository. The installer merges with what is already there, and running it
twice gives the same result as running it once.

This is an internal EY enablement kit. It is not a client deliverable.

---

## The process in one picture

The playbook describes software delivery as six stages. Each stage produces a file, called an
artifact, that is committed to git and read by the next stage. Because every artifact is a commit,
the git history is also the audit trail. There is no separate compliance document to keep up to
date.

```
  ┌──────────────────────────────────────────────────────────────────┐
  │                                                                  │
  ▼                                                                  │
1 PLAN ──▶ 2 DESIGN ──▶ 3 BUILD ──▶ 4 TEST ──▶ 5 DEPLOY ──▶ 6 MAINTAIN
intent.md   spec.md      plan.md    green      review        breach
                                    gates      findings      ──▶ intent.md
```

| Stage | What the kit installs |
|---|---|
| **1 Plan** | The `intent-capture` skill, the `/intent` command and the `intent.md` template. The person who had the idea records it, with Claude's help. |
| **2 Design** | The `spec-authoring` skill, the `spec-critic` subagent and the `/spec` command. Your policies are applied while the specification is written, and any conflict between them is recorded with a named owner. |
| **3 Build** | The `implementation-plan` skill, the `/plan` command, a `CLAUDE.md` starting template and five hooks. The implementation plan is reviewed before any code is written. |
| **4 Test** | A verification section for `CLAUDE.md`, the `protect-tests` hook, a test harness for the agent configuration, and the `agent-evals.yml` CI workflow. |
| **5 Deploy** | `REVIEW.md`, the `reviewer` subagent, the `/review` command, and a release check that matches how your team merges work. |
| **6 Maintain** | `bands.yaml`, `watch-band.sh` and the `/close-loop` command. When a production metric leaves its expected range, a new `intent.md` is written and the process starts again. |

Terms used in the table:

- A **skill** is a set of instructions that Claude loads when a task matches the skill's
  description.
- A **subagent** is a separate Claude session with a narrow job and a restricted set of tools.
- A **hook** is a script that Claude Code runs before or after a tool call. A hook can block the
  call.
- A **command** is a slash command, such as `/intent`, that runs a predefined prompt.

## Install

```bash
git clone <this repo> && cd sdlc-ai

# Preview what would happen. This writes nothing.
install/install.sh --target /path/to/your/repo --profile trunk-local --dry-run

# Install the recommended first set of modules
install/install.sh --target /path/to/your/repo --profile trunk-local \
  --modules claude-md,skills,hooks,agents
```

Requires `git`, `jq`, `yq` and `bash`. The full reference is in [`INSTALL.md`](INSTALL.md).

The installer **merges with your existing files and never overwrites them**. Your `CLAUDE.md` gains
one marked section and keeps every other line. Your `.claude/settings.json` gains the hook
registrations and keeps your existing permissions. Running the installer a second time changes
nothing. It records what it installed in `.sdlc-ai/manifest.lock`, so upgrades and uninstalls only
touch files the kit put there.

**The installer stops if `.claude/` is listed in `.gitignore`**, and prints the three-line fix.
Agent configuration that is not version-controlled works on one machine and exists nowhere else, so
installing into an ignored directory would give you a setup that cannot be shared or reviewed.

## Profiles

Stages 1 to 4 and Stage 6 are the same for every team. Stage 5 (Deploy) depends on how your team
merges work, so the kit offers two versions of it, called profiles. You choose one at install time
with `--profile`.

- **`trunk-local`**. Work is merged into the main branch on a local machine by a coordinator, who
  reads the change and re-runs the full test suite on the merged result. A person pushes to the
  remote by hand. The `no-remote-push.sh` hook blocks pushes and any `gh` command that writes.
- **`pr-github`**. Work reaches the main branch through pull requests. Branch protection requires
  approval from a designated code owner, and Claude reviews each pull request in CI. The
  `production-gate.sh` hook requires a named release approval before a production deployment.

Both profiles meet the same requirement: a named person looks at every change before it reaches the
main branch, and that person is not the agent that wrote it. See
[`docs/05-profiles.md`](docs/05-profiles.md).

## Documentation

| | |
|---|---|
| [`docs/00-why.md`](docs/00-why.md) | Why the kit exists, and what it deliberately leaves out |
| [`docs/01-stages.md`](docs/01-stages.md) | **Read this first.** The six stages, and the terms every other document uses |
| [`docs/02-adoption-path.md`](docs/02-adoption-path.md) | What to do in the first week, and which order to avoid |
| [`docs/03-governance.md`](docs/03-governance.md) | The three places a rule can live: guidance, enforcement, or locked controls. The most important idea in the kit |
| [`docs/04-metrics.md`](docs/04-metrics.md) | What to measure, and how to read the numbers |
| [`docs/05-profiles.md`](docs/05-profiles.md) | `trunk-local` compared with `pr-github` |
| [`docs/06-demonstrating.md`](docs/06-demonstrating.md) | A twenty-minute demonstration script, and the questions to expect |
| [`docs/07-demo-on-a-fresh-repo.md`](docs/07-demo-on-a-fresh-repo.md) | A thirty-minute demonstration on a throwaway repository, starting from the install |
| [`docs/worked-example-decision-layer.md`](docs/worked-example-decision-layer.md) | A real repository assessed against the playbook, with the installer's dry-run output |

## What is in `kit/`

Everything the installer can copy into a repository. Nothing in this directory runs from here.

```
kit/
├── claude/skills/        six skills: intent, spec, plan, ADRs, evals, and one example policy skill
├── claude/agents/        three subagents: verifier, reviewer, spec-critic
├── claude/commands/      /intent /spec /plan /review /close-loop
├── claude/hooks/         protect-tests, protect-paths, no-remote-push, production-gate, format-after-edit
├── claude/settings.d/    JSON fragments merged into the target repository's settings.json
├── artifacts/            the intent, spec and plan templates, and the rules for using them
├── review/REVIEW.md      the review policy: which passes to run, what counts as Important, and a limit on minor comments
├── claude-md/            the CLAUDE.md starting template and the marked sections the installer adds
├── evals/                the test harness for agent configuration (Stage 4b)
├── ci/                   agent-evals.yml, claude-review.yml and pre-merge-gate.sh
├── maintain/             bands.yaml and watch-band.sh (Stage 6)
└── enterprise/           managed settings for regulated environments. Documented, and deliberately not installed
```

## Metrics

```bash
scripts/metrics/artifact-coverage.sh --target /path/to/repo --since 90.days
scripts/metrics/stage-latency.sh     --target /path/to/repo
```

Check coverage first. The latency figures only describe the changes that have artifacts, so a low
coverage figure means the latency figures describe a small share of the work.

## Three points to understand first

1. **Skills guide behaviour. Hooks enforce it.** A rule written in a contributing guide is followed
   only when people remember it. The same rule written as a hook is applied every time. Most of this
   kit is organised around that difference. See [`docs/03-governance.md`](docs/03-governance.md).
2. **Tests of the agent configuration are different from tests of your product.** If your repository
   already scores an AI feature it ships, that test suite cannot tell you whether an edit to a skill
   last week made Claude worse at working in your codebase. You need both kinds, kept separate.
3. **The examples carry someone else's rules.** The `secure-api-review` skill and the three test
   cases in `evals/cases/` show the expected shape. Adapt them to your own policies before relying
   on them.
