/**
 * The manifest in `src/` is the Chrome one; Firefox needs a handful of
 * substitutions rather than a whole second file to keep in sync.
 */

// Firefox requires an explicit add-on id: AMO rejects the upload without one,
// and -- less visibly -- `storage.sync` silently no-ops, which would drop every
// user option this extension persists.
const GECKO_ID = 'apod-newtab@travisl12.github.io';

// MV3 in Firefox (`action`, `host_permissions`) landed in 115 ESR.
const GECKO_MIN_VERSION = '115.0';

const forFirefox = (manifest) => {
  const {
    // Firefox has no MV3 service worker; this extension's background script is
    // empty, so there is nothing to port to an event page.
    background,
    // `options_page` is a Chrome key. `open_in_tab` keeps Chrome's behaviour of
    // opening the options in a full tab rather than the about:addons panel.
    options_page,
    permissions,
    ...rest
  } = manifest;

  return {
    ...rest,
    options_ui: { page: options_page, open_in_tab: true },
    // `favicon` is Chrome-only (it gates the `_favicon/` endpoint); Firefox
    // serves top-site icons through `topSites.get({ includeFavicon: true })`.
    permissions: permissions.filter((p) => p !== 'favicon'),
    browser_specific_settings: {
      gecko: { id: GECKO_ID, strict_min_version: GECKO_MIN_VERSION },
    },
  };
};

module.exports = function buildManifest(base, target) {
  const manifest = {
    description: process.env.npm_package_description,
    version: process.env.npm_package_version,
    ...base,
  };

  return target === 'firefox' ? forFirefox(manifest) : manifest;
};
