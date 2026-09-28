// Enhance the static, readable sample recipe with keyboard-accessible tabs.
(() => {
 const card=document.querySelector('.cafe-recipe');
 if(!card)return;
 const tablist=card.querySelector('[role="tablist"]');
 const tabs=[...tablist.querySelectorAll('[role="tab"]')];
 const panels=[...card.querySelectorAll('[data-recipe-panel]')];
 function select(index,focus=false){
  tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;panels[i].hidden=i!==index;});
  if(focus)tabs[index].focus();
 }
 panels.forEach((panel,i)=>{panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby',tabs[i].id);panel.tabIndex=0;});
 tabs.forEach((tab,i)=>tab.addEventListener('click',()=>select(i)));
 tablist.addEventListener('keydown',event=>{
  const i=tabs.indexOf(document.activeElement);if(i<0)return;
  let next;
  if(event.key==='ArrowRight')next=(i+1)%tabs.length;
  else if(event.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;
  else if(event.key==='Home')next=0;
  else if(event.key==='End')next=tabs.length-1;
  else return;
  event.preventDefault();select(next,true);
 });
 card.classList.add('is-enhanced');tablist.hidden=false;select(0);
})();
