<h1 align="center">Group Checks for CoC7</h1>
<p align="center">
  <img src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fgithub.com%2FImproperSubset%2Fhh-coc7-group-check%2Freleases%2Flatest%2Fdownload%2Fmodule.json&query=%24.compatibility.minimum&label=Foundry%20VTT&suffix=%2B">
  <img src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fgithub.com%2FImproperSubset%2Fhh-coc7-group-check%2Freleases%2Flatest%2Fdownload%2Fmodule.json&query=%24.compatibility.verified&label=Foundry%20VTT%20verified">
  <img src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fgithub.com%2FImproperSubset%2Fhh-coc7-group-check%2Freleases%2Flatest%2Fdownload%2Fmodule.json&query=%24.relationships.systems%5B0%5D.compatibility.minimum&label=CoC7&suffix=%2B">
  <img src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fgithub.com%2FImproperSubset%2Fhh-coc7-group-check%2Freleases%2Flatest%2Fdownload%2Fmodule.json&query=%24.relationships.systems%5B0%5D.compatibility.verified&label=CoC7%20verified">
  <img src="https://img.shields.io/github/repo-size/ImproperSubset/hh-coc7-group-check.svg">
  <a href="https://github.com/ImproperSubset/hh-coc7-group-check/commits/main">
    <img src="https://img.shields.io/github/last-commit/ImproperSubset/hh-coc7-group-check.svg">
  </a>
  <a href="https://github.com/ImproperSubset/hh-coc7-group-check/issues">
    <img src="https://img.shields.io/github/issues/ImproperSubset/hh-coc7-group-check.svg">
  </a>
  <img src="https://img.shields.io/github/license/ImproperSubset/hh-coc7-group-check.svg">
  <img src="https://img.shields.io/github/downloads/ImproperSubset/hh-coc7-group-check/latest/total">
  <img src="https://img.shields.io/github/downloads/ImproperSubset/hh-coc7-group-check/total">
</p>
<p align="center">
  <a href="#overview">Overview</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#installation">Installation</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#usage">Usage</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#settings">Settings</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#troubleshooting">Troubleshooting</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#contributing">Contributing</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#licenses">Licenses</a>
</p>

## Overview.

