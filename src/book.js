import { setLanguage, t } from './i18n.js';
import { langPrefix, modelPath, topicPath } from './routes.js';

// The active language's data. Set once per page load (or per prerendered page) via setBook().
export let lang = 'zh';
export let models = [];
export let categories = [];
export let modelCount = 0;
export let orderedModels = [];
export let byId = new Map();
export let validIds = new Set();
export let homeLink = '/';
export let articleSections = [];

export const BASE = import.meta.env.BASE_URL;

export function setBook(language, book) {
  lang = language;
  setLanguage(language);
  ({ models, categories } = book);
  modelCount = models.length;
  orderedModels = [...models].sort((a, b) => a.number - b.number);
  byId = new Map(models.map(model => [model.id, model]));
  validIds = new Set(byId.keys());
  homeLink = BASE + langPrefix(language);
  articleSections = t.sections;
}

export const loadBook = language => (language === 'en' ? import('../content/models.en.json') : import('../content/models.json'))
  .then(module => module.default);

export const pad = number => String(number).padStart(2, '0');
export const asset = path => BASE + path;
export const modelLink = model => homeLink + modelPath(model);
export const topicLink = name => homeLink + topicPath(categories.find(category => category.name === name));
export const otherLanguage = () => (lang === 'en' ? 'zh' : 'en');

export function pageMeta(route) {
  if (route.type === 'model') {
    const model = route.model;
    return {
      title: `${pad(model.number)} · ${model.title} — ${t.siteName}`,
      description: t.metaModel(model),
      image: asset(model.image.split('?')[0]),
      type: 'article',
    };
  }
  if (route.type === 'topic') {
    const names = models.filter(model => model.category === route.category.name).map(model => model.title);
    return { title: `${route.category.name} — ${t.siteName}`, description: t.metaTopic(route.category, names) };
  }
  if (route.type === 'home') return { title: t.metaHomeTitle(modelCount), description: t.metaHome(modelCount) };
  return { title: t.metaNotFoundTitle, description: t.metaNotFound };
}
