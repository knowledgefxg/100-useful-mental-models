// Paths are relative to a language root ("" for Chinese, "en/" for English).
export const languages = ['zh', 'en'];
export const langPrefix = lang => (lang === 'en' ? 'en/' : '');
export const modelPath = model => `model/${model.id}/`;
export const topicPath = category => `topic/${category.slug}/`;

export function routePath(route) {
  if (route.type === 'model') return modelPath(route.model);
  if (route.type === 'topic') return topicPath(route.category);
  return '';
}

export function sitePaths(models, categories) {
  return ['', ...categories.map(topicPath), ...models.map(modelPath)];
}

// Splits a path relative to the site base into its language and the rest.
export function splitLanguage(path) {
  const match = String(path).match(/^en(?:\/|$)(.*)$/);
  return match ? { lang: 'en', path: match[1] } : { lang: 'zh', path: String(path) };
}

export function parseRoute(path, models, categories) {
  const clean = String(path).replace(/index\.html$/, '').replace(/^\/+|\/+$/g, '');
  if (clean === '') return { type: 'home' };
  const model = clean.match(/^model\/(\d+)$/);
  if (model) {
    const found = models.find(item => item.id === Number(model[1]));
    if (found) return { type: 'model', model: found };
  }
  const topic = clean.match(/^topic\/([a-z]+)$/);
  if (topic) {
    const category = categories.find(item => item.slug === topic[1]);
    if (category) return { type: 'topic', category };
  }
  return { type: 'not-found' };
}

// Earlier versions used hash routes such as "#model/5" and "#topic/<Chinese name>".
export function legacyHashPath(hash, categories) {
  const value = String(hash).replace(/^#/, '');
  if (value === 'home' || value === 'references') return '';
  if (/^model\/\d+$/.test(value)) return `${value}/`;
  if (value.startsWith('topic/')) {
    try {
      const name = decodeURIComponent(value.slice(6));
      const category = categories.find(item => item.name === name);
      return category ? topicPath(category) : null;
    } catch { return null; }
  }
  return null;
}
