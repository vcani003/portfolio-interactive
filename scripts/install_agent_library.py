#!/usr/bin/env python3
"""Install generated standalone generic skills; refuse unowned/modified destinations."""
import argparse
import hashlib
import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'agent-library/skills'
MARKER = '.team-library-install.json'

def hashes(folder):
    return {str(p.relative_to(folder)): hashlib.sha256(p.read_bytes()).hexdigest()
            for p in sorted(folder.rglob('*')) if p.is_file() and p.name != MARKER}

def install(destination):
    sources = sorted(SOURCE.iterdir())
    # Preflight all destinations before mutating any installation.
    for source in sources:
        target = destination / source.name
        if target.is_symlink():
            raise ValueError(f'Refusing symlink destination: {target}')
        if target.exists():
            if any(p.is_symlink() for p in target.rglob('*')):
                raise ValueError(f'Refusing nested symlinks: {target}')
            marker = target / MARKER
            if not marker.is_file():
                raise ValueError(f'Refusing unowned destination: {target}')
            prior = json.loads(marker.read_text())
            for relative in prior.get('files', {}):
                entry = Path(relative)
                if entry.is_absolute() or '..' in entry.parts:
                    raise ValueError('Unsafe installation manifest path')
            if prior.get('owner') != 'vero-team-library' or prior.get('files') != hashes(target):
                raise ValueError(f'Refusing modified destination: {target}')
    destination.mkdir(parents=True, exist_ok=True)
    for source in sources:
        target = destination / source.name
        target.mkdir(exist_ok=True)
        previous = target / MARKER
        if previous.exists():
            for relative in json.loads(previous.read_text())['files']:
                stale = Path(relative)
                if stale.is_absolute() or '..' in stale.parts:
                    raise ValueError('Unsafe installation manifest path')
                if not (source / stale).exists():
                    (target / stale).unlink()
        shutil.copytree(source, target, dirs_exist_ok=True)
        (target / MARKER).write_text(json.dumps({'owner': 'vero-team-library', 'files': hashes(source)}, indent=2)+'\n')
    print(f'Installed {len(sources)} generic skills in {destination}')

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--destination', type=Path, default=Path.home()/'.agents/skills')
    args = parser.parse_args()
    install(args.destination.expanduser().resolve())
