// Builds the client bundle, then prerenders every page in every language to static HTML.
// Usage: npm run build [-- --base=/handbook/ --site=https://example.com]
import { build } from 'vite';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const config = JSON.parse(readFileSync(resolve('site.config.json'), 'utf8'));
const option = name => process.argv.find(arg => arg.startsWith(`--${name}=`))?.split('=').slice(1).join('=');
const base = `/${(option('base') ?? process.env.BASE_PATH ?? config.base ?? '/').replace(/^\/+|\/+$/g, '')}/`.replace(/^\/\/$/, '/');
const siteUrl = (option('site') ?? process.env.SITE_URL ?? config.siteUrl ?? '').replace(/\/+$/, '');

const out = resolve('dist');
const ssrOut = resolve('dist-ssr');

await build({ base, logLevel: 'warn', build: { manifest: true } });
await build({
  base,
  logLevel: 'warn',
  build: { ssr: 'src/entry-server.jsx', outDir: ssrOut, emptyOutDir: true, rollupOptions: { output: { manualChunks: undefined } } },
});

const server = await import(pathToFileURL(resolve(ssrOut, 'entry-server.js')).href);
const { render, paths, notFoundPath, languages, htmlLang, ogLocale, siteName } = server;
const template = readFileSync(resolve(out, 'index.html'), 'utf8');
const manifest = JSON.parse(readFileSync(resolve(out, '.vite/manifest.json'), 'utf8'));
const contentChunk = { zh: manifest['content/models.json'].file, en: manifest['content/models.en.json'].file };

const prefix = lang => (lang === 'en' ? 'en/' : '');
const escape = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const absolute = path => siteUrl + path;

function head(lang, { meta, route, alternatePath }, path) {
  const found = route.type !== 'not-found';
  const url = siteUrl && found ? absolute(base + prefix(lang) + path) : '';
  const tags = [`<link rel="modulepreload" crossorigin href="${base}${contentChunk[lang]}">`];
  if (!found) tags.push('<meta name="robots" content="noindex">');
  if (url) {
    tags.push(`<link rel="canonical" href="${escape(url)}">`);
    for (const other of languages) tags.push(`<link rel="alternate" hreflang="${htmlLang(other)}" href="${escape(absolute(base + prefix(other) + alternatePath))}">`);
    tags.push(`<link rel="alternate" hreflang="x-default" href="${escape(absolute(base + alternatePath))}">`);
  }
  tags.push(
    `<meta property="og:site_name" content="${escape(siteName(lang))}">`,
    `<meta property="og:locale" content="${ogLocale(lang)}">`,
    `<meta property="og:type" content="${meta.type || 'website'}">`,
    `<meta property="og:title" content="${escape(meta.title)}">`,
    `<meta property="og:description" content="${escape(meta.description)}">`,
  );
  if (url) tags.push(`<meta property="og:url" content="${escape(url)}">`);
  if (meta.image && siteUrl) {
    tags.push(`<meta property="og:image" content="${escape(absolute(meta.image))}">`, '<meta name="twitter:card" content="summary_large_image">');
  } else tags.push('<meta name="twitter:card" content="summary">');
  if (route.type === 'model') {
    const data = {
      '@context': 'https://schema.org', '@type': 'Article', inLanguage: htmlLang(lang),
      headline: route.model.title, alternativeHeadline: route.model.en, description: meta.description,
      articleSection: route.model.category,
      ...(url && { url, mainEntityOfPage: url }),
      ...(meta.image && siteUrl && { image: absolute(meta.image) }),
    };
    tags.push(`<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`);
  }
  return tags.map(tag => `  ${tag}`).join('\n');
}

function page(lang, path) {
  const result = render(lang, path);
  return template
    .replace(/<html lang="[^"]*">/, `<html lang="${htmlLang(lang)}">`)
    .replace(/<title>[^<]*<\/title>/, `<title>${escape(result.meta.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${escape(result.meta.description)}">`)
    .replace('</head>', `${head(lang, result, path)}\n</head>`)
    .replace('<div id="root"></div>', `<div id="root">${result.html}</div>`);
}

function write(file, contents) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, contents);
}

const allUrls = [];
for (const lang of languages) {
  for (const path of paths(lang)) {
    write(resolve(out, prefix(lang), path, 'index.html'), page(lang, path));
    allUrls.push(base + prefix(lang) + path);
  }
  write(resolve(out, prefix(lang), '404.html'), page(lang, notFoundPath));
}
rmSync(resolve(out, '.vite'), { recursive: true, force: true });

const robots = ['User-agent: *', 'Allow: /', `Disallow: ${base}docs/models/`, `Disallow: ${base}content/`];
if (siteUrl) {
  const urls = allUrls.map(path => `  <url><loc>${escape(absolute(path))}</loc></url>`).join('\n');
  write(resolve(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
  robots.push('', `Sitemap: ${absolute(base)}sitemap.xml`);
}
write(resolve(out, 'robots.txt'), `${robots.join('\n')}\n`);

// Apache (SiteGround): per-language 404 pages, long-lived caching for hashed/versioned assets.
const escapedBase = base.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
write(resolve(out, '.htaccess'), [
  `ErrorDocument 404 ${base}404.html`,
  `<If "%{REQUEST_URI} =~ m#^${escapedBase}en/#">`,
  `  ErrorDocument 404 ${base}en/404.html`,
  '</If>',
  ...(base !== '/' ? ['', '# Keep a parent WordPress install from rewriting handbook URLs.', '<IfModule mod_rewrite.c>', '  RewriteEngine Off', '</IfModule>'] : []),
  '',
  '<IfModule mod_headers.c>',
  '  <FilesMatch "\\.(js|css|webp|svg)$">',
  '    Header set Cache-Control "public, max-age=31536000, immutable"',
  '  </FilesMatch>',
  '  <FilesMatch "\\.html$">',
  '    Header set Cache-Control "no-cache"',
  '  </FilesMatch>',
  '</IfModule>',
  '',
].join('\n'));

rmSync(ssrOut, { recursive: true, force: true });
console.log(`Prerendered ${allUrls.length} pages + ${languages.length} 404 pages to dist/ (base ${base}${siteUrl ? `, site ${siteUrl}` : ', no siteUrl: sitemap and canonical skipped'}).`);
