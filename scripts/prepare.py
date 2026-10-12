"""Generate shared, readable content before Quarto renders either view."""
from pathlib import Path
from html import escape
import json
import hashlib

ROOT = Path(__file__).resolve().parents[1]
programs = json.loads((ROOT / "data/programs.json").read_text())
certificate = json.loads((ROOT / "data/certificate.json").read_text())
out = ROOT / "_includes"
out.mkdir(exist_ok=True)

def e(value):
    return escape(str(value), quote=True)

def qmd(name, markup):
    (out / name).write_text("```{=html}\n" + markup + "\n```\n")

def program_body(p):
    facts = [("Credential", p["credential"]), ("Location", p["location"]), ("Learner", p["audience"])]
    facts += [(k, v) for k, v in [("Duration", p["duration"]), ("Delivery", p["delivery"])] if v]
    rows = "".join(f'<div><dt>{e(k)}</dt><dd>{e(v)}</dd></div>' for k, v in facts)
    industry = f'<h4>Industry experience</h4><p>{e(p["industry"])}</p>' if p["industry"] else ""
    supporting = f' <a href="{e(p["supporting_url"])}" target="_blank" rel="noopener noreferrer">Additional official context</a>.' if p.get("supporting_url") else ""
    return f'''<dl class="program-facts">{rows}</dl>
<h4>AI focus</h4><p>{e(p['focus'])}</p>{industry}
<div class="discussion-note"><h4>For our discussion</h4><p>{e(p['perspective'])}</p></div>
<p class="source-line"><a href="{e(p['url'])}" target="_blank" rel="noopener noreferrer">Official program page <span aria-hidden="true">↗</span></a>.{supporting}<br>Research checked October 12, 2026. Consult the institution for current requirements.</p>'''

def course_body(c):
    tools = f'<h4>Tools</h4><p>{e(c["tools"])}</p>' if c.get('tools') else ''
    sources = ' · '.join(f'<a href="{e(s["url"])}" target="_blank" rel="noopener noreferrer">{e(s["title"])}</a>' for s in c.get('sources', []))
    source_line = f'<p class="source-line">Official tool information: {sources}</p>' if sources else ''
    return f'''<p class="concept-note">Illustrative course area. {e(c['partner'])} participation in this certificate is proposed.</p>
{tools}
<h4>Learning objective</h4><p>{e(c['objective'])}</p>
<h4>Example student assignment</h4><p>{e(c['assignment'])}</p>
<h4>Practitioner involvement</h4><p>{e(c['contribution'])}</p>
<div class="discussion-note"><h4>Learning across technologies</h4><p>{e(c['transfer'])}</p></div>{source_line}'''

logos = {'carleton':'carleton.svg', 'schulich':'york.jpg', 'seneca-aig':'seneca.svg',
         'seneca-mai':'seneca.svg', 'uoft-scs':'uoft.svg', 'uoft-mscac':'uoft.svg',
         'uoft-advanced':'uoft.svg', 'queens':'queens.svg', 'durham':'durham.svg',
         'tmu':'tmu.svg', 'western':'western.svg', 'waterloo':'waterloo.svg'}
short_titles = {
    'carleton':'AI & Machine Learning', 'schulich':'Master of Management in AI',
    'seneca-aig':'Artificial Intelligence', 'uoft-scs':'Artificial Intelligence',
    'uoft-mscac':'Applied Computing · AI', 'queens':'Master of Management in AI',
    'seneca-mai':'AI Design & Development', 'durham':'AI Analysis, Design & Implementation',
    'uoft-advanced':'Advanced Artificial Intelligence', 'tmu':'AI for Data',
    'waterloo':'Data Science & AI', 'western':'Data Analytics · AI'}
choices = []
for i, p in enumerate(programs):
    logo = logos[p['id']]
    mark = f'<img src="assets/logos/{logo}" alt="{e(p["short"])}">' if (ROOT/'assets/logos'/logo).exists() else f'<span class="institution-wordmark">{e(p["short"])}</span>'
    dark = ' logo-on-navy' if p['id'] in ('queens', 'uoft-scs', 'uoft-mscac', 'uoft-advanced', 'waterloo') else ''
    choices.append(f'''<button type="button" class="program-pick" data-program="{e(p['id'])}" aria-controls="program-panel" aria-pressed="false" aria-label="{e(p['short'] + ': ' + p['title'])}"{ ' hidden' if i >= 4 else ''}><span class="institution-logo{dark}">{mark}</span><span class="program-name">{e(short_titles[p['id']])}</span><span class="program-category">{e(p['category'])}</span></button>''')
