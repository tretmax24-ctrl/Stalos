/* STALOS public-site CMS bridge. Reads only published/public Supabase data. */
(function () {
  const SUPABASE_URL = 'https://ldlvqymrxmiaxjmkrnyj.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_FheAOYbTPAqPRqyiM_zBQw_htUJspWa';
  const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
  }[c]));

  async function getSettings() {
    const { data, error } = await db.from('site_settings').select('id,value');
    if (error) throw error;
    return Object.fromEntries((data || []).map((row) => [row.id, row.value]));
  }

  function setText(selector, value) {
    const el = document.querySelector(selector);
    if (el && value) el.textContent = value;
  }

  function setLink(selector, value, prefix) {
    const el = document.querySelector(selector);
    if (!el || !value) return;
    el.textContent = value;
    if (prefix) el.href = prefix + value.replace(/\s+/g, '');
  }

  async function applySettings() {
    const s = await getSettings();
    document.title = `STALOS | ${s.school_name || 'St. Aloysius Senior Secondary School Nabbingo'}`;

    if (location.pathname.endsWith('/index.html') || location.pathname === '/' || location.pathname.endsWith('/Stalos/')) {
      setText('.hero h1', s.hero_title);
      setText('.hero .hero-text > p', s.hero_description);
      setText('.footer-brand', s.school_name);
      const apply = document.querySelector('.hero .btn-primary');
      if (apply) {
        apply.textContent = s.admissions_open === 'true' ? 'Apply Today' : 'Admissions Information';
      }
    }

    if (location.pathname.endsWith('/about.html')) {
      setText('.footer-brand', s.school_name);
    }

    if (location.pathname.endsWith('/contact.html')) {
      const office = document.querySelector('.content-block p');
      if (office) office.innerHTML = `<strong>${escapeHtml(s.school_name)}</strong><br>${escapeHtml(s.address || '')}`;
      const contact = document.querySelector('.content-block p[style*="margin-top"]');
      if (contact) contact.innerHTML = `<i class="fas fa-phone" style="color:var(--gold);margin-right:0.4rem;"></i> ${escapeHtml(s.phone || '')}<br><i class="fas fa-envelope" style="color:var(--gold);margin-right:0.4rem;"></i> ${escapeHtml(s.email || '')}`;
      const footer = document.querySelector('.footer-brand');
      if (footer) footer.textContent = s.school_name || footer.textContent;
    }

    if (location.pathname.endsWith('/admissions.html')) {
      const form = document.getElementById('admitForm');
      const applySection = document.getElementById('apply');
      if (form && s.admissions_open !== 'true') {
        form.innerHTML = `<div class="form-banner"><div class="form-banner-icon"><i class="fas fa-lock"></i></div><div><strong>Admissions are currently closed</strong><p>Please contact the school for the next admission period.</p></div></div>`;
      }
      document.querySelectorAll('a[href^="tel:"]').forEach((a) => {
        if (s.phone) { a.href = 'tel:' + s.phone.replace(/[^0-9+]/g, ''); a.textContent = s.phone; }
      });
      document.querySelectorAll('.form-note strong').forEach((el) => { if (s.email) el.textContent = s.email; });
      if (applySection && s.admissions_open !== 'true') applySection.querySelector('.section-heading p').textContent = 'Admissions are currently closed. Please contact the school for the next intake.';
    }
  }

  async function renderEvents() {
    if (!location.pathname.endsWith('/events.html')) return;
    const container = document.querySelector('.section-alt .grid.grid-3');
    if (!container) return;
    const { data, error } = await db.from('events').select('title,description,event_date,location,image_url').eq('published', true).order('event_date', { ascending: true });
    if (error || !data || !data.length) return;
    container.innerHTML = data.map((e) => `<article class="card">${e.image_url ? `<img src="${escapeHtml(e.image_url)}" alt="${escapeHtml(e.title)}" style="width:100%;height:180px;object-fit:cover;border-radius:12px;margin-bottom:14px">` : '<div class="card-icon"><i class="fas fa-calendar-alt"></i></div>'}<h3>${escapeHtml(e.title)}</h3><p>${escapeHtml(e.description)}</p><small>${new Date(e.event_date).toLocaleDateString()}${e.location ? ' · ' + escapeHtml(e.location) : ''}</small></article>`).join('');
  }

  async function renderGallery() {
    const { data, error } = await db.from('gallery_images').select('title,description,image_url').eq('published', true).order('sort_order', { ascending: true }).order('created_at', { ascending: false });
    if (error || !data || !data.length) return;

    if (location.pathname.endsWith('/gallery.html')) {
      const section = document.querySelector('.section-alt .container');
      if (!section) return;
      const heading = section.querySelector('.section-heading');
      section.innerHTML = '';
      if (heading) section.appendChild(heading);
      const row = document.createElement('div');
      row.className = 'gallery-row';
      row.innerHTML = `<div class="gallery-row-head"><h3 class="gallery-section-title">Published school gallery</h3><span class="swipe-hint">Swipe →</span></div><div class="gallery-scroll">${data.map((g) => `<figure class="gallery-card"><img src="${escapeHtml(g.image_url)}" alt="${escapeHtml(g.title || 'STALOS photo')}" decoding="async"><figcaption class="gallery-caption">${escapeHtml(g.title || g.description || 'STALOS')}</figcaption></figure>`).join('')}</div>`;
      section.appendChild(row);
    }

    if (location.pathname.endsWith('/index.html') || location.pathname === '/' || location.pathname.endsWith('/Stalos/')) {
      const strip = document.querySelector('.photo-strip');
      if (strip) strip.innerHTML = data.slice(0, 4).map((g) => `<img src="${escapeHtml(g.image_url)}" alt="${escapeHtml(g.title || 'STALOS photo')}" loading="lazy">`).join('');
    }
  }

  document.addEventListener('DOMContentLoaded', async () => {
    try {
      await applySettings();
      await renderEvents();
      await renderGallery();
    } catch (err) {
      console.warn('STALOS CMS unavailable; keeping static fallback.', err);
    }
  });
})();
