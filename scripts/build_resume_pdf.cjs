// Render the canonical résumé HTML into the site's downloadable PDF.
// PLAYWRIGHT_MODULE may point to the installed Playwright package.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'site/dist/index.html'),'utf8');
const article=html.match(/<article class="resume-document-paper"[\s\S]*?<\/article>/)?.[0];
if(!article)throw new Error('Canonical résumé article missing');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
  const page=await browser.newPage();
  await page.setContent(`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Veronica Canido — Résumé</title><style>
  @page{size:Letter;margin:.35in .45in}
  body{font:10.5px/1.18 Arial,sans-serif;color:#262626;margin:0}
  h3{font:bold 27px/1.15 Georgia,serif;text-transform:uppercase;margin:0 0 3px}
  .role{font-weight:bold;text-transform:uppercase;font-size:12px;color:#a45c0c}
  p{margin:3px 0}h4{font-size:11px;line-height:1.3;text-transform:uppercase;color:#a45c0c;border-bottom:1px solid #c9c9c9;margin:8px 0 4px;padding-bottom:3px;break-after:avoid}
  h5{font-size:11px;line-height:1.3;margin:6px 0 0;break-after:avoid}.resume-dates{margin:0 0 2px;color:#444;break-after:avoid}
  ul{margin:3px 0;padding-left:13px}li{margin:3px 0;break-inside:avoid}a{color:inherit;text-decoration:underline;text-underline-offset:2px}
  </style></head><body>${article}</body></html>`);
  await page.pdf({path:path.join(root,'site/dist/documents/Veronica_Canido-Resume.pdf'),preferCSSPageSize:true,printBackground:true,tagged:true});
 }finally{await browser.close()}
})();
