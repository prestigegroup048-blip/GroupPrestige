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
      type: 'Maison / Villa',
      rate: 2.2,
      base: 60,
      surface: parseInt(rangeInput.value, 10) || 120,
      freqMultiplier: 1.0,
      freqText: 'Intervention ponctuelle'

  };

    const typeRates = {
      'residentiel': { name: 'Maison / Villa', rate: 2.2, base: 60 },
      'bureaux': { name: 'Bureaux & Commerces', rate: 1.8, base: 70 },
      'copropriete': { name: 'Copropriété / Immeuble', rate: 1.6, base: 60 },
      'chantier': { name: 'Après Chantier', rate: 3.2, base: 110 },
      'vitres': { name: 'Vitres & Façades', rate: 2.0, base: 50 },
      'terrasse': { name: 'Terrasse Haute Pression', rate: 2.4, base: 65 }

  };

    function calculate() {
      if (priceDisplay) {
        priceDisplay.textContent = 'Tarif Personnalisé sous 2h';
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

        const key = card.getAttribute('data-type') || 'residentiel';
        if (typeRates[key]) {
          state.type = typeRates[key].name;
          state.rate = typeRates[key].rate;
          state.base = typeRates[key].base;
  
  } else if (card.getAttribute('data-type-name')) {
          state.type = card.getAttribute('data-type-name');
          state.rate = parseFloat(card.getAttribute('data-rate') || '2.0');
          state.base = parseFloat(card.getAttribute('data-base') || '60');
  
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
        const clientName = document.getElementById('devis-client-name')?.value || '';
        const clientPhone = document.getElementById('devis-client-phone')?.value || '';
        const clientCommune = document.getElementById('devis-client-commune')?.value || 'Liège et ses environs';

        const msg = 
`Bonjour Samir (Group Prestige Services),
Je souhaite recevoir un devis personnalisé suite à ma demande sur votre site web :

🏢 *Prestation* : ${state.type}
📐 *Surface estimée* : ${state.surface} m²
🔄 *Fréquence souhaitée* : ${state.freqText}
📍 *Lieu en Belgique* : ${clientCommune}
${clientName ? `👤 *Nom* : ${clientName}\n` : ''}${clientPhone ? `📞 *Tél* : ${clientPhone}\n` : ''}
Pouvez-vous me recontacter avec votre meilleure proposition tarifaire ? Merci !`;

        const url = `https://wa.me/32492969996?text=${encodeURIComponent(msg)}`;
        window.open(url, '_blank');

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
    btnId: 'btn-calc-whatsapp'

  });

  // Init devis page calculator
  initCalculator({
    typeSelector: '.option-choice-card',
    rangeId: 'devis-surface-range',
    displayId: 'devis-surface-number',
    freqId: 'devis-freq-select',
    priceId: 'devis-price-result',
    btnId: 'btn-devis-whatsapp'

  });

  // 5. Contact Form Submissions
  const forms = document.querySelectorAll('.corporate-contact-form');
  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('[name="name"]')?.value || '';
      const phone = form.querySelector('[name="phone"]')?.value || '';
      const email = form.querySelector('[name="email"]')?.value || '';
      const service = form.querySelector('[name="service"]')?.value || 'Nettoyage';
      const message = form.querySelector('[name="message"]')?.value || '';

      const waMsg = 
`Bonjour Group Prestige Services,
Nouvelle demande de devis via votre formulaire :

👤 *Nom* : ${name}
📞 *Téléphone* : ${phone}
📧 *Email* : ${email}
📋 *Service concerné* : ${service}
💬 *Détails* :
${message}`;

      const waUrl = `https://wa.me/32492969996?text=${encodeURIComponent(waMsg)}`;
      window.open(waUrl, '_blank');
      alert(`Merci ${name} ! Votre demande a été préparée pour un envoi immédiat sur notre WhatsApp officiel (+32 492 96 99 96). Nous vous répondons sous 2h.`);

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
