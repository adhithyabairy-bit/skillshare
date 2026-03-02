// build.js
// This script uses the Vite Node API to perform a build, avoiding any
// invocation of the shell binary which might be non-executable on some
// environments (e.g. Vercel's noexec mounts).

// debug logging to help diagnose build failures in CI
console.log('build.js invoked, node version:', process.version);
console.log('working directory:', process.cwd());
console.log('platform:', process.platform);

import { build } from 'vite';

// The build options mimic the default behavior of the CLI when no flags are
// provided. Additional configuration can be added here if necessary.

build().then(() => {
  console.log('vite build completed');
}).catch((err) => {
  console.error('vite build error:', err);
  process.exit(1);
});
