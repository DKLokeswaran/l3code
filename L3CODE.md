# l3code

l3code is DK Lokeswaran's personal fork of [T3 Code](https://github.com/pingdotgg/t3code). It carries a
handful of changes the upstream maintainers declined, and otherwise tracks upstream. It is not a contribution
vehicle: do not prepare anything for upstream review unless asked.

`AGENTS.md` is upstream's file and applies in full here. This file adds the fork's own rules on top of it. It
is fork-owned, so it can grow freely. `AGENTS.md` cannot.

## What differs so far

- CI. `ci-fork.yml` runs the fork's PR checks on free GitHub-hosted runners: upstream's `ci.yml` targets paid
  Blacksmith runners and is disabled on the fork, and its macOS-only mobile analysis job is dropped because
  the fork ships no Apple targets. `sync-fork-main.yml` keeps the fork in sync and `release-fork.yml` builds
  the fork's desktop artifacts. Upstream's own workflows are untouched.
- Brand. `apps/desktop/src/app/DesktopBrand.ts`, plus the `__T3CODE_DESKTOP_BRAND_SLUG__` define in
  `apps/desktop/vite.config.ts`, let a packaged build carry its own app id, user-data directory, taskbar
  identity, and Linux desktop entry. An empty slug means stock identity, so upstream builds and dev runs are
  unaffected.
- Shared state. The fork keeps the `t3` CLI name and the `.t3` data directory on purpose, so l3code and stock
  T3 Code read the same projects and threads on one machine. Only Electron's `safeStorage` files are split per
  brand (`resolveBrandEncryptedStateFilePath`), because those are encrypted by the install that wrote them.

## Branches

- `origin` is `DKLokeswaran/l3code`. `upstream` is `pingdotgg/t3code` and is fetch-only.
- `main` mirrors upstream and must stay a fast-forward of `upstream/main`. Never commit to it, never rewrite it.
- `personal/main` is the fork's branch, carrying fork commits on top of `main`. Force-pushing it is fine.

Upstream history inside `main` is preserved deliberately, so do not rewrite it. Do not leave iterative
"fix the fix" commits on `personal/main` either: group fork work into commits that represent its final state.

## Sync and release

`sync-fork-main.yml` runs daily at 14:30 UTC (20:00 IST): it fast-forwards `main` to `upstream/main`, then
merges `main` into `personal/main`. The merge is all-or-nothing. On conflict the job aborts and leaves
`personal/main` untouched for a manual fix.

A push to `personal/main` starts the fork's release train, which publishes Windows and Debian desktop builds to
this fork's releases as `0.YYYYMMDD.RUN_NUMBER`. The in-app updater watches those releases, so even a docs-only
push cuts a build.

## How to change this fork

The sync only stays painless while the fork's diff stays small. A conflict is a failed job here, not a warning,
so treat every edit to an upstream-owned file as a real cost:

- Prefer adding fork-owned files over editing upstream-owned ones. A file upstream never touches cannot conflict.
- When a shared file must change, change as few lines as possible, in one place, next to the fork's own change.
  Do not reformat, re-sort, rename, or otherwise tidy the surrounding code.
- Do not grow `AGENTS.md`, and do not edit `CLAUDE.md`, `CONTRIBUTING.md`, or the shared docs past what the
  task needs. Upstream rewrites `AGENTS.md` roughly monthly, and usually near the end of the file.
- Never edit, import, or re-export anything under `.repos/`.
- Prefer a change behind an existing extension point over touching build config, CI, or release plumbing.
- When upstream lands its own version of something the fork works around, delete the fork's copy instead of
  carrying both.
- Keep fork notes, plans, and scratch work out of the repository.

## Workarounds to re-check after a sync

Each of these exists only because upstream has not fixed the underlying thing. Confirm it is still needed, and
drop it once it is not:

- `pnpm-workspace.yaml` sets `msgpackr-extract: true`. Upstream shipped the literal instruction string
  "set this to true or false", which the strict schema in `scripts/build-desktop-artifact.ts` rejects.
