(() => {
 const spreads=[...document.querySelectorAll('.spread')];
 const links=[...document.querySelectorAll('.contents nav a')];
 const controls=document.querySelector('.page-controls');
 const contents=document.querySelector('.contents');
 let current=0;
 function show(index,focus=false){
  current=Math.max(0,Math.min(index,spreads.length-1));
  spreads.forEach((spread,i)=>{spread.hidden=i!==current;links[i].setAttribute('aria-current',i===current?'page':'false');});
  document.getElementById('previous-page').disabled=current===0;
  document.getElementById('next-page').disabled=current===spreads.length-1;
  document.getElementById('page-count').textContent=(current+1)+' / '+spreads.length;
  if(focus){spreads[current].querySelector('h2').focus({preventScroll:true});document.getElementById('book').scrollIntoView({block:'start',behavior:'instant'});}
 }
 function hashIndex(){const found=spreads.findIndex(s=>'#'+s.id===location.hash);return found<0?0:found;}
 function navigate(index){if(index<0||index>=spreads.length)return;history.pushState(null,'','#'+spreads[index].id);show(index,true);}
 links.forEach((link,i)=>link.addEventListener('click',e=>{e.preventDefault();if(matchMedia('(max-width:700px)').matches)contents.open=false;navigate(i);}));
 document.getElementById('previous-page').addEventListener('click',()=>navigate(current-1));
 document.getElementById('next-page').addEventListener('click',()=>navigate(current+1));
 window.addEventListener('hashchange',()=>show(hashIndex()));
 window.addEventListener('popstate',()=>show(hashIndex()));
 document.getElementById('print-book').hidden=false;
 document.getElementById('print-book').addEventListener('click',()=>window.print());
 document.body.classList.add('enhanced');controls.hidden=false;
 if(matchMedia('(max-width:700px)').matches)contents.open=false;
 show(hashIndex());
})();
