// Pulls real APOD entries from the NASA API into seed.json, so the screenshots
// show genuine imagery/titles rather than hand-written URLs.
const fs = require('path') && require('fs');
const path = require('path');

const KEY = 'hPgI2kGa1jCxvfXjv6hq6hsYBQawAqvjMaZNs447';
const HERO_DATE = '2024-01-14';
const DATES = [
  '2024-01-14', '2023-11-08', '2015-07-15', '2023-07-12', '2022-07-12',
  '2020-12-21', '2022-07-13', '2021-01-24', '2019-11-12', '2024-04-09',
  '2018-08-14', '2017-08-23', '2024-10-13', '2016-03-09',
];

(async () => {
  const out = [];
  for (const date of DATES) {
    const r = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${KEY}&date=${date}`);
    if (!r.ok) { console.log('skip', date, r.status); continue; }
    const d = await r.json();
    if (d.media_type !== 'image') { console.log('skip (not image)', date, d.title); continue; }
    // Confirm the image actually resolves before it lands in a screenshot.
    const head = await fetch(d.url, { method: 'HEAD' });
    if (!head.ok) { console.log('skip (dead url)', date, head.status); continue; }
    out.push(d);
    console.log('ok', date, '|', d.title);
  }
  const hero = out.find((d) => d.date === HERO_DATE) || out[0];
  fs.writeFileSync(path.join(__dirname, 'seed.json'), JSON.stringify({ hero, entries: out }, null, 2));
  console.log(`\n${out.length} entries -> seed.json; hero = ${hero.title}`);
})();
