// STALOS interactive scripts
document.addEventListener('DOMContentLoaded', function () {
  // Animated counters
  const counters = document.querySelectorAll('[data-count]');
  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(target)) return;
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString();
    };
    requestAnimationFrame(step);
  };

  if (counters.length && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach((c) => obs.observe(c));
  }

  // Gallery lightbox — works with .gallery-item and .gallery-card
  const items = document.querySelectorAll('.gallery-item img, .gallery-card img');
  if (items.length) {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.innerHTML = `
      <button class="lightbox-close" aria-label="Close">&times;</button>
      <img src="" alt="">
      <p class="lightbox-caption"></p>
    `;
    document.body.appendChild(overlay);
    const lbImg = overlay.querySelector('img');
    const lbCap = overlay.querySelector('.lightbox-caption');
    const closeBtn = overlay.querySelector('.lightbox-close');

    const open = (src, alt, caption) => {
      lbImg.src = src;
      lbImg.alt = alt || '';
      lbCap.textContent = caption || alt || '';
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    };
    const close = () => {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    };

    items.forEach((img) => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => {
        const fig = img.closest('figure');
        const cap = fig ? fig.querySelector('.gallery-caption') : null;
        open(img.src, img.alt, cap ? cap.textContent : '');
      });
    });
    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  }

  // Reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    const ro = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          ro.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach((el) => ro.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('revealed'));
  }
});