qmd('featured.qmd', f'''<div class="program-browser">
<div class="program-selector"><div class="featured-programs">{''.join(choices)}</div>
<nav class="program-pages" aria-label="More programs"><button id="programs-back" type="button" disabled aria-label="Previous four programs">←</button><span id="programs-page" role="status">1–4 of 12 programs</span><button id="programs-forward" type="button" aria-label="Next four programs">→</button></nav>
<p class="selection-note">Selected Ontario offerings · Click a program</p></div>
<div role="region" id="program-panel" class="program-panel" aria-label="Selected program information" tabindex="0"><div id="program-panel-content" aria-live="polite"><div class="program-placeholder"><span aria-hidden="true">↖</span><p>Select a program</p><small>Its details will appear here.</small></div></div></div>
</div>''')

directory = ''.join(f'''<details class="program-entry" id="program-{e(p['id'])}" data-category="{e(p['category'])}" data-region="{e(p['region'])}" data-search="{e((p['institution']+' '+p['title']+' '+p['location']).lower())}"><summary><span class="entry-category">{e(p['category'])}</span><span><strong>{e(p['title'])}</strong><span class="entry-institution">{e(p['institution'])} · {e(p['location'])}</span></span><span class="entry-plus" aria-hidden="true">+</span></summary><div class="entry-body">{program_body(p)}</div></details>''' for p in programs)
qmd('directory.qmd', f'<div id="program-directory">{directory}</div>')

course_buttons = ''.join(f'''<button class="course-pick" data-course="{e(c['id'])}" aria-haspopup="dialog"><strong>{e(c['partner'])}</strong><span>{e(c['label'])}</span><span class="course-plus" aria-hidden="true">+</span></button>''' for c in certificate['courses'])
qmd('course-buttons.qmd', f'<div class="course-choices">{course_buttons}</div>')
qmd('course-details.qmd', ''.join(f'<details class="course-entry"><summary><strong>{e(c["partner"])}</strong><span>{e(c["title"])}</span></summary><div class="entry-body">{course_body(c)}</div></details>' for c in certificate['courses']))

templates = ''
for p in programs:
    metadata = ' · '.join(e(v) for v in [p['location'], p['duration'], p['delivery']] if v)
    industry = f'<h4>Industry experience</h4><p>{e(p["industry"])}</p>' if p['industry'] else ''
    supporting = f'<p class="panel-source"><a href="{e(p["supporting_url"])}" target="_blank" rel="noopener noreferrer">Additional official context ↗</a></p>' if p.get('supporting_url') else ''
    templates += f'''<template id="panel-program-{e(p['id'])}"><p class="panel-institution">{e(p['institution'])}</p><h3>{e(p['title'])}</h3><p class="panel-meta">{metadata}</p><p>{e(p['focus'])}</p>{industry}<details class="panel-more"><summary>More program information</summary><dl class="program-facts"><div><dt>Credential</dt><dd>{e(p['credential'])}</dd></div><div><dt>Learner</dt><dd>{e(p['audience'])}</dd></div></dl><p>{e(p['perspective'])}</p>{supporting}</details><p class="panel-source"><a href="{e(p['url'])}" target="_blank" rel="noopener noreferrer">Official program page ↗</a><br>Checked October 12, 2026</p></template>'''
templates += ''.join(f'<template id="detail-course-{e(c["id"])}"><p class="dialog-eyebrow">Example partner: {e(c["partner"])}</p><h2>{e(c["title"])}</h2>{course_body(c)}</template>' for c in certificate['courses'])
interaction_version = hashlib.sha256((ROOT/'scripts/interactions.js').read_bytes()).hexdigest()[:10]
(out/'interaction-shell.html').write_text(f'''<dialog id="detail-dialog" class="mab-dialog" aria-label="More information"><button class="dialog-close" type="button" aria-label="Close details">Close <span aria-hidden="true">×</span></button><div id="detail-content"></div></dialog>
{templates}
<script src="scripts/content-data.js" defer></script>
<script src="scripts/interactions.js?v={interaction_version}" defer></script>''')
(ROOT/'scripts/content-data.js').write_text('window.MAB_DATA = '+json.dumps({'programs':programs,'certificate':certificate},ensure_ascii=False).replace('</','<\\/')+';\n')

footer = '<div class="slide-footer"><img src="assets/images/utsc-management.png" alt="University of Toronto Scarborough Management"></div>'
qmd('footer.qmd',footer)
print(f'Prepared {len(programs)} program records and {len(certificate["courses"])} illustrative course areas.')

