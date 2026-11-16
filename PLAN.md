# Plan

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
