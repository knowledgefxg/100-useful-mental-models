#!/usr/bin/env python3
"""Build the Markdown book and React reader data from content/models.tsv."""
import csv
import hashlib
import html
import json
import struct
from body_diagrams import make_body_diagram
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CATEGORIES = {
    '认知与推理': '检查我们如何理解世界、形成判断与处理分歧。',
    '证据与统计': '区分故事、相关与因果，让判断获得可检验的依据。',
    '选择与决策': '在不完整信息和有限资源下，比较选项与代价。',
    '沟通与影响': '把意思讲清楚，也理解信息如何影响他人。',
    '伦理与协作': '在关系与制度中，讨论尊重、公平和信任。',
    '工具与行动': '把模糊问题转成可以推进、验证与复盘的行动。',
    '系统与规律': '看到相互作用、反馈、阈值和变化中的限制。',
    '行为与成长': '理解动机、记忆、能力与个体差异，改善学习和工作。',
}
# ASCII directory names for topic pages, shared by both languages.
SLUGS = {
    '认知与推理': 'cognition', '证据与统计': 'evidence', '选择与决策': 'decisions', '沟通与影响': 'communication',
    '伦理与协作': 'ethics', '工具与行动': 'action', '系统与规律': 'systems', '行为与成长': 'growth',
}
EN_TEXT_FIELDS = ('lead', 'when', 'body', 'example', 'extra', 'steps', 'caution', 'exercise', 'brief')


def build_english(models):
    """Merge content/en/ translations over the Chinese data; untranslated models fall back to Chinese."""
    en_categories = json.loads((ROOT / 'content/en/categories.json').read_text(encoding='utf-8'))
    assert set(en_categories) == set(CATEGORIES)
    missing = []
    en_models = []
    for m in models:
        path = ROOT / f"content/en/models/{m['id']:03d}.json"
        tr = json.loads(path.read_text(encoding='utf-8')) if path.exists() else None
        if tr is None:
            missing.append(m['id'])
        e = {key: m[key] for key in ('id', 'number', 'related', 'imageReady', 'imageWidth', 'imageHeight', 'image')}
        e.update(title=m['en'], en=m['title'], category=en_categories[m['category']]['name'])
        for key in EN_TEXT_FIELDS:
            e[key] = tr[key] if tr else m[key]
        e['sources'] = [dict(s, title=tr['sources'][i] if tr else s['title']) for i, s in enumerate(m['sources'])]
        e['bodyDiagram'] = m['bodyDiagram'] and dict(m['bodyDiagram'], caption=tr.get('diagramCaption', m['bodyDiagram']['caption']) if tr else m['bodyDiagram']['caption'])
        en_models.append(e)
    data = dict(categories=[dict(name=en_categories[k]['name'], description=en_categories[k]['description'], slug=SLUGS[k]) for k in CATEGORIES],
                models=en_models)
    (ROOT / 'content/models.en.json').write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    if missing:
        print(f"Warning: {len(missing)} model(s) have no English translation yet and use Chinese text: {', '.join(map(str, missing))}")


