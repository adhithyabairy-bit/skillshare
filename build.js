// build.js
// Use the Vite Node API to run builds without executing the shell binary.

console.log('build.js invoked, node version:', process.version);
console.log('cwd:', process.cwd());
console.log('platform:', process.platform);

import { build } from 'vite';

build()
  .then(() => console.log('vite build completed'))
  .catch((err) => {
    console.error('vite build error:', err);
    process.exit(1);
  });
