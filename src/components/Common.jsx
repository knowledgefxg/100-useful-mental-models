import { homeLink, topicLink } from '../book.js';
import { t } from '../i18n.js';
import { scrollToSection } from '../reader-utils.js';

export function Paragraphs({ text }) {
  return String(text).split(/\n\s*\n/).map((paragraph, index) => <p key={index}>{paragraph}</p>);
}

export function SectionLink({ id, children, ...props }) {
  return <a href={`#${id}`} {...props} onClick={event => {
    event.preventDefault();
    scrollToSection(id);
  }}>{children}</a>;
}

export function Breadcrumb({ last, middle }) {
  return <div className="breadcrumb"><a href={homeLink}>{t.crumbRoot}</a><span className="sep">/</span>
    {middle && <><a href={topicLink(middle)}>{middle}</a><span className="sep">/</span></>}
    <span>{last}</span></div>;
}

export function TableOfContents({ items, note = t.tocNote }) {
  return <aside id="page-toc" className="page-toc" aria-label={t.tocAria}>
    {items.length > 0 && <><div className="toc-label">{t.tocLabel}</div>
      <div className="toc-links">{items.map(([id, title]) => <SectionLink key={id} id={id}>{title}</SectionLink>)}</div>
      <div className="toc-note">{note}</div></>}
  </aside>;
}
