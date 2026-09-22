/**
 * Remove Next.js output folders (fixes slow/corrupt compiles on Windows).
 * Safe while dev server is stopped.
 */
import { rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const dirs = ['.next', '.next-dev'];

for (const dir of dirs) {
  const path = join(root, dir);
  if (existsSync(path)) {
    rmSync(path, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 });
    console.log(`Removed ${dir}/`);
  }
}

console.log('Done. Run npm run dev — first compile will be slower, then faster.');
