/**
 * Screenshots the extension's real production bundle (build/) for the Chrome
 * Web Store listing. Chrome 152 refuses --load-extension in headless, so the
 * bundle is served over http with a thin chrome.* shim instead: the rendered
 * UI is the shipped code, only storage/topSites/favicon are stubbed.
 */
const puppeteer = require('puppeteer-core');
const http = require('http');
const path = require('path');
const fs = require('fs');

const CHROME =
  process.env.CHROME_PATH ||
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const EXT = path.resolve(__dirname, '../../build');
const OUT = path.resolve(__dirname, '../../.screenshot-cache');
const PORT = 8977;
const W = 1280, H = 800;

const SEED = JSON.parse(fs.readFileSync(path.join(__dirname, 'seed.json'), 'utf8'));
const HERO = SEED.hero;

const FAVES = Object.fromEntries(
  SEED.entries.slice(1, 9).map((d) => [d.date, { date: d.date, title: d.title, url: d.url, imgUrl: d.url }])
);

const now = Date.now();
const HIST = SEED.entries.filter((d) => d.date !== HERO.date).map((d, i) => ({
  date: d.date, title: d.title, url: d.url, mediaType: d.media_type,
  dateAdded: now - i * 3600000,
}));

const TOP_SITES = [
  'https://mail.google.com/', 'https://github.com/', 'https://news.ycombinator.com/',
  'https://www.youtube.com/', 'https://en.wikipedia.org/', 'https://apod.nasa.gov/',
  'https://www.reddit.com/', 'https://maps.google.com/',
].map((url) => ({ url, title: new URL(url).hostname.replace(/^www\./, '') }));

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.png': 'image/png', '.gif': 'image/gif', '.ttf': 'font/ttf', '.json': 'application/json' };

