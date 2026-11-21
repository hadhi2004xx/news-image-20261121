// render.mjs — build entry.png from stories.json.
//
// Deterministic render pipeline: stories.json -> page.html -> headless
// Chromium screenshot at exactly 1024x1024 -> entry.png.
// Run:  node render.mjs
// Uses the fleet chromium-headless-shell binary (CHROME_PATH env or default).

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const CHROME =
  process.env.CHROME_PATH ??
  `${process.env.HOME}/workspace/ubh/tools/pw-browsers/chromium_headless_shell-1255/chrome-headless-shell-linux64/chrome-headless-shell`;

const data = JSON.parse(readFileSync(join(root, "stories.json"), "utf8"));
const leads = data.stories.filter((s) => s.role === "lead");
const grid = data.stories.filter((s) => s.role === "grid");

const esc = (t) =>
  t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const hhmm = (iso) => iso.slice(11, 16);

const leadHtml = leads
  .map(
    (s) => `
    <article class="lead">
      <div class="kicker">${esc(s.section)}</div>
      <h2>${esc(s.display)}</h2>
      <p class="deck">${esc(s.deck ?? "")}</p>
      <div class="tag">${esc(s.source)} · ${hhmm(s.published_utc)} UTC</div>
    </article>`
  )
  .join("");

const tileHtml = grid
  .map(
    (s) => `
    <article class="tile">
      <div class="kicker">${esc(s.section)}</div>
      <h3>${esc(s.display)}</h3>
      <div class="tag">${esc(s.source)} · ${hhmm(s.published_utc)} UTC</div>
    </article>`
  )
  .join("");

const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1024px; height: 1024px; overflow: hidden;
    background: #faf8f4; color: #14120e;
    font-family: Georgia, "Times New Roman", "DejaVu Serif", serif;
    padding: 26px 30px 18px;
  }
  .masthead { text-align: center; border-bottom: 4px double #14120e; padding-bottom: 10px; }
  .masthead h1 { font-size: 58px; letter-spacing: 1px; font-weight: 900; }
  .dateline {
    font-family: "DejaVu Sans Mono", monospace; font-size: 13px;
    letter-spacing: 3px; margin-top: 4px;
  }
  .leads { display: flex; gap: 22px; padding: 16px 0 12px; border-bottom: 2px solid #14120e; }
  .lead { flex: 1; }
  .lead + .lead { border-left: 1px solid #b9b2a4; padding-left: 22px; }
  .kicker {
    font-family: "DejaVu Sans Mono", monospace; font-size: 10px;
    letter-spacing: 2px; color: #8c1d18; font-weight: bold;
  }
  .lead h2 { font-size: 25px; line-height: 1.12; margin: 5px 0 6px; font-weight: 900; }
  .lead .deck { font-size: 13.5px; line-height: 1.32; color: #33302a; }
  .tag {
    font-family: "DejaVu Sans Mono", monospace; font-size: 9.5px;
    color: #6d675c; margin-top: 5px; letter-spacing: 0.5px;
  }
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); column-gap: 20px; margin-top: 10px; }
  .tile { border-top: 1px solid #c9c2b2; padding: 6px 0 5px; }
  .tile h3 { font-size: 14.5px; line-height: 1.16; font-weight: 700; margin: 2px 0 0; }
  .footer {
    border-top: 2px solid #14120e; margin-top: 8px; padding-top: 6px;
    font-family: "DejaVu Sans Mono", monospace; font-size: 10px;
    letter-spacing: 1px; text-align: center; color: #4c473e;
  }
</style></head><body>
  <header class="masthead">
    <h1>THE WORLD IN ONE PAGE</h1>
    <div class="dateline">SATURDAY · 21 NOVEMBER 2026 · ${data.count} STORIES · ALL TIMES UTC</div>
  </header>
  <section class="leads">${leadHtml}</section>
  <section class="grid">${tileHtml}</section>
  <footer class="footer">SOURCES: BBC · REUTERS · THE GUARDIAN · NPR · QNA · SKY &amp; TELESCOPE · ABNA · CHRONICLE NG — FULL CITATIONS IN STORIES.JSON</footer>
</body></html>`;

const pagePath = join(here, "page.html");
writeFileSync(pagePath, html);

const outPng = join(root, "entry.png");
execFileSync(CHROME, [
  "--headless",
  "--disable-gpu",
  "--no-sandbox",
  "--hide-scrollbars",
  "--force-device-scale-factor=1",
  "--window-size=1024,1024",
  `--screenshot=${outPng}`,
  `file://${pagePath}`,
]);
console.log(`rendered ${outPng}`);
