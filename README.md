<h1 align="center">Group Checks for CoC7</h1>

## Overview.

A Keeper tool for the [Call of Cthulhu 7th Edition system](https://github.com/Miskatonic-Investigative-Society/CoC7-FoundryVTT) on [Foundry Virtual Tabletop](https://foundryvtt.com). It asks several investigators for the same skill, characteristic or Luck check at once. Each investigator's check appears in the chat log as its own message, the same one the system posts when you roll from the character sheet.

Requires Foundry VTT 12, 13 or 14 and CoC7 8.16 or later.

## Installation.

In Foundry VTT's setup screen, open **Add-on Modules**, click **Install Module** and paste this manifest URL:

```
https://github.com/ImproperSubset/hh-coc7-group-check/releases/latest/download/module.json
```

Then enable **Group Checks for CoC7** in your world under **Game Settings → Manage Modules**.

## Usage.

Only the Keeper can use the tool. Open it with **Shift+G** (change it under **Configure Controls**), with the **Group check** button in **Keeper's tools**, or from a script macro:

```js
game.modules.get('hh-coc7-group-check').api.groupCheck()
```

The dialog lists each player's assigned character (**User Configuration → Character**) and the actors of any tokens you have selected. Selected investigators start ticked; if you selected none, every investigator does. Selected monsters (see [Sanity checks](#sanity-checks)) start ticked and roll along with the investigators, except in a Sanity check. Choose the check, the difficulty and any bonus or penalty dice, untick anyone who shouldn't roll, and click **Send**.

The check list starts with your frequent checks (see [Settings](#settings)), then every skill that any listed investigator has, then the characteristics, Luck and Sanity. Skills that share a CoC ID or a name are listed once, even if the investigators were built in different languages.

### What Send does.

What happens depends on who owns the actor and on the system setting **Standby Keeper rolls**:

| Actor | Standby Keeper rolls on | Standby Keeper rolls off |
| --- | --- | --- |
| Owned by a player | A chat card with a **Roll** button for the player | The check rolls at once |
| No player owner, such as an NPC token | The check rolls at once | The check rolls at once |

With the setting off, you get a warning when a player's investigator is about to roll.

With the module setting **Group check: whisper requests** on (the default), each Roll card is whispered to the players who own that investigator, so players see only their own requests. When the player clicks **Roll**, the card becomes public and everyone sees the result.

Investigators who don't have the chosen skill are skipped, and a notification names them. The module never adds a skill to a sheet. If your table wants base-chance rolls for them, ask for those separately.

Opposed and combined rolls are not covered. Use the system's own tools for those.

### Sanity checks.

Select the monster's token, along with any investigators' tokens, and open the dialog. A selected monster (any actor other than an investigator whose sanity loss is filled in, such as `0/1D6`) makes **Sanity** the chosen check and fills in its loss on a success and on a failure, with its type or name as the reason. In a Sanity check the monster is left out of the list of who rolls. Pick any other check and it rolls along with the investigators.

You can also choose **Sanity** from the check list and type the loss (for example `0` and `1D6`) and the reason yourself.

What Send does depends on the CoC7 system version:

- When the system provides `game.CoC7.sanCheck`, each ticked investigator gets the system's sanity check card straight away, with the monster as its source so the system's creature rules apply. With **Group check: whisper requests** on, a player-owned investigator's card is whispered to its players and turns public once the SAN roll is made.
- Otherwise, Send posts the system's sanity loss roll link to each ticked investigator's players, whispered when **Group check: whisper requests** is on. The player clicks the link, and the system's sanity check card takes it from there. Investigators with no player are skipped and named in a notification. A roll link can't carry a reason containing `,` `:` `[` `]` `{` or `}`, so the dialog won't send one; the system tracks sanity loss per reason, so the module never alters it.

The macro's promise resolves once the dialog closes and the checks have started. The chat messages can arrive a moment later.

## Settings.

**Group check: frequent checks** is a world setting: a comma-separated list of checks to put at the top of the list, in order. The first one is selected when the dialog opens. The default is:

```
i.skill.spot-hidden, i.skill.listen, i.skill.library-use, i.skill.psychology, lck, san
```

For a modern-era game you might use:

```
i.skill.spot-hidden, i.skill.listen, i.skill.computer-use, i.skill.electronics, lck
```

An entry can be a skill's CoC ID (`i.skill.listen`, which works in every language), a skill name as it appears on the sheet (`Science (Biology)`), a characteristic (`Strength`, `STR` or `str`), Luck (`Luck` or `lck`) or Sanity (`Sanity` or `san`). Case and accents don't matter, and entries that match nothing are ignored.

To find a skill's CoC ID, open the skill from a sheet as the Keeper and click the fingerprint button in its title bar. Foundry 12 labels it **ID**; later versions show **System ID (CoC ID)** when you hover over it.

**Group check: whisper requests** is a world setting, on by default. It whispers each Roll card and sanity request to the players of that investigator. Turn it off to post them publicly.

## Languages.

The module's own text is machine-translated into the 14 other languages the CoC7 system supports, using the system's terms. Skill, characteristic and difficulty names come from the system itself. Corrections from native speakers are welcome.

## Contributing.

Bug reports and pull requests are welcome. The [contributing guide](CONTRIBUTING.md) covers building, testing and releasing.

## Licenses.

Copyright © 2026 Rhett D. Hudson. Licensed under the [GNU General Public License v3.0 only](LICENSE). Parts of the build scripts, the dialog and its template come from the CoC7 system by the Miskatonic Investigative Society, also GPL-3.0. [LICENSING.md](LICENSING.md) lists them.

This is an unofficial fan module, not published, endorsed or specifically approved by Chaosium Inc. Call of Cthulhu is a trademark of Chaosium Inc., used under [Chaosium's Fan Material Policy](https://www.chaosium.com/fan-material-policy/).
