# Plan

- **Loose end**: the operator's worlds run module 0.2.1, without the dice
  selector fix (d2dfa05) and the version change (d2c3128). The operator wants
  more work done before a release; a release after that work settles it.

- **Loose end**: a group check's sanity card for a player-owned investigator
  going public once its SAN roll is made was not tried on CoC7 9.2.hh.1. Rolling
  one in a 9.2.hh.1 world and seeing it turn public settles it.

- **Turn on the base checks.** `markdownlint-cli2` was left out of `prek.toml`
  at setup with 26 findings in `CONTRIBUTING.md` and `README.md`: 20 MD026
  (headings ending in a period), 4 MD040 (fenced code without a language), 1
  MD033 (inline HTML), 1 MD034 (bare URL). Fix them; the next `/hh-rules` run
  adds the check.

- **Review the existing docs.** Read `CLAUDE.md`, `README.md`, `CONTRIBUTING.md`
  and `LICENSING.md` as a set against the `principles` rule: lines wrong or
  stale against the code, the plan or the diary; lines restating the code;
  history, dates or counts; what is not yet built; passages that belong where
  they load instead; repetition; and decisions without their citation.
