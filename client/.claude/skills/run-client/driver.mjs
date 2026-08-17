// Non-interactive command driver for the client web app.
// Reads newline-separated commands from stdin, runs them in order against
// a headless Chromium page, prints one result line per command, then exits.
// Modeled on chromium-cli's command vocabulary so it's a drop-in mental
// model even though this project doesn't have chromium-cli available.
//
// Usage:
//   node .claude/skills/run-client/driver.mjs <<'EOF'
//   viewport 402 900
//   nav http://localhost:5173/board
//   wait text=推薦文章
//   wait-fonts
//   screenshot-viewport board-home
//   console-errors
//   EOF

import { chromium } from 'playwright'
import * as fs from 'node:fs'
import * as path from 'node:path'
import * as readline from 'node:readline'

const SHOT_DIR = process.env.SCREENSHOT_DIR || path.resolve('.claude/skills/run-client/screenshots')
fs.mkdirSync(SHOT_DIR, { recursive: true })

let browser = null
let page = null
const consoleErrors = []

function ensurePage() {
  if (!page) throw new Error('no page yet — run `nav <url>` first (it launches the browser automatically)')
  return page
}

function attachListeners(p) {
  p.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text())
  })
  p.on('pageerror', (err) => consoleErrors.push(err.message))
}

// chromium-cli style selector: "text=foo" matches by visible text,
// anything else is treated as a plain CSS selector.
function toLocator(p, sel) {
  if (sel.startsWith('text=')) return p.getByText(sel.slice(5))
  return p.locator(sel)
}

const COMMANDS = {
  async viewport(args) {
    const [w, h] = args.split(/\s+/).map(Number)
    if (!browser) browser = await chromium.launch()
    if (page) await page.close()
    const context = await browser.newContext({ viewport: { width: w, height: h } })
    page = await context.newPage()
    attachListeners(page)
    console.log(`viewport → ${w}x${h}`)
  },

  async nav(url) {
    if (!browser) browser = await chromium.launch()
    if (!page) {
      const context = await browser.newContext({ viewport: { width: 402, height: 900 } })
      page = await context.newPage()
      attachListeners(page)
    }
    await page.goto(url)
    console.log('nav →', url)
  },

  async wait(sel) {
    const p = ensurePage()
    try {
      await toLocator(p, sel).first().waitFor({ timeout: 10_000 })
      console.log('found:', sel)
    } catch {
      console.log('TIMEOUT:', sel)
    }
  },

  async 'wait-fonts'() {
    // Material Symbols / Noto Sans TC load async — screenshots taken before
    // they're ready show fallback-font text instead of icons, or (with
    // text-box-trim active) briefly-mangled CJK glyphs. Wait on this before
    // any screenshot that includes text or icons.
    const p = ensurePage()
    await p.evaluate(() => document.fonts.ready)
    console.log('fonts ready')
  },

  async 'wait-ms'(ms) {
    await new Promise((r) => setTimeout(r, Number(ms)))
    console.log('waited', ms, 'ms')
  },

  async screenshot(name) {
    const p = ensurePage()
    const f = path.join(SHOT_DIR, (name || `ss-${Date.now()}`) + '.png')
    await p.screenshot({ path: f, fullPage: true })
    console.log('screenshot (full page):', f)
  },

  async 'screenshot-viewport'(name) {
    // Prefer this over `screenshot` for any page with position:fixed
    // elements (Header, BottomNavBar). Playwright's fullPage screenshot
    // stitches fixed elements at their initial scroll position, making
    // them look like they overlap content they don't actually overlap
    // in a real browser. Confirmed this the hard way on the Board page.
    const p = ensurePage()
    const f = path.join(SHOT_DIR, (name || `ss-${Date.now()}`) + '.png')
    await p.screenshot({ path: f, fullPage: false })
    console.log('screenshot (viewport only):', f)
  },

  async click(sel) {
    const p = ensurePage()
    await toLocator(p, sel).first().click()
    console.log('click →', sel)
  },

  async fill(args) {
    const p = ensurePage()
    const spaceIdx = args.indexOf(' ')
    const sel = args.slice(0, spaceIdx)
    const value = args.slice(spaceIdx + 1)
    await toLocator(p, sel).first().fill(value)
    console.log('fill', sel, '→', JSON.stringify(value))
  },

  async type(text) {
    // Use this (not `eval el.value = ...`) for React controlled inputs —
    // setting .value directly skips React's onChange handler entirely.
    const p = ensurePage()
    await p.keyboard.type(text, { delay: 20 })
    console.log('typed:', text)
  },

  async press(key) {
    const p = ensurePage()
    await p.keyboard.press(key)
    console.log('pressed:', key)
  },

  async eval(expr) {
    const p = ensurePage()
    const result = await p.evaluate(expr)
    console.log(JSON.stringify(result))
  },

  async scroll(args) {
    // scroll <selector> <deltaX> — nudges el.scrollLeft, for verifying
    // horizontal-scroll sections (e.g. the 推薦文章 row) without simulating
    // a real mouse drag.
    const p = ensurePage()
    const [sel, dx] = args.split(/\s+/)
    const result = await toLocator(p, sel).first().evaluate((el, d) => {
      el.scrollLeft += Number(d)
      return el.scrollLeft
    }, dx)
    console.log('scrollLeft now:', result)
  },

  async 'console-errors'() {
    console.log(consoleErrors.length === 0 ? 'no console errors' : JSON.stringify(consoleErrors, null, 2))
  },

  async quit() {
    if (browser) await browser.close().catch(() => {})
    browser = null
    page = null
  },
}

async function run() {
  const rl = readline.createInterface({ input: process.stdin, terminal: false })
  for await (const rawLine of rl) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const spaceIdx = line.indexOf(' ')
    const cmd = spaceIdx === -1 ? line : line.slice(0, spaceIdx)
    const arg = spaceIdx === -1 ? '' : line.slice(spaceIdx + 1)
    const fn = COMMANDS[cmd]
    if (!fn) {
      console.log('unknown command:', cmd)
      continue
    }
    try {
      await fn(arg)
    } catch (e) {
      console.log('ERROR:', e.message)
    }
  }
  await COMMANDS.quit()
}

run()
