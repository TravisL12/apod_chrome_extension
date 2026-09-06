/**
 * Composes the raw captures into Chrome Web Store screenshots (exactly
 * 1280x800, which is what the store accepts). The raw PNGs are 2x, so they
 * downsample cleanly into the 1x canvas.
 */
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME =
  process.env.CHROME_PATH ||
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const RAW = path.resolve(__dirname, '../../.screenshot-cache');
const OUT = path.resolve(__dirname, '../screenshots');
const EXT = path.resolve(__dirname, '../../build');
const W = 1280, H = 800;

const fontFile = fs.readdirSync(EXT).find((f) => f.endsWith('.ttf'));
const FONT = fs.readFileSync(path.join(EXT, fontFile)).toString('base64');
const img = (n) => fs.readFileSync(path.join(RAW, n)).toString('base64');
const PROMO_BG = img('promo-bg.jpg');

const BASE = `
<style>
  @font-face { font-family: 'Montserrat'; src: url(data:font/ttf;base64,${FONT}) format('truetype'); }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { width: 100%; height: 100vh; overflow: hidden; background: #05070d;
         font-family: 'Montserrat', -apple-system, sans-serif; color: #fff; }
  .stage { position: relative; width: 100%; height: 100%; overflow: hidden; }
  .shot { position: absolute; inset: 0; background-size: cover; background-position: center; }
  .scrim { position: absolute; inset: 0; }
  .cap { display: inline-flex; align-items: center; justify-content: center;
         min-width: 34px; height: 34px; padding: 0 10px; border-radius: 8px;
         background: rgba(255,255,255,.94); color: #0a0e17; font-weight: 700;
         font-size: 15px; letter-spacing: .3px;
         box-shadow: 0 2px 0 rgba(0,0,0,.55), 0 6px 18px rgba(0,0,0,.45); }
  .cap.wide { font-size: 13px; }
  h1 { font-size: 52px; font-weight: 800; line-height: 1.08; letter-spacing: -1.2px;
       text-shadow: 0 4px 30px rgba(0,0,0,.85); }
  h2 { font-size: 38px; font-weight: 800; letter-spacing: -.8px;
       text-shadow: 0 4px 24px rgba(0,0,0,.85); }
  .sub { font-size: 20px; font-weight: 500; color: rgba(255,255,255,.86);
         text-shadow: 0 2px 16px rgba(0,0,0,.9); }
  .eyebrow { font-size: 13px; font-weight: 700; letter-spacing: 3.4px;
             text-transform: uppercase; color: #7fd4ff; }
</style>`;

