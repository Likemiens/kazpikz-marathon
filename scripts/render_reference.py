"""Optional visual-reference check; requires Playwright and installed Chromium.
Not an Android/app test. Embeds local assets in memory, without network.
"""
from pathlib import Path
import json, base64, mimetypes, re, shutil, argparse
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1]
ap=argparse.ArgumentParser(description=__doc__)
ap.add_argument('--browser-executable', default=shutil.which('chromium') or shutil.which('google-chrome'))
args=ap.parse_args()
out=R/'design'/'screenshots';out.mkdir(exist_ok=True)
results=[];errors=[];remote=[]
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path=args.browser_executable,headless=True)
 page=browser.new_page(viewport={'width':1920,'height':1080},device_scale_factor=1)
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.on('request',lambda req: remote.append(req.url) if req.url.startswith(('http:','https:')) else None)
 html=(R/'design/preview.html').read_text()
 html=re.sub(r'<link rel="stylesheet" href="([^"]+)">',lambda m:'<style>'+((R/'design')/m.group(1)).resolve().read_text()+'</style>',html)
 js=(R/'design/preview.js').read_text()
 html=html.replace('<script defer src="preview.js"></script>','')
 html=re.sub(r'<img src="([^"]+)"',lambda m:'<img src="data:'+mimetypes.guess_type(m.group(1))[0]+';base64,'+base64.b64encode(((R/'design')/m.group(1)).resolve().read_bytes()).decode()+'"',html)
 page.set_content(html)
 page.add_script_tag(content=js)
 for lang in ('ru','kk','en'):
  page.locator('.locale-tabs [data-locale="'+lang+'"]').click()
  for screen in ('language','distance','form','success'):
   page.locator('.review-tabs [data-screen="'+screen+'"]').click()
   page.wait_for_timeout(90)
   info=page.evaluate('''() => ({viewport:[innerWidth,innerHeight],content:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],images:[...document.images].filter(i=>!i.complete || !i.naturalWidth).map(i=>i.src),keyboard:[...document.querySelectorAll('#keyboard-rows .key')].map(k=>({w:k.getBoundingClientRect().width,h:k.getBoundingClientRect().height})).filter(v=>v.w>0)})''')
   results.append({'locale':lang,'screen':screen,**info})
   if lang=='ru' or screen=='form': page.screenshot(path=str(out/(screen+'-'+lang+'.png')),full_page=True)
 browser.close()
data={'scope':'static-reference-only','browser':'Chromium desktop in-memory set_content, original local assets embedded for rendering; not Android WebView; independent of browser URL navigation; not a direct file URI launch test','errors':errors,'remoteRequests':remote,'views':results}
(R/'design/preview-checks.json').write_text(json.dumps(data,ensure_ascii=False,indent=2))
for r in results:print(r['locale'],r['screen'],r['viewport'],r['content'], 'broken',r['images'])
print('errors',errors,'remote',remote)

raise SystemExit(1 if errors or remote or any(r['content']!=r['viewport'] or r['images'] for r in results) else 0)