def build():
    models = []
    references = json.loads((ROOT / 'content/sources.json').read_text(encoding='utf-8'))
    with (ROOT / 'content/models.tsv').open(encoding='utf-8') as source:
        source_ids = [int(row[0]) for row in csv.reader(source, delimiter='\t') if row]
    expected_ids = set(range(1, len(source_ids) + 1))
    assert len(source_ids) == len(set(source_ids)) and set(source_ids) == expected_ids, 'IDs must be contiguous and unique'
    with (ROOT / 'content/definitions.tsv').open(encoding='utf-8') as f:
        definitions = {int(row[0]): row[1] for row in csv.reader(f, delimiter='\t') if row}
    assert set(references) == set(map(str, expected_ids))
    assert set(definitions) == expected_ids
    extras = json.loads((ROOT / 'content/extras.json').read_text(encoding='utf-8'))
    structures = json.loads((ROOT / 'content/infographic-structures.json').read_text(encoding='utf-8'))
    assert set(structures) == set(map(str, expected_ids))
    assert {int(key) for key in extras} == expected_ids
    with (ROOT / 'content/models.tsv').open(encoding='utf-8') as f:
        for row in csv.reader(f, delimiter='\t'):
            if not row:
                continue
            assert len(row) == 11, (row[0], len(row))
            ident, title, en, cat, lead, body, example, steps, caution, brief, related = row
            assert cat in CATEGORIES, cat
            model = dict(id=int(ident), title=title, en=en, category=cat, lead=lead,
                         body=body, example=example, steps=steps.split('|'), caution=caution,
                         brief=brief, related=[int(x) for x in related.split(',')])
            assert len(model['steps']) == 3
            model['definition'] = definitions[int(ident)]
            intro = model['body'].split('\n\n')
            model['body'] = '\n\n'.join([intro[0], model['definition'], *intro[1:]])
            model['diagramStructure'] = structures[ident]
            if structures[ident]['explanation']:
                model['body'] += '\n\n' + structures[ident]['explanation']
            model.update(extras[ident])
            assert all(model.get(key) for key in ('when', 'extra', 'exercise'))
            model['sources'] = references[ident]
            models.append(model)
    models.sort(key=lambda m: m['id'])
    assert [m['id'] for m in models] == sorted(expected_ids), 'IDs must be unique and complete'
    # Keep IDs stable for links, assets and saved progress; display numbers follow the topic order.
    ordered_models = [m for category in CATEGORIES for m in models if m['category'] == category]
    for number, model in enumerate(ordered_models, 1):
        model['number'] = number
    by_id = {m['id']: m for m in models}
    art = ROOT / 'docs/assets/illustrations'
    art.mkdir(parents=True, exist_ok=True)
    (ROOT / 'docs/models').mkdir(parents=True, exist_ok=True)
    for m in models:
        num = f"{m['id']:03d}"
        existing = next((art / f'{num}.{ext}' for ext in ('webp', 'png', 'jpg', 'svg')
                         if (art / f'{num}.{ext}').exists()), art / f'{num}.svg')
        if not existing.exists():
            existing.write_text(f'''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600" viewBox="0 0 1200 600" role="img" aria-labelledby="title desc">
<title id="title">{html.escape(m['title'])}：插图占位</title><desc id="desc">{html.escape(m['brief'])}</desc>
<rect width="1200" height="600" rx="20" fill="#f2eee5"/>
<rect x="28" y="28" width="1144" height="544" rx="12" fill="none" stroke="#d0c8ba" stroke-dasharray="8 8"/>
<g font-family="system-ui,sans-serif" text-anchor="middle" fill="#827b70">
<text x="600" y="240" font-size="20" letter-spacing="5">MODEL {num}</text>
<text x="600" y="310" font-size="32">插图待补</text>
<text x="600" y="360" font-size="20">{html.escape(m['title'])}</text></g></svg>''', encoding='utf-8')
        m['imageReady'] = existing.suffix != '.svg'
        m['imageWidth'], m['imageHeight'] = (1200, 600)
        dimension_source = existing if existing.suffix == '.png' else existing.with_suffix('.png')
        if dimension_source.exists():
            m['imageWidth'], m['imageHeight'] = struct.unpack('>II', dimension_source.read_bytes()[16:24])
        image_version = hashlib.sha256(existing.read_bytes()).hexdigest()[:12]
        m['image'] = str(existing.relative_to(ROOT)) + f'?v={image_version}'
        m['bodyDiagram'] = make_body_diagram(ROOT, m)
        if m['bodyDiagram']:
            diagram_path = ROOT / m['bodyDiagram']['image']
            diagram_version = hashlib.sha256(diagram_path.read_bytes()).hexdigest()[:12]
            m['bodyDiagram']['image'] += f'?v={diagram_version}'
        diagram_markdown = (f"\n\n![{m['title']} · 正文图解](../assets/body-diagrams/{num}.svg)\n\n"
                            f"*{m['bodyDiagram']['caption']}*" if m['bodyDiagram'] else '')
        concept_diagram = diagram_markdown if m['bodyDiagram'] and m['bodyDiagram']['section'] == 'concept' else ''
        example_diagram = diagram_markdown if m['bodyDiagram'] and m['bodyDiagram']['section'] == 'example' else ''
        related = '\n'.join(f"- [{by_id[r]['number']:02d} · {by_id[r]['title']}]({r:03d}.md)" for r in m['related'])
        assert len(set(m['related'])) == 3 and all(r in by_id and r != m['id'] for r in m['related']), m['id']
        sources = '\n'.join(f"- [{s['title']}]({s['url']})" for s in m['sources'])
        source_section = f'\n\n## 来源与延伸\n\n{sources}' if m['sources'] else ''
        steps = '\n'.join(f'{i}. {step}' for i, step in enumerate(m['steps'], 1))
        text = f'''# {m['number']:02d} · {m['title']}

{m['en']} · {m['category']}

> {m['lead']}

![{m['title']}{'' if m['imageReady'] else ' · 插图占位'}](../assets/illustrations/{existing.name})

*配图说明：{m['brief']}*

## 定义

{m['body']}{concept_diagram}

## 举个身边的例子

{m['example']}{example_diagram}

## 换个场景看看

{m['extra']}

## 可以这样试

**什么时候用得上：** {m['when']}

{steps}

## 别用过头了

{m['caution']}

## 花一分钟试试

{m['exercise']}

## 顺着看下去

{related}{source_section}

---

例子为方便理解而设置，不是真实案例报道。
'''
        (ROOT / f'docs/models/{num}.md').write_text(text, encoding='utf-8')
    data = dict(categories=[dict(name=k, description=v, slug=SLUGS[k]) for k, v in CATEGORIES.items()], models=models)
    (ROOT / 'content/models.json').write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    build_english(models)
    summary = '# 目录\n\n* [开始阅读](README.md)\n* [信息图结构对照](infographic-structures.md)\n\n'
    for cat in CATEGORIES:
        summary += f'## {cat}\n\n'
        summary += '\n'.join(f"* [{m['number']:02d} · {m['title']}](models/{m['id']:03d}.md)" for m in models if m['category'] == cat) + '\n\n'
    (ROOT / 'docs/SUMMARY.md').write_text(summary, encoding='utf-8')
    print(f"Built {len(models)} chapters, {len(CATEGORIES)} topic groups and {len(models)} illustration slots.")


if __name__ == '__main__':
    build()
