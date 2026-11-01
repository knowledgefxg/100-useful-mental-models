import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { searchModels, searchEntries, readPosition, storage } from '../src/reader-utils.js';
import { legacyHashPath, parseRoute, sitePaths, splitLanguage, topicPath } from '../src/routes.js';
import { enScenarios, matchingScenarios } from '../src/scenarios.js';

const { models, categories } = JSON.parse(readFileSync(new URL('../content/models.json', import.meta.url), 'utf8'));
const en = JSON.parse(readFileSync(new URL('../content/models.en.json', import.meta.url), 'utf8'));

test('all 100 chapters retain their images, diagrams, and related models', () => {
  assert.equal(models.length, 100);
  assert.equal(new Set(models.map(model => model.id)).size, 100);
  assert.equal(models.filter(model => model.bodyDiagram).length, 68);
  for (const model of models) {
    assert.ok(model.imageReady, `missing finished illustration: ${model.id}`);
    assert.ok(existsSync(model.image.split('?')[0]), model.image);
    if (model.bodyDiagram) assert.ok(existsSync(model.bodyDiagram.image.split('?')[0]));
    assert.equal(model.steps.length, 3);
    for (const id of model.related) assert.ok(models.some(model => model.id === id));
  }
});

test('page paths resolve to the home page, models, and ASCII topic slugs', () => {
  assert.equal(parseRoute('', models, categories).type, 'home');
  assert.equal(parseRoute('index.html', models, categories).type, 'home');
  assert.equal(parseRoute('model/66/', models, categories).model.title, '反馈回路');
  assert.equal(parseRoute('model/66', models, categories).model.title, '反馈回路');
  for (const category of categories) {
    assert.match(topicPath(category), /^topic\/[a-z]+\/$/);
    assert.equal(parseRoute(topicPath(category), models, categories).category.name, category.name);
  }
  assert.deepEqual(splitLanguage('en/model/5/'), { lang: 'en', path: 'model/5/' });
  assert.deepEqual(splitLanguage('en/'), { lang: 'en', path: '' });
  assert.deepEqual(splitLanguage('en'), { lang: 'en', path: '' });
  assert.deepEqual(splitLanguage('model/5/'), { lang: 'zh', path: 'model/5/' });
  assert.deepEqual(splitLanguage('english/'), { lang: 'zh', path: 'english/' });
  for (const path of ['model/999/', 'topic/unknown/', 'unknown', '404']) assert.equal(parseRoute(path, models, categories).type, 'not-found');
  const paths = sitePaths(models, categories);
  assert.equal(paths.length, 1 + categories.length + models.length);
  assert.equal(new Set(paths).size, paths.length);
});

test('old hash links redirect to the matching page path', () => {
  assert.equal(legacyHashPath('#home', categories), '');
  assert.equal(legacyHashPath('#references', categories), '');
  assert.equal(legacyHashPath('#model/66', categories), 'model/66/');
  assert.equal(legacyHashPath(`#topic/${encodeURIComponent(categories[0].name)}`, categories), topicPath(categories[0]));
  for (const hash of ['', '#example', '#topic/%E0%A4%A', '#topic/unknown']) assert.equal(legacyHashPath(hash, categories), null);
});

test('the English edition mirrors every model, topic, and page path', () => {
  assert.equal(en.models.length, models.length);
  assert.deepEqual(en.categories.map(category => category.slug), categories.map(category => category.slug));
  assert.deepEqual(sitePaths(en.models, en.categories), sitePaths(models, categories));
  for (const model of en.models) {
    const zh = models.find(item => item.id === model.id);
    assert.equal(model.title, zh.en);
    assert.equal(model.en, zh.title);
    assert.equal(model.number, zh.number);
    assert.deepEqual(model.related, zh.related);
    assert.ok(en.categories.some(category => category.name === model.category));
    assert.equal(model.sources.length, zh.sources.length);
  }
});

test('English search finds models by name and by everyday situation', () => {
  const options = { scenarios: enScenarios };
  assert.equal(searchModels(en.models, 'sunk cost', options)[0].id, 1);
  assert.equal(searchModels(en.models, 'Sunk Cost', options)[0].id, 1);
  for (const scene of enScenarios) {
    assert.equal(searchModels(en.models, scene.query, options)[0].id, scene.models[0], scene.query);
    assert.ok(scene.models.every(id => en.models.some(model => model.id === id)));
  }
  assert.deepEqual(matchingScenarios('st', enScenarios), []);
  assert.deepEqual(matchingScenarios('stuc', enScenarios).map(scene => scene.id), ['effort']);
  assert.deepEqual(matchingScenarios('沟通', undefined).map(scene => scene.id), ['talk']);
});

test('search ranks model names and searches article text without matching handbook numbers', () => {
  assert.deepEqual(searchModels(models, '066'), []);
  assert.equal(searchModels(models, '沉没成本')[0].id, 1);
  assert.equal(searchModels(models, 'sunk cost')[0].id, 1);
  assert.ok(searchModels(models, '客服').some(model => model.id === 66));
  assert.deepEqual(searchModels(models, ' '), []);
  assert.deepEqual(searchModels(models, 'unfindable-string-12345'), []);
});

