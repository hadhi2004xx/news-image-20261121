// "The World in One Page" — make.fun entry for news-image-20261121.
//
// The deliverable of this competition is a single image: a broadsheet front
// page that sums up the world news of Saturday 21 November 2026. The image
// itself (entry.png, sitting next to this file) is the artifact; it was
// composed from 38 verified same-day stories listed in stories.json and
// rendered deterministically by the tooling in render/ (HTML -> headless
// Chromium screenshot). This program is the make.fun entrypoint: it copies
// the finished front page into the harness output directory, byte for byte,
// so repeated runs produce identical output.

import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const sourceImage = join(here, "entry.png");

// The harness sets MAKEFUN_OUTPUT_DIR; fall back to ./out for local runs.
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "out";
const targetImage = join(outputDir, "entry.png");

if (!existsSync(sourceImage)) {
  throw new Error(`entry.png not found next to main.ts (looked in ${here})`);
}

mkdirSync(outputDir, { recursive: true });
copyFileSync(sourceImage, targetImage);

console.log(`news-image-20261121: wrote ${targetImage}`);
