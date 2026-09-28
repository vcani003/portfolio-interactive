// Development convenience only; the storybook itself is portable static HTML.
(() => {
 if(!['localhost','127.0.0.1','::1','[::1]'].includes(location.hostname))return;
 const url=new URL('storybook/',document.currentScript.src);
 const link=document.createElement('a');
 link.href=url.href;link.target='_blank';link.rel='noopener';
 link.className='dev-storybook-link';link.textContent='Art storybook ↗';
 link.setAttribute('aria-label','Open art-direction storybook in a new tab');
 const bar=document.createElement('div');
 bar.className='dev-storybook-bar';bar.append(link);
 document.querySelector('body > header').after(bar);
})();
