"""Render the public change source into semantic HTML (also works without JS)."""
from pathlib import Path
import json, html, re
ROOT = Path(__file__).resolve().parents[1]
source = ROOT / 'site/dist/content/changes.json'
entries = json.loads(source.read_text())
assert len({entry['id'] for entry in entries}) == len(entries), 'Duplicate change id'
assert entries == sorted(entries, key=lambda e: e['date'], reverse=True), 'Newest dates first'
rows = []
for entry in entries:
    assert re.fullmatch(r'\d{4}-\d{2}-\d{2}', entry['date'])
    date, title, detail = (html.escape(entry[key]) for key in ('date', 'title', 'detail'))
    tools = entry['aiTools']
    assert isinstance(tools, list) and all(isinstance(tool, str) and tool.strip() for tool in tools), 'aiTools must be a list of tool names'
    credit = 'Co-authored with ' + html.escape(' · '.join(tools)) if tools else 'AI tool not recorded'
    rows.append(f'<li><time datetime="{date}">{date}</time><h4>{title}</h4><p>{detail}</p><span class="activity-credit">{credit}</span></li>')
markup = '''<!-- activity-log:start --><article class="activity-log" aria-labelledby="activity-title"><h3 id="activity-title">What changed</h3><p>Changes to the experience, and the decisions behind them.</p><div class="activity-window" tabindex="0" role="region" aria-label="Portfolio change history"><ol class="activity-list">''' + ''.join(rows) + '''</ol><button class="button secondary activity-more" type="button" hidden>Load more changes</button><p class="activity-end" hidden>You’re all caught up.</p></div><p class="activity-status" role="status" aria-live="polite"></p></article><!-- activity-log:end -->'''
page = ROOT / 'site/dist/index.html'
text = page.read_text()
if '<!-- activity-log:start -->' in text:
    text = re.sub(r'<!-- activity-log:start -->.*?<!-- activity-log:end -->', lambda _: markup, text, flags=re.S)
else:
    text, count = re.subn(r'<article><h3>What changed</h3>.*?</article>', lambda _: markup, text, count=1, flags=re.S)
    assert count == 1
if 'activity-log.css' not in text:
    text = text.replace('</head>', '<link rel="stylesheet" href="activity-log.css"><script src="activity-log.js" defer></script></head>')
page.write_text(text)
print(f'Rendered {len(entries)} activity entries.')
