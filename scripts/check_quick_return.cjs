const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{
for(const viewport of [{width:1440,height:1000},{width:390,height:844},{width:320,height:568},{width:844,height:390}]){
 const page=await browser.newPage({viewport,reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4174/');
 await page.locator('header a[href="#quick-view"]').click();
 await page.locator('[data-quick-section="fortress"]').click();
 await page.locator('#quick-game-return').click();
 await page.locator('#scene').waitFor({state:'visible'});
 assert.equal(await page.evaluate(()=>era),'fortress');
 await page.locator('#scene').focus();await page.keyboard.down('ArrowLeft');await page.waitForTimeout(200);await page.keyboard.up('ArrowLeft');
 const before=await page.evaluate(()=>({x,y,era}));
 for(const exit of ['button','escape','close']){
  await page.locator('#read-story').click();await page.locator('#experience-link').click();
  assert(await page.locator('#quick-panel').isVisible());assert(await page.locator('#game').isVisible());
  assert.equal(await page.locator('#quick-game-return').innerText(),'Back to game');
  await page.locator('[data-quick-section="cafe"]').click();
  await page.keyboard.press('ArrowRight');await page.waitForTimeout(80);
  assert.deepEqual(await page.evaluate(()=>({x,y,era})),before);
  if(exit==='button')await page.screenshot({path:'/tmp/quick-return-'+viewport.width+'.png'});
  if(exit==='button')await page.locator('#quick-game-return').click();
  if(exit==='escape')await page.keyboard.press('Escape');
  if(exit==='close')await page.locator('#close-quick-panel').click();
  assert(!(await page.locator('#quick-panel').isVisible()));assert(await page.locator('#game').isVisible());
  assert.deepEqual(await page.evaluate(()=>({x,y,era})),before);
  assert.equal(await page.evaluate(()=>document.activeElement.id),'scene');
 }
 await page.keyboard.down('ArrowLeft');await page.waitForTimeout(200);await page.keyboard.up('ArrowLeft');
 assert((await page.evaluate(()=>x))<before.x);
 await page.locator('#close-game').click();
 await page.locator('header a[href="#quick-view"]').click();
 assert.equal(await page.locator('#quick-game-return').innerText(),'Play the Journey');
 await page.locator('#close-quick-panel').click();assert(!(await page.locator('#game').isVisible()));
 assert.deepEqual(errors,[]);console.log(viewport,'PASS global entry, paused position, three return routes, focus, resumed movement, clean global close');await page.close();
}
}finally{await browser.close()}})();
