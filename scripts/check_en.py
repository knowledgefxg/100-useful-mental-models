#!/usr/bin/env python3
"""Validate English translations in content/en/models/ against content/models.json.

Usage: python3 scripts/check_en.py [id ...]   (defaults to every model)
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TEXT_FIELDS = ['lead', 'when', 'body', 'example', 'extra', 'caution', 'exercise', 'brief']
CJK = re.compile(r'[\u3400-\u9fff\uff00-\uffef\u3000-\u303f]')


def paragraphs(text):
    return len([part for part in re.split(r'\n\s*\n', text) if part.strip()])


def check(model):
    path = ROOT / f'content/en/models/{model["id"]:03d}.json'
    if not path.exists():
        return [f'{path.name}: missing']
    try:
        data = json.loads(path.read_text(encoding='utf-8'))
    except json.JSONDecodeError as error:
        return [f'{path.name}: invalid JSON ({error})']
    problems = []
    for field in TEXT_FIELDS:
        if not isinstance(data.get(field), str) or not data[field].strip():
            problems.append(f'{path.name}: "{field}" must be a non-empty string')
    if not isinstance(data.get('steps'), list) or len(data['steps']) != 3 or not all(isinstance(s, str) and s.strip() for s in data['steps']):
        problems.append(f'{path.name}: "steps" must be a list of 3 strings')
    if model.get('bodyDiagram') and not str(data.get('diagramCaption', '')).strip():
        problems.append(f'{path.name}: "diagramCaption" is required (this model has a body diagram)')
    if not isinstance(data.get('sources'), list) or len(data['sources']) != len(model['sources']):
        problems.append(f'{path.name}: "sources" must list {len(model["sources"])} translated title(s), in the original order')
    for field in ['body', 'example', 'extra']:
        if isinstance(data.get(field), str) and paragraphs(data[field]) != paragraphs(model[field]):
            problems.append(f'{path.name}: "{field}" has {paragraphs(data[field])} paragraph(s); the Chinese has {paragraphs(model[field])}')
    leftover = CJK.findall(json.dumps(data, ensure_ascii=False))
    if leftover:
        problems.append(f'{path.name}: contains Chinese characters or full-width punctuation: {"".join(sorted(set(leftover)))[:20]}')
    return problems


def main():
    models = json.loads((ROOT / 'content/models.json').read_text(encoding='utf-8'))['models']
    ids = {int(arg) for arg in sys.argv[1:]} or {model['id'] for model in models}
    problems = [problem for model in models if model['id'] in ids for problem in check(model)]
    print('\n'.join(problems) if problems else f'OK: {len(ids)} translation(s) valid')
    return 1 if problems else 0


if __name__ == '__main__':
    sys.exit(main())
