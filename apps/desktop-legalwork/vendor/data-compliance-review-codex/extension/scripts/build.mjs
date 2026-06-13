import { mkdir, cp } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import esbuild from 'esbuild';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const srcDir = path.join(root, 'src');
const publicDir = path.join(root, 'public');
const outdir = path.join(root, 'dist');
const watch = process.argv.includes('--watch');

execFileSync('python3', [path.join(root, 'scripts', 'export_regulation_index.py')], {
  stdio: 'inherit'
});

const ctx = await esbuild.context({
  absWorkingDir: root,
  entryPoints: {
    background: 'src/background.ts',
    'ui/sidepanel': 'src/ui/sidepanel.ts',
    'ui/result': 'src/ui/result.ts',
    'ui/options': 'src/ui/options.ts',
    'workers/review.worker': 'src/workers/review.worker.ts',
    'content/pdf-detect': 'src/content/pdf-detect.ts'
  },
  bundle: true,
  outdir,
  format: 'esm',
  target: 'chrome120',
  sourcemap: true,
  loader: {
    '.json': 'json'
  }
});

await mkdir(outdir, { recursive: true });
await cp(publicDir, outdir, { recursive: true });

const pdfWorkerCandidates = [
  path.join(root, 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.mjs'),
  path.join(root, 'node_modules', 'pdfjs-dist', 'legacy', 'build', 'pdf.worker.mjs')
];

for (const candidate of pdfWorkerCandidates) {
  try {
    await mkdir(path.join(outdir, 'vendor'), { recursive: true });
    await cp(candidate, path.join(outdir, 'vendor', 'pdf.worker.mjs'));
    break;
  } catch {
    // Try next path.
  }
}

if (watch) {
  await ctx.watch();
  console.log('Watching extension build...');
} else {
  await ctx.rebuild();
  await ctx.dispose();
}
