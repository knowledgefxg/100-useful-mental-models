import { useEffect, useRef } from 'react';
import { t } from '../i18n.js';
import { scrollToSection } from '../reader-utils.js';

export default function MobileArticleContents({ items }) {
  const details = useRef(null);
  useEffect(() => {
    const close = event => {
      if (event.key === 'Escape' || (event.type === 'pointerdown' && !details.current?.contains(event.target))) {
        if (details.current) details.current.open = false;
      }
    };
    document.addEventListener('keydown', close);
    document.addEventListener('pointerdown', close);
    return () => { document.removeEventListener('keydown', close); document.removeEventListener('pointerdown', close); };
  }, []);
  return <details className="mobile-article-contents" ref={details}>
    <summary>{t.mobileToc} <span>{t.mobileTocHint}</span></summary>
    <nav aria-label={t.mobileTocAria}>{items.map(([id, title]) => <a key={id} href={`#${id}`} onClick={event => {
      event.preventDefault();
      details.current.open = false;
      scrollToSection(id);
      const heading = document.getElementById(id)?.querySelector('h2');
      heading?.setAttribute('tabindex', '-1');
      heading?.focus({ preventScroll: true });
    }}>{title}</a>)}</nav>
  </details>;
}
