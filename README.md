<h1 align="center">Group Checks for Call of Cthulhu 7th Edition</h1>
<p align="center">
  <a href="#overview">Overview</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#usage">Usage</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#installation">Installation</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#building">Building</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#releasing">Releasing</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#licenses">Licenses</a>
</p>

## Overview.

A module for the [Call of Cthulhu 7th Edition system](https://github.com/Miskatonic-Investigative-Society/CoC7-FoundryVTT) on [Foundry Virtual Tabletop](http://foundryvtt.com). It adds a Keeper tool that asks several investigators for the same check at once, for example "everyone roll Spot Hidden".

Each chosen investigator gets the system's own check card. When the system setting "Standby Keeper rolls" is on, player-owned investigators get a card with a Roll button that their player clicks.

## Usage.

- Open Keeper's tools in the scene controls and click **Group check** (the people icon).
- Choose the check: a skill, a characteristic or Luck. The checks listed in the "Group check: frequent checks" setting appear first, in that order, and the first one is selected.
- Choose the difficulty and any bonus or penalty dice.
- Tick the investigators who should roll. The list holds every player's assigned character, plus the actors of any selected tokens. When tokens are selected, only their actors are ticked; otherwise everyone is ticked.
- Click **Send**.

Investigators without the chosen skill are skipped and named in a notification.

Requires Foundry VTT 12 or later and the Call of Cthulhu 7th Edition system 8.16 or later.

## Installation.

In Foundry VTT, open **Add-on Modules**, click **Install Module** and paste this manifest URL:

```
https://github.com/ImproperSubset/hh-coc7-group-check/releases/latest/download/module.json
```

## Building.

The build uses the Call of Cthulhu 7th Edition system's own webpack scripts, which write the module straight into a Foundry VTT data folder.

```sh
npm ci         # installs the exact versions in package-lock.json
npm run init   # choose the Foundry VTT user data folder(s) to build into
npm run build  # production build into <data>/Data/modules/hh-coc7-group-check
npm run watch  # development build that rebuilds on change
npm run eslint
npm test
```

## Releasing.

1. Run `npm version 0.2.0 --no-git-tag-version` (with the new version) to update `package.json` and `package-lock.json`, set the same version in `static/module.json`, and commit all three.
2. Publish a GitHub release whose tag is that version, for example `0.2.0`.

The release workflow then checks, tests and builds the module, and attaches `module.json` and `module.zip` to the release. It fails if the tag doesn't match both versions.

## Licenses.

Copyright (C) 2026 Rhett D. Hudson. Licensed under the [GNU General Public License v3.0 only](LICENSE).

This is an unofficial fan module, not published, endorsed, or specifically approved by Chaosium Inc. See [LICENSING.md](LICENSING.md) for the code it includes from the Call of Cthulhu 7th Edition system, the Foundry VTT license and Chaosium's Fan Material Policy notice.
