# Contributing to Group Checks for Call of Cthulhu 7th Edition.

This guide is for people who want to work on the module itself. If you just want to use it, see the [README](README.md).

## Reporting bugs.

Open an [issue](https://github.com/ImproperSubset/hh-coc7-group-check/issues) with your Foundry VTT and CoC7 system versions, what you did, what you expected and what happened instead. Errors from the browser console (F12) help a lot.

## Translations.

Each language is one file in [`static/lang/`](static/lang/). Edit it and open a pull request. `npm test` checks that every language file has exactly the same keys and `{placeholders}` as `en.json`, so a new key has to be added to all of them.

## Development.

The build reuses the CoC7 system's webpack scripts, which compile the module and write it directly into one or more Foundry VTT user data folders so you can test it live.

### Prerequisites.

- Node.js 20 or later (CI uses Node 24)
- A local Foundry VTT installation with the CoC7 system, for testing

### Setup.

```sh
npm ci         # install the exact dependency versions in package-lock.json
npm run init   # interactive: choose the Foundry VTT user data folder(s) to build into
```

`npm run init` asks for your Foundry VTT **user data** folder — the one containing `Data/` (on Linux typically `~/.local/share/FoundryVTT`) — and saves your choices to `fvtt.config.json`, which is git-ignored. You can register several folders (say, a v12 and a v13 install) and toggle between building to one or all of them.

### Build and test.

```sh
npm run build   # production build into <user data>/Data/modules/hh-coc7-group-check
npm run watch   # development build that rebuilds on every change
npm run eslint  # lint the module, build scripts and tests
npm test        # run the unit tests with node:test
```

> **Note:** a production build **empties** `Data/modules/hh-coc7-group-check` before writing to it. If that folder exists but doesn't contain a `module.json`, the build asks for confirmation first. Don't point it at a folder you care about.

After a build, reload Foundry VTT (F5) to pick up the changes.

### Tests.

The tests run under Node with no Foundry VTT runtime, so they cover the pure logic:

- `tests/check-choices.test.js` — dropdown grouping and ordering, frequent-check matching (case, accents, CoC IDs, duplicates) and value parsing.
- `tests/lang.test.js` — every language listed in `module.json` has the same keys and placeholders as `en.json`.

The dialog itself and the calls into the system are tested by hand in Foundry VTT.

### Project layout.

```
hh-coc7-group-check/
  module.js                        entry point: registers the hooks
  constants.js                     module ID, system ID, default frequent checks
  hooks/init.js                    registers settings
  hooks/get-scene-control-buttons.js  adds the button to Keeper's tools (v12 and v13+ APIs)
  setup/register-settings.js       the Frequent checks setting
  apps/check-choices.js            builds the grouped check list (no Foundry dependencies)
  apps/group-check-dialog.js       the dialog and the code that sends the checks
static/
  module.json                      Foundry VTT manifest
  templates/group-check.hbs        dialog template
  lang/*.json                      translations
styles/hh-coc7-group-check.less    dialog styling
scripts/, webpack.config.js        build scripts from the CoC7 system
tests/                             node:test unit tests
```

### Continuous integration.

Every push to `main` and every pull request runs [`ci.yml`](.github/workflows/ci.yml): actionlint on the workflows, a [REUSE](https://reuse.software/) licensing check, ESLint, the tests and a production build.

## Releasing.

1. Bump the version everywhere it lives, and commit:

   ```sh
   npm version 0.2.0 --no-git-tag-version   # updates package.json and package-lock.json
   # then set "version": "0.2.0" in static/module.json by hand
   git commit -am "Release 0.2.0"
   ```

2. Push, then publish a GitHub release whose tag is exactly the version (`0.2.0`, no `v` prefix).

The [release workflow](.github/workflows/release.yml) runs the full CI check, fails if the tag doesn't match the version in both `package.json` and `static/module.json`, builds the module, sets the `download` URL in `module.json`, and attaches `module.json` and `module.zip` to the release. Foundry VTT's manifest URL points at the latest release's `module.json`, so users get the update automatically.
