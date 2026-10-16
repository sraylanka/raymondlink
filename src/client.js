const root = document.documentElement;
const toggle = document.querySelector('#sidebar-toggle');
const mobile = window.matchMedia('(max-width: 700px)');
function closeNav() { document.body.classList.remove('nav-open'); syncNav(); }
function syncNav() { toggle.setAttribute('aria-expanded', String(mobile.matches ? document.body.classList.contains('nav-open') : !document.body.classList.contains('nav-collapsed'))); document.querySelector('#sidebar').inert = mobile.matches ? !document.body.classList.contains('nav-open') : document.body.classList.contains('nav-collapsed'); }
toggle.addEventListener('click', () => { document.body.classList.toggle(mobile.matches ? 'nav-open' : 'nav-collapsed'); syncNav(); if(mobile.matches && document.body.classList.contains('nav-open')) document.querySelector('#sidebar a').focus(); });
document.querySelector('#backdrop').addEventListener('click', closeNav);
mobile.addEventListener('change', () => { document.body.classList.remove('nav-open','nav-collapsed'); syncNav(); });
syncNav();
document.querySelector('#theme-toggle').addEventListener('click', () => { root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark'; try { localStorage.setItem('rl-theme',root.dataset.theme); } catch {} });
const sectionElements = [...document.querySelectorAll('main > section[id]')];
const navLinks = [...document.querySelectorAll('.nav-link[href^="#"], .page-toc a')];
function setActive(id) { navLinks.forEach(a => { const active = a.hash === '#' + id; a.classList.toggle('active',active); if(active) a.setAttribute('aria-current','location'); else a.removeAttribute('aria-current'); }); const current = document.querySelector(`.nav-link[href="#${id}"] span`); if(current) document.querySelector('#breadcrumb').textContent=current.textContent; }
let queued = false;
window.addEventListener('scroll', () => { if(queued) return; queued=true; requestAnimationFrame(() => { let current=sectionElements[0]; for(const s of sectionElements) if(s.getBoundingClientRect().top < 180) current=s; if(window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 20) current=sectionElements.at(-1); setActive(current.id); queued=false; }); }, {passive:true});
document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', () => { closeNav(); if(a.closest('#sidebar')) toggle.focus(); }));
const dialog=document.querySelector('#search-dialog'); const input=document.querySelector('#search-input');
function openSearch(){ if(!dialog.open) dialog.showModal(); input.value=''; filterSearch(); input.focus(); }
function filterSearch(){ let count=0; document.querySelectorAll('#search-results a').forEach(a=>{ const show=a.dataset.keywords.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').includes(input.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')); a.hidden=!show; if(show) count++; }); document.querySelector('#search-empty').hidden=count>0; }
document.querySelectorAll('[data-search]').forEach(b=>b.addEventListener('click',openSearch));
document.querySelector('#search-close').addEventListener('click',()=>dialog.close());
input.addEventListener('input',filterSearch);
input.addEventListener('keydown',event=>{ if(event.key==='ArrowDown'){event.preventDefault();document.querySelector('#search-results a:not([hidden])')?.focus();} if(event.key==='Enter'){event.preventDefault();document.querySelector('#search-results a:not([hidden])')?.click();} });
dialog.addEventListener('click',e=>{if(e.target===dialog){ const r=dialog.getBoundingClientRect(); if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close(); }});
document.querySelectorAll('#search-results a').forEach(a=>a.addEventListener('click',()=>{dialog.close();closeNav();document.querySelector(a.hash)?.querySelector('h1,h2')?.focus();}));
document.addEventListener('keydown',event=>{ if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){event.preventDefault(); dialog.open?dialog.close():openSearch();} if(event.key==='Escape' && !dialog.open && document.body.classList.contains('nav-open')){closeNav();toggle.focus();} if(event.key==='Tab' && mobile.matches && document.body.classList.contains('nav-open') && !dialog.open){ const links=[...document.querySelectorAll('#sidebar a, #sidebar button')]; const first=links[0],last=links.at(-1); if(event.shiftKey && document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus();} } });
const copy=document.querySelector('#copy-email');
copy.addEventListener('click',async()=>{ const status=document.querySelector('#copy-status'); try{await navigator.clipboard.writeText(copy.dataset.email);status.textContent='Email address copied.';}catch{status.textContent='Copy this address: '+copy.dataset.email;} });
if(sectionElements.some(section => '#' + section.id === location.hash)) setActive(location.hash.slice(1));
