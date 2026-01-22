# Contract: Accessibility (WCAG 2.2 AA CI)

## Requirement (FR-026 / SC-020)

v1 MUST run automated **WCAG 2.2 AA** audit tooling in CI against primary demo
routes for roles under test and **fail the pipeline** when AA violations are
reported.

## Scope

| Item         | Requirement                                                                                               |
| ------------ | --------------------------------------------------------------------------------------------------------- |
| Standard     | WCAG 2.2 Level AA                                                                                         |
| Tooling      | axe (or equivalent) integrated with Playwright/CI                                                         |
| Routes       | Primary demo route(s) per role under test (standalone home, host home, remote standalone home at minimum) |
| Failure mode | Non-zero CI exit on reported AA violations                                                                |
| Out of scope | Manual full-site audit beyond automated primary routes; WCAG AAA                                          |

## Notes

Complements responsive/PWA constitution expectations; does not replace semantic
HTML and operable controls in the demo UI.
