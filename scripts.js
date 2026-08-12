// STALOS interactive scripts
document.addEventListener('DOMContentLoaded', function () {
  const counters = document.querySelectorAll('[data-count]');
  const animateCounter = (el) => {
    const cmsText = el.textContent.trim().replace(/,/g, '');
    const attrTarget = el.getAttribute('data-count');
    const target = /^\d+$/.test(cmsText) && cmsText !== '0' ? parseInt(cmsText, 10) : parseInt(attrTarget, 10);
    if (isNaN(target)) return;
    el.setAttribute('data-count', String(target));
    const duration = 1400, start = performance.now();
    const step = (now) => { const progress=Math.min((now-start)/duration,1), eased=1-Math.pow(1-progress,3); el.textContent=Math.floor(eased*target).toLocaleString(); if(progress<1)requestAnimationFrame(step); else el.textContent=target.toLocaleString(); };
    requestAnimationFrame(step);
  };
  if(counters.length&&'IntersectionObserver'in window){const obs=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){animateCounter(entry.target);obs.unobserve(entry.target)}}),{threshold:.4});counters.forEach(c=>obs.observe(c))}
  const items=document.querySelectorAll('.gallery-item img, .gallery-card img');
  if(items.length){const overlay=document.createElement('div');overlay.className='lightbox';overlay.innerHTML='<button class="lightbox-close" aria-label="Close">&times;</button><img src="" alt=""><p class="lightbox-caption"></p>';document.body.appendChild(overlay);const img=overlay.querySelector('img'),cap=overlay.querySelector('.lightbox-caption'),close=()=>{overlay.classList.remove('open');document.body.style.overflow=''};items.forEach(x=>{x.style.cursor='zoom-in';x.addEventListener('click',()=>{if(!x.complete||!x.naturalWidth)return;const f=x.closest('figure'),c=f?.querySelector('.gallery-caption');img.src=x.currentSrc||x.src;img.alt=x.alt||'';cap.textContent=c?.textContent||x.alt||'';overlay.classList.add('open');document.body.style.overflow='hidden'})});overlay.querySelector('.lightbox-close').onclick=close;overlay.onclick=e=>{if(e.target===overlay)close()};document.addEventListener('keydown',e=>{if(e.key==='Escape')close()})}
  const reveals=document.querySelectorAll('.reveal');if(reveals.length&&'IntersectionObserver'in window){const ro=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('revealed');ro.unobserve(entry.target)}}),{threshold:.12});reveals.forEach(el=>ro.observe(el))}else reveals.forEach(el=>el.classList.add('revealed'));
  if(!window.__STALOS_CMS_LOADER){window.__STALOS_CMS_LOADER=true;const load=()=>{if(window.__STALOS_CMS_LOADED)return;const sup=document.createElement('script');sup.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';sup.onload=()=>{const cms=document.createElement('script');cms.src='cms.js';cms.defer=true;document.head.appendChild(cms)};document.head.appendChild(sup)};load()}
});