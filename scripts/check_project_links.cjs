const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{
for(const width of [1440,320]){
const context=await browser.newContext({viewport:{width,height:850},reducedMotion:'reduce'});
await context.route('https://**/*',route=>route.fulfill({status:200,body:'Link destination reached'}));
const page=await context.newPage();await page.goto('http://127.0.0.1:4174/');
await page.locator('header a[href="#projects"]').click();await page.locator('#quick-game-return').click();await page.locator('#read-story').click();
const links=page.locator('#career-editor .career-project-links a');assert.equal(await links.count(),5);
assert.equal(await links.first().evaluate(el=>el.href),'https://hop-meow.fly.dev/');
assert((await page.locator('.editor-document').innerText()).includes('WebSocket rooms'));
for(let i=0;i<5;i++) {const href=await links.nth(i).evaluate(el=>el.href);const popupPromise=page.waitForEvent('popup');await links.nth(i).click();const popup=await popupPromise;await popup.waitForLoadState();assert.equal(popup.url(),href);await popup.close();}
assert(await page.locator('#career-editor').isVisible());
await page.screenshot({path:'/tmp/project-links-'+width+'.png'});
console.log(width,'PASS five clickable project links, expected destinations, chapter retained');await context.close();
}
}finally{await browser.close()}})();
