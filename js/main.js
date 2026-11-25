// Shared interactivity: FAQ accordion, corporate carousel, scroll-spy nav,
// YouTube click-to-load facades, hero video data-saver, validated form submission.
document.addEventListener('DOMContentLoaded', () => {
  // FAQ accordion (with aria-expanded)
  document.querySelectorAll('.faq-item .faq-q').forEach(btn => {
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-q')?.setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });


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

  // YouTube facades: load the real player only on click
  document.querySelectorAll('.yt-facade').forEach(btn => {
    btn.addEventListener('click', () => {
      const iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube.com/embed/' + btn.dataset.yt + '?autoplay=1&rel=0';
      iframe.title = btn.dataset.title || 'Balloons Lane video';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      btn.replaceWith(iframe);
    });
  });


  /* Inquiry forms: validate in the browser, then genuinely submit.
     Delivery: FormSubmit forwards each valid inquiry to seooptimizeragency@gmail.com
     (spam captcha page + first-submission activation email apply on their side). */
  (function () {
    var forms = document.querySelectorAll('form.inquiry-form');
    if (!forms.length) return;
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var zipRe = /^\d{5}(-\d{4})?$/;
    function showError(field, msg) {
      if (!field) return;
      var input = field.querySelector('input, select, textarea');
      if (input) { input.classList.add('field-invalid'); input.setAttribute('aria-invalid', 'true'); }
      var err = field.querySelector('.field-error');
      if (!err) { err = document.createElement('p'); err.className = 'field-error'; field.appendChild(err); }
      err.textContent = msg;
    }
    function clearError(field) {
      if (!field) return;
      var input = field.querySelector('input, select, textarea');
      if (input) { input.classList.remove('field-invalid'); input.removeAttribute('aria-invalid'); }
      var err = field.querySelector('.field-error');
      if (err) err.remove();
    }
    function fieldByName(form, name) {
      var input = form.querySelector('[name="' + name + '"]');
      return input ? input.closest('.field') : null;
    }
    forms.forEach(function (form) {
      form.addEventListener('input', function (e) {
        var f = e.target.closest('.field'); if (f) clearError(f);
      });
      form.addEventListener('change', function (e) {
        var f = e.target.closest('.field'); if (f) clearError(f);
        if (e.target.closest('.verify-row')) {
          var herr = form.querySelector('.verify-row-error'); if (herr) herr.remove();
        }
      });
      form.addEventListener('submit', function (e) {
        var honey = form.querySelector('[name="_honey"]');
        if (honey && honey.value) { e.preventDefault(); return; }
        var firstBad = null;
        function bad(field, msg) {
          if (!field) return;
          showError(field, msg);
          if (!firstBad) firstBad = field.querySelector('input, select, textarea');
        }
        var nameV = form.querySelector('[name="name"]');
        if (!nameV || nameV.value.trim().length < 2) bad(fieldByName(form, 'name'), 'Please enter your name.');
        var emailV = form.querySelector('[name="email"]');
        if (!emailV || !emailRe.test(emailV.value.trim())) bad(fieldByName(form, 'email'), 'Please enter a valid email address.');
        var phoneV = form.querySelector('[name="phone"]');
        if (phoneV && phoneV.value.trim() && phoneV.value.replace(/\D/g, '').length < 7)
          bad(fieldByName(form, 'phone'), 'Please enter a valid phone number.');
        var dateV = form.querySelector('[name="event_date"]');
        if (!dateV || !dateV.value) {
          bad(fieldByName(form, 'event_date'), 'Please choose your event date.');
        } else {
          var d = new Date(dateV.value + 'T00:00:00');
          var today = new Date(); today.setHours(0, 0, 0, 0);
          if (isNaN(d.getTime())) bad(fieldByName(form, 'event_date'), 'Please choose a valid event date.');
          else if (d < today) bad(fieldByName(form, 'event_date'), 'Event date cannot be in the past.');
        }
        var zipV = form.querySelector('[name="delivery_zip"]');
        if (!zipV || !zipRe.test(zipV.value.trim())) bad(fieldByName(form, 'delivery_zip'), 'Please enter a valid 5-digit delivery zip code.');
        var msgV = form.querySelector('[name="message"]');
        if (!msgV || !msgV.value.trim()) bad(fieldByName(form, 'message'), 'Please write your message.');
        var human = form.querySelector('.verify-row input[type="checkbox"]');
        if (human && !human.checked) {
          var herr = form.querySelector('.verify-row-error');
          if (!herr) {
            herr = document.createElement('p'); herr.className = 'field-error verify-row-error';
            human.closest('.verify-row').after(herr);
          }
          herr.textContent = 'Please verify you are human.';
          if (!firstBad) firstBad = human;
        }
        var fileV = form.querySelector('[name="attachment"]');
        if (fileV && fileV.files && fileV.files[0] && fileV.files[0].size > 10 * 1024 * 1024)
          bad(fieldByName(form, 'attachment'), 'Please attach a file smaller than 10 MB.');
        if (firstBad) { e.preventDefault(); firstBad.focus(); return; }
        var btn = form.querySelector('button[type="submit"]');
        if (btn) { btn.disabled = true; btn.textContent = 'Sending\u2026'; }
      });
    });
  })();
});


/* Copyright year stays current automatically */
(function(){var y=document.getElementById('copy-year');if(y)y.textContent=new Date().getFullYear();})();

/* Mobile nav: hamburger toggle */
(function () {
  var btn = document.querySelector('.nav-toggle');
  var nav = document.getElementById('mainNav');
  if (!btn || !nav) return;
  btn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    btn.textContent = open ? '✕' : '☰';
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.textContent = '☰';
    }
  });
})();
