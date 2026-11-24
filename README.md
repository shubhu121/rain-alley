# 雨の横丁 / Rain Alley

A 40-second night rain study of a real-time WebGL Shinjuku alley, cut frame-exactly from the
scene itself. Nothing is rebuilt, redrawn or faked: every frame in the film is the actual page
render, captured 1:1 through the page's own deterministic still mode.

- **Film** — 1920 × 1080, 30 fps, 40.0 s, image area 1920 × 804 (2.39:1) inside black bars
- **Source** — [`index.html`](index.html), a single-file WebGL 2 scene (procedural shops, signs,
  rain, steam, reflections). Open it in any WebGL 2 browser: drag to look, space to pause,
  `#t=<seconds>` for an exact frame.
- **Edit** — [`rain-alley/`](rain-alley/), a [HyperFrames](https://hyperframes.heygen.com) project

## The cut

Nine takes, cut end to end, no transitions. Each shot's only move is the walk the page already
does (0.91 m/s at 1.58 m eye height); the camera's head turns are the page's own drag-look.

| # | shot      | film time   | reads                                       |
|---|-----------|-------------|---------------------------------------------|
| 1 | poster    | 0.0 – 4.4   | the lane at rest, two lanterns, rain        |
| 2 | lantern   | 4.4 – 9.4   | a 麺 lantern passes overhead                |
| 3 | arch      | 9.4 – 13.8  | wet road, 花園横丁, the umbrella 20 m on     |
| 4 | steam     | 13.8 – 17.8 | steam against a shutter                     |
| 5 | colour    | 17.8 – 22.2 | スナック 澪 pink against 純喫茶 cyan          |
| 6 | shutters  | 22.2 – 26.2 | closed shops, the vending machine           |
| 7 | wide      | 26.2 – 30.6 | 夜の澪, おでん, the bicycle                   |
| 8 | longview  | 30.6 – 35.0 | the lane receding, the walk continues       |
| 9 | card      | 35.0 – 40.0 | the same take continues under the title     |

Shot 8 and 9 are the same source time in the same place, so the film keeps walking under its own
title; shot 1 and shot 9 are the same spot one world-loop apart.

## Rebuild it

```bash
cd rain-alley
npm i -D puppeteer-core                      # capture driver; node_modules is git-ignored
node tools/bake.mjs                          # bakes all 9 takes into assets/footage/
node tools/bake.mjs --only steam             # or one shot (see tools/shots.json)
```

`tools/bake.mjs` drives the page at `#t=<seconds>`, sets the look offset the way a visitor drags
(yaw = −dx · 0.0032, pitch = +dy · 0.0028) and encodes each take all-intra so the renderer can
seek it frame-exactly. It needs Chrome and FFmpeg on the PATH (`CHROME_PATH` overrides Chrome).

Preview, check and render:

```bash
cd rain-alley
npx hyperframes@0.9.91 preview               # Studio at http://127.0.0.1:3002
npx hyperframes@0.9.91 check                 # lint + runtime + layout + contrast
npx hyperframes@0.9.91 render --quality delivery --output out/rain-alley.mp4
```

`out/`, `node_modules/` and `.hyperframes/` are git-ignored, so the delivery MP4 is not committed
(172 MB); render it with the command above.

## Where things are

| Path | What |
| --- | --- |
| `index.html` | the scene: WebGL 2, all textures, signs and audio-free |
| `rain-alley/index.html` | root composition (40 s, scene hosts, rain bed, duck) |
| `rain-alley/compositions/alley.html` | the nine takes, one clip each |
| `rain-alley/compositions/endcard.html` | the title lockup and its neon-tube strike |
| `rain-alley/assets/footage/` | baked takes, 1920 × 804, all-intra H.264 |
| `rain-alley/assets/audio/` | rain bed (built by `tools/rain.filter`), vent hiss |
| `rain-alley/SPEC.md` | the brief: numbers, shot list, banned defaults |
| `rain-alley/STORYLINES.md` | the three storylines, and which was picked |
| `rain-alley/REVIEW.md` | measured vs. looked at, weakest shot, kept warnings |

## Credits

- Scene and film by [@shubhu121](https://github.com/shubhu121).
- “Steam/hiss” by **wubitog**, CC0 1.0 — [freesound.org/s/234782](https://freesound.org/people/wubitog/sounds/234782), via Openverse.
- Title face: **Noto Serif JP** (SIL Open Font License), subset to 雨の横丁.
- Built with [HyperFrames](https://hyperframes.heygen.com).
