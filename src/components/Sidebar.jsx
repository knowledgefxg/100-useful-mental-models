import { useEffect, useRef, useState } from 'react';
import { categories, homeLink, models, modelCount, modelLink, pad } from '../book.js';
import { t } from '../i18n.js';

// `open` is null until the viewport size is known, so prerendered HTML lets CSS decide.
export default function Sidebar({ currentId, home, read, open, onNavigate }) {
  const nav = useRef(null);
  const currentCategory = models.find(model => model.id === currentId)?.category;
  const [expanded, setExpanded] = useState(() => new Set([categories[0].name, currentCategory].filter(Boolean)));

  useEffect(() => {
    if (currentCategory) setExpanded(previous => new Set([...previous, currentCategory]));
  }, [currentCategory]);

  useEffect(() => {
    if (!open) return;
    const active = nav.current?.querySelector('.active');
    if (!active) return;
    const bounds = active.getBoundingClientRect();
    const container = nav.current.getBoundingClientRect();
    if (bounds.bottom > container.bottom || bounds.top < container.top) {
      nav.current.scrollTop += bounds.top - container.top - 60;
    }
  }, [currentId, expanded, open]);

  const item = model => <a key={model.id} href={modelLink(model)} onClick={onNavigate}
    className={`nav-item${model.id === currentId ? ' active' : ''}${read.has(model.id) ? ' read' : ''}`}
    aria-current={model.id === currentId ? 'page' : undefined}>
    <span className="num">{pad(model.number)}</span><span>{model.title}</span></a>;

  return <aside className={`sidebar${open === null ? ' default-open' : open ? ' open' : ''}`} id="sidebar" aria-label={t.sidebarAria} inert={open === false}>
    <div className="workspace"><span className="workspace-icon">{modelCount}</span><div><strong>{t.workspaceTitle}</strong><small>{t.workspaceSub}</small></div></div>
    <a href={homeLink} className={`home-link${home ? ' active' : ''}`} id="home-link" onClick={onNavigate}><span aria-hidden="true">⌂</span> {t.startReading} <span className="arrow">↗</span></a>
    <div className="nav-label">{t.navLabel}</div>
    <nav id="book-nav" ref={nav}>{categories.map(category => {
      const items = models.filter(model => model.category === category.name).sort((a, b) => a.number - b.number);
      return <details key={category.name} open={expanded.has(category.name)} onToggle={event => {
        const isOpen = event.currentTarget.open;
        setExpanded(previous => {
          if (previous.has(category.name) === isOpen) return previous;
          const next = new Set(previous);
          if (isOpen) next.add(category.name); else next.delete(category.name);
          return next;
        });
      }}>
        <summary>{category.name}<small>{items.length}</small></summary>
        {items.map(item)}
      </details>;
    })}</nav>
    <div className="sidebar-bottom"><div><span>{t.progressLabel}</span><strong id="progress-label">{read.size} / {modelCount}</strong></div>
      <progress id="progress" max={modelCount} value={read.size} aria-label={t.progressAria} /><small>{t.progressNote}</small></div>
  </aside>;
}