const SHOTS = [
  {
    name: '1-hero',
    html: `<div class="stage">
      <div class="shot" style="background-image:url(data:image/png;base64,${img('01-hero.png')})"></div>
      <div class="scrim" style="background:linear-gradient(90deg,rgba(3,6,14,.94) 0%,rgba(3,6,14,.82) 34%,rgba(3,6,14,0) 62%)"></div>
      <div style="position:absolute;left:64px;top:196px;width:560px;display:flex;flex-direction:column;gap:22px">
        <div class="eyebrow">NASA Astronomy Picture of the Day</div>
        <h1>The universe,<br>every new tab.</h1>
        <div class="sub">Real NASA imagery and the astronomer-written story
          behind it &mdash; on the tab you already open a hundred times a day.</div>
        <div style="display:flex;gap:10px;align-items:center;margin-top:6px">
          <span class="cap">R</span><span class="cap">T</span><span class="cap">J</span>
          <span class="cap">K</span><span class="cap">E</span><span class="cap">F</span>
          <span style="font-size:15px;color:rgba(255,255,255,.72);margin-left:6px">
            Drive the whole thing from the keyboard</span>
        </div>
      </div>
    </div>`,
  },
  {
    name: '2-shortcuts',
    html: `<div class="stage">
      <div class="shot" style="background-image:url(data:image/png;base64,${img('06-shortcut-base.png')})"></div>
      <div class="scrim" style="background:rgba(4,7,15,.80)"></div>
      <div style="position:absolute;inset:0;padding:74px 64px 52px;display:flex;flex-direction:column">
        <div class="eyebrow" style="margin-bottom:12px">Built for the keyboard</div>
        <h2 style="margin-bottom:34px">Never touch the mouse</h2>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:26px 56px">
          ${[
            ['Explore', [['R', 'Jump to a random APOD'], ['T', "Back to today's picture"],
                         ['J', 'Previous day'], ['K', 'Next day']]],
            ['Panels', [['E', 'Read the explanation'], ['F', 'Open your favorites'],
                        ['H', 'Open your history'], ['ESC', 'Close the panel']]],
          ].map(([title, rows]) => `
            <div>
              <div style="font-size:12px;font-weight:700;letter-spacing:2.6px;text-transform:uppercase;
                          color:rgba(255,255,255,.5);margin-bottom:16px">${title}</div>
              ${rows.map(([k, label]) => `
                <div style="display:flex;align-items:center;gap:16px;padding:9px 0">
                  <span class="cap ${k.length > 1 ? 'wide' : ''}">${k}</span>
                  <span style="font-size:17px;font-weight:500;color:rgba(255,255,255,.94)">${label}</span>
                </div>`).join('')}
            </div>`).join('')}
        </div>
        <div style="margin-top:auto;display:flex;align-items:center;gap:16px;
                    border-top:1px solid rgba(255,255,255,.14);padding-top:22px">
          <span class="cap wide">&larr;</span><span class="cap wide">&rarr;</span>
          <span style="font-size:17px;font-weight:500;color:rgba(255,255,255,.94)">
            Step back through everything you have already seen</span>
        </div>
      </div>
    </div>`,
  },
  {
    name: '3-explanation',
    html: `<div class="stage">
      <div class="shot" style="background-image:url(data:image/png;base64,${img('02-explanation.png')})"></div>
      <div class="scrim" style="background:linear-gradient(180deg,rgba(3,6,14,.90) 0%,rgba(3,6,14,.30) 30%,rgba(3,6,14,0) 55%)"></div>
      <div style="position:absolute;left:64px;top:44px;width:520px;display:flex;flex-direction:column;gap:14px">
        <h2>The story behind<br>the picture</h2>
        <div class="sub" style="font-size:18px">Every APOD comes with NASA's own
          write-up. Press <b style="color:#fff">E</b> to read it without leaving the tab.</div>
      </div>
      <div style="position:absolute;left:64px;top:236px;display:flex;align-items:center;gap:14px">
        <span class="cap" style="min-width:44px;height:44px;font-size:19px">E</span>
        <span style="font-size:16px;font-weight:600;color:rgba(255,255,255,.8)">Explanation</span>
      </div>
    </div>`,
  },
  {
    name: '4-collections',
    html: `<div class="stage">
      <div class="shot" style="background-image:url(data:image/png;base64,${img('03-favorites.png')})"></div>
      <div class="scrim" style="background:linear-gradient(90deg,rgba(3,6,14,.96) 0%,rgba(3,6,14,.88) 26%,rgba(3,6,14,.10) 38%)"></div>
      <div style="position:absolute;left:56px;top:74px;width:372px;display:flex;flex-direction:column;gap:16px">
        <h2 style="font-size:34px">Keep the ones<br>that stopped you</h2>
        <div class="sub" style="font-size:17px;line-height:1.45">Save any image to
          Favorites, and search back through every APOD you have seen &mdash;
          all stored on your own machine.</div>
      </div>
      <div style="position:absolute;left:56px;top:352px;display:flex;flex-direction:column;gap:16px">
        ${[['F', 'Favorites'], ['H', 'History']].map(([k, l]) => `
          <div style="display:flex;align-items:center;gap:14px">
            <span class="cap" style="min-width:44px;height:44px;font-size:19px">${k}</span>
            <span style="font-size:16px;font-weight:600;color:rgba(255,255,255,.8)">${l}</span>
          </div>`).join('')}
      </div>
    </div>`,
  },
  {
    name: '5-options',
    html: `<div class="stage">
      <div class="shot" style="background-image:url(data:image/png;base64,${img('01-hero.png')});filter:blur(26px) brightness(.42);transform:scale(1.12)"></div>
      <div class="scrim" style="background:rgba(4,7,15,.55)"></div>
      <div style="position:absolute;left:64px;top:0;height:100%;width:560px;
                  display:flex;flex-direction:column;justify-content:center;gap:20px">
        <div class="eyebrow">Yours to tune</div>
        <h2>Set it up once<br>and forget it</h2>
        <div style="display:flex;flex-direction:column;gap:14px;margin-top:6px">
          ${['Today\'s picture, or a random one from 30 years of archive',
             'Force full HD, or fall back when the connection is slow',
             'Show or hide your top sites',
             'See today a few times, then roll on to something new']
            .map((t) => `<div style="display:flex;gap:13px;align-items:flex-start">
              <span style="color:#7fd4ff;font-size:17px;line-height:1.45">&#9679;</span>
              <span style="font-size:17px;font-weight:500;line-height:1.45;
                           color:rgba(255,255,255,.92)">${t}</span></div>`).join('')}
        </div>
      </div>
      <img src="data:image/png;base64,${img('05-options.png')}"
           style="position:absolute;right:56px;top:50%;transform:translateY(-50%);
                  height:700px;border-radius:14px;
                  box-shadow:0 30px 80px rgba(0,0,0,.7),0 0 0 1px rgba(255,255,255,.12)">
    </div>`,
  },
];


// Store promo tiles. The small tile is required for any featuring; the marquee
// is used on the store's front page.
const promo = (w, h, titleSize, subSize) => `
  <div class="stage" style="width:${w}px;height:${h}px">
    <div class="shot" style="background-image:url(data:image/jpeg;base64,${PROMO_BG});
         background-position:72% center"></div>
    <div class="scrim" style="background:linear-gradient(90deg,rgba(3,6,14,.95) 0%,rgba(3,6,14,.78) 40%,rgba(3,6,14,.05) 82%)"></div>
    <div style="position:absolute;inset:0;padding:0 ${Math.round(w * 0.07)}px;
                display:flex;flex-direction:column;justify-content:center;gap:${Math.round(h * 0.05)}px">
      <div style="font-size:${subSize}px;font-weight:700;letter-spacing:${(subSize * 0.18).toFixed(1)}px;
                  text-transform:uppercase;color:#7fd4ff">NASA Picture of the Day</div>
      <div style="font-size:${titleSize}px;font-weight:800;line-height:1.05;letter-spacing:-1px;
                  text-shadow:0 4px 26px rgba(0,0,0,.9)">The universe,<br>every new tab.</div>
    </div>
  </div>`;

const PROMOS = [
  { name: 'promo-small-440x280', w: 440, h: 280, html: promo(440, 280, 30, 10) },
  { name: 'promo-marquee-1400x560', w: 1400, h: 560, html: promo(1400, 560, 76, 17) },
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: 'new',
    defaultViewport: { width: W, height: H, deviceScaleFactor: 1 },
    args: ['--no-first-run', '--hide-scrollbars'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });

  for (const s of [...SHOTS, ...PROMOS]) {
    await page.setViewport({ width: s.w || W, height: s.h || H, deviceScaleFactor: 1 });
    await page.setContent(BASE + s.html, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({ path: path.join(OUT, `${s.name}.png`) });
    console.log('composed', s.name);
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
