// Browser regression checks for the approved Fortress integration; local server only.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
const base=process.env.PORTFOLIO_URL||'http://127.0.0.1:4174/';
const out=path.resolve(__dirname,'../tmp/fortress-integration');
async function enter(p){await p.goto(base);await p.locator('#map-fortress [data-chapter]').focus();await p.keyboard.press('Enter');await p.waitForFunction(()=>document.querySelector('#world').dataset.era==='fortress'&&document.querySelector('#fortress-household')?.dataset.ready==='true');}
async function trigger(p,s,touch){const l=p.locator(s);if(touch)await l.tap();else await l.click();}
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{
 for(const item of [{w:1280,h:960},{w:390,h:844,touch:true},{w:320,h:568,touch:true},{w:844,h:390,touch:true,reduced:true}]){
  const p=await browser.newPage({viewport:{width:item.w,height:item.h},isMobile:!!item.touch,hasTouch:!!item.touch,reducedMotion:item.reduced?'reduce':'no-preference'});const errors=[];p.on('pageerror',e=>errors.push(e.message));
  await enter(p);const id=`${item.w}x${item.h}`;
  assert(await p.locator('#chapter-pad').isVisible());assert.match(await p.locator('#chapter-pad').getAttribute('aria-label'),/Banh Miow/);
  assert.equal(await p.locator('#fortress-household').evaluate(e=>getComputedStyle(e).pointerEvents),'none');
  await p.locator('#scene').screenshot({path:path.join(out,`scene-${id}.png`)});
  // Real pointer/touch activation walks to the left workstation and opens notes.
  await trigger(p,'[data-action=computer]',item.touch);await p.waitForFunction(()=>document.querySelector('#career-editor').open,null,{timeout:15000});
  assert.match(await p.locator('[data-document=experience]').innerText(),/Fortress/i);
  await trigger(p,'[data-file=skills]',item.touch);assert(await p.locator('[data-document=skills]').isVisible());
  await trigger(p,'#close-editor',item.touch);assert.equal(await p.locator('#career-editor').evaluate(e=>e.open),false);
  // Design note is a nested, dismissible click target and must not transport/move while open.
  // Use keyboard activation if the narrow camera currently views only the left workstation.
  await p.locator('#design-credit').focus();await p.keyboard.press('Enter');await p.waitForFunction(()=>document.querySelector('#design-note').open);
  assert.match(await p.locator('#design-note').innerText(),/white/i);await p.waitForTimeout(850);
  assert.equal(await p.locator('#world').getAttribute('data-era'),'fortress');await trigger(p,'#close-design-note',item.touch);
  assert.equal(await p.evaluate(()=>document.activeElement.id),'design-credit');
  // Immediate keyboard career access still works, followed by Quick View handoff and visible exit.
  await p.locator('#read-story').focus();await p.keyboard.press('Enter');await p.locator('#experience-link').click();
  await p.waitForFunction(()=>document.querySelector('#quick-panel').open);assert.match(await p.locator('#quick-panel').innerText(),/Fortress/);
  await p.locator('#close-quick-panel').click();
  await enter(p);
  // Keyboard movement remains usable after modal closure.
  await p.locator('#scene').focus();const before=await p.locator('#player').evaluate(e=>parseFloat(e.style.left));await p.keyboard.down('ArrowRight');await p.waitForTimeout(200);await p.keyboard.up('ArrowRight');assert(await p.locator('#player').evaluate(e=>parseFloat(e.style.left))>before);
  // Camera follows navigation to the right. A keyboard click follows the same portal handler.
  await p.locator('#chapter-pad').focus();await p.keyboard.press('Enter');
  await p.waitForFunction(()=>document.querySelector('#chapter-pad').classList.contains('holding'),null,{timeout:15000});
  await p.locator('#scene').focus();await p.keyboard.down('ArrowLeft');await p.waitForTimeout(650);await p.keyboard.up('ArrowLeft');await p.waitForTimeout(800);
  assert.equal(await p.locator('#world').getAttribute('data-era'),'fortress');
  // Complete a real click/tap portal journey after cancellation.
  await trigger(p,'#chapter-pad',item.touch);await p.waitForFunction(()=>document.querySelector('#world').dataset.era==='cafe',null,{timeout:15000});
  await p.waitForTimeout(900);assert.equal(await p.locator('#world').getAttribute('data-era'),'cafe');assert(await p.locator('#fortress-household').isHidden());
  await trigger(p,'#close-game',item.touch);assert.equal(await p.locator('#game').evaluate(e=>e.open),false);assert.equal(await p.evaluate(()=>document.activeElement.dataset.chapter),'cafe');
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);
  console.log('PASS',id,'computer, skills, design note, Quick View, movement, portal cancel/complete, return, no layer leak/errors');await p.close();
 }
 // A failed decorative household image cannot take career access or exit away.
 const p=await browser.newPage({viewport:{width:1280,height:960}});await p.route('**/*fortress*chair*.png',r=>r.abort());await p.goto(base);await p.locator('#map-fortress [data-chapter]').focus();await p.keyboard.press('Enter');await p.locator('#read-story').click();await p.waitForFunction(()=>document.querySelector('#career-editor').open);await p.locator('#close-editor').click();await p.locator('#close-game').click();assert.equal(await p.locator('#game').evaluate(e=>e.open),false);console.log('PASS missing decorative asset preserves notes and exit');await p.close();
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
