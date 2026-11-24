// Bakes the film's shots from ../../index.html (the rain alley WebGL scene).
// Each shot is a contiguous run of the page's deterministic #t=<seconds> still
// mode with a look offset driven the way a visitor drags: yaw = -dx*0.0032,
// pitch = +dy*0.0028. Every shot lands as its own all-intra MP4.
import puppeteer from "puppeteer-core";
import { spawn } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? fallback : process.argv[i + 1];
};
const SRC = resolve(HERE, "../../index.html");
const PLAN = JSON.parse(readFileSync(resolve(HERE, "shots.json"), "utf8"));
const OUTDIR = resolve(HERE, "..", arg("dir", "assets/footage"));
const CAP = Number(arg("cap", "1920"));
const W = PLAN.width,
  H = PLAN.height,
  FPS = PLAN.fps;
const ONLY = arg("only", "")
  .split(",")
  .filter(Boolean);
const STILLS = arg("stills", "") === "1";
const CRF = arg("crf", "11");
const CHROME = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

mkdirSync(OUTDIR, { recursive: true });

// The page caps its internal render at 1770 px wide. For a 1:1 capture at 1920
// the cap is raised in a generated copy; the scene itself is untouched.
const source = readFileSync(SRC, "utf8");
const patched = source.replace("1770/aw,1160/ah", `${CAP}/aw,${Math.round((CAP * H) / W)}/ah`);
if (patched === source) throw new Error("resolution cap string not found; page changed");
const copyDir = join(tmpdir(), "alley-capture");
mkdirSync(copyDir, { recursive: true });
const copy = join(copyDir, `alley-${CAP}-${H}.html`);
writeFileSync(copy, patched);

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  protocolTimeout: 900000,
  args: [
    "--enable-gpu",
    "--use-angle=d3d11",
    "--ignore-gpu-blocklist",
    "--hide-scrollbars",
    "--mute-audio",
    "--disable-background-timer-throttling",
    "--disable-renderer-backgrounding",
    "--disable-backgrounding-occluded-windows",
  ],
});
const page = await browser.newPage();
await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });

await page.evaluateOnNewDocument(() => {
  window.__frames = 0;
  const proto = WebGL2RenderingContext.prototype;
  const drawArrays = proto.drawArrays;
  proto.drawArrays = function (mode, first, count) {
    const result = drawArrays.call(this, mode, first, count);
    if (count === 3 && mode === this.TRIANGLES) {
      try {
        if (this.getParameter(this.FRAMEBUFFER_BINDING) === null) window.__frames++;
      } catch {}
    }
    return result;
  };
});

const t0 = Date.now();
await page.goto(`${pathToFileURL(copy).href}#t=${PLAN.shots[0].t}`, { waitUntil: "load", timeout: 120000 });
await page.addStyleTag({ content: "#controls{display:none!important}" });
await page.waitForSelector("#status[hidden]", { timeout: 180000 });
const info = await page.evaluate(() => {
  const gl = document.querySelector("#scene").getContext("webgl2");
  const dbg = gl.getExtension("WEBGL_debug_renderer_info");
  return {
    renderer: dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : "?",
    canvas: [document.querySelector("#scene").width, document.querySelector("#scene").height],
  };
});
console.log(`ready in ${Date.now() - t0} ms · ${info.renderer} · canvas ${info.canvas.join("x")}`);

async function nextFrame(before) {
  await page.waitForFunction((n) => window.__frames > n, { timeout: 180000, polling: 16 }, before);
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r(null)))));
}

async function setLook(yaw, pitch) {
  await page.keyboard.press("Escape");
  await new Promise((r) => setTimeout(r, 900));
  if (!yaw && !pitch) return;
  const cx = W / 2,
    cy = H / 2;
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  await page.mouse.move(cx - yaw / 0.0032, cy + pitch / 0.0028, { steps: 5 });
  await page.mouse.up();
  await new Promise((r) => setTimeout(r, 1500));
}

let serial = 0;
for (const shot of PLAN.shots) {
  if (ONLY.length && !ONLY.includes(shot.id)) continue;
  const frames = Math.round(shot.duration * FPS);
  const out = join(OUTDIR, `${shot.id}.mp4`);
  await setLook(shot.yaw, shot.pitch);

  const ffmpeg = spawn(
    "ffmpeg",
    [
      "-y", "-hide_banner", "-loglevel", "error",
      "-f", "image2pipe", "-framerate", String(FPS), "-i", "-",
      "-c:v", "libx264", "-preset", "slow", "-crf", CRF, "-pix_fmt", "yuv420p",
      "-g", "1", "-movflags", "+faststart", out,
    ],
    { stdio: ["pipe", "inherit", "inherit"] },
  );
  const done = new Promise((res, rej) =>
    ffmpeg.on("close", (code) => (code === 0 ? res() : rej(new Error(`ffmpeg exited ${code}`)))),
  );

  const begin = Date.now();
  for (let i = 0; i < frames; i++) {
    const t = shot.t + i / FPS;
    const before = await page.evaluate((tt) => {
      location.hash = `#t=${tt.toFixed(4)}`;
      return window.__frames;
    }, t + (serial + 1) * 1e-7);
    await nextFrame(before);
    const png = await page.screenshot({ type: "png", optimizeForSpeed: true, captureBeyondViewport: false });
    if (STILLS && (i === 0 || i === frames - 1)) {
      writeFileSync(join(OUTDIR, `${shot.id}-${i === 0 ? "in" : "out"}.png`), png);
    }
    if (!ffmpeg.stdin.write(png)) await new Promise((r) => ffmpeg.stdin.once("drain", r));
  }
  ffmpeg.stdin.end();
  await done;
  serial++;
  const per = (Date.now() - begin) / frames;
  console.log(`${shot.id.padEnd(9)} ${frames} f · ${shot.duration}s · ${per.toFixed(0)} ms/frame · ${((Date.now() - begin) / 1000).toFixed(1)} s`);
}

await browser.close();
console.log("done");
