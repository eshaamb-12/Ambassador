/**
 * Production build wrapper.
 * Hostinger (and some .env files) set NODE_ENV=development, which breaks `next build`
 * with: TypeError: Cannot read properties of null (reading 'useState')
 */
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const nextBin = require.resolve('next/dist/bin/next');

const env = { ...process.env };

if (env.NODE_ENV && env.NODE_ENV !== 'production') {
  console.warn(
    `[build] Ignoring NODE_ENV=${env.NODE_ENV} from the environment — Next.js requires production for builds.`
  );
}

env.NODE_ENV = 'production';
delete env.NEXT_DIST_DIR;

// Webpack build — Turbopack production builds panic on PostCSS/Tailwind (globals.css) on Vercel/Linux.
const buildArgs = ['build', '--webpack'];

const result = spawnSync(process.execPath, [nextBin, ...buildArgs], {
  stdio: 'inherit',
  env,
});

process.exit(result.status ?? 1);
