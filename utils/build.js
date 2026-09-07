// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';
process.env.ASSET_PATH = '/';
process.env.TARGET = process.env.TARGET || 'chrome';

var webpack = require('webpack'),
  config = require('../webpack.config');

delete config.chromeExtensionBoilerplate;

config.mode = 'production';

webpack(config, function (err, stats) {
  // `err` only covers fatal webpack failures; a compilation error (a broken
  // import, a type error) lands on `stats` instead. Ignoring it meant a failed
  // build printed nothing, exited 0, and left the previous build/ untouched --
  // so `yarn package` would zip up the stale version and ship it.
  if (err) {
    console.error(err.stack || err);
    process.exit(1);
  }

  if (stats.hasErrors()) {
    console.error(
      stats.toString({ all: false, errors: true, errorDetails: true })
    );
    process.exit(1);
  }

  console.log(stats.toString({ all: false, warnings: true, assets: true }));
});
