# Contributing to Group Checks for CoC7.

This guide is for people who want to work on the module itself. If you just want to use it, see the [README](README.md).

## Reporting bugs.

Open an [issue](https://github.com/ImproperSubset/hh-coc7-group-check/issues) with your Foundry VTT and CoC7 system versions, what you did, what you expected and what happened instead. Errors from the browser console (F12) help a lot.

## Translations.

Each language is one file in [`static/lang/`](static/lang/). Edit it and open a pull request. `npm test` checks that every language file has exactly the same keys and `{placeholders}` as `en.json`, so a new key has to be added to all of them.

## Development.

The build reuses the CoC7 system's webpack scripts, which compile the module and write it directly into one or more Foundry VTT user data folders so you can test it live.

### Prerequisites.

- Node.js 20.19+, 22.13+ or 24+ (CI uses Node 24). The build alone runs on Node 20.9 or later; ESLint needs the newer versions.
- A local Foundry VTT installation with the CoC7 system, for testing

### Setup.

```sh
npm ci         # install the exact dependency versions in package-lock.json
npm run init   # interactive: choose the Foundry VTT user data folder(s) to build into
```

`npm run init` asks for your Foundry VTT **user data** folder, the one that contains `Data/` (on Linux usually `~/.local/share/FoundryVTT`), and saves your choices to `fvtt.config.json`, which git ignores. You can register several folders, such as a v13 and a v14 install, and build into one or all of them.

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

- `tests/check-choices.test.js`: merging skills by CoC ID and name, dropdown grouping and ordering, frequent-check matching (case, accents, CoC IDs, duplicates), setting parsing and the sanity loss link.
- `tests/lang.test.js`: every language listed in `module.json` has the same keys and placeholders as `en.json`.

The dialog itself and the calls into the system are tested in a running Foundry VTT world.

### Project layout.

```
hh-coc7-group-check/
  module.js                        entry point: registers the hooks
  constants.js                     IDs, default frequent checks, check types and difficulties
  hooks/init.js                    registers settings and key bindings, exposes the macro API
  hooks/get-scene-control-buttons.js  adds the button to Keeper's tools (v12 and v13+ APIs)
  hooks/pre-create-chat-message.js whispers a group check's standby and sanity cards to the investigator's players
  hooks/update-chat-message.js     makes a whispered sanity card public once its SAN roll is made
  setup/register-settings.js       the Frequent checks and whisper requests settings
  setup/register-keybindings.js    the Shift+G key binding
  apps/check-choices.js            builds the check list and the sanity loss link from plain data (no Foundry dependencies)
  apps/group-check-dialog.js       the dialog and the code that sends the checks
  apps/card-whispers.js            which standby and sanity cards to whisper, and to whom
static/
  module.json                      Foundry VTT manifest
  templates/group-check.hbs        dialog template
  lang/*.json                      translations
styles/hh-coc7-group-check.less    dialog styling
scripts/, webpack.config.js        build scripts adapted from the CoC7 system
tests/                             node:test unit tests
```

### Continuous integration.

Every push to `main` and every pull request runs [`ci.yml`](.github/workflows/ci.yml): actionlint on the workflows, a [REUSE](https://reuse.software/) licensing check, ESLint, the tests and a production build.

### Patched CoC7 system.

The CoC7 system doesn't expose its sanity check card to modules, so with a released system, a Sanity group check falls back to posting roll links. A fork of the system adds the card as `game.CoC7.sanCheck`, and with it the module creates sanity cards directly:

- Fork: [ImproperSubset/CoC7-FoundryVTT](https://github.com/ImproperSubset/CoC7-FoundryVTT), branch `expose-san-check`.
- The branch is the latest CoC7 release plus one commit adding `game.CoC7.sanCheck` in `coc7/hooks/init.js`. It never tracks the system's unreleased `develop`.

When CoC7 publishes a release, move the commit onto it. With the branch on `8.16` and a new `8.17` release:

```sh
git remote add upstream https://github.com/Miskatonic-Investigative-Society/CoC7-FoundryVTT.git  # once
git fetch upstream --tags
git checkout expose-san-check
git rebase --onto 8.17 8.16 expose-san-check
git push --force-with-lease origin expose-san-check
```

A conflict there means the system changed the `game.CoC7` object in `coc7/hooks/init.js`; re-add the import and the `sanCheck: CoC7SanCheckCard.create` line.

To build the patched system into a Foundry VTT data folder, from the fork's clone:

```sh
npm install
npm run init               # choose the Foundry VTT user data folder to build into
npm run compendiums-build
npm run manuals-build
npm run roll-requests-build
npm run build              # writes <data>/Data/systems/CoC7
```

## Releasing.

1. Bump the version everywhere it lives, and commit:

   ```sh
   npm version 0.2.0 --no-git-tag-version   # updates package.json and package-lock.json
   # then set "version": "0.2.0" in static/module.json by hand
   git commit -am "Release 0.2.0"
   ```

2. Push, then publish a GitHub release whose tag is exactly the version (`0.2.0`, no `v` prefix).

The [release workflow](.github/workflows/release.yml) runs the full CI check, fails if the tag doesn't match the version in both `package.json` and `static/module.json`, builds the module, sets the `download` URL in `module.json`, and attaches `module.json` and `module.zip` to the release. Foundry VTT's manifest URL points at the latest release's `module.json`, so users get the update automatically.
