#!/usr/bin/env python3
"""Check actual instruction continuity, link resolution, entrypoints and generic isolation."""
import hashlib
import json
import re
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
MIGRATION = ROOT / 'specialist/migration-continuity'

def check():
    manifest = json.loads((MIGRATION/'manifest.json').read_text())
    failures = []
    def require(value, reason):
        if not value: failures.append(reason)
    for name, digest in manifest['baselineHashes'].items():
        p = MIGRATION/'baseline'/name
        require(p.exists() and hashlib.sha256(p.read_bytes()).hexdigest() == digest, f'Baseline changed: {name}')
    old = (MIGRATION/'baseline/AGENTS.md.txt').read_text()
    sections = {x.split('\n',1)[0]: x.split('\n',1)[1].strip() for x in old.split('## ')[1:]}
    require(set(sections) == set(manifest['sectionDestinations']), 'Incomplete section inventory')
    for heading, destination in manifest['sectionDestinations'].items():
        require(sections[heading] in (ROOT/destination).read_text(), f'Lost baseline requirement: {heading}')
    for legacy in manifest['legacy']:
        require((MIGRATION/f'baseline/{legacy}.md.txt').read_bytes() == (ROOT/f'specialist/shared/{legacy}.md').read_bytes(), f'Changed approved skill detail: {legacy}')
    files = [ROOT/'AGENTS.md', ROOT/'agent-library/README.md']
    files += list((ROOT/'agent-library').rglob('SKILL.md')) + list((ROOT/'specialist').rglob('*.md'))
    files += list((ROOT/'.agents/skills').glob('*/SKILL.md')) + list((ROOT/'.cursor/skills').glob('*/SKILL.md'))
    for path in files:
        text = path.read_text()
        if path.name == 'SKILL.md':
            require(text.startswith('---\n'), f'Missing metadata: {path}')
            require(bool(re.search(r'^name: [a-z0-9-]+$',text,re.M)), f'Bad skill name: {path}')
            require(bool(re.search(r'^description: .+',text,re.M)), f'Missing description: {path}')
        for target in re.findall(r'(?<!!)\[[^\]]*\]\(([^)]+)\)', text):
            if '://' in target or target.startswith('#'): continue
            target = target.split('#',1)[0]
            require((path.parent/target).exists(), f'Broken link: {path.relative_to(ROOT)} -> {target}')
    for name in manifest['genericSkills']:
        source = ROOT/'agent-library/skills'/name/'SKILL.md'
        require((ROOT/'.agents/skills'/name/'SKILL.md').resolve() == source.resolve(), f'Generic entrypoint drift: {name}')
        text = source.read_text()
        require(not re.search(r'Vero|Lumi|Luci|JPMC|Fortress|GPT-6|\.\./.*specialist|PLAN\.md|SETTINGS\.md',text), f'Project leakage: {name}')
    for name in manifest['specialists']:
        source = ROOT/'specialist'/name/'SKILL.md'
        wrapper = ROOT/'.agents/skills'/name/'SKILL.md'
        require(wrapper.exists() and str(Path('../../../specialist')/name/'SKILL.md') in wrapper.read_text(), f'Specialist discovery missing: {name}')
    for legacy, specialist in manifest['legacy'].items():
        canonical = ROOT/'.agents/skills'/legacy/'SKILL.md'
        compatibility = ROOT/'.cursor/skills'/legacy/'SKILL.md'
        require(compatibility.resolve() == canonical.resolve(), f'Legacy duplicate: {legacy}')
        require(f'../../../specialist/{specialist}/SKILL.md' in canonical.read_text(), f'Legacy route missing: {legacy}')
    if failures:
        raise SystemExit('\n'.join(failures))
    print(f'PASS: {len(sections)} migrated sections; 3 exact skill references; {len(manifest["genericSkills"])} generic skills; {len(manifest["specialists"])} specialists; links and compatibility paths')
    print('This is structural/source continuity, not proof of runtime discovery or agent behavior.')

if __name__ == '__main__': check()
