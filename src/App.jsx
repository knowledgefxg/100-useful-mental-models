import { useCallback, useEffect, useRef, useState } from 'react';
import { articleSections, BASE, categories, homeLink, lang, models, modelCount, otherLanguage, pageMeta, validIds } from './book.js';
import { dictionaries, t } from './i18n.js';
import { storage } from './reader-utils.js';
import { langPrefix, parseRoute, routePath, splitLanguage } from './routes.js';
import { Breadcrumb, SectionLink, TableOfContents } from './components/Common.jsx';
import Sidebar from './components/Sidebar.jsx';
import SearchDialog from './components/SearchDialog.jsx';
import HomePage from './pages/HomePage.jsx';
import ModelPage from './pages/ModelPage.jsx';
import TopicPage from './pages/TopicPage.jsx';
import useReadingPosition from './hooks/useReadingPosition.js';
import useCompactLayout from './hooks/useCompactLayout.js';

// Splits a URL into its language and the path below that language's root.
const locate = url => splitLanguage(decodeURI(url.pathname).slice(BASE.length));

// `initialPath` is relative to the current language's root, e.g. "model/5/".
export default function App({ initialPath }) {
  const [path, setPath] = useState(initialPath);
  const [read, setRead] = useState(() => new Set());
  const [lastId, setLastId] = useState(null);
  const compact = useCompactLayout();
  const [menuOpen, setMenuOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const sidebarVisible = compact === null ? null : compact ? menuOpen : desktopSidebarOpen;
  const menuButton = useRef(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const openSearch = useCallback((query = '') => { setMenuOpen(false); setSearchQuery(query); setSearchOpen(true); }, []);
  const [toast, setToast] = useState('');
  const timer = useRef(null);
  const main = useRef(null);
  const route = parseRoute(path, models, categories);
  const currentId = route.model?.id ?? null;
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const navigate = useCallback(href => {
    const url = new URL(href, window.location.href);
    history.pushState(null, '', url.pathname + url.search + url.hash);
    setPath(locate(url).path);
  }, []);

  useEffect(() => {
    const saved = storage.get('mental-models-read', []);
    setRead(new Set((Array.isArray(saved) ? saved : []).filter(id => validIds.has(id))));
    setLastId(storage.get('mental-models-last', null));
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    if (document.activeElement?.closest('#book-nav, .pagination, .related, #search-dialog')) main.current?.focus({ preventScroll: true });
  }, [path]);

  useEffect(() => {
    // Same-language links switch pages in place; other languages, images, and new tabs load normally.
    const onClick = event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest?.('a[href]');
      if (!link || link.target || link.hasAttribute('download')) return;
      const url = new URL(link.href);
      if (url.origin !== window.location.origin || !url.pathname.startsWith(BASE)) return;
      if (url.pathname === window.location.pathname && url.hash) return;
      const target = locate(url);
      if (target.lang !== lang || parseRoute(target.path, models, categories).type === 'not-found') return;
      event.preventDefault();
      navigate(url.href);
    };
    const onPopState = () => setPath(locate(window.location).path);
    const onKeyDown = event => {
      const typing = /INPUT|TEXTAREA/.test(document.activeElement?.tagName) || document.activeElement?.isContentEditable;
      if (((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') || (event.key === '/' && !typing)) {
        event.preventDefault(); openSearch();
      }
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('click', onClick);
    window.addEventListener('popstate', onPopState);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('popstate', onPopState);
      document.removeEventListener('keydown', onKeyDown);
      clearTimeout(timer.current);
    };
  }, [navigate]);

  useEffect(() => {
    if (!compact || !menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const sidebar = document.getElementById('sidebar');
    (sidebar.querySelector('.active') || sidebar.querySelector('a'))?.focus({ preventScroll: true });
    const trapFocus = event => {
      if (event.key !== 'Tab') return;
      const controls = [menuButton.current, ...sidebar.querySelectorAll('a, summary')].filter(element => element?.getClientRects().length);
      const index = controls.indexOf(document.activeElement);
      if (event.shiftKey && index <= 0) { event.preventDefault(); controls.at(-1)?.focus(); }
      else if (!event.shiftKey && (index === controls.length - 1 || index === -1)) { event.preventDefault(); controls[0]?.focus(); }
    };
    document.addEventListener('keydown', trapFocus);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', trapFocus);
      if (sidebar.contains(document.activeElement)) menuButton.current?.focus({ preventScroll: true });
    };
  }, [compact, menuOpen]);

  useReadingPosition(path, currentId, main);
  useEffect(() => {
    if (currentId !== null) {
      storage.set('mental-models-last', currentId);
      setLastId(currentId);
    }
  }, [currentId]);
  useEffect(() => {
    const meta = pageMeta(route);
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
  }, [path]);

  function toggleRead(id) {
    const next = new Set(read);
    if (next.has(id)) next.delete(id); else next.add(id);
    setRead(next);
    const persisted = storage.set('mental-models-read', [...next]);
    setToast(persisted ? (next.has(id) ? t.toastRead : t.toastUnread) : t.toastNoStorage);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(''), 2600);
  }

  let content;
  let sections = [];
  let note;
  if (route.type === 'home') { content = <HomePage lastId={lastId} onSearch={openSearch} />; sections = t.homeSections; }
  else if (route.type === 'model') {
    content = <ModelPage key={currentId} model={route.model} read={read.has(currentId)} onToggleRead={toggleRead} />;
    sections = articleSections.filter(([id]) => id !== 'sources' || route.model.sources.length > 0);
    note = t.modelNote;
  } else if (route.type === 'topic') {
    content = <TopicPage category={route.category} />;
    sections = [['topic-models', t.topicSection(models.filter(model => model.category === route.category.name).length)]];
    note = t.topicNote;
  } else content = <><Breadcrumb last={t.notFoundCrumb} /><h1 className="article-title">{t.notFoundTitle}</h1>
    <p className="topic-description">{t.notFoundText}</p><a href={homeLink} className="primary">{t.backHome}</a></>;
  const other = otherLanguage();

  return <>
    <SectionLink className="skip" id="main">{t.skip}</SectionLink>
    <header className="topbar"><button className="mobile-menu icon-button" id="menu-toggle" ref={menuButton} aria-label={sidebarVisible ? t.closeMenu : t.openMenu}
      aria-expanded={!!sidebarVisible} aria-controls="sidebar" onClick={() => compact ? setMenuOpen(open => !open) : setDesktopSidebarOpen(open => !open)}>{sidebarVisible ? '×' : '☰'}</button>
      <a className="brand" href={homeLink}><span className="brand-icon" aria-hidden="true"><i /><i /><i /><i /></span><strong>{t.brand}</strong><span className="brand-divider" /><span className="brand-sub">{t.brandSub(modelCount)}</span></a>
      <div className="top-actions"><span className="draft"><span />{t.badge(modelCount)}</span>
        <a className="lang-switch" href={BASE + langPrefix(other) + routePath(route)} hrefLang={dictionaries[other].htmlLang} lang={dictionaries[other].htmlLang}
          aria-label={t.switchAria}>{t.switchLabel}</a>
        <button id="search-open" className="search-trigger" onClick={() => openSearch()}>
        <span aria-hidden="true">⌕</span> {t.searchButton} <kbd>⌘ K</kbd></button></div></header>
    <button id="sidebar-backdrop" className="sidebar-backdrop" aria-label={t.closeBackdrop} hidden={!compact || !menuOpen} onClick={() => setMenuOpen(false)} />
    <Sidebar currentId={currentId} home={route.type === 'home'} read={read} open={sidebarVisible} onNavigate={() => setMenuOpen(false)} />
    <div className={`reading-layout${sidebarVisible === false ? ' sidebar-collapsed' : ''}`} inert={!!compact && menuOpen}><main id="main" ref={main} tabIndex={-1}>{content}</main><TableOfContents items={sections} note={note} /></div>
    <SearchDialog open={searchOpen} query={searchQuery} onQueryChange={setSearchQuery} onClose={closeSearch} onNavigate={navigate} />
    <div id="toast" className={`toast${toast ? ' visible' : ''}`} role="status">{toast}</div>
  </>;
}
