# SPEC — 「雨の横丁」 / Rain Alley, a night rain study

GOAL: the viewer stops thinking "web page" and watches a wet Tokyo lane, then the end card tells
them it is a real-time walk they can steer — the stillness of a photograph that turns out to be alive.

OUTPUT: HyperFrames, 1920 × 1080, 30 fps. Image is 1920 × 804 (2.39:1) at y = 138; bars #000000
above and below. Source footage: the real scene, captured 1:1 from `index.html#t=<seconds>`.

TIME: 40.0 s × 30 = 1200 frames. No music, so the rain is the clock: cuts land on phrasing of the
storm, not on a beat grid. Sound bed 44 s (4 s tail past the picture for the fade).

LOOK:
- ground: #000000 bars, no texture.
- ink: #f0eee5 (the page's own text colour), at 100 % for the title, 72 % for the place line,
  52 % for the credit line.
- accent: #ff462d — permitted only inside the footage (the らーめん lantern and the 中華そば sign).
  Never in type.
- display: Noto Serif JP 400, 104 px, line-height 1.0, tracking 0.14 em, ink #f0eee5.
- body: Inter 500, 22 px, tracking 0.30 em, uppercase; credit Inter 400, 16 px, tracking 0.14 em.
- medium: a night photograph of a real-time scene. 2.39:1, 24 mm field (the page's own 53° vertical
  FOV), camera height 1.58 m, walk 0.91 m/s.
- light: the scene's own — cyan shop interiors 5600 K, sodium lanterns 2200 K, sky #0a1a20.
- grade (media-treatment, on every shot): exposure +0.08, contrast +0.16, highlights −0.12,
  shadows −0.05, blacks −0.12, temperature −0.07, vibrance +0.12, saturation −0.05.
- depth: vignette 22 % (midpoint 0.5, feather 0.7); grain 9 % size 0.32 roughness 0.55.
- type plate: the page's own bottom gradient, `rgba(2,6,9,.62)` at the bottom edge to 0 at 58 % of
  the image height, only under the end card.

OBJECTS: a paper lantern (ribbed, warm, its kanji reversed through the paper); wet asphalt that
carries every sign as a vertical smear; rain seen against light, not against dark; a vending
machine as the only cold white source; a figure with an umbrella, never nearer than 20 m; steam
from a vent, lit from below.

MOTION:
- cuts only, no transitions, no opacity blends between shots. 9 shots, 4.0–5.0 s each.
- each shot's one move is the walk itself (0.91 m/s forward, 0.016 s of head-sway per stride);
  the camera never pushes, zooms or drifts on top of it.
- no two consecutive shots at the same framing scale: close (lantern) → wide (arch) → close
  (steam) → wide (colour) → wide-low (shutters) → wide (夜の澪) → deep (long view) → wide (card).
- end card, in card-local time (card starts 35.0):
  - 0.25 → 0.62: hairline rule, scaleX 0 → 1, origin left, power2.out (11 frames).
  - 0.40: title strike — opacity 0 → 0.55 (1 frame) → 0.18 (2 frames) → 1.00 (3 frames); the 14 px
    rise finishes at 0.55 and stops. No drift afterwards.
  - 0.72 → 1.10: place line 0 → 0.72.
  - 1.30 → 1.80: credit line 0 → 0.52.
  - 3.4 → 5.0: nothing moves but the walk; the rain ducks 3 dB at 0.0 and returns at 4.6.

SHOTS (film time → source):
| # | shot      | film s      | frames    | source t  | look yaw/pitch | reads                                  |
|---|-----------|-------------|-----------|-----------|----------------|----------------------------------------|
| 1 | poster    | 0.0 – 4.4   | 0 – 132   | 0.0       | 0 / 0          | the lane at rest, two lanterns, rain    |
| 2 | lantern   | 4.4 – 9.4   | 132 – 282 | 38.6      | 0 / +0.10      | a 麺 lantern passes overhead            |
| 3 | arch      | 9.4 – 13.8  | 282 – 414 | 12.8      | 0 / −0.34      | wet road, 花園横丁, the umbrella 20 m on |
| 4 | steam     | 13.8 – 17.8 | 414 – 534 | 44.6      | +0.28 / −0.10  | steam against a shutter                 |
| 5 | colour    | 17.8 – 22.2 | 534 – 666 | 59.6      | −0.40 / +0.10  | スナック 澪 pink against 純喫茶 cyan     |
| 6 | shutters  | 22.2 – 26.2 | 666 – 786 | 8.6       | 0 / −0.36      | closed shops, the vending machine       |
| 7 | wide      | 26.2 – 30.6 | 786 – 918 | 27.4      | 0 / +0.08      | 夜の澪, おでん, the bicycle              |
| 8 | longview  | 30.6 – 35.0 | 918 – 1050| 65.6      | 0 / +0.05      | the lane receding, the walk continues   |
| 9 | card      | 35.0 – 40.0 | 1050 – 1200| 70.0     | 0 / +0.05      | the walk, the title lands               |

SOUND: rain only. A 44 s stereo bed built from decorrelated noise (air 450 Hz–10 kHz, body
150 Hz–2.8 kHz, rumble < 110 Hz) with 0.07/0.23 Hz gusts, −20 LUFS; one recorded steam hiss at
13.9 s for 3 s; the bed ducks 3 dB under the card. No music bed (no library or local model here).

BANNED: a black void with small elements; glow, particles, lens flare; purple-blue gradients;
cream paper + serif + numbered labels; centred titles; every element fading and sliding up;
titles that keep drifting after they land; corner labels, HUD, frame borders; three cards in a row;
a docked logo; a title over a fully dimmed still; VHS/8 mm pastiche; a fake push-in on the footage;
words anywhere before 35 s.

QA: frame 0 (poster, two lanterns, readable as a thumbnail), 130 (lantern overhead, top-left),
282 (arch + umbrella), 414 (steam visible right of centre), 534 (pink left, cyan right),
666 (road foreground, shutters), 786 (bicycle right, 夜の澪), 918 (deep view), 1050 (card begins,
no type yet), 1100 (title at full opacity, no motion), 1195 (final frame, type held).
