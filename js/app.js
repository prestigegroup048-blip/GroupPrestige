/**
 * GROUP PRESTIGE SERVICES - MAIN APP LOGIC
 * Navigation, 3D Tilt Effects, Before/After Slider, Filter Tabs, 
 * Animated Counters & Contact Handlers.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Sticky Navigation Blur & Scroll Effect
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // 2. Mobile Menu Toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      const isVisible = navLinks.style.display === 'flex';
      navLinks.style.display = isVisible ? 'none' : 'flex';
      if (!isVisible) {
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.background = 'rgba(5, 11, 24, 0.98)';
        navLinks.style.padding = '2rem';
        navLinks.style.borderBottom = '1px solid rgba(212, 175, 55, 0.3)';
      }
    });

    // Close mobile nav on click of link
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          navLinks.style.display = 'none';
        }
      });
    });
  }

  // 3. Before / After Interactive Split Slider
  const baWrapper = document.querySelector('.image-compare-wrapper');
  const baAfterBox = document.querySelector('.compare-img-after-box');
  const baHandle = document.querySelector('.compare-handle');

  if (baWrapper && baAfterBox && baHandle) {
    let isDragging = false;

    function setSliderPosition(x) {
      const rect = baWrapper.getBoundingClientRect();
      let offsetX = x - rect.left;
      if (offsetX < 0) offsetX = 0;
      if (offsetX > rect.width) offsetX = rect.width;

      const percentage = (offsetX / rect.width) * 100;
      baAfterBox.style.width = `${percentage}%`;
      baHandle.style.left = `${percentage}%`;
    }

    // Mouse Events
    baWrapper.addEventListener('mousedown', (e) => {
      isDragging = true;
      setSliderPosition(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      setSliderPosition(e.clientX);
    });

    // Touch Events for Mobile
    baWrapper.addEventListener('touchstart', (e) => {
      isDragging = true;
      setSliderPosition(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      setSliderPosition(e.touches[0].clientX);
    }, { passive: true });
  }

  // 4. Before/After Example Scenario Switcher
  const baTabs = document.querySelectorAll('.ba-tab');
  const imgBefore = document.getElementById('img-before');
  const imgAfter = document.getElementById('img-after');

  const baScenarios = {
    chantier: {
      before: 'assets/images/services-grid.jpg',
      after: 'assets/images/hero-showcase.jpg'
    },
    vitres: {
      before: 'assets/images/team-interventions.jpg',
      after: 'assets/images/hero-showcase.jpg'
    },
    sols: {
      before: 'assets/images/team-interventions.jpg',
      after: 'assets/images/services-grid.jpg'
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
        }, 200);
      }
    });
  });

  // 5. 3D Tilt Card Micro-interactions
  const tiltCards = document.querySelectorAll('.service-card, .hero-3d-card, .review-card, .why-card');

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });

  // 6. Services Filter Tabs
  const serviceTabs = document.querySelectorAll('.tab-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  serviceTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      serviceTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      serviceCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 7. Quick Devis Buttons on Service Cards
  const serviceDevisBtns = document.querySelectorAll('.btn-service-devis');
  serviceDevisBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceTitle = btn.getAttribute('data-service') || 'Service de nettoyage';
      const contactMsg = document.getElementById('contact-message');
      const contactSub = document.getElementById('contact-subject');
      const contactSection = document.getElementById('contact');

      if (contactSub) {
        contactSub.value = `Demande de devis - ${serviceTitle}`;
      }
      if (contactMsg) {
        contactMsg.value = `Bonjour Samir,\nJe souhaite obtenir un devis rapide pour la prestation suivante : ${serviceTitle}.\nPouvez-vous m'indiquer vos disponibilités et tarifs ? Merci !`;
      }
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // 8. Stats Animated Counter on Scroll
  const statNumbers = document.querySelectorAll('.stat-counter');
  let statsCounted = false;

  function countUp(el) {
    const target = parseFloat(el.getAttribute('data-target'));
    const isDecimal = target % 1 !== 0;
    const duration = 2000;
    const stepTime = 30;
    const steps = duration / stepTime;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
    }, stepTime);
  }

  const statsSection = document.querySelector('.hero-stats-row');
  if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !statsCounted) {
        statsCounted = true;
        statNumbers.forEach((num) => countUp(num));
      }
    }, { threshold: 0.5 });
    observer.observe(statsSection);
  }

  // 9. Contact Form Submission (direct email / WhatsApp integration)
  const contactForm = document.getElementById('main-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value;
      const phone = document.getElementById('contact-phone').value;
      const email = document.getElementById('contact-email').value;
      const subject = document.getElementById('contact-subject').value;
      const message = document.getElementById('contact-message').value;

      const formattedWhatsApp = 
`Bonjour Group Prestige Services,
Nouvelle demande de contact via le site web :

👤 *Nom* : ${name}
📞 *Téléphone* : ${phone}
📧 *Email* : ${email}
📋 *Sujet* : ${subject}
💬 *Message* :
${message}`;

      const url = `https://wa.me/32492969996?text=${encodeURIComponent(formattedWhatsApp)}`;
      
      // Open WhatsApp & confirm to user
      window.open(url, '_blank');
      alert(`Merci ${name} ! Votre demande a été préparée pour un envoi immédiat sur notre WhatsApp officiel (+32 492 96 99 96). Nous vous répondons en moins de 30 minutes.`);
    });
  }

  // 10. Lightbox Modal for Business Card & Showcase
  const modalOverlay = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-img');
  const modalClose = document.querySelector('.modal-close-btn');

  document.querySelectorAll('.open-lightbox').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const src = trigger.getAttribute('data-img-src') || trigger.getAttribute('src');
      if (modalImg && modalOverlay) {
        modalImg.src = src;
        modalOverlay.classList.add('open');
      }
    });
  });

  if (modalClose && modalOverlay) {
    modalClose.addEventListener('click', () => {
      modalOverlay.classList.remove('open');
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('open');
      }
    });
  }
});

