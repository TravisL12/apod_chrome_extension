# Chrome Web Store listing

Paste-ready copy for the [Developer Dashboard](https://chrome.google.com/webstore/devconsole).
Update this file in the same commit as the feature change, so the listing never
drifts from what ships.

Two fields live in `src/manifest.json` rather than here — **Name** and
**Summary** are read from the manifest, not typed into the dashboard. The copies
below are for reference only; edit the manifest.

Last synced with: **v4.3.0**

> The live listing is still v4.2.1's copy. This version adds the Download button
> to the feature list and a `downloads` permission justification — both go up
> with the 4.3.0 submission, not before.

---

## Name

Read from `manifest.name`. 75 char limit.

```
APOD - NASA Astronomy Picture of the Day
```

## Summary

Read from `manifest.description`. **132 char limit — the current text is exactly
132, so any edit has to lose a character to gain one.** This is what shows in
store search results, so it does more work than anything else in the listing.

```
Transform your new tab with NASA's Astronomy Picture of the Day. Explore HD space wallpapers, nebulae, galaxies, and cosmic history.
```

## Category

Currently listed under **Just for Fun**.

Worth reconsidering: someone hunting for a space or wallpaper new tab is more
likely browsing `Art & Design` or `Photos`. Changing category resets nothing —
ratings and install count carry over.

---

## Description

Plain text. No markdown — asterisks and dashes render literally, which is why
the bullets below are `*` characters chosen to look intentional.

The first two lines are what a browsing user reads before clicking "more", so
they carry the hook.

```text
Every new tab becomes NASA's Astronomy Picture of the Day — a real photograph of
the universe, with the story behind it.

Since 1995, NASA has published one astronomy image every day, each written up by
a professional astronomer. That's thousands of pictures: nebulae, galaxies, solar
eclipses, aurorae, rovers, comets and deep field surveys. This extension puts
them on the page you already open a hundred times a day.

Your top sites stay in the top left, so the new tab keeps the usefulness of the
default one.


BROWSE THIRTY YEARS OF ARCHIVE

* See today's picture, or open on a random one from the entire archive.
* Show today's image a set number of times before switching to random — set the
  count in the options, and it resets each day.
* Click the date in the title bar to jump to any day back to June 16, 1995.
* Step through the archive a day at a time, forward or back.


KEEP WHAT YOU LIKE

* Save any image to Favorites and search back through them by title.
* Every image you view is kept in a searchable history.
* Move through images you have already seen with the Left and Right arrow keys.
* Download the full-resolution image to your computer.


BUILT FOR THE KEYBOARD

Navigation:
* Random APOD — 'r'
* Today's APOD — 't'
* Previous day — 'j'
* Next day — 'k'

Panels:
* Explanation — 'e'
* Favorites — 'f'
* History — 'h'
* Close panel — 'esc'


OPTIONS

* Open on today's picture or a random one.
* Force full-resolution images, or let the standard image load when the HD file
  is taking too long.
* Show or hide your top sites.
* Set how many times today's image appears before random ones take over.


PERMISSIONS

* topSites — draws your most-visited shortcuts in the top left. Toggle it off in
  the options and they are not shown.
* storage — saves your settings, favorites and viewing history on your own
  machine.
* favicon — draws the shortcut icons from Chrome's local favicon cache, so your
  browsing data never leaves your computer.
* downloads — optional, and only requested the first time you click Download.
* api.nasa.gov — the only site this extension talks to, to fetch the daily image.

No analytics, no tracking, no account.
```

---

## Privacy tab

These fields are required on every submission and block publishing if left
blank. They change rarely, but a permission change means editing them.

### Single purpose

```
Replaces the new tab page with NASA's Astronomy Picture of the Day, and lets the
user browse, search and save images from the APOD archive.
```

### Permission justifications

**topSites**

```
Renders the user's most-visited site shortcuts in the top left corner of the new
tab page, so that replacing the default new tab does not remove the shortcuts
users rely on. The user can turn this off in the extension options.
```

**storage**

```
Stores the user's settings, saved favorites and viewing history. All of it is
kept locally on the user's own machine; none of it is transmitted anywhere.
```

**favicon**

```
Draws the site icons for the top-site shortcuts from Chrome's local favicon
cache. This avoids sending the user's most-visited domains to a third-party
favicon service, which is what the extension did previously.
```

**downloads** (optional permission)

```
Saves the current Astronomy Picture of the Day to the user's computer when they
click the Download button. It is declared as an optional permission and is only
requested at the moment the user first clicks Download, so users who never use
the feature are never asked for it.
```

**Host permission — `https://api.nasa.gov/*`**

```
The extension fetches the daily image metadata from NASA's public APOD API at
api.nasa.gov. This is the only host the extension makes requests to.
```

### Remote code

```
No. All code is bundled in the extension package.
```

### Data usage disclosures

Check **none** of the collection categories, and affirm all three compliance
certifications. The extension collects nothing: settings, favorites and history
live in `chrome.storage` on the user's machine, and the only outbound request is
to `api.nasa.gov` for the daily image.

---

## Screenshots

Generated from the real production build — see [generate/](generate/) and run
`yarn screenshots`. Upload from [screenshots/](screenshots/):

| File | Use |
| --- | --- |
| `1-hero.png` | Screenshot 1 — lead with this one |
| `2-shortcuts.png` | Screenshot 2 — keyboard shortcuts |
| `3-explanation.png` | Screenshot 3 — explanation panel |
| `4-collections.png` | Screenshot 4 — favorites and history |
| `5-options.png` | Screenshot 5 — options |
| `promo-small-440x280.png` | Small promo tile — required for any featuring |
| `promo-marquee-1400x560.png` | Marquee promo tile |

---

## Before submitting

- [ ] `src/manifest.json` version bumped
- [ ] Summary still ≤ 132 characters
- [ ] Description matches the shortcuts in `src/constants.ts` (`KEY_MAP`)
- [ ] Description matches the permissions in `src/manifest.json`
- [ ] `yarn screenshots` re-run if the UI changed
- [ ] `yarn package` produces `release/apod-<version>.zip`
