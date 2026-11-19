---
paths:
  - "prek.toml"
  - ".github/workflows/*.yml"
  - "tests/**/*.test.js"
---

# Commit checks, CI and tests

What the commit checks and CI run, and where the tests live.

- The commit checks in `prek.toml` run `npm run eslint`, `npm test` and
  `reuse lint`, among hh-rules' checks; no rules pack, since the module keeps
  the system's ESLint config and `node:test` (diary decision 2026-11-16: no
  rules pack). CI also runs actionlint and a build.
- Tests are `tests/**/*.test.js`.
