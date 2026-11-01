import { useLayoutEffect } from 'react';
import { readPosition, storage } from '../reader-utils.js';

const topOffset = () => parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 96;

export default function useReadingPosition(routeKey, modelId, main) {
  useLayoutEffect(() => {
    const previous = history.scrollRestoration;
    history.scrollRestoration = 'manual';
    return () => { history.scrollRestoration = previous; };
  }, []);

  useLayoutEffect(() => {
    if (modelId === null) { window.scrollTo(0, 0); return; }
    const key = `mental-models-position-${modelId}`;
    const saved = readPosition(storage.get(key, null));
    const section = saved?.section ? document.getElementById(saved.section) : null;
    const target = section ? window.scrollY + section.getBoundingClientRect().top + saved.offset - topOffset() : saved?.y || 0;
    window.scrollTo({ top: Math.max(0, target), behavior: 'instant' });
    let latest = null;
    let timeout;
    function capture() {
      const sections = [...(main.current?.querySelectorAll('.article-section') || [])];
      const active = sections.filter(section => section.getBoundingClientRect().top <= topOffset() + 1).at(-1);
      latest = {
        y: window.scrollY,
        section: active?.id || null,
        offset: active ? topOffset() - active.getBoundingClientRect().top : 0,
      };
    }
    const persist = () => { if (latest) storage.set(key, latest); };
    const onScroll = () => {
      capture();
      clearTimeout(timeout);
      timeout = setTimeout(persist, 250);
    };
    const onVisibility = () => { if (document.visibilityState === 'hidden') persist(); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pagehide', persist);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      clearTimeout(timeout);
      persist();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pagehide', persist);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [routeKey, modelId, main]);
}
