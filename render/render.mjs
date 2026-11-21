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

const leadArt = [
  // Poland: missile trajectory arcing over a border line
  `<svg viewBox="0 0 300 44" width="100%" height="44"><path d="M8 40 Q 120 -30 236 30" fill="none" stroke="#8c1d18" stroke-width="2.5"/><path d="M236 30 l-14 1 M236 30 l-4 -13" stroke="#8c1d18" stroke-width="2.5" fill="none"/><line x1="0" y1="41" x2="300" y2="41" stroke="#14120e" stroke-width="2"/><circle cx="262" cy="36" r="4" fill="#8c1d18"/></svg>`,
  // Riyadh: defence dome over a skyline, interception burst
  `<svg viewBox="0 0 300 44" width="100%" height="44"><path d="M30 38 A 105 32 0 0 1 240 38" fill="none" stroke="#8c1d18" stroke-width="2.5"/><path d="M205 12 l3 7 7 1 -5 5 1 7 -6 -3 -6 3 1 -7 -5 -5 7 -1 z" fill="#8c1d18"/><rect x="96" y="26" width="12" height="12" fill="#14120e"/><rect x="116" y="18" width="12" height="20" fill="#14120e"/><rect x="136" y="28" width="12" height="10" fill="#14120e"/><rect x="156" y="22" width="10" height="16" fill="#14120e"/><line x1="0" y1="39" x2="300" y2="39" stroke="#14120e" stroke-width="2"/></svg>`,
  // COP31: globe with meridian lines
  `<svg viewBox="0 0 300 44" width="100%" height="44"><circle cx="150" cy="22" r="17" fill="none" stroke="#14120e" stroke-width="2"/><ellipse cx="150" cy="22" rx="7" ry="17" fill="none" stroke="#14120e" stroke-width="1.2"/><line x1="133" y1="22" x2="167" y2="22" stroke="#14120e" stroke-width="1.2"/><path d="M40 30 Q 90 6 128 18 M172 26 Q 220 40 262 14" fill="none" stroke="#8c1d18" stroke-width="2"/></svg>`,
];

const leadHtml = leads
  .map(
    (s, i) => `
    <article class="lead">
      <div class="art">${leadArt[i] ?? ""}</div>
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
      <div class="tilemeta"><span class="kicker">${esc(s.section)}</span><span class="tag">${esc(s.source)} · ${hhmm(s.published_utc)}</span></div>
      <h3>${esc(s.display)}</h3>
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
    padding: 22px 30px 14px;
  }
  .masthead { text-align: center; border-bottom: 4px double #14120e; padding-bottom: 8px; }
  .masthead h1 { font-size: 52px; letter-spacing: 1px; font-weight: 900; }
  .dateline {
    font-family: "DejaVu Sans Mono", monospace; font-size: 12.5px;
    letter-spacing: 3px; margin-top: 3px;
  }
  .leads { display: flex; gap: 20px; padding: 12px 0 10px; border-bottom: 2px solid #14120e; }
  .lead { flex: 1; }
  .lead + .lead { border-left: 1px solid #b9b2a4; padding-left: 20px; }
  .lead .art { margin-bottom: 4px; }
  .kicker {
    font-family: "DejaVu Sans Mono", monospace; font-size: 10px;
    letter-spacing: 1.5px; color: #8c1d18; font-weight: bold;
  }
  .lead h2 { font-size: 22.5px; line-height: 1.1; margin: 4px 0 5px; font-weight: 900; }
  .lead .deck { font-size: 12.5px; line-height: 1.3; color: #26231d; }
  .tag {
    font-family: "DejaVu Sans Mono", monospace; font-size: 9px;
    color: #6d675c; letter-spacing: 0.3px;
  }
  .lead .tag { display: block; margin-top: 4px; }
  .grid { columns: 3; column-gap: 22px; column-rule: 1px solid #d8d2c2; margin-top: 8px; }
  .tile { break-inside: avoid; border-top: 1px solid #c9c2b2; padding: 5px 0 4px; }
  .tilemeta { display: flex; justify-content: space-between; align-items: baseline; }
  .tile h3 { font-size: 14px; line-height: 1.14; font-weight: 700; margin-top: 1px; }
  .footer {
    border-top: 2px solid #14120e; margin-top: 6px; padding-top: 5px;
    font-family: "DejaVu Sans Mono", monospace; font-size: 9.5px;
    letter-spacing: 0.8px; text-align: center; color: #4c473e;
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
