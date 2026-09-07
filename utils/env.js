// tiny wrapper with default env vars
module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  // 'chrome' or 'firefox' -- selects the manifest shape and output directory.
  TARGET: process.env.TARGET || 'chrome',
};
