import { categories, models, modelLink, pad } from '../book.js';
import { Breadcrumb } from '../components/Common.jsx';

export default function TopicPage({ category }) {
  const items = models.filter(model => model.category === category.name);
  return <><Breadcrumb last={category.name} /><div className="eyebrow">EXPLORE A TOPIC / {pad(categories.indexOf(category) + 1)}</div>
    <h1 className="topic-heading">{category.name}</h1><p className="topic-description">{category.description}</p>
    <div className="model-list" id="topic-models">{items.map(model => <a key={model.id} href={modelLink(model)}>
      <span className="list-number">{pad(model.number)}</span><div><h3>{model.title}</h3><p>{model.lead}</p></div><span className="list-arrow">→</span></a>)}</div></>;
}
