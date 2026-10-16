# Group Checks for CoC7

Foundry VTT module `hh-coc7-group-check`: a Keeper dialog (Keeper's tools button, Shift+G, or `game.modules.get('hh-coc7-group-check').api.groupCheck()`) that sends one skill, characteristic, Luck or Sanity check to several investigators. GPL-3.0-only.

- `README.md` describes what the module does for users.
- `CONTRIBUTING.md` covers building, tests, project layout, CI, releasing and the patched CoC7 system. Read it before changing code or releasing.

## Repositories

- **This repo**: `ImproperSubset/hh-coc7-group-check`, public. `main` is what releases are cut from.
- **CoC7 system fork**: `ImproperSubset/CoC7-FoundryVTT`, local clone `~/git/CoC7-FoundryVTT` (remote `origin` is upstream, `fork` is the fork). Branch `expose-san-check` is the latest CoC7 release plus two commits: `game.CoC7.sanCheck` in `coc7/hooks/init.js` and `.github/workflows/fork-release.yml`. Releases are tagged `<CoC7 release>.hh.<build>`, such as `8.16.hh.1`. The fork's `develop` and `master` mirror upstream and are never changed.
- **Upstream CoC7**: `Miskatonic-Investigative-Society/CoC7-FoundryVTT`. Read its source to learn how the system works. Never push to it, open pull requests, issues or comments on it, or fork it again without the user's explicit permission for that specific action.

## How to work here

- Match the CoC7 system: use its APIs, localization keys (`CoC7.*`, `CHARAC.*`, `SETTINGS.*`) and terminology, and check its source before assuming how it behaves, citing `file:line`.
- Support Foundry VTT 12, 13 and 14, as the system does. Version-specific code follows the system's `/* // FoundryVTT V12 */` convention.
- Ship every user-facing string in all 15 languages the system supports, using each language's terms from the system's own language files. `tests/lang.test.js` checks keys and placeholders.
- Docs and comments state what is true now. No history, no mention of removed features, no narration of decisions; a comment is only for a constraint that stops a wrong edit. Spell it "license". Keep side discussions out of docs.
- Before warning about a risk, trace it to the conditions under which it actually happens. If it can't be confirmed, say it's unconfirmed.
- This repo is public. Server, infrastructure and personal details never go in it; keep local notes in `CLAUDE.local.md`, which `.git/info/exclude` keeps out of git.
- Before pushing: `npm run eslint`, `npm test`, and `reuse lint`. CI also runs actionlint and a build.
- Commit as `ImproperSubset <1039371+ImproperSubset@users.noreply.github.com>`; GitHub rejects pushes containing the user's private email.
- The user's separate "workshop" development process doesn't apply here.
