const $ = (selector) => document.querySelector(selector);
const game = $('#game'), scene = $('#scene'), world = $('#world'), player = $('#player');
const editor = $('#career-editor');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let paused = reducedMotion.matches;
let origin, editorOrigin, frame, last = 0, x = 47, y = 87, facing = 1, destination = null;
let effectTimer, editorTimer, computerArmed = true;
const keys = new Set();
const eras = {
  fulltime: {
    image: 'assets/office-playroom.png', title: 'My first cubicle.', label: 'Full-time · My own cubicle',
    alt: 'A corporate cubicle bay with Vero’s workstation, a desk succulent, espresso candy, welcome balloons and a neighboring coworker.',
    minY: 56, maxY: 90,
    objects: {
      plant: {x: 23.5, y: 25, walkX: 26, walkY: 60},
      computer: {x: 34, y: 22, walkX: 37, walkY: 60},
      snack: {x: 47, y: 27, walkX: 48, walkY: 60},
      coworker: {x: 86, y: 23, walkX: 79, walkY: 60}
    }
  },
  internship: {
    image: 'assets/jpmc-closet.png', title: 'We worked in a closet.', label: 'Internship · The closet',
    alt: 'A cramped storage closet repurposed as a shared internship workspace.',
    minY: 79, maxY: 94,
    objects: {computer: {x: 43, y: 37, walkX: 45, walkY: 80}}
  }
};
const chapterOrder = ['college','fulltime','fortress','cafe','gamedev'];
const chapterData = window.portfolioChapters || {};
const jpmcDocuments = $('.editor-document').innerHTML;
const sceneSpecs = {
 college: {image:'assets/chapter-college.png', computer:{x:15,y:31.5,walkX:22,walkY:65}, extra:{x:92,y:40.5,walkX:83,walkY:65}, action:'View my notes', response:'MDC & FIU'},
 fortress: {image:'assets/chapter-fortress.png', computer:{x:24,y:35,walkX:27,walkY:68}},
 cafe: {image:'assets/chapter-cafe.png', computer:{x:30,y:23,walkX:30,walkY:65}, extra:{x:52.5,y:24,walkX:53,walkY:65}, action:'Open recipe notes', response:''},
 gamedev: {image:'assets/chapter-gamedev.png', computer:{x:34.5,y:19,walkX:35,walkY:65}, extra:{x:20.6,y:26.3,walkX:23,walkY:65}, action:'Tap a rhythm', response:'♪  ♫  ♪'}
};
for (const [id, spec] of Object.entries(sceneSpecs)) {
 const data = chapterData[id];
 if (!data) continue;
 const alts = {fortress:'A cooler gray home den with hardwood floors, Levi at the desk, Lumi and Luci nearby, and a backyard oak with storybook wildlife.'};
 const objects = {computer:spec.computer};
 if (spec.extra) objects.coworker = spec.extra;
 eras[id] = {image:spec.image,title:data.title,label:data.label,alt:alts[id] || data.label + ' — an imaginative illustrated setting.',minY:65,maxY:91,objects};
}
let era = 'college';
eras.college.objects.cat = {x:48, y:82, walkX:48, walkY:82};
function chapterKey() { return era === 'internship' ? 'fulltime' : era; }
function updateDocuments() {
 const data = chapterData[era];
 const root = $('.editor-document');
 if (!data) {root.innerHTML = jpmcDocuments;}
 else {
  root.replaceChildren();
  const add = (parent, tag, text, cls) => {const node=document.createElement(tag);node.textContent=text;if(cls)node.className=cls;parent.append(node);return node;};
  for (const kind of ['experience','skills','memories']) {
   const section=document.createElement('section');section.dataset.document=kind;root.append(section);
   add(section,'p',`career / ${kind==='experience'?data.filename:kind+'.md'}`,'document-path');
   add(section,'h2',kind==='experience'?data.heading:kind==='skills'?'Tools & focus':'About this chapter');
   if(kind==='experience') {add(section,'p',data.label,'document-role');add(section,'p',data.summary);for(const part of data.sections){add(section,'h3',part.heading);add(section,'p',part.body);}}
   else {for(const line of data[kind])add(section,'p',line);}
  }
 }
 $('[data-file="experience"]').textContent='# '+(data?.filename || 'jpmc.md');
 $('[data-file="memories"]').textContent=data?'# context.md':'# memories.md';
 $('[data-file="memories"]').hidden=!!data && !data.memories.length;
 $('[data-file="skills"]').hidden=!!data && !data.skills.length;
 $('#experience-link').href='#'+(data?.anchor || 'jpmc');
 $('#experience-link').textContent=era==='gamedev'?'View projects ↗':'View in Quick View ↗';
}
function setMotion(value) {
  paused = value;
  document.body.classList.toggle('motion-paused', paused);
}
setMotion(paused);
reducedMotion.addEventListener('change', e => setMotion(e.matches));

