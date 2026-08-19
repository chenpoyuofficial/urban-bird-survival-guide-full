---
name: run-client
description: Start, build, and drive the client React/Vite web app (urban-bird-survival-guide-full). Use when asked to run the client, start the dev server, take a screenshot of a page or component, or interact with the running UI (click, fill a form, check a console error).
---

`client/` is a Vite + React SPA. Drive it by starting the dev server
and piping commands to the Playwright-based script at
`.claude/skills/run-client/driver.mjs` — this project has no
`chromium-cli`, so this driver is the substitute (same command
vocabulary: `nav`, `wait`, `screenshot`, `click`, `fill`, `eval`...).

All paths below are relative to `client/`.

## Prerequisites

`playwright` is already a devDependency (added for this skill) and its
Chromium build was already present in this environment — `npx
playwright install chromium` completed with no download needed. On a
machine without it cached, that command will fetch it.

## Setup

```bash
npm install
```

## Run (agent path)

Start the dev server in the background and wait for it to actually serve:

```bash
(npm run dev > /tmp/vite.log 2>&1 &)
timeout 30 bash -c 'until curl -sf http://localhost:5173 >/dev/null; do sleep 1; done'
```

Drive it by piping a script to the driver over stdin (this is a
one-shot script runner, not an interactive REPL — no tmux needed):

```bash
node .claude/skills/run-client/driver.mjs <<'EOF'
viewport 402 900
nav http://localhost:5173/board
wait text=推薦文章
wait-fonts
screenshot-viewport board-home
console-errors
EOF
```

Screenshots land in `.claude/skills/run-client/screenshots/`
(override with `SCREENSHOT_DIR`). Routes that exist right now: `/`
(placeholder), `/board`, `/login`, `/register`, `/dev/playground`
(component gallery — every `ui/`/`features/` component's states are
demoed here, useful as a first stop when a component itself, not a
full page, is what changed).

**Stop the server** before relaunching, or the next run hits
`EADDRINUSE`:

```bash
netstat -ano | grep ':5173.*LISTENING' | awk '{print $5}' | xargs -r -I{} taskkill //F //PID {}
```

### Driver commands

| command | what it does |
|---|---|
| `viewport <w> <h>` | open a fresh page at this viewport size (default if you skip straight to `nav`: 402×900, i.e. this project's mobile frame width) |
| `nav <url>` | go to a URL (launches the browser on first call) |
| `wait <sel>` | wait up to 10s for a selector; `text=foo` matches visible text, anything else is CSS |
| `wait-fonts` | wait on `document.fonts.ready` — see Gotchas, needed before most screenshots |
| `wait-ms <ms>` | plain timeout, fallback when there's nothing to poll for |
| `screenshot [name]` | full-page screenshot → `<name>.png` |
| `screenshot-viewport [name]` | viewport-only screenshot — **prefer this** on any page with a fixed header/nav (see Gotchas) |
| `click <sel>` | click first match (`text=` or CSS) |
| `fill <sel> <text>` | fill an input (goes through Playwright's real input pipeline, fires React's onChange) |
| `type <text>` | keyboard-type into whatever's focused |
| `press <key>` | keyboard press, e.g. `Enter` |
| `eval <js>` | `page.evaluate(js)`, prints JSON |
| `scroll <sel> <deltaX>` | nudge `el.scrollLeft` — for the horizontal-scroll 推薦文章 row etc. |
| `console-errors` | print any `console.error`/`pageerror` seen so far |
| `quit` | close the browser (also runs automatically at end of script) |

## Run (human path)

```bash
npm run dev   # → http://localhost:5173, Ctrl-C to stop
```

## Test

No test suite configured yet (no `test` script in `package.json`).
`npm run lint` runs oxlint.

## Gotchas

- **Full-page screenshots lie about fixed elements.** `screenshot`
  (fullPage) stitches `position: fixed` elements (this app's `Header`,
  `BottomNavBar`) at wherever they were during capture, making them
  look like they overlap content they don't actually overlap when
  scrolling in a real browser. Use `screenshot-viewport` for any page
  with a fixed header/nav — which is every page in this app.
- **`wait-fonts` matters here specifically.** This project's icons are
  a webfont (`material-symbols-outlined`) and its text is Noto Sans
  TC, both loaded async. A screenshot taken before `document.fonts.ready`
  can show literal fallback text instead of icon glyphs, or (this repo
  has `text-box-trim` active project-wide, see `index.css`) briefly
  render CJK characters with wrong-looking glyphs. Always
  `wait-fonts` before a screenshot that includes text or icons.
- **React controlled inputs need `fill`/`type`, not `eval ... .value = `.**
  Setting `.value` via `eval` bypasses React's `onChange` entirely —
  the component's state never updates even though the DOM shows the
  new text. `fill`/`type` go through Playwright's real input pipeline.
- **`EADDRINUSE` on relaunch.** `npm run dev &` backgrounds the npm
  wrapper, not the Vite process it spawns, and npm doesn't forward
  `Ctrl-C`/`SIGTERM` to children reliably — the port-kill one-liner
  above (via `netstat`/`taskkill`, this being Windows — there's no
  `lsof` here) is the actual way to free the port before restarting.

## Troubleshooting

- **`chromium launched OK` fails / browser not found**: run `npx
  playwright install chromium` from `client/`.
- **Driver prints `no page yet — run 'nav <url>' first`**: any command
  before the first `nav`/`viewport` call — reorder the script.
- **Port already in use starting the dev server**: see the `EADDRINUSE`
  gotcha above; find and kill the existing listener on 5173 first.
