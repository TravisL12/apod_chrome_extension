// Zips the contents of the build directory (not the directory itself) into
// release/apod[-<target>]-<version>.zip, which is what both the Chrome Web
// Store and AMO expect: manifest.json must sit at the archive root.
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const target = process.env.TARGET || 'chrome';

const root = path.resolve(__dirname, '..');
const buildDir = path.join(
  root,
  target === 'chrome' ? 'build' : `build-${target}`
);
const releaseDir = path.join(root, 'release');

const manifest = JSON.parse(
  fs.readFileSync(path.join(buildDir, 'manifest.json'), 'utf8')
);
const name = target === 'chrome' ? 'apod' : `apod-${target}`;
const zipPath = path.join(releaseDir, `${name}-${manifest.version}.zip`);

fs.mkdirSync(releaseDir, { recursive: true });
fs.rmSync(zipPath, { force: true });

// -x excludes macOS cruft that Finder's "Compress" would otherwise bundle in.
// Running from inside buildDir keeps paths relative, so there is no top-level
// folder in the archive.
execFileSync(
  'zip',
  ['-r', '-X', zipPath, '.', '-x', '.DS_Store', '__MACOSX/*', '*.zip'],
  { cwd: buildDir, stdio: 'inherit' }
);

console.log(`\nPackaged ${path.relative(root, zipPath)}`);
console.log(execFileSync('unzip', ['-l', zipPath], { encoding: 'utf8' }));