function renderWorld() {
  const width = Math.max(scene.clientWidth, scene.clientHeight * 1.5);
  const height = width / 1.5;
  world.style.width = `${width}px`;
  world.style.height = `${height}px`;
  const camera = (width - scene.clientWidth) * Math.max(0, Math.min(1, (x - 15) / 70));
  world.style.left = `${-camera}px`;
  world.style.top = `${Math.min(0, (scene.clientHeight - height) * Math.max(.1, Math.min(.9, (y-58)/38)))}px`;
  player.style.left = `${x}%`;
  player.style.top = `${y}%`;
  player.style.setProperty('--facing', facing);
  player.style.zIndex = Math.round(y);
  const current = eras[era];
  document.querySelectorAll('[data-action]').forEach(button => {
    const point = current.objects[button.dataset.action];
    button.hidden = !point;
    if (!point) return;
    button.style.left = `${point.x}%`;
    button.style.top = `${point.y}%`;
    button.classList.toggle('nearby', Math.hypot(point.walkX - x, point.walkY - y) < 12);
  });
}
function stopWalking() { destination = null; keys.clear(); player.classList.remove('walking'); }
function animateWorld(t) {
  const dt = Math.min((t - last) / 1000 || 0, .04); last = t;
  const previousX = x, previousY = y;
  let dx = Number(keys.has('d') || keys.has('arrowright')) - Number(keys.has('a') || keys.has('arrowleft'));
  let dy = Number(keys.has('s') || keys.has('arrowdown')) - Number(keys.has('w') || keys.has('arrowup'));
  if (era==='college') tickCampusCat(dt, t);
  if (!transporting && !editor.open && !$('#study-notes').open && !$('#campus-video').open && !world.classList.contains('opening-computer')) {
    if (dx || dy) {
      destination = null;
      const length = Math.hypot(dx, dy);
      x += dx / length * dt * 18; y += dy / length * dt * 14;
    } else if (destination) {
      const distance = Math.hypot(destination.x - x, destination.y - y);
      if (distance < .5) {
        const action = destination.action;
        destination = null;
        if (action) performAction(action);
      } else {
        x += (destination.x - x) / distance * Math.min(18 * dt, distance);
        y += (destination.y - y) / distance * Math.min(18 * dt, distance);
      }
    }
  }
  x = Math.max(15, Math.min(85, x));
  y = Math.max(eras[era].minY, Math.min(eras[era].maxY, y));
  const moving = Math.abs(previousX - x) + Math.abs(previousY - y) > .01;
  if (Math.abs(previousX - x) > .01) facing = x > previousX ? 1 : -1;
  player.classList.toggle('walking', moving);
  renderWorld();
  tickPad(moving);
  const computer = eras[era].objects.computer;
  const distance = Math.hypot(x - computer.walkX, y - computer.walkY);
  if (distance > 12) computerArmed = true;
  if (computerArmed && distance < 4 && moving && !editor.open && (!destination?.action || destination.action === 'computer')) openComputer();
  if (game.open) frame = requestAnimationFrame(animateWorld);
}
const padNames = {college:'JPMorgan Chase', fulltime:'Fortress', fortress:'Banh Miow Cafe', cafe:'Game development'};
let padTimer = 0, transporting = false;
function cancelPad() {
  clearTimeout(padTimer);
  padTimer = 0;
  const pad = $('#chapter-pad');
  pad.classList.remove('holding', 'is-active');
  stopTransitions();
}
function placePad() {
  const pad = $('#chapter-pad');
  const name = padNames[chapterKey()];
  pad.hidden = !name || transporting;
  if (pad.hidden) return;
  const floor = eras[era].maxY;
  pad.style.left = '79.5%';
  pad.style.top = `${floor - 2}%`;
  pad.style.zIndex = String(Math.max(1, Math.round(floor) - 1));
  pad.querySelector('.pad-label').textContent = name;
}
function tickPad(moving) {
  const pad = $('#chapter-pad');
  if (transporting || !padNames[chapterKey()] || editor.open || $('#study-notes').open || $('#campus-video').open || world.classList.contains('opening-computer')) {
    cancelPad();
    placePad();
    return;
  }
  const floor = eras[era].maxY;
  const onPad = x >= 74 && x <= 85 && y >= floor - 8 && y <= floor + 0.2;
  pad.classList.toggle('is-active', onPad);
  const still = onPad && !moving && !destination && keys.size === 0;
  if (still && !padTimer) {
    pad.classList.add('holding');
    playTransition('move');
    padTimer = setTimeout(beginTransport, 650);
  } else if (!still && padTimer) {
    clearTimeout(padTimer);
    padTimer = 0;
    pad.classList.remove('holding');
    stopTransitions();
  }
  placePad();
}
function beginTransport() {
  padTimer = 0;
  const next = chapterOrder[chapterOrder.indexOf(chapterKey()) + 1];
  if (!next || transporting) return;
  transporting = true;
  stopWalking();
  cancelPad();
  $('#chapter-pad').hidden = true;
  if (reducedMotion.matches) {setEra(next); return;}
  world.classList.add('departing');
}
world.addEventListener('transitionend', event => {
  if (event.target !== world || event.propertyName !== 'opacity') return;
  if (world.classList.contains('departing')) {
    const next = chapterOrder[chapterOrder.indexOf(chapterKey()) + 1];
    world.classList.remove('departing');
    if (next) setEra(next, true);
    world.classList.add('arriving');
    requestAnimationFrame(() => world.classList.add('arrive-in'));
    return;
  }
  if (world.classList.contains('arrive-in')) {
    world.classList.remove('arriving', 'arrive-in');
    transporting = false;
  }
});
function setEra(value, fromPad) {
  if (!fromPad) {
    transporting = false;
    world.classList.remove('departing', 'arriving', 'arrive-in');
    cancelPad();
  }
  era = value;
  $('#desk-photos').hidden = era !== 'fulltime';
  $('#design-credit').hidden = era !== 'fortress';
  $('#guest-levi').hidden = era !== 'fortress';
  $('#guest-lumi').hidden = era !== 'fortress';
  $('#guest-luci').hidden = era !== 'fortress';
  if (era !== 'fortress' && $('#design-note').open) $('#design-note').close();
  if (era !== 'college' && $('#study-notes').open) $('#study-notes').close();
  if (era !== 'college') closeCampusVideo(false);
  stopWalking();
  clearTimeout(effectTimer); clearTimeout(editorTimer);
  $('#speech').textContent = ''; $('#action-effect').className = ''; $('#action-effect').replaceChildren();
  world.classList.remove('opening-computer');
  x = era === 'college' ? 25 : 47; y = era === 'internship' ? 90 : 87;
  updateDocuments();
  const data = chapterData[era];
  $('#chapter-heading').textContent = data?.heading || 'JPMORGAN CHASE / TAMPA';
  $('#scene-name').textContent = data?.heading || 'JPMORGAN CHASE';
  $('.chapter-switch').hidden = !['fulltime','internship'].includes(era);
  const idx = chapterOrder.indexOf(chapterKey());
  $('#previous-chapter').disabled = idx===0;
  $('#next-chapter').textContent = idx===chapterOrder.length-1 ? 'Let’s talk ↗' : 'Next chapter →';
  document.querySelectorAll('.journey-nav [data-chapter]').forEach(b=>b.setAttribute('aria-current', b.dataset.chapter===chapterKey()?'step':'false'));
  const secondary = $('[data-action="coworker"]');
  secondary.setAttribute('aria-label',sceneSpecs[era]?.action || 'Say hi to a coworker');
  secondary.querySelector('.target-label').textContent=sceneSpecs[era]?.action || 'Say hi';
  $('[data-action="computer"] .target-label').textContent=era==='college'?'Explore education':era==='cafe'?'Open the POS':era==='gamedev'?'Explore projects':'Use computer';
  $('[data-action="computer"]').setAttribute('aria-label', $('[data-action="computer"] .target-label').textContent + ' to open career notes');
  $('#chapter-hint').textContent=era==='gamedev'?'The projects are here. Then you can go talk to me.':'Walk around, or open the notes. Either is fine.';
  $('.screen-shimmer').hidden = !['fulltime','internship'].includes(era);
  computerArmed = true;
  world.dataset.era = era;
  const backdrop = world.querySelector('.room-backdrop');
  world.classList.add('loading');$('#scene-loading').hidden=false;$('#scene-loading').textContent='Loading illustration…';
  backdrop.onload=()=>{world.classList.remove('loading');$('#scene-loading').hidden=true;};
  backdrop.onerror=()=>{$('#scene-loading').textContent='Illustration unavailable. Career notes are still available below.';};
  backdrop.src = eras[era].image;
  if(backdrop.complete && backdrop.naturalWidth)backdrop.onload();
  world.querySelector('.room-backdrop').alt = eras[era].alt;
  $('#game-title').textContent = eras[era].title;
  $('#era-label').textContent = eras[era].label;
  document.querySelectorAll('button[data-era]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.era === era)));
  renderWorld();
  placePad();
  if (game.open) playChapter(era);
}
document.querySelectorAll('button[data-era]').forEach(b => b.addEventListener('click', () => setEra(b.dataset.era)));
const chapterTracks = {
  college: 'assets/audio/college-vino-de-verano.mp3',
  fulltime: 'assets/audio/jpmc-abandoned-shopping-mall.mp3',
  internship: 'assets/audio/jpmc-abandoned-shopping-mall.mp3',
  fortress: 'assets/audio/fortress-moonbug.mp3',
  cafe: 'assets/audio/cafe-cat-leg-dog-bone.mp3',
  gamedev: 'assets/audio/gamedev-bastille-unbound.mp3'
};
const journeyAudio = document.getElementById('journey-theme');
const chapterAudio = document.getElementById('chapter-theme');
const enterSting = document.getElementById('transition-enter');
const moveSting = document.getElementById('transition-move');
const journeySound = document.getElementById('journey-sound');
const pageSound = document.getElementById('page-sound');
let journeyMuted = false;
let journeyOpened = false;
let journeySoundIntroduced = false;
let chapterTrackId = '';
journeyAudio.volume = 0.2;
chapterAudio.volume = 0.2;
enterSting.volume = 0.45;
moveSting.volume = 0.45;
function playTransition(kind) {
  if (journeyMuted) return;
  const audio = kind === 'enter' ? enterSting : moveSting;
  audio.pause();
  try { audio.currentTime = 0; } catch (error) {}
  const playing = audio.play();
  if (playing) playing.catch(() => {});
}
function stopTransitions() {
  enterSting.pause();
  moveSting.pause();
}
function syncJourneySound() {
  const label = journeyMuted ? 'press M to unmute or click here' : 'press M to mute or click here';
  for (const button of [journeySound, pageSound]) {
    button.hidden = button === journeySound ? !game.open : game.open;
    button.setAttribute('aria-pressed', String(journeyMuted));
    button.textContent = label;
  }
  if (journeyOpened && !game.open && !journeySoundIntroduced && !reducedMotion.matches) pageSound.classList.add('glow');
  if (journeyOpened && !game.open) journeySoundIntroduced = true;
}
function startPageMusic() {
  chapterAudio.pause();
  syncJourneySound();
  if (!journeyOpened || journeyMuted || game.open) {journeyAudio.pause(); return;}
  const playing = journeyAudio.play();
  if (playing) playing.catch(() => {});
}
function playChapter(value) {
  const src = chapterTracks[value] || '';
  if (src !== chapterTrackId) {
    chapterTrackId = src;
    chapterAudio.pause();
    chapterAudio.removeAttribute('src');
    if (src) chapterAudio.src = src;
  }
  journeyAudio.pause();
  syncJourneySound();
  if (!src || journeyMuted) {chapterAudio.pause(); return;}
  const playing = chapterAudio.play();
  if (playing) playing.catch(() => {});
}
function toggleJourneyMute() {
  journeyMuted = !journeyMuted;
  if (journeyMuted) {journeyAudio.pause(); chapterAudio.pause(); stopTransitions();}
  else if (game.open) playChapter(era);
  else startPageMusic();
  syncJourneySound();
}
journeySound.addEventListener('click', toggleJourneyMute);
pageSound.addEventListener('click', toggleJourneyMute);
document.addEventListener('keydown', e => {
  if (e.key.toLowerCase() !== 'm' || e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
  if (e.target.closest('input, textarea')) return;
  e.preventDefault();
  toggleJourneyMute();
});
syncJourneySound();
function enterChapter(value, source) {
 if (quickDialog.open) {source=quickReturnFocus;closeQuickView();}
 if (editor.open) editor.close();
 const opening = !game.open;
 if (opening) {journeyOpened = true;window.scrollTo({top:window.scrollY,behavior:'instant'});origin=source;game.showModal();last=0;cancelAnimationFrame(frame);frame=requestAnimationFrame(animateWorld);}
 setEra(value);game.scrollTop=0;scene.focus({preventScroll:true});
}
document.querySelectorAll('[data-play], [data-chapter]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();if(!b.hasAttribute('data-hold-entry'))enterChapter(b.dataset.chapter || 'college',b);}));
$('#previous-chapter').addEventListener('click',()=>{const i=chapterOrder.indexOf(chapterKey());if(i>0)setEra(chapterOrder[i-1]);});
$('#next-chapter').addEventListener('click',()=>{const i=chapterOrder.indexOf(chapterKey());if(i<chapterOrder.length-1)setEra(chapterOrder[i+1]);else {closeGame(false);location.hash='contact';$('#contact').tabIndex=-1;$('#contact').focus();}});
function closeGame(toTimeline=true) {
  if($('#design-note').open)$('#design-note').close();
  if($('#photo-viewer').open)$('#photo-viewer').close();
  if($('#study-notes').open)$('#study-notes').close();
  closeCampusVideo(false);
  transporting = false;
  world.classList.remove('departing', 'arriving', 'arrive-in');
  cancelPad();
  if (editor.open) editor.close();
  clearTimeout(editorTimer); clearTimeout(effectTimer);
  world.classList.remove('opening-computer');
  chapterAudio.pause();
  chapterTrackId = '';
  game.close(); stopWalking(); cancelAnimationFrame(frame);
  startPageMusic();
  if(toTimeline) {
   const stop=document.getElementById('map-'+chapterKey());
   stop.scrollIntoView({behavior:'instant',block:'center'});
   stop.querySelector('[data-chapter]').focus({preventScroll:true});
   history.replaceState(null,'','#map-'+chapterKey());
  } else origin?.focus({preventScroll:true});
}
$('#close-game').addEventListener('click', closeGame);
game.addEventListener('cancel', e => {e.preventDefault(); closeGame();});
function nearestObject() {
  let best = null, distance = 14;
  for (const [name, point] of Object.entries(eras[era].objects)) {
    const d = Math.hypot(point.walkX - x, point.walkY - y);
    if (d < distance) {best = name; distance = d;}
  }
  return best;
}
scene.addEventListener('keydown', e => {
  if (e.target.closest('button')) return;
  const key = e.key.toLowerCase();
  if (['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].includes(key)) {e.preventDefault(); keys.add(key);}
  if (key === 'e') {e.preventDefault(); const nearby = nearestObject(); if (nearby) performAction(nearby);}
});
window.addEventListener('keyup', e => keys.delete(e.key.toLowerCase()));
window.addEventListener('blur', () => keys.clear());
scene.addEventListener('blur', () => keys.clear());
window.addEventListener('resize', () => {if (game.open) renderWorld();});
scene.addEventListener('pointerdown', e => {
  if (e.target.closest('button')) return;
  const bounds = world.getBoundingClientRect();
  destination = {x: Math.max(15, Math.min(85, (e.clientX - bounds.left) / bounds.width * 100)), y: Math.max(eras[era].minY, Math.min(eras[era].maxY, (e.clientY - bounds.top) / bounds.height * 100))};
  const marker = $('#walk-marker'); marker.style.left = `${destination.x}%`; marker.style.top = `${destination.y}%`;
  marker.classList.remove('visible'); void marker.offsetWidth; marker.classList.add('visible'); scene.focus({preventScroll:true});
});
document.querySelectorAll('[data-action]').forEach(button => button.addEventListener('click', e => {
  const action = button.dataset.action, point = eras[era].objects[action];
  if (!point) return;
  // Keyboard/assistive activation is immediate. Pointer activation walks to the object.
  if (e.detail === 0 || Math.hypot(point.walkX - x, point.walkY - y) < 5) performAction(action);
  else {destination = {x: point.walkX, y: point.walkY, action}; scene.focus({preventScroll:true});}
}));
function performAction(action) {
  stopWalking();
  if (action === 'computer') {openComputer(); return;}
  if (action === 'coworker' && era === 'college') {openStudyNotes(); return;}
  if (action === 'cat') {openCampusVideo(); return;}
  const point = eras[era].objects[action];
  if (!point) return;
  clearTimeout(effectTimer);
  const speech = $('#speech'), effect = $('#action-effect');
  speech.classList.toggle('sr-only',action==='coworker' && era==='cafe');
  speech.style.left = `${Math.min(78, Math.max(20, point.x))}%`; speech.style.top = `${point.y - 8}%`;
  speech.textContent = action==='coworker' && sceneSpecs[era] ? sceneSpecs[era].response : {plant:'Watered.', snack:'Espresso candy.', coworker:'Hey, Vero!'}[action];
  effect.style.left = `${point.x}%`; effect.style.top = `${point.y}%`;
  effect.className = `effect-${action}`;
  effect.innerHTML = action === 'plant' ? '<i></i><i></i><i></i>' : action === 'snack' ? '<span aria-hidden="true">◇</span>' : '';
  if (action==='coworker' && sceneSpecs[era]) {
    effect.className='chapter-effect '+era+'-effect';
    if(era==='cafe') {
      const source = document.querySelector('#cafe li');
      speech.textContent=source.textContent;
      const card=document.createElement('div');card.className='recipe-proof';
      const line=document.createElement('span');line.textContent=source.textContent;card.append(line);
      effect.append(card);
    }
    if(era==='gamedev') effect.innerHTML='<div class="rhythm-pulse"><i>←</i><i>↓</i><i>↑</i><i>→</i></div>';
  }
  effectTimer = setTimeout(() => {speech.textContent = ''; effect.className = ''; effect.replaceChildren();}, sceneSpecs[era] ? 4200 : 2200);
}
function openComputer() {
  if (editor.open || world.classList.contains('opening-computer')) return;
  stopWalking(); computerArmed = false; editorOrigin = document.activeElement;
  world.classList.add('opening-computer');
  const show = () => {world.classList.remove('opening-computer'); editor.showModal(); selectFile('experience'); $('#close-editor').focus();};
  show();
}
function closeEditor() {
  editor.close(); stopWalking();
  (editorOrigin?.isConnected ? editorOrigin : scene).focus({preventScroll:true});
}
$('#close-editor').addEventListener('click', closeEditor);
editor.addEventListener('cancel', e => {e.preventDefault(); closeEditor();});
$('#read-story').addEventListener('click', openComputer);
function selectFile(name) {
  document.querySelectorAll('[data-document]').forEach(el => el.hidden = el.dataset.document !== name);
  document.querySelectorAll('[data-file]').forEach(el => el.setAttribute('aria-pressed', String(el.dataset.file === name)));
  $('#editor-filename').textContent = '# ' + ({experience:chapterData[era]?.filename || 'jpmc.md', skills:'skills.md', memories:chapterData[era]?'context.md':'memories.md'}[name]);
  $('.editor-document').scrollTop = 0;
}
document.querySelectorAll('[data-file]').forEach(b => b.addEventListener('click', () => selectFile(b.dataset.file)));
$('#experience-link').addEventListener('click', e => {e.preventDefault();e.stopPropagation();const section=chapterData[era]?.anchor || 'jpmc';const source=origin;closeGame(false);openQuickView(section,source);});
$('#print-resume').addEventListener('click', () => window.print());

// Cat locomotion: small ground-level walks, actual gait frames, then still rests.
const catStates = [
  {element:$('.kitten-one'), row:0, x:27, min:23, max:43, y:90, state:'sit', time:4.5, direction:1, next:1, frame:4},
  {element:$('.kitten-two'), row:1, x:67, min:56, max:75, y:91, state:'groom', time:7, direction:-1, next:-1, frame:5}
];
let catsVisible = true, catLast = 0;
new IntersectionObserver(entries => {catsVisible = entries[0].isIntersecting; $('.landing-world').classList.toggle('offscreen', !catsVisible);}, {threshold:0}).observe($('.landing-world'));
const kittenAtlas = new Image();
kittenAtlas.src = 'assets/kitten-poses.png';
const catWindows = [[10,365],[386,376],[780,365],[1160,388],[1558,246],[1885,259]];
function paintCat(cat) {
  cat.element.style.left = `${cat.x}%`;
  cat.element.style.top = `${cat.y}%`;
  cat.element.dataset.state = cat.state;
  const sprite = cat.element.firstElementChild;
  if (kittenAtlas.complete && kittenAtlas.naturalWidth) {
    const context = sprite.getContext('2d');
    const [sx,sw] = catWindows[cat.frame];
    context.clearRect(0,0,380,362);
    context.drawImage(kittenAtlas,sx,cat.row*362,sw,362,(380-sw)/2,0,sw,362);
  }
  sprite.style.transform = `scaleX(${cat.direction})`;
}
function tickCats(t) {
  const dt = Math.min((t-catLast)/1000 || 0,.05); catLast = t;
  if (catsVisible && !document.hidden) for (const cat of catStates) {
    if (paused) {cat.frame=4;paintCat(cat);continue;}
    cat.time -= dt;
    if (cat.state === 'walk') {
      cat.x += cat.direction * 1.45 * dt;
      cat.frame = [1,3,2,3][Math.floor((t / 1000 + cat.row*.21) / .19)%4];
      if (cat.time<=0 || cat.x<cat.min || cat.x>cat.max) {
        cat.x=Math.max(cat.min,Math.min(cat.max,cat.x));
        cat.state='stand';cat.frame=0;cat.time=1.2;
      }
    } else if (cat.time<=0) {
      if (cat.state==='stand') {cat.state=cat.row===0?'groom':'sit';cat.frame=cat.state==='groom'?5:4;cat.time=5+cat.row*2;}
      else if (cat.state==='turn') {cat.direction=cat.next;cat.state='walk';cat.time=3.5+cat.row;}
      else {
        cat.next = cat.x > (cat.min+cat.max)/2 ? -1 : 1;
        cat.state='turn';cat.frame=0;cat.time=.8;
      }
    }
    paintCat(cat);
  }
  requestAnimationFrame(tickCats);
}
catStates.forEach(paintCat);requestAnimationFrame(tickCats);
const campusCatPoses = {stand:'assets/campus-cat-stand.png', walkA:'assets/campus-cat-walk-a.png', walkB:'assets/campus-cat-walk-b.png', sit:'assets/campus-cat-sit.png', belly:'assets/campus-cat-belly.png'};
function showCampusPose(img, pose, direction) {
  if (img.dataset.pose !== pose) {img.dataset.pose = pose; img.src = campusCatPoses[pose];}
  img.style.transform = `scaleX(${direction})`;
}
const campusCat = {x:48, min:32, max:72, y:82, state:'walk', time:4.2, direction:1, next:1, element:document.getElementById('campus-cat')};
function tickCampusCat(dt, t) {
  const frozen = paused || $('#campus-video').open || $('#study-notes').open;
  const sprite = campusCat.element.querySelector('img');
  let pose = 'walkA';
  if (paused) {campusCat.state='sit'; pose='sit';}
  else if (!frozen) {
    campusCat.time -= dt;
    if (campusCat.state==='walk') {
      campusCat.x += campusCat.direction * 6 * dt;
      pose = Math.floor(t / 190) % 2 ? 'walkB' : 'walkA';
      if (campusCat.time<=0 || campusCat.x<campusCat.min || campusCat.x>campusCat.max) {
        campusCat.x=Math.max(campusCat.min, Math.min(campusCat.max, campusCat.x));
        campusCat.state='stand'; pose='stand'; campusCat.time=.7;
      }
    } else if (campusCat.time<=0) {
      if (campusCat.state==='stand') {campusCat.next=-campusCat.direction; campusCat.state='turn'; pose='stand'; campusCat.time=.4;}
      else if (campusCat.state==='turn') {campusCat.direction=campusCat.next; campusCat.state='walk'; campusCat.time=3+Math.random()*1.6;}
    } else pose = 'stand';
  } else pose = campusCat.state==='walk' ? 'walkA' : 'stand';
  const point = eras.college.objects.cat;
  point.x=campusCat.x; point.y=campusCat.y; point.walkX=campusCat.x; point.walkY=campusCat.y;
  showCampusPose(sprite, pose, campusCat.direction);
  campusCat.element.style.zIndex=Math.round(campusCat.y);
}
const campusVideoCat = {x:18, direction:1, mode:'walk', until:0};
let campusVideoFrame=0, campusVideoLast=0;
function tickCampusVideoCat(t) {
  if (!$('#campus-video').open) return;
  const dt=Math.min((t-campusVideoLast)/1000||0,.05); campusVideoLast=t;
  const img=document.getElementById('campus-video-cat');
  let pose='sit';
  if (paused) {showCampusPose(img,'sit',1); img.style.left='38%';}
  else {
    if (t>=campusVideoCat.until) {
      const order=['walk','sit','belly'];
      campusVideoCat.mode=order[(order.indexOf(campusVideoCat.mode)+1)%order.length];
      campusVideoCat.until=t+(campusVideoCat.mode==='walk'?3400:2200);
      if (campusVideoCat.mode==='walk') campusVideoCat.direction*=-1;
    }
    if (campusVideoCat.mode==='walk') {
      campusVideoCat.x=Math.max(6, Math.min(74, campusVideoCat.x+campusVideoCat.direction*22*dt));
      if (campusVideoCat.x<=6 || campusVideoCat.x>=74) campusVideoCat.direction*=-1;
      pose=Math.floor(t/190)%2 ? 'walkB' : 'walkA';
    } else if (campusVideoCat.mode==='belly') pose='belly';
    showCampusPose(img, pose, campusVideoCat.mode==='belly' ? 1 : campusVideoCat.direction);
    img.style.left=campusVideoCat.x+'%';
  }
  campusVideoFrame=requestAnimationFrame(tickCampusVideoCat);
}
function openCampusVideo() {
  stopWalking();
  clearTimeout(effectTimer);
  $('#speech').textContent='';
  $('#action-effect').className='';
  $('#action-effect').replaceChildren();
  const dialog=$('#campus-video');
  const frame=dialog.querySelector('iframe');
  if (!dialog.open) {
    frame.src='https://www.youtube-nocookie.com/embed/OAK4RZkAlgQ?autoplay=1&mute=1';
    dialog.showModal();
    campusVideoLast=0;
    campusVideoCat.mode='walk';
    campusVideoCat.until=performance.now()+3400;
    cancelAnimationFrame(campusVideoFrame);
    campusVideoFrame=requestAnimationFrame(tickCampusVideoCat);
  }
  $('#close-campus-video').focus();
}
function closeCampusVideo(restoreFocus=true) {
  const dialog=$('#campus-video');
  const frame=dialog.querySelector('iframe');
  if (frame.src && frame.src!=='about:blank') frame.src='about:blank';
  cancelAnimationFrame(campusVideoFrame);
  if (!dialog.open) return;
  dialog.close();
  if (restoreFocus && game.open) $('#campus-cat').focus({preventScroll:true});
}
$('#close-campus-video').addEventListener('click', ()=>closeCampusVideo());
$('#campus-video').addEventListener('cancel', e=>{e.preventDefault(); closeCampusVideo();});

// Resume evidence uses the same visible career source as the journey.
document.querySelectorAll('[data-resume-source]').forEach(folder => {
 const source=document.getElementById(folder.dataset.resumeSource);
 const evidence=folder.querySelector('.thread-evidence');
 evidence.append(source.querySelector('.role').cloneNode(true));
 const point=document.createElement('p');
 point.textContent=folder.dataset.resumeSource==='jpmc' ? source.querySelector('li:last-child').textContent : source.querySelector('li').textContent;
 evidence.append(point);
});

// Scroll-driven paper theatre. Scroll is never captured or required for chapter access.
const trail = document.querySelector('.overworld-trail');
const mapStops = [...document.querySelectorAll('.map-stop')];
const trailSvg = trail.querySelector('svg');
const trailPaths = [...trailSvg.querySelectorAll('path')];
const traveler = document.querySelector('#overworld .paper-traveler');
let trailLength=0, mapTickPending=false;
function layoutTrail() {
 const width=trail.clientWidth, height=trail.clientHeight;
 const mobile=width<641;
 const positions=mapStops.map((stop,i)=>({x:width*(mobile ? (i%2?.12:.15) : [ .32,.38,.30,.37,.32 ][i]), y:stop.offsetTop+stop.offsetHeight*(mobile?.53:.72)}));
 let path='M '+positions[0].x+' 0';
 let last={x:positions[0].x,y:0};
 for(const pos of positions) {
  const middle=(last.y+pos.y)/2;
  path+=' C '+last.x+' '+middle+', '+pos.x+' '+middle+', '+pos.x+' '+pos.y;
  last=pos;
 }
 path+=' L '+last.x+' '+height;
 trailSvg.setAttribute('viewBox','0 0 '+width+' '+height);
 trailPaths.forEach(p=>p.setAttribute('d',path));
 trailLength=trailPaths[0].getTotalLength();
 updateOverworld();
}
let jumpTraceUntil=0, lastTraceActive=-1;
function updateOverworld() {
 mapTickPending=false;
 if(!trailLength)return;
 const rect=trail.getBoundingClientRect();
 const targetY=Math.max(0,Math.min(rect.height,innerHeight*.56-rect.top));
 // Find the path point at the viewport reading line; its y-axis is monotonic.
 let lo=0,hi=trailLength;
 for(let n=0;n<18;n++){const mid=(lo+hi)/2;if(trailPaths[0].getPointAtLength(mid).y<targetY)lo=mid;else hi=mid;}
 const distance=(lo+hi)/2, point=trailPaths[0].getPointAtLength(distance);
 // Fixed + high z-index: full cutout paints above the sticky bar; stick stays on the route.
 traveler.style.left=(rect.left+point.x)+'px';
 traveler.style.top=(rect.top+point.y)+'px';
 traveler.classList.add('is-ready');
 traveler.hidden=!(rect.bottom>0 && rect.top<innerHeight);
 trailPaths[2].style.strokeDasharray=trailLength;
 trailPaths[2].style.strokeDashoffset=trailLength-distance;
 let active=0,best=Infinity;
 mapStops.forEach((stop,i)=>{const d=Math.abs(stop.offsetTop+stop.offsetHeight*.5-targetY);if(d<best){best=d;active=i;}});
 mapStops.forEach((stop,i)=>{stop.classList.toggle('is-current',i===active);stop.classList.toggle('is-past',i<active);});
 // #region agent log
 if(Date.now()<jumpTraceUntil && active!==lastTraceActive){lastTraceActive=active;dbg('C','app.js:updateOverworld','current island changed during jump',{active,id:mapStops[active]?.id,scrollY:Math.round(window.scrollY),targetY:Math.round(targetY)}); }
 // #endregion
}
let travelerRestTimer, lastTimelineScroll=window.scrollY;
window.addEventListener('scroll',()=>{
 const changed=Math.abs(window.scrollY-lastTimelineScroll)>.5;
 lastTimelineScroll=window.scrollY;
 const bounds=trail.getBoundingClientRect();
 if(changed && !paused && bounds.top<innerHeight && bounds.bottom>0 && !game.open && !document.querySelector('#quick-panel').open) {
  traveler.classList.add('timeline-walking');
  clearTimeout(travelerRestTimer);
  travelerRestTimer=setTimeout(()=>traveler.classList.remove('timeline-walking'),180);
 }
 if(!mapTickPending){mapTickPending=true;requestAnimationFrame(updateOverworld);}
},{passive:true});
new ResizeObserver(layoutTrail).observe(trail);
layoutTrail();


// Progressive enhancement: the original semantic career sections become an overlay.
// With JavaScript disabled they remain ordinary, directly linked page sections.
const quickDialog = document.getElementById('quick-panel');
const quickContent = quickDialog.querySelector('.quick-panel-content');
const quickSections = ['quick-view','experience','projects','education','resume'].map(id=>document.getElementById(id));
const quickNames = {'quick-view':'Career overview',experience:'Experience',education:'MDC & FIU',jpmc:'JPMorgan Chase',fortress:'Fortress',cafe:'Banh Miow Cafe',projects:'What if? — Projects',resume:'Résumé'};
let quickReturnFocus=null, quickScroll=0;
quickSections.forEach(section=>quickContent.append(section));

// Education Quick View: page through the same HTML facts as a small book (no second source).
const educationSection = document.getElementById('education');
const educationFacts = educationSection.querySelector('.education-facts');
const educationBookPages = (() => {
 const schools = [...educationFacts.querySelectorAll('p')];
 // Chronological chapter order for the book; print/no-JS keep the original HTML order.
 const ordered = [...schools].sort((a,b) => (a.dataset.eduKey==='mdc'?0:1) - (b.dataset.eduKey==='mdc'?0:1));
 return [
  {id:'college', title:'College', kind:'intro', node:null},
  ...ordered.map(node => ({
   id: node.dataset.eduKey || 'school',
   title: (node.querySelector('strong')?.textContent || 'School').trim(),
   kind:'school',
   node
  }))
 ];
})();
let educationBookPage = 0;
function placeEducationFactsInBook() {
 educationBookPages.forEach((page, index) => {
  if(!page.node)return;
  const copy=educationSection.querySelector(`.education-book-page[data-edu-page="${index}"] .education-book-copy`);
  if(copy) copy.append(page.node);
 });
}
function restoreEducationFacts() {
 educationBookPages.forEach(page => { if(page.node) educationFacts.append(page.node); });
}
function buildEducationBook() {
 if(educationSection.querySelector('.education-book'))return;
 const book = document.createElement('div');
 book.className='education-book';
 book.innerHTML = `
  <div class="education-book-shell">
   <ol class="education-book-agenda" aria-label="Education pages"></ol>
   <div class="education-book-pages"></div>
   <div class="education-book-nav">
    <button type="button" class="button secondary" data-edu-prev>Previous</button>
    <span class="education-book-status" aria-live="polite"></span>
    <button type="button" class="button secondary" data-edu-next>Next</button>
   </div>
  </div>`;
 const agenda = book.querySelector('.education-book-agenda');
 const pagesRoot = book.querySelector('.education-book-pages');
 educationBookPages.forEach((page, index) => {
  const item = document.createElement('li');
  item.innerHTML = `<button type="button" data-edu-page="${index}"><span class="page-index">${String(index+1).padStart(2,'0')}</span><span class="page-title"></span></button>`;
  item.querySelector('.page-title').textContent = page.title;
  agenda.append(item);
  const sheet = document.createElement('article');
  sheet.className='education-book-page';
  sheet.dataset.eduPage = String(index);
  sheet.setAttribute('aria-label', page.title);
  const heading = document.createElement('h3');
  heading.textContent = page.title;
  const copy = document.createElement('div');
  copy.className='education-book-copy';
  if(page.kind==='intro') {
   const intro = document.createElement('p');
   intro.textContent = 'Miami Dade College, then FIU. Computer science, then software development.';
   copy.append(intro);
  }
  const photo = document.createElement('div');
  photo.className='education-photo-slot';
  photo.textContent='Photo coming — place for a picture from this time.';
  sheet.append(heading, copy, photo);
  pagesRoot.append(sheet);
 });
 book.querySelector('[data-edu-prev]').addEventListener('click', ()=>showEducationBookPage(educationBookPage-1));
 book.querySelector('[data-edu-next]').addEventListener('click', ()=>showEducationBookPage(educationBookPage+1));
 agenda.addEventListener('click', e => {
  const button=e.target.closest('[data-edu-page]');
  if(button) showEducationBookPage(Number(button.dataset.eduPage));
 });
 educationSection.append(book);
}
function showEducationBookPage(index) {
 const pages = educationBookPages;
 if(!pages.length)return;
 educationBookPage=Math.max(0, Math.min(pages.length-1, index));
 const book=educationSection.querySelector('.education-book');
 if(!book)return;
 book.querySelectorAll('.education-book-page').forEach((sheet,i)=>sheet.classList.toggle('is-active', i===educationBookPage));
 book.querySelectorAll('.education-book-agenda [data-edu-page]').forEach(button=>button.setAttribute('aria-current', button.dataset.eduPage===String(educationBookPage)?'page':'false'));
 book.querySelector('[data-edu-prev]').disabled = educationBookPage===0;
 book.querySelector('[data-edu-next]').disabled = educationBookPage===pages.length-1;
 book.querySelector('.education-book-status').textContent = `Page ${educationBookPage+1} of ${pages.length}`;
}
function setEducationBookMode(on) {
 if(on) {
  buildEducationBook();
  placeEducationFactsInBook();
  educationSection.classList.add('is-book');
  showEducationBookPage(0);
 } else {
  educationSection.classList.remove('is-book');
  restoreEducationFacts();
 }
}
window.addEventListener('beforeprint', restoreEducationFacts);
window.addEventListener('afterprint', () => {
 if(quickDialog.open && !educationSection.hidden) setEducationBookMode(true);
});

function selectQuickSection(id) {
 if(!quickNames[id])id='quick-view';
 const isRole=['jpmc','fortress','cafe'].includes(id);
 quickSections.forEach(section=>section.hidden=section.id!==(isRole?'experience':id));
 document.querySelectorAll('#experience .experience-row').forEach(row=>row.hidden=isRole && row.id!==id);
 document.querySelector('#experience .section-heading').hidden=isRole;
 document.getElementById('quick-panel-title').textContent=quickNames[id];
 quickDialog.querySelectorAll('[data-quick-section]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.quickSection===id)));
 setEducationBookMode(id==='education');
 quickContent.scrollTop=0;
}
function openQuickView(id,source) {
 if(!quickDialog.open) {quickReturnFocus=source || document.activeElement;quickScroll=window.scrollY;window.scrollTo({top:quickScroll,behavior:'instant'});selectQuickSection(id);quickDialog.showModal();}
 else selectQuickSection(id);
 document.getElementById('close-quick-panel').focus({preventScroll:true});
}
function closeQuickView() {
 quickDialog.close();
 if(quickReturnFocus?.isConnected)quickReturnFocus.focus({preventScroll:true});
 window.scrollTo({top:quickScroll,behavior:'instant'});
}
document.getElementById('close-quick-panel').addEventListener('click',closeQuickView);
quickDialog.addEventListener('cancel',e=>{e.preventDefault();closeQuickView();});
quickDialog.addEventListener('keydown', e => {
 if(educationSection.hidden || !educationSection.classList.contains('is-book'))return;
 if(e.key==='ArrowRight' || e.key==='PageDown'){e.preventDefault();showEducationBookPage(educationBookPage+1);}
 if(e.key==='ArrowLeft' || e.key==='PageUp'){e.preventDefault();showEducationBookPage(educationBookPage-1);}
});
quickDialog.querySelectorAll('[data-quick-section]').forEach(button=>button.addEventListener('click',()=>selectQuickSection(button.dataset.quickSection)));
document.addEventListener('click',e=>{
 const link=e.target.closest('a[href^="#"]');
 if(!link || link.hasAttribute('data-chapter'))return;
 let section=link.getAttribute('href').slice(1);
 if(!quickNames[section])return;
 e.preventDefault();
 if(link.hasAttribute('data-quick-context')) {
  const active=document.querySelector('.map-stop.is-current');
  section=({college:'education',fulltime:'jpmc',fortress:'fortress',cafe:'cafe',gamedev:'projects'})[active?.dataset.mapChapter] || 'quick-view';
 }
 openQuickView(section,link);
});
const requestedQuick=location.hash.slice(1);
if(quickNames[requestedQuick]) {
 const mapId=({education:'college',jpmc:'fulltime',fortress:'fortress',cafe:'cafe',projects:'gamedev'})[requestedQuick];
 requestAnimationFrame(()=>{
  if(mapId){document.getElementById('map-'+mapId).scrollIntoView({behavior:'instant',block:'center'});history.replaceState(null,'','#map-'+mapId);}
  else {window.scrollTo({top:0,behavior:'instant'});history.replaceState(null,'',location.pathname+location.search);}
  openQuickView(requestedQuick,document.querySelector('header a[href="#quick-view"]'));
 });
}


// Deliberate game entry: pointer hold or hold E. Enter still activates a focused button.
let activeEntryHold=null;
function cancelEntryHold() {
 if(!activeEntryHold)return;
 clearTimeout(activeEntryHold.timer);
 activeEntryHold.button.classList.remove('holding');
 activeEntryHold=null;
 stopTransitions();
}
function beginEntryHold(button, pointer, fromKey) {
 cancelEntryHold();
 button.classList.add('holding');
 playTransition('enter');
 activeEntryHold={button,pointer,fromKey,timer:setTimeout(()=>{cancelEntryHold();enterChapter(button.dataset.chapter,button);},650)};
}
function currentHoldButton() {
 const focused=document.activeElement?.closest?.('[data-hold-entry]');
 if(focused && document.getElementById('overworld')?.contains(focused)) return focused;
 return document.querySelector('.map-stop.is-current [data-hold-entry]');
}
// #region agent log
function dbg(hypothesisId, location, message, data) {fetch('http://127.0.0.1:7599/ingest/2af5a33f-3a02-437a-96b8-dee8410988ae',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'5e1fd7'},body:JSON.stringify({sessionId:'5e1fd7',runId:'pre-fix',hypothesisId,location,message,data,timestamp:Date.now()})}).catch(()=>{});}
function islandSnap(){return [...document.querySelectorAll('.map-stop')].map(stop=>{const r=stop.getBoundingClientRect();return {id:stop.id,top:Math.round(r.top),current:stop.classList.contains('is-current')};});}
// #endregion
function jumpIsland(direction) {
 const stops=[...document.querySelectorAll('.map-stop')];
 let index=stops.findIndex(stop=>stop.classList.contains('is-current'));
 if(index<0) index=0;
 const first=stops[0];
 const firstCenter=first.getBoundingClientRect().top+first.offsetHeight*0.5;
 let next=index+direction;
 if(direction>0 && firstCenter>innerHeight*0.5+first.offsetHeight*0.28) next=0;
 if(next<0 || next>=stops.length) return;
 // #region agent log
 const overworldTop=Math.round(document.getElementById('overworld').getBoundingClientRect().top);
 dbg('A','app.js:jumpIsland','space jump chosen',{direction,index,from:stops[index]?.id,to:stops[next]?.id,scrollY:Math.round(window.scrollY),overworldTop,islands:islandSnap(),thumbs:[...document.querySelectorAll('.stops img')].map(img=>({top:Math.round(img.getBoundingClientRect().top),transform:getComputedStyle(img).transform}))});
 jumpTraceUntil=Date.now()+900; lastTraceActive=index;
 // #endregion
 stops[next].scrollIntoView({behavior:reducedMotion.matches?'instant':'smooth',block:'center'});
 const hold=stops[next].querySelector('[data-hold-entry]');
 const yBeforeFocus=window.scrollY;
 hold?.focus({preventScroll:true});
 // #region agent log
 dbg('B','app.js:jumpIsland','after focus',{yBeforeFocus:Math.round(yBeforeFocus),yAfterFocus:Math.round(window.scrollY),hash:location.hash,focused:document.activeElement?.dataset?.chapter||null,targetTop:Math.round(stops[next].getBoundingClientRect().top)});
 let frame=0;
 const sample=()=>{frame++;dbg('B','app.js:jumpIsland','frame after jump',{frame,scrollY:Math.round(window.scrollY),hash:location.hash,targetTop:Math.round(stops[next].getBoundingClientRect().top),current:document.querySelector('.map-stop.is-current')?.id||null,thumbTransform:getComputedStyle(document.querySelector('.stops img')).transform});if(frame<8 || frame===20) requestAnimationFrame(sample);};
 requestAnimationFrame(sample);
 // #endregion
}
function timelineKeysFree() {
 return !document.querySelector('dialog[open]') && !document.activeElement?.closest('input, textarea');
}
document.addEventListener('keydown',e=>{
 if(!timelineKeysFree() || e.metaKey || e.ctrlKey || e.altKey) return;
 if(e.key===' ' && !e.repeat){
  // #region agent log
  dbg('D','app.js:keydown','space before jump',{scrollY:Math.round(window.scrollY),shift:e.shiftKey,defaultPrevented:e.defaultPrevented,target:e.target?.tagName+(e.target?.id?'#'+e.target.id:''),active:document.activeElement?.tagName+(document.activeElement?.id?'#'+document.activeElement.id:'')});
  // #endregion
  e.preventDefault();jumpIsland(e.shiftKey?-1:1);
 }
 if(e.key.toLowerCase()==='e' && !e.repeat){
  const button=currentHoldButton();
  if(!button) return;
  e.preventDefault();
  beginEntryHold(button,null,true);
 }
 if(e.key.toLowerCase()==='v' && !e.repeat){
  const link=document.querySelector('.map-utility .map-quick');
  if(!link) return;
  e.preventDefault();
  link.click();
 }
});
document.addEventListener('keyup',e=>{if(e.key.toLowerCase()==='e' && activeEntryHold?.fromKey) cancelEntryHold();});
document.querySelectorAll('[data-hold-entry]').forEach(button=>{
 button.setAttribute('role','button');
 button.setAttribute('aria-label','Hold to enter game');
 button.querySelector('span').innerHTML='Hold to <kbd>E</kbd>nter game';
 button.addEventListener('pointerdown',e=>{if(e.button!==0)return;beginEntryHold(button,{x:e.clientX,y:e.clientY},false);});
 button.addEventListener('pointermove',e=>{const point=activeEntryHold?.pointer;if(point&&Math.hypot(e.clientX-point.x,e.clientY-point.y)>12)cancelEntryHold();});
 button.addEventListener('pointerleave',cancelEntryHold);
 button.addEventListener('pointercancel',cancelEntryHold);
 button.addEventListener('blur',cancelEntryHold);
 button.addEventListener('keydown',e=>{
  if(e.key==='Enter'){e.preventDefault();if(!e.repeat){cancelEntryHold();enterChapter(button.dataset.chapter,button);}}
 });
 button.addEventListener('click',e=>{e.preventDefault();if(e.detail===0){cancelEntryHold();enterChapter(button.dataset.chapter,button);}});
});
window.addEventListener('pointerup',cancelEntryHold);
window.addEventListener('blur',cancelEntryHold);
document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelEntryHold();});
const deskPhotos = [
  {src:'assets/jpmc-internship-2019.jpg', title:'JPMC internship · 2019', alt:'Group photograph from the 2019 JPMC internship, aboard Yacht Starship in Tampa Bay.'},
  {src:'assets/jpmc-desk-friday.jpg', title:'Wear Red Friday', alt:'A desk with two monitors showing kittens, two open boxes of donuts, and a white travel mug. A note says Wear Red Friday.'},
  {src:'assets/jpmc-desk-mug.jpg', title:'White mug', alt:'Vero in a gray hoodie and glasses, holding a white travel mug and making a peace sign.'}
];
const photoViewer=document.getElementById('photo-viewer');
let deskPhotoIndex = 0;
let deskPhotoOpener = null;
function showDeskPhoto(index) {
  deskPhotoIndex = (index + deskPhotos.length) % deskPhotos.length;
  const photo = deskPhotos[deskPhotoIndex];
  $('#photo-title').textContent = photo.title;
  $('#photo-count').textContent = (deskPhotoIndex + 1) + ' of ' + deskPhotos.length;
  const view = $('#photo-view');
  view.src = photo.src;
  view.alt = photo.alt;
}
document.querySelectorAll('.desk-photo').forEach(button => button.addEventListener('click', () => {
  stopWalking();
  clearTimeout(editorTimer);
  world.classList.remove('opening-computer');
  deskPhotoOpener = button;
  showDeskPhoto(Number(button.dataset.photo));
  photoViewer.showModal();
  document.getElementById('close-photo').focus();
}));
function closePhoto(){photoViewer.close();(deskPhotoOpener || document.querySelector('.desk-photo'))?.focus({preventScroll:true});}
document.getElementById('close-photo').addEventListener('click',closePhoto);
document.getElementById('photo-prev').addEventListener('click', () => showDeskPhoto(deskPhotoIndex - 1));
document.getElementById('photo-next').addEventListener('click', () => showDeskPhoto(deskPhotoIndex + 1));
photoViewer.addEventListener('cancel',e=>{e.preventDefault();closePhoto();});
photoViewer.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') {e.preventDefault(); showDeskPhoto(deskPhotoIndex - 1);}
  if (e.key === 'ArrowRight') {e.preventDefault(); showDeskPhoto(deskPhotoIndex + 1);}
});
function openStudyNotes() {
  stopWalking();
  clearTimeout(effectTimer);
  $('#speech').textContent = '';
  $('#action-effect').className = '';
  $('#action-effect').replaceChildren();
  const notes = $('#study-notes');
  if (notes.open) return;
  notes.showModal();
  $('#close-study-notes').focus();
}
function closeStudyNotes() {
  const notes = $('#study-notes');
  if (!notes.open) return;
  notes.close();
  const opener = document.querySelector('[data-action="coworker"]');
  if (game.open && era === 'college' && opener && !opener.hidden) opener.focus({preventScroll:true});
}
$('#close-study-notes').addEventListener('click', closeStudyNotes);
$('#study-notes').addEventListener('cancel', e => {e.preventDefault(); closeStudyNotes();});
const designNote=$('#design-note');
$('#design-credit').addEventListener('click',e=>{e.stopPropagation();stopWalking();designNote.showModal();$('#close-design-note').focus();});
function closeDesignNote(){designNote.close();$('#design-credit').focus({preventScroll:true});}
$('#close-design-note').addEventListener('click',closeDesignNote);
designNote.addEventListener('cancel',e=>{e.preventDefault();closeDesignNote();});
const builtFold=document.querySelector('#built details');
let builtWasOpen=false;
window.addEventListener('beforeprint',()=>{builtWasOpen=builtFold.open;builtFold.open=true;});
window.addEventListener('afterprint',()=>{builtFold.open=builtWasOpen;});