test('storage remains usable when a browser blocks local storage', () => {
  assert.equal(storage.get('test', 'fallback'), 'fallback');
  assert.equal(storage.set('test', 1), false);
  globalThis.localStorage = { getItem: () => '{invalid', setItem: () => { throw Error('blocked'); } };
  try {
    assert.deepEqual(storage.get('test', []), []);
    assert.equal(storage.set('test', 1), false);
  } finally { delete globalThis.localStorage; }
});


test('new chapters are searchable, independently sourced, and numbered after the original book', () => {
  const titles = ['锚定效应', '框架效应', '结果偏差', '瓶颈理论', '古德哈特定律', '执行意图', '主动回忆'];
  for (const [offset, title] of titles.entries()) {
    const id = 81 + offset;
    const model = parseRoute(`model/${id}/`, models, categories).model;
    assert.equal(model.title, title);
    assert.equal(searchModels(models, title)[0].id, id);
    assert.ok(model.body.includes(model.definition));
    assert.ok(model.sources.length > 0);
    assert.ok(model.sources.every(source => !source.title.includes('原始清单')));
    assert.ok(model.bodyDiagram);
    assert.equal(new Set(model.related).size, 3);
  }
});


test('communication additions remain grouped and searchable', () => {
  const added = ['非暴力沟通', '推论阶梯', '乔哈里视窗'];
  assert.equal(models.filter(model => model.category === '沟通与影响').length, 8);
  for (const [offset, title] of added.entries()) {
    const model = parseRoute(`model/${88 + offset}/`, models, categories).model;
    assert.equal(model.title, title);
    assert.equal(model.category, '沟通与影响');
    assert.equal(searchModels(models, title)[0].id, model.id);
    assert.ok(model.body.includes(model.definition));
    assert.ok(model.sources.every(source => !source.title.includes('原始清单')));
    assert.ok(model.bodyDiagram);
    assert.equal(new Set(model.related).size, 3);
  }
});


test('the final ten additions complete a contiguous 100-model handbook', () => {
  const titles = ['能力圈','安全边际','贝叶斯更新','基准率思维','期望值','系统杠杆点','网络效应','激励机制','比较优势','现时偏差'];
  assert.deepEqual(models.map(model => model.id), Array.from({length:100}, (_,i) => i+1));
  for (const [offset, title] of titles.entries()) {
    const id = 91 + offset;
    const model = parseRoute(`model/${id}/`, models, categories).model;
    assert.equal(model.title, title);
    assert.equal(searchModels(models, title)[0].id, id);
    assert.ok(model.body.includes(model.definition));
    assert.ok(model.sources.length > 0);
    assert.ok(model.sources.every(source => !source.title.includes('原始清单')));
    assert.ok(model.bodyDiagram);
    assert.equal(new Set(model.related).size, 3);
    assert.ok(!model.related.includes(id));
  }
});


test('every home scenario prioritizes useful models, including natural-language queries', async () => {
  const { scenarios } = await import('../src/scenarios.js');
  for (const scene of scenarios) {
    assert.equal(searchModels(models, scene.query)[0].id, scene.models[0]);
    assert.ok(scene.models.every(id => models.some(model => model.id === id)));
  }
  for (const query of ['拖延', '总是拖延怎么办', '不想开始', 'procrastination']) {
    const result = searchEntries(models, query)[0];
    assert.equal(result.model.id, 86);
    assert.equal(result.label, '适用场景');
    assert.ok(result.snippet.includes(result.model.when.slice(0, 12)));
  }
  assert.deepEqual(searchModels(models, '０８６'), []);
  assert.equal(searchModels(models, '损失厌恶')[0].id, 28);
  assert.equal(searchModels(models, '  Sunk    Cost  ')[0].id, 1);
  assert.equal(searchEntries(models, '客服').some(result => result.snippet.includes('客服')), true);
  assert.deepEqual(searchEntries(models, '[.*+?'), []);
});

test('reading positions tolerate missing and corrupted browser storage', () => {
  for (const value of [null, [], 'bad', { y: -5 }, { y: '123' }, { y: Infinity }]) assert.equal(readPosition(value), null);
  assert.deepEqual(readPosition({ y: 250, section: 'example', offset: 13 }), { y: 250, section: 'example', offset: 13 });
  assert.deepEqual(readPosition({ y: 0, section: 3, offset: 'bad' }), { y: 0, section: null, offset: 0 });
});


test('model numbers continue from 1 to 100 across the eight categories', () => {
  const ordered = categories.flatMap(category => models.filter(model => model.category === category.name));
  assert.deepEqual(ordered.map(model => model.number), Array.from({ length: 100 }, (_, index) => index + 1));
  assert.equal(ordered[0].title, '启发式法则');
  assert.equal(ordered[17].number, 18);
  for (const model of ordered) {
    const chapter = readFileSync(new URL(`../docs/models/${String(model.id).padStart(3, '0')}.md`, import.meta.url), 'utf8');
    assert.ok(chapter.startsWith(`# ${String(model.number).padStart(2, '0')} · ${model.title}\n`));
  }
});
