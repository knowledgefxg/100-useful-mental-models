import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { cpSync, mkdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const site = JSON.parse(readFileSync(resolve('site.config.json'), 'utf8'));

// Keep the GitBook sources in place; include only reader assets in the website.
function bookAssets() {
  let ssr = false;
  return {
    name: 'book-assets',
    configResolved(config) { ssr = Boolean(config.build.ssr); },
    closeBundle() {
      if (ssr) return;
      const out = resolve('dist');
      const copy = (from, to = from) => {
        mkdirSync(resolve(out, to, '..'), { recursive: true });
        cpSync(resolve(from), resolve(out, to), { recursive: true });
      };
      mkdirSync(resolve(out, 'docs'), { recursive: true });
      cpSync(resolve('docs'), resolve(out, 'docs'), {
        recursive: true,
        filter: source => {
          if (source.includes('/illustrations/') && /\.(png|svg)$/.test(source)) return false;
          return true;
        },
      });
      copy('favicon/favicon.ico', 'favicon.ico');
    },
  };
}

export default defineConfig({
  base: site.base || '/',
  publicDir: false,
  plugins: [react(), bookAssets()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: { manualChunks: id => id.includes('node_modules') ? 'vendor' : undefined },
    },
  },
});