// Neutral letter tiles stand in for Chrome's favicon cache, which only exists
// behind a real chrome-extension:// origin.
const TILE_COLORS = ['#4f7cff', '#e2574c', '#f0a53a', '#3fb27f', '#9b5de5', '#2ec4d6', '#ef6a9e', '#7a869a'];
const faviconSvg = (pageUrl) => {
  const host = (() => { try { return new URL(pageUrl).hostname.replace(/^www\./, ''); } catch { return '?'; } })();
  const letter = host[0] ? host[0].toUpperCase() : '?';
  let h = 0;
  for (const c of host) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const bg = TILE_COLORS[h % TILE_COLORS.length];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="7" fill="${bg}"/>
  <text x="16" y="22" font-family="Helvetica,Arial,sans-serif" font-size="17" font-weight="600"
        fill="#fff" text-anchor="middle">${letter}</text></svg>`;
};

const server = http.createServer((req, res) => {
  const u = new URL(req.url, `http://localhost:${PORT}`);
  if (u.pathname === '/_favicon/') {
    res.writeHead(200, { 'Content-Type': 'image/svg+xml' });
    return res.end(faviconSvg(u.searchParams.get('pageUrl') || ''));
  }
  const file = path.join(EXT, u.pathname === '/' ? 'newtab.html' : u.pathname);
  if (!file.startsWith(EXT) || !fs.existsSync(file)) { res.writeHead(404); return res.end('nope'); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Landscape, high-resolution, and unmistakably space -- the promo tiles crop a
// band out of it, so it needs far more pixels than a 1280x800 UI capture has.
const PROMO_DATE = '2017-08-23';

const downloadPromoBackground = async () => {
  const dest = path.join(OUT, 'promo-bg.jpg');
  if (fs.existsSync(dest)) return;

  const entry = SEED.entries.find((e) => e.date === PROMO_DATE);
  if (!entry) throw new Error(`no seed entry for promo date ${PROMO_DATE}`);

  const res = await fetch(entry.hdurl || entry.url);
  if (!res.ok) throw new Error(`promo background: ${res.status}`);
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
  console.log('downloaded promo background:', entry.title);
};

const SHIM = (seed) => {
  const store = { sync: seed.sync, local: seed.local };
  const listeners = [];
  const area = (name) => ({
    get(keys, cb) {
      const out = {};
      const list = Array.isArray(keys) ? keys : keys == null ? Object.keys(store[name]) : [keys];
      list.forEach((k) => { if (k in store[name]) out[k] = store[name][k]; });
      setTimeout(() => cb && cb(out), 0);
    },
    set(items, cb) {
      const changes = {};
      Object.entries(items).forEach(([k, v]) => {
        changes[k] = { oldValue: store[name][k], newValue: v };
        store[name][k] = v;
      });
      setTimeout(() => { cb && cb(); listeners.forEach((l) => l(changes, name)); }, 0);
    },
    remove(keys, cb) {
      (Array.isArray(keys) ? keys : [keys]).forEach((k) => delete store[name][k]);
      setTimeout(() => cb && cb(), 0);
    },
  });
  window.chrome = {
    runtime: {
      lastError: undefined,
      getURL: (p) => new URL(p, location.origin).toString(),
      getManifest: () => seed.manifest,
    },
    topSites: { get: (cb) => setTimeout(() => cb(seed.topSites), 0) },
    storage: {
      sync: area('sync'),
      local: area('local'),
      onChanged: { addListener: (fn) => listeners.push(fn) },
    },
  };
};

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  await downloadPromoBackground();
  await new Promise((r) => server.listen(PORT, r));

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    defaultViewport: { width: W, height: H, deviceScaleFactor: 2 },
    args: [`--window-size=${W},${H}`, '--no-first-run', '--hide-scrollbars'],
  });

  const seed = {
    sync: { isTodayApod: true, hiResOnly: false, showTopSites: true,
            isTodayLimitOn: false, todayCount: 0, todayLimit: 5 },
    local: { apodFavorites: FAVES, apodHistory: HIST },
    topSites: TOP_SITES,
    manifest: JSON.parse(fs.readFileSync(path.join(EXT, 'manifest.json'), 'utf8')),
  };

  let currentHero = HERO;

  const newPage = async (w, h) => {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: h, deviceScaleFactor: 2 });
    await page.evaluateOnNewDocument(SHIM, seed);
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const url = req.url();
      if (url.startsWith('https://api.nasa.gov/planetary/apod')) {
        return req.respond({
          status: 200, contentType: 'application/json',
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify(url.includes('count=') ? [currentHero] : currentHero),
        });
      }
      req.continue();
    });
    page.on('console', (m) => m.type() === 'error' && console.log('  page error:', m.text()));
    return page;
  };

  const page = await newPage(W, H);
  await page.goto(`http://localhost:${PORT}/newtab.html`, { waitUntil: 'networkidle2' });
  await sleep(7000);

  const shot = async (name) => {
    await page.screenshot({ path: path.join(OUT, `${name}.png`) });
    console.log('captured', name);
  };

  await shot('01-hero');
  for (const [key, name] of [['e', '02-explanation'], ['f', '03-favorites'], ['h', '04-history']]) {
    await page.keyboard.press('Escape');
    await sleep(700);
    await page.keyboard.press(key);
    await sleep(3000);
    await shot(name);
  }
  await page.keyboard.press('Escape');
  await sleep(800);

  // A wide APOD leaves the least letterboxing behind the shortcut overlay.
  const wide = SEED.entries.reduce((a, b) => (a._r > b._r ? a : b),
    SEED.entries.map((e) => Object.assign(e, { _r: 0 }))[0]);
  currentHero = SEED.entries.find((e) => e.date === '2022-07-12') || HERO;
  await page.goto(`http://localhost:${PORT}/newtab.html`, { waitUntil: 'networkidle2' });
  await sleep(7000);
  await shot('06-shortcut-base');

  const pop = await newPage(420, 820);
  await pop.goto(`http://localhost:${PORT}/popup.html`, { waitUntil: 'networkidle2' });
  await sleep(2500);
  // Clip to the rendered options panel; the viewport is taller than the
  // content, which otherwise leaves a band of dead white in the screenshot.
  const box = await pop.$eval('#app-container > *', (el) => {
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  });
  await pop.screenshot({ path: path.join(OUT, '05-options.png'), clip: box });
  console.log('captured 05-options');

  await browser.close();
  server.close();
})().catch((e) => { console.error(e); process.exit(1); });
