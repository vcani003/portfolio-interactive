// Run against local portfolio on 4174. Browser screenshots go to /tmp.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true});try{
 for(const [width,height] of [[1440,1100],[1280,960],[390,844],[320,568],[844,390]]){
 const p=await b.newPage({viewport:{width,height},isMobile:width<500,hasTouch:width<500});const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://127.0.0.1:4174/#cafe');await p.locator('#cafe').waitFor({state:'visible'});await p.locator('.recipe-intro img').evaluate(e=>e.decode());
 assert(await p.locator('#quick-panel').evaluate(e=>e.scrollWidth<=e.clientWidth));assert(await p.locator('#cafe').evaluate(e=>e.scrollWidth<=e.clientWidth));
 const summary=await p.evaluate(()=>window.portfolioChapters.cafe);assert(summary.summary.includes('mostly Claude'));assert.equal(summary.sections.length,1);
 await p.screenshot({path:`/tmp/cafe-layout-${width}.png`});
 await p.locator('#recipe-tab-steps').click();assert(await p.locator('#recipe-steps').isVisible());assert(!(await p.locator('#recipe-ingredients').isVisible()));await p.locator('#recipe-tab-steps').press('ArrowRight');assert(await p.locator('#recipe-notes').isVisible());await p.locator('#recipe-tab-notes').press('Home');assert(await p.locator('#recipe-ingredients').isVisible());
 if(width<500)await p.screenshot({path:`/tmp/cafe-card-${width}.png`});
 await p.locator('.cafe-login').click();assert(await p.locator('#secret-login').isVisible());await p.locator('#close-secret-login').click();assert(await p.locator('.cafe-login').evaluate(e=>document.activeElement===e));
 await p.locator('[data-quick-section="fortress"]').click();assert(!(await p.locator('.cafe-tools-footer').isVisible()));assert(!(await p.locator('#quick-panel').evaluate(e=>e.classList.contains('is-cafe'))));
 await p.locator('[data-quick-section="cafe"]').click();await p.locator('#close-quick-panel').click();assert(!(await p.locator('#quick-panel').isVisible()));assert.deepEqual(errors,[]);console.log(width,height,'PASS');await p.close();
 }
 const p=await b.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});await p.goto('http://127.0.0.1:4174/#cafe');for(const id of ['recipe-ingredients','recipe-steps','recipe-notes'])assert(await p.locator('#'+id).isVisible());assert(await p.locator('#cafe').evaluate(e=>e.scrollWidth<=e.clientWidth));console.log('No-JS full recipe PASS');await p.close();
}finally{await b.close()}})();
