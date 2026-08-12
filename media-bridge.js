/* STALOS public Media Library bridge */
(()=>{
  const db=window.supabase.createClient('https://ldlvqymrxmiaxjmkrnyj.supabase.co','sb_publishable_FheAOYbTPAqPRqyiM_zBQw_htUJspWa');
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  async function load(){
    const r=await db.from('media_library').select('id,title,description,image_url,created_at').order('created_at',{ascending:false}).limit(12);
    if(r.error||!r.data?.length)return;
    const existing=document.getElementById('stalos-media-library');
    if(existing)existing.remove();
    const section=document.createElement('section');
    section.id='stalos-media-library';
    section.className='section section-alt';
    section.innerHTML='<div class="container"><div class="section-heading center"><h2>Latest from STALOS</h2><p>Recent photos from the STALOS Media Library.</p></div><div class="grid grid-3" data-media-grid></div></div>';
    section.querySelector('[data-media-grid]').innerHTML=r.data.map(m=>`<figure class="card reveal" style="margin:0"><img src="${esc(m.image_url)}" alt="${esc(m.title||'STALOS photo')}" loading="lazy" style="width:100%;height:220px;object-fit:cover;border-radius:12px"><figcaption style="padding-top:10px"><strong>${esc(m.title||'STALOS photo')}</strong>${m.description?`<div class="muted">${esc(m.description)}</div>`:''}</figcaption></figure>`).join('');
    const main=document.querySelector('main');
    const cta=main?.querySelector('.site-cta');
    if(main)main.insertBefore(section,cta||null);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});else load();
})();
