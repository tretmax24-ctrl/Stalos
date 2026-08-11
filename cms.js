/* STALOS public-site CMS bridge. Published Supabase content is layered on top of the built-in site content. */
(function () {
  const SUPABASE_URL = 'https://ldlvqymrxmiaxjmkrnyj.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_FheAOYbTPAqPRqyiM_zBQw_htUJspWa';
  const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const page = location.pathname.endsWith('/about.html') ? 'about' : location.pathname.endsWith('/academics.html') ? 'academics' : location.pathname.endsWith('/admissions.html') ? 'admissions' : location.pathname.endsWith('/events.html') ? 'events' : location.pathname.endsWith('/gallery.html') ? 'gallery' : location.pathname.endsWith('/contact.html') ? 'contact' : 'home';
  async function settings(){const {data,error}=await db.from('site_settings').select('id,value');if(error)throw error;return Object.fromEntries((data||[]).map(r=>[r.id,r.value]));}
  function text(sel,v){const e=document.querySelector(sel);if(e&&v!==undefined&&v!=='')e.textContent=v;}
  function texts(sel,v){document.querySelectorAll(sel).forEach(e=>{if(v!==undefined&&v!=='')e.textContent=v;});}
  function list(sel,v){const e=document.querySelector(sel);if(!e||!v)return;e.innerHTML=String(v).split(/\n+/).filter(Boolean).map(x=>`<li>${esc(x)}</li>`).join('');}
  function tel(v){return String(v||'').replace(/[^0-9+]/g,'');}

  async function applySettings(){
    const s=await settings();
    document.title=`STALOS | ${s.school_name||'St. Aloysius Senior Secondary School Nabbingo'}`;
    texts('.footer-brand',s.school_name);
    if(page==='home'){
      text('.hero h1',s.hero_title); text('.hero .hero-text > p',s.hero_description);
      text('.section:nth-of-type(2) .section-heading h2',s.home_why_title); text('.section:nth-of-type(2) .section-heading p',s.home_why_text);
      const cards=document.querySelectorAll('.section:nth-of-type(2) .grid.grid-3 .card');
      const cs=[['home_academics_title','home_academics_text'],['home_values_title','home_values_text'],['home_skills_title','home_skills_text']];
      cards.forEach((c,i)=>{if(!cs[i])return;text.call(null,'h3',s[cs[i][0]]);const p=c.querySelector('p');if(p&&s[cs[i][1]])p.textContent=s[cs[i][1]];});
      text('.section:nth-of-type(3) .section-heading h2',s.home_life_title);text('.section:nth-of-type(3) .section-heading p',s.home_life_text);
      text('.section:nth-of-type(6) .section-heading h2',s.home_growth_title);text('.section:nth-of-type(6) .section-heading p',s.home_growth_text);
      const blocks=document.querySelectorAll('.section:nth-of-type(6) .content-block');if(blocks[0]){text('h3',s.home_facilities_title);const p=blocks[0].querySelector('p');if(p&&s.home_facilities_text)p.textContent=s.home_facilities_text;}if(blocks[1]){text('h3',s.home_studentlife_title);const p=blocks[1].querySelector('p');if(p&&s.home_studentlife_text)p.textContent=s.home_studentlife_text;}
      text('.site-cta h2',s.home_cta_title);
      const apply=document.querySelector('.hero .btn-primary');if(apply)apply.textContent=s.admissions_open==='true'?'Apply Today':'Admissions Information';
    }
    if(page==='about'){
      text('.section-alt .section-heading h2',s.about_heading);text('.section-alt .section-heading p',s.about_intro);
      const b=document.querySelectorAll('.section-alt .content-block');if(b[0]){text('h3',s.about_story_title);text('p',s.about_story_text)}if(b[1]){text('h3',s.about_who_title);text('p',s.about_who_text)}
      const cards=document.querySelectorAll('.section:not(.section-alt) .grid.grid-3 .card');if(cards[0])cards[0].querySelector('p').textContent=s.about_vision||cards[0].querySelector('p').textContent;if(cards[1])cards[1].querySelector('p').textContent=s.about_motto||cards[1].querySelector('p').textContent;if(cards[2])cards[2].querySelector('p').textContent=s.about_foundation||cards[2].querySelector('p').textContent;
      text('.section-alt .section-heading h2',s.about_leadership);const leaders=document.querySelectorAll('.section-alt .content-block');if(leaders.length>=2){leaders[0].querySelector('p').textContent=s.about_headteacher||leaders[0].querySelector('p').textContent;leaders[1].querySelector('p').textContent=s.about_governance||leaders[1].querySelector('p').textContent;}
      const lists=document.querySelectorAll('.section .content-block ul');if(lists[0])list('.section .content-block ul',s.about_completed);if(lists[1])list('.section .content-block ul',s.about_priorities);
    }
    if(page==='academics'){
      text('.section-alt .section-heading h2',s.academics_heading);text('.section-alt .section-heading p',s.academics_intro);const b=document.querySelectorAll('.section-alt .content-block');if(b[0]){b[0].querySelector('h3').textContent=s.academics_olevel_title;b[0].querySelector('p').textContent=s.academics_olevel_text}if(b[1]){b[1].querySelector('h3').textContent=s.academics_holistic_title;b[1].querySelector('p').textContent=s.academics_holistic_text}text('.section:not(.section-alt) .section-heading h2',s.academics_vocational_heading);const cards=document.querySelectorAll('.section:not(.section-alt) .grid.grid-3 .card');const a=[['academics_tailoring_title','academics_tailoring_text'],['academics_plumbing_title','academics_plumbing_text'],['academics_trades_title','academics_trades_text']];cards.forEach((c,i)=>{if(a[i]){c.querySelector('h3').textContent=s[a[i][0]];c.querySelector('p').textContent=s[a[i][1]]}});
    }
    if(page==='contact'){
      text('.section-alt .section-heading h2',s.contact_heading);text('.section-alt .section-heading p',s.contact_intro);const blocks=document.querySelectorAll('.section-alt .content-block');if(blocks[0]){const p=blocks[0].querySelector('p');p.innerHTML=`<strong>${esc(s.school_name||'')}</strong><br>${esc(s.address||'').replace(/\n/g,'<br>')}<br><br><i class="fas fa-phone"></i> ${esc(s.phone||'')}<br><i class="fas fa-envelope"></i> ${esc(s.email||'')}`;}if(blocks[1]){const li=blocks[1].querySelectorAll('li');if(li[0])li[0].innerHTML=`<strong>Head Teacher</strong> — ${esc(s.contact_headteacher||'')}`;if(li[1])li[1].innerHTML=`<strong>School Bursar</strong> — ${esc(s.contact_bursar||'')}`;if(li[2])li[2].innerHTML=`<strong>Board Chairman</strong> — ${esc(s.contact_board||'')}`;}
    }
    if(page==='admissions'){
      text('.section-alt .section-heading h2',s.admissions_heading);text('.section-alt .section-heading p',s.admissions_intro);const b=document.querySelectorAll('.section-alt .content-block');if(b[0])b[0].querySelector('p').textContent=s.admissions_who;if(b[1])b[1].querySelector('p').innerHTML=esc(s.admissions_fees||'').replace(/\n/g,'<br>');
      if(s.admissions_open!=='true'){const form=document.getElementById('admitForm');if(form)form.innerHTML='<div class="form-banner"><div class="form-banner-icon"><i class="fas fa-lock"></i></div><div><strong>Admissions are currently closed</strong><p>Please contact the school for the next admission period.</p></div></div>';}
      document.querySelectorAll('a[href^="tel:"]').forEach(a=>{if(s.phone){a.href='tel:'+tel(s.phone);a.textContent=s.phone;}});document.querySelectorAll('.form-note strong').forEach(e=>{if(s.email)e.textContent=s.email});
    }
  }

  async function renderEvents(){
    if(page!=='events')return;const host=document.querySelector('.section-alt .container');if(!host)return;const {data,error}=await db.from('events').select('id,title,description,event_date,location,image_url').eq('published',true).order('event_date',{ascending:true});if(error||!data?.length)return;
    let row=host.querySelector('.cms-events-row');if(!row){row=document.createElement('div');row.className='gallery-row cms-events-row';row.innerHTML='<div class="gallery-row-head"><h3 class="gallery-section-title">Published events</h3></div><div class="gallery-scroll cms-events-scroll"></div>';host.appendChild(row)}
    row.querySelector('.cms-events-scroll').innerHTML=data.map(e=>`<article class="card" style="min-width:280px">${e.image_url?`<img src="${esc(e.image_url)}" alt="${esc(e.title)}" style="width:100%;height:180px;object-fit:cover;border-radius:12px;margin-bottom:14px">`:'<div class="card-icon"><i class="fas fa-calendar-alt"></i></div>'}<h3>${esc(e.title)}</h3><p>${esc(e.description)}</p><small>${new Date(e.event_date).toLocaleDateString()}${e.location?' · '+esc(e.location):''}</small></article>`).join('');
  }
  async function renderGallery(){
    const {data,error}=await db.from('gallery_images').select('title,description,image_url').eq('published',true).order('sort_order',{ascending:true}).order('created_at',{ascending:false});if(error||!data?.length)return;
    if(page==='gallery'){const section=document.querySelector('.section-alt .container');if(section&&!section.querySelector('.cms-gallery-row')){const row=document.createElement('div');row.className='gallery-row cms-gallery-row';row.innerHTML='<div class="gallery-row-head"><h3 class="gallery-section-title">Newly published photos</h3><span class="swipe-hint">Swipe →</span></div><div class="gallery-scroll"></div>';section.appendChild(row);row.querySelector('.gallery-scroll').innerHTML=data.map(g=>`<figure class="gallery-card"><img src="${esc(g.image_url)}" alt="${esc(g.title||'STALOS photo')}" loading="lazy"><figcaption class="gallery-caption">${esc(g.title||g.description||'STALOS')}</figcaption></figure>`).join('');}}
    if(page==='home'){const strip=document.querySelector('.photo-strip');if(strip){const existing=strip.querySelectorAll('img').length;data.slice(0,4).forEach((g,i)=>{if(i>=4-existing){const img=document.createElement('img');img.src=g.image_url;img.alt=g.title||'STALOS photo';img.loading='lazy';strip.appendChild(img);}});}}
  }
  document.addEventListener('DOMContentLoaded',async()=>{try{await applySettings();await renderEvents();await renderGallery();}catch(e){console.warn('STALOS CMS unavailable; static content remains visible.',e);}});
})();
