# Plan

- **Wrap finding**: the `CLAUDE.md` line citing "Luck gain applied by the
  system" says the module needs `game.CoC7.developLuck` but not why it does not
  copy the system's rules or read the card's dice itself. Proposed: add "rather
  than copying its rules or reading a card's internal dice data, which nothing
  keeps stable".

- **Loose end**: a player rolling their own Luck improvement card was not tried;
  only the Keeper's roll was. Owed to the operator. Settled by the operator, in
  14.369 as Gamemaster (reloaded), Player and Player 2, pressing **Recover Luck
  Points** and rolling each card as its player, then Claude reading the cards
  back: who rolled each, `appliedDevelopment` set, and the card public.

- **Loose end**: a group check's sanity card for a player-owned investigator
  going public once its SAN roll is made was not tried on CoC7 9.2.hh.1. Rolling
  one in a 9.2.hh.1 world and seeing it turn public settles it. Wrap finding:
  the servers are now offered the fork's 9.2.hh.4, and 14.369 runs a branch
  build matching it; whether a pass in 14.369 settles this was put to the
  operator (C1) and not answered. Proposed: reword to "the fork's latest
  release" and settle it in a server world on 9.2.hh.4, or accept a pass in
  14.369.

- **Migrate to hh-rules v0.30.0**, the next work to start. In `prek.toml`,
  replace the whole comment above the jscpd hook, from the line that opens
  `# Duplication: jscpd over the whole tracked tree` down to the `[[repos]]`
  line above the hook, with the base's words at v0.30.0, read with
  `git -C ~/git/hh-rules show v0.30.0:prek/base.toml`. Checked by the comment
  matching the base's word for word, and the commit checks passing.

- **Review the existing docs.** Read `CLAUDE.md`, `README.md`, `CONTRIBUTING.md`
  and `LICENSING.md` as a set against the `principles` rule: lines wrong or
  stale against the code, the plan or the diary; lines restating the code;
  history, dates or counts; what is not yet built; passages that belong where
  they load instead; repetition; and decisions without their citation.
