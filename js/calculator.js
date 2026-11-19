/**
 * GROUP PRESTIGE SERVICES - INTERACTIVE 3D QUOTE SIMULATOR
 * Real-time estimation logic with custom WhatsApp & Email dispatch.
 */

(function () {
  'use strict';

  // DOM Elements
  const typeCards = document.querySelectorAll('.type-select-card');
  const surfaceInput = document.getElementById('surface-range');
  const surfaceDisplay = document.getElementById('surface-val-display');
  const serviceCheckboxes = document.querySelectorAll('.calc-service-cb');
  const freqSelect = document.getElementById('freq-select');
  const priceDisplay = document.getElementById('estimate-price-display');
  const btnSendWhatsApp = document.getElementById('btn-calc-whatsapp');
  const btnSendForm = document.getElementById('btn-calc-form');

  if (!surfaceInput || !priceDisplay) return;

  // State
  let state = {
    type: 'Maison / Villa',
    ratePerSqm: 2.4, // Base € per m²
    baseFixed: 60,
    surface: parseInt(surfaceInput.value, 10) || 120,
    optionsTotal: 0,
    selectedOptions: [],
    discount: 1.0,
    frequencyLabel: 'Ponctuel (1 seule fois)'
  };

  // Property type rates
  const typeConfigs = {
    'residentiel': { name: 'Maison / Villa / Appartement', rate: 2.2, base: 60 },
    'bureaux': { name: 'Bureaux & Commerces', rate: 1.8, base: 80 },
    'copropriete': { name: 'Immeuble / Copropriété', rate: 1.6, base: 70 },
    'chantier': { name: 'Après Chantier & Travaux', rate: 3.4, base: 120 },
    'sinistre': { name: 'Après Sinistre (Incendie / Eau)', rate: 4.2, base: 150 },
    'terrasse': { name: 'Terrasse & Extérieurs (Kärcher)', rate: 2.5, base: 75 }
  };

  // Update Surface Readout
  function updateSurfaceDisplay() {
    state.surface = parseInt(surfaceInput.value, 10);
    if (surfaceDisplay) {
      surfaceDisplay.innerHTML = `${state.surface} <small style="font-size: 1.1rem; color: var(--text-muted)">m²</small>`;
    }
  }

  // Calculate Price Range
  function calculateQuote() {
    // Surface part
    let surfacePrice = state.surface * state.ratePerSqm;
    
    // Add options
    let optionsSum = 0;
    state.selectedOptions = [];
    serviceCheckboxes.forEach((cb) => {
      if (cb.checked) {
        const cost = parseFloat(cb.getAttribute('data-cost') || '0');
        optionsSum += cost;
        state.selectedOptions.push(cb.getAttribute('data-label') || 'Option');
      }
    });

    // Subtotal
    let subtotal = (state.baseFixed + surfacePrice + optionsSum) * state.discount;

    // Price range (+/- 12%)
    let minPrice = Math.round(subtotal * 0.9);
    let maxPrice = Math.round(subtotal * 1.15);

    // Minimum intervention floor
    if (minPrice < 90) minPrice = 90;
    if (maxPrice < 120) maxPrice = 130;

    // Display
    priceDisplay.textContent = `${minPrice} € - ${maxPrice} € HTVA`;

    return { minPrice, maxPrice };
  }

  // Type selection events
  typeCards.forEach((card) => {
    card.addEventListener('click', () => {
      typeCards.forEach((c) => c.classList.remove('active'));
      card.classList.add('active');

      const key = card.getAttribute('data-type');
      if (typeConfigs[key]) {
        state.type = typeConfigs[key].name;
        state.ratePerSqm = typeConfigs[key].rate;
        state.baseFixed = typeConfigs[key].base;
      }
      calculateQuote();
    });
  });

  // Surface slider event
  surfaceInput.addEventListener('input', () => {
    updateSurfaceDisplay();
    calculateQuote();
  });

  // Checkboxes events
  serviceCheckboxes.forEach((cb) => {
    cb.addEventListener('change', calculateQuote);
  });

  // Frequency event
  if (freqSelect) {
    freqSelect.addEventListener('change', () => {
      const val = freqSelect.value;
      if (val === 'hebdo') {
        state.discount = 0.85;
        state.frequencyLabel = 'Régulier : Chaque semaine (-15%)';
      } else if (val === 'bimensuel') {
        state.discount = 0.90;
        state.frequencyLabel = 'Régulier : 2x par mois (-10%)';
      } else if (val === 'mensuel') {
        state.discount = 0.95;
        state.frequencyLabel = 'Régulier : 1x par mois (-5%)';
      } else {
        state.discount = 1.0;
        state.frequencyLabel = 'Intervention ponctuelle';
      }
      calculateQuote();
    });
  }

  // WhatsApp Action with Pre-filled Formatted Message
  if (btnSendWhatsApp) {
    btnSendWhatsApp.addEventListener('click', (e) => {
      e.preventDefault();
      const quote = calculateQuote();
      const optionsText = state.selectedOptions.length > 0 
        ? state.selectedOptions.join(', ') 
        : 'Nettoyage standard';

      const message = 
`Bonjour Group Prestige Services (Samir Chihab),
Je souhaite recevoir un devis officiel suite à ma simulation sur votre site web :

🏢 *Type de bien* : ${state.type}
📐 *Surface estimée* : ${state.surface} m²
🔄 *Fréquence souhaitée* : ${state.frequencyLabel}
✨ *Options sélectionnées* : ${optionsText}

📍 *Lieu d'intervention* : Belgique (Liège & alentours)
Pouvez-vous me confirmer vos disponibilités pour une intervention rapide ? Merci !`;

      const encodedMsg = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/32492969996?text=${encodedMsg}`;
      window.open(whatsappUrl, '_blank');
    });
  }

  // Smooth scroll to contact form with prefilled message
  if (btnSendForm) {
    btnSendForm.addEventListener('click', (e) => {
      e.preventDefault();
      const quote = calculateQuote();
      const formSection = document.getElementById('contact');
      const formMessage = document.getElementById('contact-message');
      const formSubject = document.getElementById('contact-subject');

      if (formSubject) {
        formSubject.value = `Devis ${state.type} - ${state.surface} m²`;
      }

      if (formMessage) {
        formMessage.value = 
`Bonjour,
Je souhaite un devis pour :
- Type : ${state.type}
- Surface : ${state.surface} m²
- Fréquence : ${state.frequencyLabel}
- Options : ${state.selectedOptions.join(', ') || 'Standard'}
- Estimation indicative du site : ${quote.minPrice} € à ${quote.maxPrice} € HTVA.

Merci de me contacter rapidement pour convenir d'une visite ou confirmer le tarif.`;
      }

      if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Initial calculation
  updateSurfaceDisplay();
  calculateQuote();
})();

