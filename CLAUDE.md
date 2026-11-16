# Group Checks for CoC7

Foundry VTT module `hh-coc7-group-check`: a Keeper dialog (Keeper's tools
button, Shift+G, or `game.modules.get('hh-coc7-group-check').api.groupCheck()`)
that sends one skill, characteristic, Luck or Sanity check to several
investigators. GPL-3.0-only, the CoC7 system's license, since the module copies
its code (diary decision 2026-11-16: the module's license).

- `README.md` describes what the module does for users.
- `CONTRIBUTING.md` covers building, tests, project layout, CI and releasing.
  Read it before changing code or releasing.

## Repositories

- **This repo**: `ImproperSubset/hh-coc7-group-check`, public. `main` is what
  releases are cut from.
- **CoC7 system fork**: `ImproperSubset/CoC7-FoundryVTT`, local clone
  `~/git/CoC7-FoundryVTT` (remote `origin` is the fork, `upstream` is upstream).
  The module needs its `game.CoC7.sanCheck`. How the fork is versioned and
  released is in that clone's `.hh/docs/releases.md`; read it before changing
  the fork.
- **Upstream CoC7**: `Miskatonic-Investigative-Society/CoC7-FoundryVTT`. Read
  its source to learn how the system works. Never push to it, open pull
  requests, issues or comments on it, or fork it again without the user's
  explicit permission for that specific action.

## How to work here

- Match the CoC7 system: use its APIs, localization keys (`CoC7.*`, `CHARAC.*`,
  `SETTINGS.*`) and terminology, and check its source before assuming how it
  behaves, citing `file:line`.
- Support Foundry VTT 12, 13 and 14, as the system does. Version-specific code
  follows the system's `/* // FoundryVTT V12 */` convention.
- Ship every user-facing string in all 15 languages the system supports, using
  each language's terms from the system's own language files.
  `tests/lang.test.js` checks keys and placeholders.
- Docs and comments state what is true now, with no mention of removed features;
  a comment is only for a constraint that stops a wrong edit. Spell it
  "license". Keep side discussions out of docs.
- Docs name the versions the module needs and where to get them, never what is
  inside a dependency or how it is built, branched or released. The fork's own
  maintenance lives in its clone's `CLAUDE.md` and `.hh/docs/`.
- Before warning about a risk, trace it to the conditions under which it
  actually happens. If it can't be confirmed, say it's unconfirmed.
- This repo is public. Server, infrastructure and personal details never go in
  it; keep local notes in `CLAUDE.local.md`, which `.git/info/exclude` keeps out
  of git.
- The commit checks in `prek.toml` run `npm run eslint`, `npm test` and
  `reuse lint`, among hh-rules' checks; no rules pack, since the module keeps
  the system's ESLint config and `node:test` (diary decision 2026-11-16: no
  rules pack). CI also runs actionlint and a build.
- Tests are `tests/**/*.test.js`.
- Commit as `ImproperSubset <1039371+ImproperSubset@users.noreply.github.com>`;
  GitHub rejects pushes containing the user's private email.

## Glossary

Terms used only in this project; shared terms are in the `glossary` rule.
