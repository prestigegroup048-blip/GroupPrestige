/**
 * GROUP PRESTIGE SERVICES - COMPLETE APP LOGIC
 * Navigation, Before/After Slider, 3D Calculator (Homepage & Devis page), 
 * Stats Counters & WhatsApp Formatter.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Sticky Navigation Blur
  const navbar = document.querySelector('.main-navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');

  } else {
        navbar.classList.remove('scrolled');

  }

  }, { passive: true });

  }

  // 2. Mobile Menu & Drawer Controller
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  let backdrop = document.getElementById('mobileNavBackdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'mobile-nav-backdrop';
    backdrop.id = 'mobileNavBackdrop';
    document.body.appendChild(backdrop);

  }

  function openMobileDrawer() {
    if (!navMenu) return;
    navMenu.classList.add('open');
    if (backdrop) backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    const icon = mobileToggle ? mobileToggle.querySelector('i') : null;
    if (icon) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-xmark');

  }

  }

  function closeMobileDrawer() {
    if (!navMenu) return;
    navMenu.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
    const icon = mobileToggle ? mobileToggle.querySelector('i') : null;
    if (icon) {
      icon.classList.remove('fa-xmark');
      icon.classList.add('fa-bars');

  }

  }

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (navMenu.classList.contains('open')) {
        closeMobileDrawer();

  } else {
        openMobileDrawer();

  }

  });

    // Close button inside drawer
    const drawerCloseBtn = document.getElementById('drawerCloseBtn');
    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeMobileDrawer();

  });

  }

    // Click outside on backdrop
    if (backdrop) {
      backdrop.addEventListener('click', () => {
        closeMobileDrawer();

  });

  }

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        closeMobileDrawer();

  }

  });

    // Services dropdown accordion in mobile drawer
    const dropdownToggle = navMenu.querySelector('.nav-link-dropdown-toggle');
    const dropdownParent = dropdownToggle ? dropdownToggle.closest('.nav-item') : null;
    if (dropdownToggle && dropdownParent) {
      dropdownToggle.addEventListener('click', (e) => {
        if (window.innerWidth <= 860) {
          e.preventDefault();
          dropdownParent.classList.toggle('dropdown-open');
        }
      });
    }

    // Close drawer when clicking normal links
    navMenu.querySelectorAll('a').forEach((link) => {
      if (!link.classList.contains('nav-link-dropdown-toggle')) {
        link.addEventListener('click', () => {
          if (window.innerWidth <= 860) {
            closeMobileDrawer();
    
  }
  
  });

  }

  });

    // Auto-open if URL has #menu-open (useful for preview/testing)
    if (window.location.hash === '#menu-open') {
      setTimeout(openMobileDrawer, 200);
    }
  }

  // 2b. Clean Minimalist Full-Width Hero Slider
  const heroBgSlider = document.getElementById('heroBgSlider');
  if (heroBgSlider) {
    const slides = heroBgSlider.querySelectorAll('.hero-bg-slide');
    const dashes = document.querySelectorAll('.dash-btn');
    const prevBtn = document.getElementById('heroNavPrev');
    const nextBtn = document.getElementById('heroNavNext');
    const progressFill = document.getElementById('heroProgressFill');

    const slideNum = document.getElementById('slideCurrentNum');
    const slideTitle = document.getElementById('slideCurrentTitle');

    let current = 0;
    const total = slides.length;
    const slideDuration = 5500;
    let timer = null;
    let isPaused = false;

    function goToSlide(index) {
      if (index < 0) index = total - 1;
      if (index >= total) index = 0;
      current = index;

      // Update slides
      slides.forEach((slide, i) => {
        if (i === current) {
          slide.classList.add('active');
  
  } else {
          slide.classList.remove('active');
  
  }

  });

      // Update dash buttons
      dashes.forEach((dash, i) => {
        if (i === current) {
          dash.classList.add('active');
  
  } else {
          dash.classList.remove('active');
  
  }

  });

      // Update label
      const activeSlide = slides[current];
      if (activeSlide) {
        const title = activeSlide.getAttribute('data-title') || '';
        if (slideNum) slideNum.textContent = `0${current + 1}`;
        if (slideTitle) slideTitle.textContent = title;

  }

      resetProgress();

  }

    function resetProgress() {
      if (progressFill) {
        progressFill.style.transition = 'none';
        progressFill.style.width = '0%';
        void progressFill.offsetWidth;
        if (!isPaused) {
          progressFill.style.transition = `width ${slideDuration}ms linear`;
          progressFill.style.width = '100%';
  
  }

  }
      clearTimeout(timer);
      if (!isPaused) {
        timer = setTimeout(() => {
          goToSlide(current + 1);
  
  }, slideDuration);

  }

  }

    function pauseSlider() {
      isPaused = true;
      clearTimeout(timer);
      if (progressFill) {
        const computedWidth = window.getComputedStyle(progressFill).width;
        progressFill.style.transition = 'none';
        progressFill.style.width = computedWidth;

  }

  }

    function resumeSlider() {
      isPaused = false;
      resetProgress();

  }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        goToSlide(current - 1);

  });

  }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        goToSlide(current + 1);

  });

  }

    dashes.forEach((dash) => {
      dash.addEventListener('click', (e) => {
        e.preventDefault();
        const target = parseInt(dash.getAttribute('data-index'), 10);
        if (!isNaN(target)) {
          goToSlide(target);
  
  }

  });

  });

    const heroSection = document.querySelector('.hero-corporate');
    if (heroSection) {
      heroSection.addEventListener('mouseenter', pauseSlider);
      heroSection.addEventListener('mouseleave', resumeSlider);

  }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (window.scrollY < 600) {
        if (e.key === 'ArrowLeft') goToSlide(current - 1);
        if (e.key === 'ArrowRight') goToSlide(current + 1);

  }

  });

    goToSlide(0);

  }

  // 2c. Services Category Filter Tabs
  const filterBtns = document.querySelectorAll('.filter-tab-btn');
  const serviceCards = document.querySelectorAll('.service-card-prestige');

  if (filterBtns.length > 0 && serviceCards.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');

        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        serviceCards.forEach((card) => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px) scale(0.98)';
            setTimeout(() => {
              card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0) scale(1)';
      
  }, 30);
    
  } else {
            card.style.display = 'none';
    
  }
  
  });

  });

  });

  }

  // 3. Before / After Interactive Slider
  const baContainer = document.querySelector('.image-compare-wrapper');
  const baAfterLayer = document.querySelector('.compare-img-after-box');
  const baHandle = document.querySelector('.compare-handle');
  const imgBefore = document.getElementById('img-before');
  const imgAfter = document.getElementById('img-after');

  if (baContainer && baAfterLayer && baHandle) {
    let isDragging = false;

    function syncAfterImgWidth() {
      if (baContainer && imgAfter) {
        imgAfter.style.width = baContainer.offsetWidth + 'px';
        imgAfter.style.maxWidth = 'none';
        imgAfter.style.height = '100%';
        imgAfter.style.objectFit = 'cover';
      }
    }
    window.addEventListener('resize', syncAfterImgWidth);
    window.addEventListener('orientationchange', () => setTimeout(syncAfterImgWidth, 100));
    syncAfterImgWidth();
    if (imgAfter) {
      imgAfter.addEventListener('load', syncAfterImgWidth);
    }

    function updateSlider(clientX) {
      const rect = baContainer.getBoundingClientRect();
      let x = clientX - rect.left;
      if (x < 0) x = 0;
      if (x > rect.width) x = rect.width;
      const pct = (x / rect.width) * 100;
      baAfterLayer.style.width = `${pct}%`;
      baHandle.style.left = `${pct}%`;
    }

    baContainer.addEventListener('mousedown', (e) => {
      isDragging = true;
      updateSlider(e.clientX);

  });

    window.addEventListener('mouseup', () => {
      isDragging = false;

  });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      updateSlider(e.clientX);

  });

    baContainer.addEventListener('touchstart', (e) => {
      isDragging = true;
      updateSlider(e.touches[0].clientX);

  }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;

  });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      updateSlider(e.touches[0].clientX);

  }, { passive: true });

  }

  // Scenario Tabs for Before/After
  const baTabs = document.querySelectorAll('.ba-tab');

  const baScenarios = {
    travaux: {
      before: 'assets/images/ba-travaux-before.jpg',
      after: 'assets/images/ba-travaux-after.jpg'

  },
    vitres: {
      before: 'assets/images/ba-vitres-before.jpg',
      after: 'assets/images/ba-vitres-after.jpg'

  },
    bureaux: {
      before: 'assets/images/ba-bureaux-before.jpg',
      after: 'assets/images/ba-bureaux-after.jpg'

  },
    residentiel: {
      before: 'assets/images/ba-residentiel-before.jpg',
      after: 'assets/images/ba-residentiel-after.jpg'

  },
    copropriete: {
      before: 'assets/images/ba-copropriete-before.jpg',
      after: 'assets/images/ba-copropriete-after.jpg'

  },
    incendie: {
      before: 'assets/images/ba-incendie-before.jpg',
      after: 'assets/images/ba-incendie-after.jpg'

  },
    chantier: {
      before: 'assets/images/ba-travaux-before.jpg',
      after: 'assets/images/ba-travaux-after.jpg'

  },
    sols: {
      before: 'assets/images/ba-copropriete-before.jpg',
      after: 'assets/images/ba-copropriete-after.jpg'

  }

  };

  baTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      baTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const scenario = tab.getAttribute('data-scenario');
      if (baScenarios[scenario] && imgBefore && imgAfter) {
        imgBefore.style.opacity = '0.5';
        imgAfter.style.opacity = '0.5';
        setTimeout(() => {
          imgBefore.src = baScenarios[scenario].before;
          imgAfter.src = baScenarios[scenario].after;
          imgBefore.style.opacity = '1';
          imgAfter.style.opacity = '1';
          if (typeof syncAfterImgWidth === 'function') syncAfterImgWidth();
        }, 150);

  }

  });

  });

  // 4. Interactive Calculator (Supports both Homepage and Devis Page)
  function initCalculator(config) {
    const typeCards = document.querySelectorAll(config.typeSelector);
    const rangeInput = document.getElementById(config.rangeId);
    const rangeDisplay = document.getElementById(config.displayId);
    const freqSelect = document.getElementById(config.freqId);
    const priceDisplay = document.getElementById(config.priceId);
    const btnWhatsApp = document.getElementById(config.btnId);

    if (!rangeInput || !priceDisplay) return;

    let state = {
      type: 'Bureaux & Locaux Pro',
      surface: parseInt(rangeInput.value, 10) || 120,
      freqText: 'Intervention ponctuelle'
    };

    const typeNames = {
      'bureaux': 'Nettoyage Bureaux & Locaux Pro',
      'medical': 'Cabinets Médicaux & Dentaires',
      'copropriete': 'Copropriétés & Communs d\'Immeubles',
      'copro': 'Copropriétés & Communs d\'Immeubles',
      'chantier': 'Après Travaux & Fin de Chantier',
      'vitres': 'Lavage de Vitres & Châssis',
      'sinistres': 'Nettoyage Après Sinistre',
      'residentiel': 'Maisons & Appartements (Résidentiel)',
      'soustraitance': 'Sous-traitance Partenaire'
    };

    function calculate() {
      if (priceDisplay) {
        priceDisplay.textContent = '« Recevez votre devis gratuit et personnalisé, sans engagement. »';
      }
      return { type: state.type, surface: state.surface, freq: state.freqText };
    }

    typeCards.forEach((card) => {
      card.addEventListener('click', () => {
        typeCards.forEach((c) => {
          c.classList.remove('active');
          c.classList.remove('selected');
        });
        card.classList.add('active');
        card.classList.add('selected');

        const key = card.getAttribute('data-type') || 'bureaux';
        if (typeNames[key]) {
          state.type = typeNames[key];
        } else if (card.getAttribute('data-type-name')) {
          state.type = card.getAttribute('data-type-name');
        } else {
          const titleEl = card.querySelector('.calc-type-name, .option-choice-title, strong');
          if (titleEl) state.type = titleEl.textContent.trim();
        }
        calculate();
      });
    });

    rangeInput.addEventListener('input', () => {
      state.surface = parseInt(rangeInput.value, 10);
      if (rangeDisplay) {
        rangeDisplay.innerHTML = `${state.surface} <small style="font-size: 1rem; color: var(--text-muted)">m²</small>`;

  }
      calculate();

  });

    if (freqSelect) {
      freqSelect.addEventListener('change', () => {
        const val = freqSelect.value;
        if (val === 'hebdo') {
          state.freqMultiplier = 0.85;
          state.freqText = 'Régulier : 1x par semaine (-15%)';
  
  } else if (val === 'bimensuel') {
          state.freqMultiplier = 0.90;
          state.freqText = 'Régulier : 2x par mois (-10%)';
  
  } else if (val === 'mensuel') {
          state.freqMultiplier = 0.95;
          state.freqText = 'Régulier : 1x par mois (-5%)';
  
  } else {
          state.freqMultiplier = 1.0;
          state.freqText = 'Intervention ponctuelle';
  
  }
        calculate();

  });

  }

    if (btnWhatsApp) {
      btnWhatsApp.addEventListener('click', (e) => {
        e.preventDefault();
        const quote = calculate();
        const clientName = document.getElementById('calc-client-name')?.value || document.getElementById('devis-client-name')?.value || '';
        const clientPhone = document.getElementById('calc-client-phone')?.value || document.getElementById('devis-client-phone')?.value || '';
        const clientCommune = document.getElementById('calc-client-commune')?.value || document.getElementById('devis-client-commune')?.value || 'Province de Liège / Wallonie';
        const clientEmail = document.getElementById('calc-client-email')?.value || document.getElementById('devis-client-email')?.value || '';

        const msg = 
`Bonjour Samir (GROUP PRESTIGE SERVICES SRL),
Je souhaite recevoir un devis gratuit et personnalisé suite à ma demande sur votre site web :

🏢 *Prestation* : ${state.type}
📐 *Surface estimée* : ${state.surface} m²
🔄 *Fréquence souhaitée* : ${state.freqText}
📍 *Ville / Commune* : ${clientCommune}
${clientName ? `👤 *Nom / Société* : ${clientName}\n` : ''}${clientPhone ? `📞 *Tél* : ${clientPhone}\n` : ''}${clientEmail ? `✉️ *Email* : ${clientEmail}\n` : ''}
Pouvez-vous me recontacter avec votre proposition adaptée ? Merci !`;

        const url = `https://wa.me/32492969996?text=${encodeURIComponent(msg)}`;
        window.open(url, '_blank');
      });
    }

    // Gestion de l'envoi par Email depuis le simulateur (sendmail.php)
    const btnEmail = document.getElementById(config.emailBtnId || 'btn-calc-email');
    if (btnEmail) {
      btnEmail.addEventListener('click', async (e) => {
        e.preventDefault();
        const clientName = document.getElementById('calc-client-name')?.value || document.getElementById('devis-client-name')?.value || '';
        const clientPhone = document.getElementById('calc-client-phone')?.value || document.getElementById('devis-client-phone')?.value || '';
        const clientCommune = document.getElementById('calc-client-commune')?.value || document.getElementById('devis-client-commune')?.value || 'Province de Liège';
        const clientEmail = document.getElementById('calc-client-email')?.value || document.getElementById('devis-client-email')?.value || '';

        if (!clientName || (!clientPhone && !clientEmail)) {
          alert('Veuillez renseigner votre nom ainsi qu\'un numéro de téléphone ou un email dans les champs prévus pour recevoir votre devis chiffré.');
          const nameInput = document.getElementById('calc-client-name') || document.getElementById('devis-client-name');
          if (nameInput) {
            nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            nameInput.focus();
            nameInput.style.borderColor = '#0070f3';
          }
          return;
        }

        const originalBtnHtml = btnEmail.innerHTML;
        btnEmail.disabled = true;
        btnEmail.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Envoi en cours...';

        const formData = new FormData();
        formData.append('form_source', 'Simulateur de Devis en ligne');
        formData.append('name', clientName);
        formData.append('phone', clientPhone);
        formData.append('email', clientEmail);
        formData.append('service', state.type);
        formData.append('surface', state.surface);
        formData.append('frequency', state.freqText);
        formData.append('commune', clientCommune);
        formData.append('message', `Simulation réalisée : ${state.type} - Surface : ${state.surface} m² - Fréquence : ${state.freqText} - Commune : ${clientCommune}`);

        try {
          const res = await fetch('sendmail.php', { method: 'POST', body: formData });
          const json = await res.json().catch(() => null);

          if (res.ok && json && json.status === 'success') {
            alert(`✅ Merci ${clientName} ! Votre demande de devis a été transmise directement à info@groupprestiges.be. Samir CHIHAB l\'étudie et vous répondra sous 24h.`);
          } else {
            throw new Error(json?.message || 'Erreur d\'envoi');
          }
        } catch (err) {
          console.warn('Envoi email simulateur en échec, proposition WhatsApp:', err);
          alert(`Votre demande a été préparée sur WhatsApp pour un contact direct avec Samir CHIHAB.`);
          btnWhatsApp?.click();
        } finally {
          btnEmail.disabled = false;
          btnEmail.innerHTML = originalBtnHtml;
        }
      });
    }

    calculate();

  }

  // Init homepage calculator
  initCalculator({
    typeSelector: '.type-select-card',
    rangeId: 'surface-range',
    displayId: 'surface-val-display',
    freqId: 'freq-select',
    priceId: 'estimate-price-display',
    btnId: 'btn-calc-whatsapp',
    emailBtnId: 'btn-calc-email'

  });

  // Init devis page calculator
  initCalculator({
    typeSelector: '.option-choice-card',
    rangeId: 'devis-surface-range',
    displayId: 'devis-surface-number',
    freqId: 'devis-freq-select',
    priceId: 'devis-price-result',
    btnId: 'btn-devis-whatsapp',
    emailBtnId: 'btn-devis-email'

  });

  // 5. Contact Form Submissions
  // 5. Contact Form Submissions (Envoi Email via sendmail.php + Fallback WhatsApp)
  const forms = document.querySelectorAll('.corporate-contact-form');
  forms.forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
      
      const name = form.querySelector('[name="name"]')?.value || '';
      const phone = form.querySelector('[name="phone"]')?.value || '';
      const email = form.querySelector('[name="email"]')?.value || '';
      const service = form.querySelector('[name="service"]')?.value || 'Nettoyage';
      const message = form.querySelector('[name="message"]')?.value || '';

      const waMsg = 
`Bonjour Group Prestige Services,
Nouvelle demande de devis via votre site internet :

👤 *Nom* : ${name}
📞 *Téléphone* : ${phone}
📧 *Email* : ${email}
📋 *Service concerné* : ${service}
💬 *Détails* :
${message}`;
      const waUrl = `https://wa.me/32492969996?text=${encodeURIComponent(waMsg)}`;

      // Afficher l'état de chargement
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Transmission en cours...';
      }

      // Préparation des données FormData pour sendmail.php
      const formData = new FormData(form);
      formData.append('form_source', 'Page Contact (Formulaire Principal)');

      try {
        const response = await fetch('sendmail.php', {
          method: 'POST',
          body: formData
        });

        const result = await response.json().catch(() => null);

        if (response.ok && result && result.status === 'success') {
          // Affichage bannière de confirmation
          let alertBox = form.querySelector('.form-alert-feedback');
          if (!alertBox) {
            alertBox = document.createElement('div');
            alertBox.className = 'form-alert-feedback';
            form.prepend(alertBox);
          }
          alertBox.style.cssText = 'background: #f0fdf4; border: 1px solid #86efac; border-left: 5px solid #22c55e; border-radius: 12px; padding: 1.25rem 1.5rem; margin-bottom: 1.5rem; text-align: left;';
          alertBox.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
              <i class="fa-solid fa-circle-check" style="color: #16a34a; font-size: 1.4rem; margin-top: 2px;"></i>
              <div>
                <strong style="color: #15803d; font-size: 1.05rem; display: block; margin-bottom: 0.25rem;">Demande envoyée avec succès !</strong>
                <p style="color: #166534; font-size: 0.9rem; margin: 0 0 0.85rem; line-height: 1.6;">
                  Merci <strong>${name}</strong>. Votre demande a bien été transmise à <strong>info@groupprestiges.be</strong>. Samir CHIHAB l'étudie personnellement et vous recontactera sous 24h ouvrées.
                </p>
                <a href="${waUrl}" target="_blank" style="display: inline-flex; align-items: center; gap: 0.45rem; background: #25d366; color: #ffffff; text-decoration: none; padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.82rem; font-weight: 700;">
                  <i class="fa-brands fa-whatsapp"></i> Échanger également sur WhatsApp direct
                </a>
              </div>
            </div>
          `;
          form.reset();
        } else {
          throw new Error(result?.message || 'Erreur serveur');
        }
      } catch (err) {
        console.warn('Envoi direct email non abouti, basculement WhatsApp:', err);
        // Fallback WhatsApp
        window.open(waUrl, '_blank');
        alert(`Merci ${name} ! Votre demande a été préparée et s'ouvre sur WhatsApp pour Samir CHIHAB (+32 492 96 99 96).`);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }
      }
    });
  });

  // 6. Animated Statistics
  const counters = document.querySelectorAll('.counter-val');
  let statsTriggered = false;

  function countUp() {
    counters.forEach((el) => {
      const target = parseFloat(el.getAttribute('data-target'));
      const isFloat = target % 1 !== 0;
      let current = 0;
      const step = target / 40;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
  
  }
        el.textContent = isFloat ? current.toFixed(1) : Math.floor(current);

  }, 30);

  });

  }

  const statsSection = document.querySelector('.stats-strip');
  if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !statsTriggered) {
        statsTriggered = true;
        countUp();

  }

  }, { threshold: 0.3 });
    observer.observe(statsSection);

  }
});
