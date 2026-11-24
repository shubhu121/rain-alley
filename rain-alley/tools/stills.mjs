// Scouts framings of the alley: renders one still per "t:yaw:pitch" entry.
import puppeteer from "puppeteer-core";
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
const DIR = resolve(HERE, "..", arg("dir", "assets/footage/scout"));
const SHOTS = arg("shots", "0:0:0")
  .split(",")
  .map((s) => {
    const [t, yaw, pitch] = s.split(":").map(Number);
    return { t, yaw: yaw || 0, pitch: pitch || 0 };
  });
const W = Number(arg("width", "1920"));
const H = Number(arg("height", "804"));
const CAP = Number(arg("cap", "1920"));

const source = readFileSync(SRC, "utf8");
const patched = source.replace("1770/aw,1160/ah", `${CAP}/aw,${Math.round((CAP * H) / W)}/ah`);
const dir = join(tmpdir(), "alley-capture");
mkdirSync(dir, { recursive: true });
const copy = join(dir, `alley-${CAP}-${H}.html`);
writeFileSync(copy, patched);
mkdirSync(DIR, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: true,
  args: ["--enable-gpu", "--use-angle=d3d11", "--ignore-gpu-blocklist", "--hide-scrollbars", "--mute-audio"],
});
const page = await browser.newPage();
await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
await page.evaluateOnNewDocument(() => {
  window.__frames = 0;
  const proto = WebGL2RenderingContext.prototype;
  const drawArrays = proto.drawArrays;
  proto.drawArrays = function (mode, first, count) {
    const r = drawArrays.call(this, mode, first, count);
    if (count === 3 && mode === this.TRIANGLES) {
      try {
        if (this.getParameter(this.FRAMEBUFFER_BINDING) === null) window.__frames++;
      } catch {}
    }
    return r;
  };
});
await page.goto(`${pathToFileURL(copy).href}#t=${SHOTS[0].t}`, { waitUntil: "load", timeout: 120000 });
await page.addStyleTag({ content: "#controls{display:none!important}" });
await page.waitForSelector("#status[hidden]", { timeout: 180000 });

async function awaitFrame(before) {
  await page.waitForFunction((n) => window.__frames > n, { timeout: 120000, polling: 16 }, before);
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r(null)))));
}

async function look(yaw, pitch) {
  // The page resets its aim on Escape, so each scout starts from dead ahead.
  await page.keyboard.press("Escape");
  await new Promise((r) => setTimeout(r, 900));
  if (!yaw && !pitch) return;
  // Drive the page's own drag-look: yaw = -dx * 0.0032, pitch = +dy * 0.0028.
  const cx = 960,
    cy = 402;
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  await page.mouse.move(cx - yaw / 0.0032, cy + pitch / 0.0028, { steps: 4 });
  await page.mouse.up();
  await new Promise((r) => setTimeout(r, 1600));
}

let index = 0;
for (const shot of SHOTS) {
  await look(shot.yaw, shot.pitch);
  const before = await page.evaluate((tt) => {
    // A distinct string each time: an unchanged hash does not re-render.
    location.hash = `#t=${tt.toFixed(4)}`;
    return window.__frames;
  }, shot.t + index * 0.0001);
  await awaitFrame(before);
  const shotBuf = await page.screenshot({ type: "png", captureBeyondViewport: false });
  const name = `${String(index).padStart(2, "0")}_t${shot.t}_y${shot.yaw}_p${shot.pitch}.png`;
  writeFileSync(join(DIR, name), shotBuf);
  console.log(name);
  index++;
}
await browser.close();
