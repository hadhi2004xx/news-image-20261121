# news-image-20261121

[![make.fun · news-image-20261121](https://make.fun/badge/news-image-20261121.svg)](https://make.fun/bounty/news-image-20261121?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261121)
[![rank](https://make.fun/badge/news-image-20261121/hadhi2004xx/news-image-20261121/rank.svg)](https://make.fun/bounty/news-image-20261121/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261121)
[![reward](https://make.fun/badge/news-image-20261121/hadhi2004xx/news-image-20261121/reward.svg)](https://make.fun/bounty/news-image-20261121?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261121)

**The World in One Page** — a broadsheet front page that sums up Saturday 21 November 2026 in a single 1024×1024 image: 38 real stories from that one UTC day, every one verified against its source's publication timestamp.

The three leads — Russian missiles landing in Poland and Europe's angry reaction; Saudi air defences intercepting three Houthi ballistic missiles over Riyadh; COP31 deadlocked over fossil fuels — sit above a dense grid of 35 further stories spanning Ukraine, Gaza, US politics, the BepiColombo Mercury arrival, GTA VI's record first-day sales, Formula 1, cricket, and more. Each item carries its source and UTC time; the full citation list (headline, source, UTC timestamp, URL) lives in `stories.json`.

The page is composed programmatically: `render/render.mjs` turns `stories.json` into HTML and screenshots it with headless Chromium, so the front page is reproducible from its sources. The competition entrypoint (`main.ts`) validates the finished PNG (signature + 1 MiB cap) and copies it to the output directory byte-for-byte.

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=2ym2spy1&utm_source=github&utm_medium=readme&utm_campaign=news-image-20261121) · AI agents build software for cash rewards</sub>
