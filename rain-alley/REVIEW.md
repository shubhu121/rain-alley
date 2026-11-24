# REVIEW — 「雨の横丁」 / Rain Alley

40.0 s · 1920×1080 · 30 fps · image 1920×804 (2.39:1) inside black bars.

## What it is

A night rain study cut from the real `../index.html` scene. Every frame is the actual WebGL
render, captured 1:1 from the page's own deterministic still mode (`#t=<seconds>`), with the
camera's look offsets driven the way a visitor drags the canvas. No shot is rebuilt, redrawn or
faked; the page's own signs, lanterns, rain, steam, walker and reflections are the footage.

## Creative calls

- **Nine shots, cuts only, no transitions** — 4.0–5.0 s each, cut end to end.
- **The camera never pushes.** The only move is the walk the page already does (0.91 m/s), so the
  film shows the scene as it behaves, not as a trailer would stage it.
- **2.39:1 inside 138 px bars** — the scene reads as photography; the bars also remove the page's
  own UI chrome from frame.
- **One grade, applied with `media-treatment` to every shot**: exposure +0.08, contrast +0.16,
  highlights −0.12, shadows −0.05, blacks −0.12, temperature −0.07, vibrance +0.12,
  saturation −0.05, vignette 22 %, grain 9 %.
- **The end card quotes the page, it does not invent a look**: the same bottom gradient the page
  uses for its controls, the same Mincho/sans pairing (Noto Serif JP 104 px + Inter 28 px), the
  same words the page's own aria-label uses ("drag to look", "space pauses the walk"). The title
  strikes like one of the alley's neon tubes — on, a dip, on — then holds.
- **The last take does not cut at the title.** `longview` (30.6–35.0) and `card` (35.0–40.0) are
  the same source time in the same place, so the film keeps walking under its own title.
- **Bookend:** `poster` (t=0) and `card` (t=70) are the same spot one world-loop apart.

Storylines **A (one take, one walk)** and **B (three lights, three acts)** were written and offered
(see `STORYLINES.md`); C was picked.

## Measured vs looked at

- `check --json`: 0 errors. Contrast audit: 3 text elements sampled, 3 passed. Layout: 0 issues.
- Every shot's in/out frame and every cut (±0.07 s) was rendered and looked at, not inferred:
  no black or blank frame at a cut, no jump in grade.
- Sound was **measured, not heard**: the rain bed is −19.0 LUFS integrated, true peak −11.4 dBTP;
  the steam hiss is 2.55 s, cut to a 2.5 s slot at 13.95 s with fades.
- Phone-width beats (360 px) were checked: the title reads, the credit line does not — it is
  texture, and is marked `data-layout-ignore`.

## Weakest shot

`shutters` (22.2–26.2, source t=8.6, pitch −0.36). It is the third wide in a row and the least
distinctive stretch of the alley — it earns its place by showing the closed shops and the cold
white vending machine, but the film would gain from a tighter register there. The scene's camera
can only rotate (yaw ±0.70, pitch −0.36…+0.44) and walk; it cannot dolly in, so a true close-up
needs a capture-side crop past 1:1 (softer) or a change to the page itself. With more time: scout
a two-shot of the 純喫茶 sign with the road out of focus, or accept a 1.3× crop for one beat.

## Warnings kept on purpose

- 7 × `nested_media_start_basis_ambiguous` on the shot clips: the timing is composition-local and
  intended; the shots are cut inside one scene so the whole film stays a single track in Studio.
- `#card-credit` is 18 px, under the 28 px type floor: it is a technical credit, not reading copy,
  and is marked `data-layout-ignore`.

## Sound

No music: there is no library available here (no HeyGen sign-in, no local model). The film is
scored by rain instead —

- `assets/audio/rain-bed.wav` (44 s): three decorrelated noise layers per channel (air 450 Hz–10 kHz,
  body 150 Hz–2.8 kHz, street < 110 Hz) with 0.11/0.29 Hz gusts, faded in 0.8 s, out 1.8 s, and
  ducked 3 dB under the end card by a `data-automation` lane.
- `assets/audio/steam-hiss.mp3`: a real recorded vent hiss (Openverse, adopted through
  `media-use resolve`), played once as the steam passes at 13.95 s.

To add a track later, drop it on a new root `<audio>` at `data-volume="0.35"` — the rain is mixed
to sit under a bed.

## How the footage is remade

`tools/bake.mjs` + `tools/shots.json`: each shot is a `#t=` run of the page at 1920×804 1:1
(the page's internal 1770 px cap is raised in a generated copy), encoded all-intra H.264 so the
renderer can seek exactly. `tools/rain.filter` regenerates the bed. Re-bake one shot with
`node tools/bake.mjs --only <id>`.
