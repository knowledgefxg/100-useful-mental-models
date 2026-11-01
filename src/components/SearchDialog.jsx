import { useEffect, useMemo, useRef } from 'react';
import { lang, models, modelLink, pad } from '../book.js';
import { t } from '../i18n.js';
import { searchEntries } from '../reader-utils.js';
import { scenariosFor } from '../scenarios.js';

function Highlight({ text, query }) {
  const tokens = query.trim().split(/\s+/).filter(Boolean).sort((a, b) => b.length - a.length);
  if (!tokens.length) return text;
  const pattern = new RegExp(`(${tokens.map(token => token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  return text.split(pattern).map((part, index) => index % 2 ? <mark key={index}>{part}</mark> : part);
}

export default function SearchDialog({ open, query, onQueryChange, onClose, onNavigate }) {
  const dialog = useRef(null);
  const input = useRef(null);
  const scenarios = scenariosFor(lang);
  const results = useMemo(() => searchEntries(models, query, { scenarios, labels: t.searchLabels, sceneSnippet: t.sceneSnippet }), [query, scenarios]);

  useEffect(() => {
    const element = dialog.current;
    if (open && !element.open) { element.showModal(); input.current.focus(); }
    else if (!open && element.open) element.close();
  }, [open]);
  useEffect(() => {
    const container = dialog.current?.querySelector('#search-results');
    if (container) container.scrollTop = 0;
  }, [query]);

  function focusResult(index) {
    const links = dialog.current.querySelectorAll('.search-result');
    if (index < 0) input.current.focus();
    else links[Math.min(index, links.length - 1)]?.focus();
  }

  return <dialog id="search-dialog" ref={dialog} aria-labelledby="search-title" onClose={onClose}
    onCancel={onClose} onClick={event => {
      if (event.target !== event.currentTarget) return;
      const rect = event.currentTarget.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
    }}>
    <div className="search-dialog-top"><span id="search-title" className="sr-only">{t.searchTitle}</span><span aria-hidden="true">⌕</span>
      <input id="search-input" ref={input} type="search" autoComplete="off" placeholder={t.searchPlaceholder}
        aria-label={t.searchAria} aria-controls="search-results" value={query} onChange={event => onQueryChange(event.target.value)}
        onKeyDown={event => {
          if (event.nativeEvent.isComposing) return;
          if (event.key === 'ArrowDown' && results.length) { event.preventDefault(); focusResult(0); }
          if (event.key === 'Enter' && results[0]) {
            event.preventDefault(); onNavigate(modelLink(results[0].model)); onClose();
          }
        }} />
      <button id="search-close" className="key-button" aria-label={t.searchClose} onClick={onClose}><span aria-hidden="true">×</span></button></div>
    <div id="search-results" role="region" aria-label={t.searchResults}>
      {!query.trim() ? <div className="search-state">{t.searchEmpty}
        <div className="search-suggestions">{scenarios.map(scene => <button key={scene.id} onClick={() => { onQueryChange(scene.query); input.current.focus(); }}>{scene.query}</button>)}</div>
      </div> : results.length ? <>
        <div className="search-state search-count" role="status">{t.searchCount(results.length)}</div>
        {results.map(({ model, label, snippet }, index) => <a key={model.id} className="search-result" href={modelLink(model)} onClick={onClose}
          onKeyDown={event => {
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
              event.preventDefault(); focusResult(index + (event.key === 'ArrowDown' ? 1 : -1));
            }
          }}>
          <small>{pad(model.number)} / {model.category}</small><b><Highlight text={model.title} query={query} /></b>
          <p><span className="match-label">{label}</span><Highlight text={snippet} query={query} /></p></a>)}
      </> : <div className="search-state" role="status">{t.searchNone}</div>}
    </div>
    <div className="search-foot">{t.searchFoot} <span>{t.searchKeys}</span></div>
  </dialog>;
}