A Keeper tool for the [Call of Cthulhu 7th Edition system](https://github.com/Miskatonic-Investigative-Society/CoC7-FoundryVTT) on [Foundry Virtual Tabletop](https://foundryvtt.com) that asks several investigators for the same check at once: "everyone roll Spot Hidden", "everyone make a Luck roll", "POW checks, all of you".

Pick the check, the difficulty and any bonus or penalty dice once, tick who should roll, and click **Send**. Each investigator's check then appears in the chat log as its own message, the same message the system posts when you roll that check from the character sheet.

## Installation.

1. In Foundry VTT's setup screen, open **Add-on Modules** and click **Install Module**.
2. Paste this manifest URL into **Manifest URL** and click **Install**:

   ```
   https://github.com/ImproperSubset/hh-coc7-group-check/releases/latest/download/module.json
   ```

3. Launch your CoC7 world and enable **Group Checks for CoC7** under **Game Settings → Manage Modules**.

To install a specific version instead of the latest, use that release's `module.json` from the [releases page](https://github.com/ImproperSubset/hh-coc7-group-check/releases).

## Usage.

### Quick start.

1. Make sure each player has their investigator assigned (**User Configuration → Character**), or select the tokens you want to roll.
2. In the scene controls, open **Keeper's tools** and click **Group check** (the people icon).
3. Choose the check, difficulty and bonus/penalty dice, adjust the ticked investigators, and click **Send**.

For the usual table experience — each player clicks their own Roll button — turn on the system setting **Standby Keeper rolls** (see [What Send does](#what-send-does)).

### The Group check dialog.

The tool is only shown to, and only usable by, the Keeper (any user with the GM role).

#### Check.

A single dropdown holding every check the listed investigators can make, in up to three groups:

| Group | Contents | Order |
| --- | --- | --- |
| **Frequent** | Checks named in the [Frequent checks](#frequent-checks) setting | Setting order |
| **Skills** | Every skill owned by at least one listed investigator | Alphabetical |
| **Characteristics** | STR, CON, SIZ, DEX, APP, INT, POW, EDU, then Luck | Fixed |

A check that appears under **Frequent** is not repeated in its normal group, and empty groups are hidden. The first entry in the list is selected when the dialog opens, so with the default settings that is Spot Hidden.

The skill list is the *union* of the investigators' skills, not the intersection. A skill only one investigator has still appears; everyone else is skipped when you send it (see below). Skills are matched across investigators by their CoC ID where they have one, so the same skill shows up once even if investigators were built in different languages.

#### Difficulty.

Regular, Hard, Extreme or Unknown. The initial choice follows the system setting **Default check difficulty**. Unknown is the system's own hidden-difficulty mode: the roll is made without telling the player what they needed.

#### Bonus / penalty dice.

A slider from two penalty dice (−2) to two bonus dice (+2), as in the system's own roll dialog. The same modifier is applied to every investigator; if some of them should have a different modifier, send them a separate group check.

#### Investigators.

A checkbox list built from:

- every player's **assigned character**, and
- the actor of every **token you have selected** on the canvas (this can include NPCs or investigators that aren't assigned to anyone).

If you have tokens selected, only their actors start ticked; otherwise everyone starts ticked. Untick anyone who shouldn't roll. Sending with nobody ticked does nothing.

### What Send does.

For each ticked investigator, the module asks the system to start the chosen check with the chosen difficulty and dice. What happens next depends on the actor and on the system setting **Standby Keeper rolls** (Game Settings → Configure Settings → Call of Cthulhu 7th Edition):

| Actor | Standby Keeper rolls **on** | Standby Keeper rolls **off** |
| --- | --- | --- |
| Owned by a player | A chat message with a **Roll** button appears; the player clicks it to roll | The check rolls immediately and the result appears in chat |
| Not owned by any player (e.g. an NPC token) | The check rolls immediately | The check rolls immediately |

When **Standby Keeper rolls** is off you'll get a warning each time you send, as a reminder that your players won't be rolling for themselves.

**Investigators who can't make the check are skipped**, and a notification names them — for example *"Skipped, no Language (Latin): Harvey Walters, Rita Young"*. This happens when an investigator doesn't own the chosen skill — usually a specialization such as a Language, Science or Art/Craft that only some investigators took — or (for unusual actor types) lacks the characteristic or Luck. The module deliberately does **not** add missing skills to anyone's sheet; ask those players for the base-chance roll separately if your table wants one.

Sanity rolls, opposed rolls and combined rolls are out of scope; use the system's own tools for those.

## Settings.

Found under **Game Settings → Configure Settings → Group Checks for CoC7**. Settings are world-wide and only the Keeper can change them.

### Frequent checks.

**Group check: frequent checks** — a comma-separated list of checks to pin to the top of the dropdown, in order. The first one is preselected.

Default:

```
i.skill.spot-hidden, i.skill.listen, i.skill.library-use, i.skill.psychology, lck
```

Each entry can be any of:

| Kind | Examples | Notes |
| --- | --- | --- |
| Skill CoC ID | `i.skill.spot-hidden`, `i.skill.listen` | Works in every language; recommended |
| Skill name | `Spot Hidden`, `Science (Biology)` | Must match the name on the sheet in your world's language |
| Characteristic | `Strength`, `STR`, `str` | Localized full name, localized abbreviation or system key |
| Luck | `Luck`, `lck` | |

Matching ignores case and accents, so `ecouter` matches *Écouter*. Entries that don't match any listed investigator's checks are silently ignored, which means you can list skills that only some of your investigators have. Listing the same check twice (for example by name and by CoC ID) shows it once.

To find a skill's CoC ID, open the skill from an investigator's sheet and click the **CoC ID** button in the sheet's title bar; the system calls it the *System ID*.

Example for a Mythos-heavy campaign:

```
i.skill.spot-hidden, i.skill.listen, POW, i.skill.occult, lck
```

## Troubleshooting.

**There's no Group check button.**
You need to be logged in as a GM, the world must use the CoC7 system at the version shown in the **CoC7** badge at the top of this page or later, and the module must be enabled in **Manage Modules**. The button lives inside **Keeper's tools**, not in the token or notes controls.

**"No player has an assigned character and no tokens are selected."**
Assign each player's investigator in **User Configuration → Character**, or select the tokens you want before opening the dialog.

**The checks rolled straight away instead of showing a Roll button.**
Turn on **Standby Keeper rolls** in the system settings. Also check that the actor is owned by a player: actors with no player owner always roll immediately.

**A skill I expected isn't in the list.**
Only skills owned by at least one *listed* investigator appear. If the investigator who has it isn't a player's assigned character, select their token before opening the dialog.

**Someone was skipped who does have the skill.**
The skill is looked up on each sheet by CoC ID or by name (ignoring case and accents). A skill with no CoC ID that is spelled differently on different sheets (for example a custom or renamed specialization) can't be matched; give the skills a CoC ID or make the names agree.

## Languages.

The module's own text is translated into Čeština, Deutsch, English, Español, Français, Italiano, Polski, Português (Brasil), Русский, Svenska, Українська, 日本語, 中文, 正體中文 and 한국어, matching the languages the CoC7 system ships. Skill, characteristic and difficulty names come from the system and your world's items.

Corrections from native speakers are very welcome; see [Contributing](#contributing).

## Contributing.

Bug reports, translation corrections and pull requests are welcome. Building the module, running the tests, the project layout and the release process are covered in the [contributing guide](https://github.com/ImproperSubset/hh-coc7-group-check/blob/main/CONTRIBUTING.md).

## Licenses.

Copyright © 2026 Rhett D. Hudson. Licensed under the [GNU General Public License v3.0 only](LICENSE).

Parts of the build tooling, the dialog and its template are derived from the Call of Cthulhu 7th Edition system by the Miskatonic Investigative Society, also GPL-3.0. [LICENSING.md](LICENSING.md) lists exactly which files, and `REUSE.toml` records every file's copyright and license in machine-readable form.

This is an unofficial fan module, not published, endorsed, or specifically approved by Chaosium Inc. Call of Cthulhu is a trademark of Chaosium Inc., used under [Chaosium's Fan Material Policy](https://www.chaosium.com/fan-material-policy/); see [LICENSING.md](LICENSING.md) for the full notice and the Foundry VTT license.
