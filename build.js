// build.js
// This script uses the Vite Node API to perform a build, avoiding any
// invocation of the shell binary which might be non-executable on some
// environments (e.g. Vercel's noexec mounts).
import { build } from 'vite';

// The build options mimic the default behavior of the CLI when no flags are
// provided. Additional configuration can be added here if necessary.

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
