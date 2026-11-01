import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.jsx';
import { BASE, loadBook, setBook } from './book.js';
import { dictionaries } from './i18n.js';
import { langPrefix, legacyHashPath, splitLanguage } from './routes.js';
import '../styles.css';

async function start() {
  const { lang, path } = splitLanguage(decodeURI(window.location.pathname).slice(BASE.length));
  const book = await loadBook(lang);
  const legacy = lang === 'zh' && window.location.hash ? legacyHashPath(window.location.hash, book.categories) : null;
  if (legacy !== null) { window.location.replace(BASE + langPrefix(lang) + legacy); return; }
  setBook(lang, book);
  document.documentElement.lang = dictionaries[lang].htmlLang;
  const root = document.getElementById('root');
  const app = <React.StrictMode><App initialPath={path} /></React.StrictMode>;
  // Production pages arrive prerendered; the dev server serves an empty shell.
  if (root.firstElementChild) hydrateRoot(root, app);
  else createRoot(root).render(app);
}

start();
