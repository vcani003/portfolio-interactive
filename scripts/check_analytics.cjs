// All analytics traffic is intercepted; never sends guesses to a real project.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try {
  for(const width of [1280,390,320,844]) {
   const page=await browser.newPage({viewport:{width,height:width===1280?960:width===844?390:568}});
   const events=[], errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.route('**/analytics-config.js',r=>r.fulfill({contentType:'application/javascript',body:'window.portfolioAnalyticsConfig={projectToken:"phc_test",apiHost:"https://us.i.posthog.com",trackLocalhost:true};'}));
   await page.route('https://us.i.posthog.com/**',r=>{events.push(r.request().postDataJSON());return r.fulfill({status:200,body:'{"status":1}'});});
   await page.route('**/api/**',r=>r.fulfill({status:404,body:''}));
   await page.route('**/embed/**',r=>r.abort());
   await page.goto('http://127.0.0.1:4174/?utm_source=chesscom&private=do-not-send&ref=8K3M#cafe');
   await page.waitForFunction(()=>window.portfolioAnalytics);
   await page.locator('.cafe-login-form input').fill('a playful guess');
   assert(!events.some(e=>e.event==='secret_phrase_submitted'));
   await page.locator('.cafe-login-form').scrollIntoViewIfNeeded();
   await page.screenshot({path:path.resolve(`tmp/analytics-qa/screen-cafe-${width}.png`)});
   await page.locator('.cafe-login-form').screenshot({path:path.resolve(`tmp/analytics-qa/cafe-${width}.png`)});
   await page.locator('.cafe-login').click();
   await page.waitForFunction(()=>document.querySelector('#secret-login-status').textContent==='ACCESS DENIED');
   await page.waitForTimeout(100);
   assert.equal(events.filter(e=>e.event==='secret_phrase_submitted').length,1);
   assert.equal(events.find(e=>e.event==='secret_phrase_submitted').properties.guess,'a playful guess');
   assert.equal(events.find(e=>e.event==='secret_phrase_submitted').properties.success,false);
   await page.screenshot({path:path.resolve(`tmp/analytics-qa/screen-dialog-${width}.png`)});
   await page.locator('#secret-login').screenshot({path:path.resolve(`tmp/analytics-qa/dialog-${width}.png`)});
   await page.locator('#secret-login input').fill('wizardchess');
   await page.locator('#secret-login button[type=submit]').click();
   await page.waitForFunction(()=>document.querySelector('#egg-note').open);
   await page.waitForTimeout(100);
   assert.equal(events.filter(e=>e.event==='secret_login_success').length,1);
   assert.equal(events.filter(e=>e.event==='secret_phrase_submitted'&&e.properties.success).length,1);
   assert(events.every(e=>e.properties.utm_source==='chesscom'&&e.properties.ref==='8K3M'));
   assert(!JSON.stringify(events).includes('do-not-send'));
   await page.locator('#egg-skip').click();
   assert(await page.locator('.cafe-login').evaluate(el=>el===document.activeElement));
   await page.locator('#close-quick-panel').click();
   await page.evaluate(()=>{
     const a=document.createElement('a');a.href='https://example.com/project?private=omit';
     a.addEventListener('click',e=>e.preventDefault());document.body.append(a);a.click();a.remove();
     const pdf=document.createElement('a');pdf.href='/resume.pdf?private=omit';
     pdf.addEventListener('click',e=>e.preventDefault());document.body.append(pdf);pdf.click();pdf.remove();
   });
   await page.waitForTimeout(100);
   assert(events.some(e=>e.event==='outbound_link_clicked'&&e.properties.destination==='https://example.com/project'));
   assert(events.some(e=>e.event==='resume_downloaded'&&e.properties.destination.endsWith('/resume.pdf')));
   assert(!JSON.stringify(events).includes('private=omit'));
   // Verify analytics outages do not block guessing or career content.
   await page.route('https://us.i.posthog.com/**',r=>r.abort());
   await page.locator('footer .term-prompt').click();
   await page.locator('#secret-login input').fill('another guess');
   await page.locator('#secret-login button[type=submit]').click();
   await page.waitForFunction(()=>document.querySelector('#secret-login-status').textContent==='ACCESS DENIED');
   await page.locator('#close-secret-login').click();
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   assert.deepEqual(errors,[]);
   await page.close();
  }
  const p=await browser.newPage();let sent=0;
  await p.route('https://*.posthog.com/**',r=>{sent++;return r.abort();});
  await p.goto('http://127.0.0.1:4174/');
  await p.evaluate(()=>window.portfolioAnalytics.capture('secret_phrase_submitted',{guess:'disabled'}));
  assert.equal(sent,0);
  await p.route('**/j/8K3M/**',r=>r.fulfill({contentType:'text/html',body:require('node:fs').readFileSync(path.resolve('site/dist/j/8K3M/index.html'),'utf8')}));
  await p.goto('http://127.0.0.1:4174/j/8K3M/?utm_source=application');
  await p.waitForURL('**/?utm_source=application&ref=8K3M');
  await p.close();
  for(const guard of ['local','dnt','gpc']) {
   const g=await browser.newPage();let requests=0;
   if(guard==='dnt') await g.addInitScript(()=>Object.defineProperty(navigator,'doNotTrack',{value:'1'}));
   if(guard==='gpc') await g.addInitScript(()=>Object.defineProperty(navigator,'globalPrivacyControl',{value:true}));
   await g.route('**/analytics-config.js',r=>r.fulfill({contentType:'application/javascript',body:`window.portfolioAnalyticsConfig={projectToken:"phc_test",apiHost:"https://us.i.posthog.com",trackLocalhost:${guard!=='local'}};`}));
   await g.route('https://us.i.posthog.com/**',r=>{requests++;return r.abort();});
   await g.goto('http://127.0.0.1:4174/');
   await g.evaluate(()=>window.portfolioAnalytics.capture('portfolio_opened'));
   await g.waitForTimeout(100);assert.equal(requests,0,guard);await g.close();
  }
  console.log('PASS: desktop/390/320/landscape UI, submissions only, success/failure, static fallback, referral/UTM, query minimization, blocked analytics, focus/exit, disabled config and static redirect.');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
