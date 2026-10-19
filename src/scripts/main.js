// Shared interactivity: FAQ accordion, corporate carousel, scroll-spy nav
document.addEventListener('DOMContentLoaded', () => {
  // FAQ accordion
  document.querySelectorAll('.faq-item .faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  // Corporate logo carousel arrows
  const track = document.querySelector('.corp-track');
  if (track) {
    document.querySelector('.corp-arrow.prev')?.addEventListener('click', () =>
      track.scrollBy({ left: -340, behavior: 'smooth' }));
    document.querySelector('.corp-arrow.next')?.addEventListener('click', () =>
      track.scrollBy({ left: 340, behavior: 'smooth' }));
  }

  // Scroll-spy for nav highlight
  const sections = [...document.querySelectorAll('[data-spy]')];
  const links = [...document.querySelectorAll('.main-nav a[data-spy-link]')];
  if (sections.length && links.length && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          links.forEach(l => l.classList.toggle('active',
            l.getAttribute('href') === '#' + e.target.id));
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(s => obs.observe(s));
  }

  // Contact form: fake submit -> WhatsApp fallback note
  const form = document.getElementById('inquiryForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const note = document.getElementById('formNote');
      if (note) {
        note.textContent = 'Thanks! Your inquiry was noted — we will contact you shortly. For instant reply, WhatsApp us at 718-427-0968.';
        note.style.color = '#2e7d32';
      }
      form.reset();
    });
  }
});
