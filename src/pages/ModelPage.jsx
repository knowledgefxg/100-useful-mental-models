import { articleSections, asset, byId, homeLink, models, orderedModels, modelLink, pad } from '../book.js';
import { t } from '../i18n.js';
import MobileArticleContents from '../components/MobileArticleContents.jsx';
import { Breadcrumb, Paragraphs } from '../components/Common.jsx';

function BodyDiagram({ model, section }) {
  const diagram = model.bodyDiagram;
  if (!diagram || diagram.section !== section) return null;
  return <figure className="body-diagram"><a href={asset(diagram.image)} target="_blank" rel="noopener" aria-label={t.diagramAria(model.title)}>
    <img src={asset(diagram.image)} width={diagram.width} height={diagram.height} loading="lazy" decoding="async" alt={diagram.caption} /></a>
    <figcaption>{diagram.caption}</figcaption></figure>;
}

function Illustration({ model }) {
  const picture = <img src={asset(model.image)} alt={t.imageAlt(model.title, model.brief)} width={model.imageWidth || 1200} height={model.imageHeight || 600} />;
  return <figure className={`illustration${model.imageReady ? ' illustration--ready' : ''}`}>
    {model.imageReady ? <a href={asset(model.image)} target="_blank" rel="noopener" aria-label={t.imageAria(model.title)}>{picture}</a> : picture}
  </figure>;
}

function ArticleSection({ id, number, title, children }) {
  return <section className="article-section" id={id}><h2>{number && <span className="section-number">{number}</span>}{title}</h2>{children}</section>;
}

export default function ModelPage({ model: m, read, onToggleRead }) {
  const minutes = t.readingMinutes([m.body, m.example, m.caution, m.when, m.extra, m.exercise, ...m.steps].join(' '));
  const index = orderedModels.findIndex(model => model.id === m.id);
  const previous = orderedModels[index - 1];
  const next = orderedModels[index + 1];
  const title = Object.fromEntries(articleSections);
  return <><Breadcrumb last={m.title} middle={m.category} />
    <article><div className="article-top"><div className="eyebrow">MENTAL MODEL / {String(m.number).padStart(3, '0')}</div><span className="pill">{m.category}</span></div>
      <h1 className="article-title">{m.title}</h1><p className="english-title">{m.en}</p><p className="article-lead">{m.lead}</p>
      <div className="meta"><span>{t.minutes(minutes)}</span><span>{t.handbookNumber(pad(m.number), models.length)}</span></div>
      <MobileArticleContents items={articleSections.filter(([id]) => id !== 'sources' || m.sources.length > 0)} />
      <Illustration key={m.id} model={m} />
      <ArticleSection id="concept" number="01" title={title.concept}><div className="prose"><Paragraphs text={m.body} /></div><BodyDiagram model={m} section="concept" /></ArticleSection>
      <ArticleSection id="example" number="02" title={title.example}><div className="example-box"><Paragraphs text={m.example} /></div><BodyDiagram model={m} section="example" /></ArticleSection>
      <ArticleSection id="another-example" number="03" title={title['another-example']}><div className="prose"><Paragraphs text={m.extra} /></div></ArticleSection>
      <ArticleSection id="practice" number="04" title={title.practice}><p className="when-to-use"><strong>{t.whenLabel}</strong>{m.when}</p>
        <ol className="steps">{m.steps.map((step, index) => <li key={index}>{step}</li>)}</ol></ArticleSection>
      <ArticleSection id="boundaries" number="05" title={title.boundaries}><div className="caution-box">{m.caution}</div></ArticleSection>
      <ArticleSection id="exercise" number="06" title={title.exercise}><div className="exercise-card"><span className="exercise-label">{t.exerciseLabel}</span><p>{m.exercise}</p></div></ArticleSection>
      <ArticleSection id="related" title={title.related}><div className="related">{m.related.map(id => {
        const related = byId.get(id);
        return <a key={id} href={modelLink(related)}><small>MODEL {pad(related.number)} ↗</small>{related.title}</a>;
      })}</div></ArticleSection>
      {m.sources.length > 0 && <ArticleSection id="sources" title={title.sources}><ul className="sources">{m.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title} ↗</a></li>)}
      </ul></ArticleSection>}
      <p className="article-footnote">{t.footnote}</p>
      <div className="completion"><span>{t.completion}</span><button id="mark-read" className={`read-button${read ? ' is-read' : ''}`} aria-pressed={read} onClick={() => onToggleRead(m.id)}>
        {read ? t.markedRead : t.markRead}</button></div>
      <nav className="pagination" aria-label={t.paginationAria}>
        {previous ? <a href={modelLink(previous)}><small>{t.previousModel(pad(previous.number))}</small>{previous.title}</a> : <a href={homeLink}><small>{t.backLabel}</small>{t.startReading}</a>}
        {next ? <a href={modelLink(next)}><small>{t.nextModel(pad(next.number))}</small>{next.title}</a> : <a href={homeLink}><small>{t.backToContents}</small>{t.exploreMore}</a>}
      </nav></article>
  </>;
}
