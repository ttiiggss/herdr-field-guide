# Herdr Field Guide

A static companion to a real Herdr terminal. Nine missions, a checked recall question per mission, Guided/Recall modes, browser-local progress, and a no-hints capstone. No packages, shell bridge, analytics, remote fonts, or application backend.

## Open

From this directory:

    python3 -m http.server 8765 --bind 127.0.0.1

Open http://127.0.0.1:8765 on this machine. The development server lasts only while its process is running. It is not public hosting.

You can also open index.html directly. Clipboard and localStorage behavior for file URLs varies by browser; copy manually if needed. HTTP is recommended for consistent saved progress.

## Learn

Keep the site beside a fresh ordinary terminal outside Herdr. Mission 1 launches `herdr --session herdr-school` from `~/herdr-practice`. If that name already contains real work, choose another unused name and substitute it throughout.

1. Guided pass: perform each task, notice its result, answer the recall question.
2. Recall pass: reproduce the final layout without instructions; reveal hints only if stuck.
3. Repeat tomorrow, then apply the same layout to a real project a few days later.

The site does not read or control your terminal. The task checkbox is self-reported, not automated evidence of terminal success. The agent mission starts an already-configured real agent and may incur model usage; leave it incomplete if you have none configured. Never enter credentials into this page.

A named session isolates runtime state, NOT files, configuration, or integration installs. The course does not change global config, stop servers, install software, or close your existing work. You execute the practice commands yourself.

## Sources and scope

Prepared for the locally installed Herdr 0.9.0. Commands and default bindings were checked against `herdr --help`, `herdr --default-config`, and the pane/workspace/tab/agent command-group help. The local key configuration had no overrides when checked. Live Help always wins if you customize keys later.

Concept order and human-first/mouse-first approach:
https://herdr.dev/agent-guide.md
https://herdr.dev/docs/keyboard/
https://herdr.dev/docs/session-state/

`verified-herdr-help.txt` is generated evidence from the installed binary, not fabricated sample terminal output. Version drift intentionally fails the check so the lessons can be reviewed.

## Check

With the static server running:

    node --check app.js
    node check.cjs http://127.0.0.1:8765

The check uses Node's assert module plus an already-installed Playwright browser driver. It first tries normal module resolution, then the existing npm cache. Override discovery with `PLAYWRIGHT_MODULE` and `CHROMIUM_PATH` if needed; no application dependencies are installed.

Checks: live binary help/defaults; full nine-mission browser playthrough; wrong answer and retry; task/answer gating; clipboard; hints; completion; reload; repeating without duplicate progress; reset cancellation and confirmation; invalid and disabled storage; mobile overflow; browser runtime errors. Screenshots go to TMPDIR or the Hermes scratch directory.

These checks verify the site and source-matched instructions, not the actions of a human in Herdr. No live Herdr session was inspected or controlled during construction.
