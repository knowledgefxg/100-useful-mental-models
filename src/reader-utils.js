import { matchingScenarios } from './scenarios.js';

export const storage = {
  get(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch { return false; }
  },
};

const normalize = value => String(value).normalize('NFKC').toLocaleLowerCase().trim();

const zhLabels = { lead: '一句话理解', when: '什么时候用', body: '定义', example: '身边的例子', extra: '换个场景', steps: '可以这样试', caution: '使用边界', exercise: '一分钟练习', scene: '适用场景' };

export function searchEntries(models, value, { scenarios: sceneList, labels = zhLabels, sceneSnippet = (scene, when) => `${scene}：${when}` } = {}) {
  const query = normalize(value);
  if (!query) return [];
  const tokens = query.split(/\s+/);
  const scenes = matchingScenarios(query, sceneList);
  return models.map(model => {
    const title = normalize(`${model.title} ${model.en}`);
    const passages = [
      [labels.lead, model.lead], [labels.when, model.when], [labels.body, model.body],
      [labels.example, model.example], [labels.extra, model.extra],
      [labels.steps, model.steps.join(' ')], [labels.caution, model.caution], [labels.exercise, model.exercise],
    ];
    const text = normalize([title, model.category, ...passages.map(([, text]) => text)].join(' '));
    const scene = scenes.find(scene => scene.models.includes(model.id));
    const literalMatch = tokens.every(token => text.includes(token));
    if (!scene && !literalMatch) return null;
    const exactTitle = normalize(model.title) === query || normalize(model.en) === query;
    const score = exactTitle ? 900 : title.includes(query) ? 800
      : scene ? 600 - scene.models.indexOf(model.id) * 15
        : normalize(model.when).includes(query) ? 400 : normalize(model.lead).includes(query) ? 300 : 100;
    const passage = passages.find(([, text]) => tokens.every(token => normalize(text).includes(token)))
      || passages.find(([, text]) => tokens.some(token => normalize(text).includes(token)));
    let label, snippet;
    if (scene && !title.includes(query)) {
      label = labels.scene;
      snippet = sceneSnippet(scene.title, model.when);
    } else {
      [label, snippet] = passage || passages[0];
    }
    snippet = snippet.replace(/\s+/g, ' ');
    const index = Math.min(...tokens.map(token => normalize(snippet).indexOf(token)).filter(index => index >= 0));
    const offset = Number.isFinite(index) ? Math.max(0, index - 28) : 0;
    snippet = `${offset ? '…' : ''}${snippet.slice(offset, offset + 115)}${snippet.length > offset + 115 ? '…' : ''}`;
    return { model, score, label, snippet };
  }).filter(Boolean).sort((a, b) => b.score - a.score || a.model.id - b.model.id);
}

export function searchModels(models, value, options) {
  return searchEntries(models, value, options).map(result => result.model);
}

// Reject stale or corrupted browser data rather than jumping to an invalid position.
export function readPosition(value) {
  if (!value || typeof value !== 'object' || !Number.isFinite(value.y) || value.y < 0) return null;
  return {
    y: value.y,
    section: typeof value.section === 'string' ? value.section : null,
    offset: Number.isFinite(value.offset) ? value.offset : 0,
  };
}

export function scrollToSection(id) {
  const section = document.getElementById(id);
  section?.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    block: 'start',
  });
  if (id === 'main') section?.focus({ preventScroll: true });
}
