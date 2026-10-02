// Pulls real APOD entries from NASA into seed.json, so the screenshots show
// genuine imagery/titles rather than hand-written URLs. Entries are stored in
// the shape the extension builds from the API (`url` = image, `hdurl` = full
// res), so capture.js can feed them straight to favorites and history.
const fs = require('fs');
const path = require('path');

const API = 'https://science.nasa.gov/wp-json/wp/v2/apod-basic/';
const HERO_DATE = '2024-01-14';
const DATES = [
  '2024-01-14', '2023-11-08', '2015-07-15', '2023-07-12', '2022-07-12',
  '2020-12-21', '2022-07-13', '2021-01-24', '2019-11-12', '2024-04-09',
  '2018-08-14', '2017-08-23', '2024-10-13', '2016-03-09',
];

// The API takes dates as `YYMMDD`.
const apiDate = (date) => date.replace(/-/g, '').slice(2);

const stripHtml = (html = '') =>
  html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').replace(/\s+([.,;:!?)])/g, '$1').trim();

// Mirrors `toApodResponse` in src/utilities/images.ts: the media is only in
// `basic_html`, as an <img> wrapped in a link to the full-resolution file.
const fromBasic = (item) => {
  const img = /<a href="([^"]+)"[^>]*>\s*<img[^>]*src="([^"]+)"/i.exec(item.basic_html);
  if (!img) return null;
  return {
    copyright: stripHtml(item.copyright),
    date: item.date,
    explanation: stripHtml(item.explanation.split(/<br\s*\/?>/i)[0]).replace(/^Explanation:\s*/i, ''),
    hdurl: img[1],
    media_type: item.media_type,
    title: item.title,
    url: img[2],
    apodUrl: item.permalink,
  };
};

(async () => {
  const out = [];
  for (const date of DATES) {
    const r = await fetch(`${API}?date_from=${apiDate(date)}&date_to=${apiDate(date)}`);
    if (!r.ok) { console.log('skip', date, r.status); continue; }
    const [item] = await r.json();
    const d = item && item.media_type === 'image' && fromBasic(item);
    if (!d) { console.log('skip (not image)', date, item && item.title); continue; }
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
