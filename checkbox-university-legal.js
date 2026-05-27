/* ============================================================
   Checkbox University Legal - page JS
   - Smooth scroll for in-page anchors
   - Demo modal open/close
   - Lazy-load HubSpot form on first modal open
   ============================================================ */

(function() {
  var anchors = document.querySelectorAll('.cbx-u a[href^="#"]');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  anchors.forEach(function(link) {
    link.addEventListener('click', function(e) {
      // Demo CTAs open the modal instead of scrolling
      if (link.hasAttribute('data-cbx-demo')) return;
      var hash = link.getAttribute('href');
      if (!hash || hash === '#') return;
      var target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });
})();

(function() {
  var modal = document.getElementById('cbxDemoModal');
  if (!modal) return;
  var formContainer = document.getElementById('cbxHubspotForm');
  var hsFormLoaded = false;

  function loadHubspotForm() {
    if (hsFormLoaded) return;
    if (typeof hbspt === 'undefined' || !hbspt.forms || !hbspt.forms.create) {
      // Script hasn't loaded yet; retry shortly
      setTimeout(loadHubspotForm, 200);
      return;
    }
    formContainer.innerHTML = '';
    hbspt.forms.create({
      region: "na1",
      portalId: "4351004",
      formId: "ad82bdab-9ec9-4e52-9c1e-690b6137f680",
      target: "#cbxHubspotForm",
      onFormSubmit: function($form) {
        try {
          var fname = $form[0].fullName ? $form[0].fullName.value : '';
          var em = $form[0].email ? $form[0].email.value : '';
          if (typeof window.navattic !== 'undefined' && window.navattic.identify) {
            window.navattic.identify({
              'user.fullName': fname,
              'user.email': em
            });
          }
        } catch (err) { /* swallow */ }
      }
    });
    hsFormLoaded = true;
  }

  function openModal() {
    modal.setAttribute('data-open', 'true');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('cbx-u-modal-open');
    loadHubspotForm();
  }

  function closeModal() {
    modal.setAttribute('data-open', 'false');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('cbx-u-modal-open');
  }

  // Open from any [data-cbx-demo] CTA
  document.querySelectorAll('[data-cbx-demo]').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      openModal();
    });
  });

  // Close from overlay or close button
  modal.querySelectorAll('[data-cbx-modal-close]').forEach(function(el) {
    el.addEventListener('click', closeModal);
  });

  // Esc to close
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.getAttribute('data-open') === 'true') closeModal();
  });
})();
