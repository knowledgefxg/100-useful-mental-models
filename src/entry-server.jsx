import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App.jsx';
import zhBook from '../content/models.json';
import enBook from '../content/models.en.json';
import { categories, models, pageMeta, setBook } from './book.js';
import { dictionaries } from './i18n.js';
import { languages, parseRoute, routePath, sitePaths } from './routes.js';

const books = { zh: zhBook, en: enBook };
export { languages };
export const paths = lang => sitePaths(books[lang].models, books[lang].categories);
export const notFoundPath = '404';
export const htmlLang = lang => dictionaries[lang].htmlLang;
export const ogLocale = lang => dictionaries[lang].ogLocale;
export const siteName = lang => dictionaries[lang].siteName;

export function render(lang, path) {
  setBook(lang, books[lang]);
  const html = renderToString(<React.StrictMode><App initialPath={path} /></React.StrictMode>);
  const route = parseRoute(path, models, categories);
  return { html, route, meta: pageMeta(route), alternatePath: routePath(route) };
}
