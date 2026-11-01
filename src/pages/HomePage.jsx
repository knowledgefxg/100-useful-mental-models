import { categories, lang, models, orderedModels, modelCount, modelLink, topicLink, pad } from '../book.js';
import { t } from '../i18n.js';
import { scenariosFor } from '../scenarios.js';
import { Breadcrumb, SectionLink } from '../components/Common.jsx';

export default function HomePage({ lastId, onSearch }) {
  const last = models.find(model => model.id === lastId);
  const heroLines = t.heroText(modelCount);
  const statValues = [modelCount, pad(categories.length), '03'];
  return <><Breadcrumb last={t.homeCrumb} />
    <section className="home-hero"><div className="eyebrow">A FIELD GUIDE TO BETTER THINKING</div>
      <h1>{t.heroTitle[0]}<span>{t.heroTitle[1]}</span></h1>
      <p>{heroLines.map((line, index) => <span key={index}>{index > 0 && <br />}{line}</span>)}</p>
      <div className="hero-actions"><a className="primary" href={modelLink(orderedModels[0])}>{t.startFirst} <span>→</span></a>
        {last ? <a className="subtle-link" href={modelLink(last)}>{t.continueReading(last.title)}</a> : <SectionLink className="subtle-link" id="topics">{t.exploreTopics}</SectionLink>}</div>
      <div className="stats">{t.stats.map(([label, note], index) => <div key={label}><strong>{statValues[index]}</strong><span>{label}<br />{note}</span></div>)}</div>
    </section>
    <section id="scenarios" className="scenario-section">
      <div className="section-heading"><h2>{t.scenariosTitle}</h2><small>{t.scenariosSub}</small></div>
      <p className="scenario-intro">{t.scenariosIntro}</p>
      <div className="scenario-grid">{scenariosFor(lang).map(scene => <button key={scene.id} className="scenario-card" onClick={() => onSearch(scene.query)}>
        <strong>{scene.title}<span aria-hidden="true">↗</span></strong><span>{scene.description}</span>
        <small>{t.sceneCount(scene.models.length)}</small>
      </button>)}</div>
    </section>
    <section id="topics"><div className="section-heading"><h2>{t.topicsTitle}</h2><small>{t.topicsSub}</small></div>
      <div className="topic-grid">{categories.map((category, index) => <a key={category.name} className="topic-card" href={topicLink(category.name)}>
        <header><span className="topic-index">0{index + 1} /</span><span className="topic-count">{t.topicCount(models.filter(model => model.category === category.name).length)}</span></header>
        <h3>{category.name}</h3><p>{category.description}</p></a>)}</div></section>
    <section id="how-to-read" className="reading-note"><span aria-hidden="true">↳</span><div><b>{t.howTitle}</b>
      <p>{t.howText}</p></div></section>
    <section id="about" className="reading-note"><span aria-hidden="true">◫</span><div><b>{t.aboutTitle}</b>
      <p>{t.aboutText(models.filter(model => model.imageReady).length, models.length)}</p>
</div></section>
  </>;
}
