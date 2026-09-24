/**
 * Dev server — uses the default `.next` cache (same as production build).
 * If the cache is corrupt or locked, stop the server and run: npm run clean:cache
 *
 * Optional: NEXT_DIST_DIR=.next-dev npm run dev  (legacy alternate cache)
 */
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const nextBin = require.resolve('next/dist/bin/next');

const env = { ...process.env };
if (!env.NEXT_DIST_DIR) {
  delete env.NEXT_DIST_DIR;
}

// Webpack dev avoids Turbopack route-table bugs (e.g. /login, /signup → 404 on Windows).
const devArgs = ['dev', '--webpack', ...process.argv.slice(2).filter((a) => a !== '--turbo' && a !== '--turbopack')];

const result = spawnSync(process.execPath, [nextBin, ...devArgs], {
  stdio: 'inherit',
  env,
});

process.exit(result.status ?? 1);
