document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('#navToggle');
  const mobileMenu = document.querySelector('#mobileMenu');
  const year = document.querySelector('#year');
  const counters = document.querySelectorAll('.counter');

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });
  }

  const animateCounter = (counter) => {
    const target = Number(counter.dataset.target) || 0;
    const suffix = counter.dataset.suffix || '';
    const duration = 1500;
    const stepTime = Math.max(Math.floor(duration / target), 20);
    let current = 0;

    const timer = setInterval(() => {
      current += Math.ceil(target / (duration / stepTime));
      if (current >= target) {
        counter.textContent = `${target}${suffix}`;
        clearInterval(timer);
      } else {
        counter.textContent = `${current}${suffix}`;
      }
    }, stepTime);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((counter) => observer.observe(counter));

  const serviceCards = document.querySelectorAll('.service-card');
  const cardsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = 1;
          cardsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  serviceCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.15}s`;
    cardsObserver.observe(card);
  });

  const currencySelector = document.querySelector('#currencySelector');
  const priceAmounts = document.querySelectorAll('.price-amount');

  const currencyConfig = {
    usa: { locale: 'en-US', currency: 'USD', rate: 1, round: 1 },
    india: { locale: 'en-IN', currency: 'INR', rate: 83.4, round: 100 },
    canada: { locale: 'en-CA', currency: 'CAD', rate: 1.36, round: 1 },
    australia: { locale: 'en-AU', currency: 'AUD', rate: 1.53, round: 1 },
  };

  const formatPrice = (value, { locale, currency, round }) => {
    const adjusted = round > 1 ? Math.round(value / round) * round : Math.round(value);
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(adjusted);
  };

  const updatePrices = (region) => {
    const config = currencyConfig[region] || currencyConfig.usa;
    priceAmounts.forEach((priceEl) => {
      const base = Number(priceEl.dataset.basePrice) || 0;
      const converted = base * config.rate;
      priceEl.textContent = formatPrice(converted, config);
    });
  };

  if (currencySelector && priceAmounts.length) {
    updatePrices(currencySelector.value);
    currencySelector.addEventListener('change', (event) => updatePrices(event.target.value));
  }

  const contactForm = document.querySelector('#contactForm');
  const contactFeedback = document.querySelector('#contactFormFeedback');
  const contactToast = document.querySelector('#contactToast');
  let toastTimer = null;

  const validators = {
    fullName: (value) => value.trim().length >= 3,
    company: (value) => value.trim().length >= 2,
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
    phone: (value) => !value.trim() || /^[0-9+\s-]{7,20}$/.test(value.trim()),
    message: (value) => value.trim().length >= 10,
  };

  const validateField = (input) => {
    const rule = validators[input.name];
    if (!rule) return true;
    const isValid = rule(input.value || '');
    input.classList.toggle('is-invalid', !isValid);
    return isValid;
  };

  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const inputs = contactForm.querySelectorAll('input, textarea');
      let formIsValid = true;
      inputs.forEach((input) => {
        if (!validateField(input)) {
          formIsValid = false;
        }
      });

      if (!formIsValid) {
        contactFeedback.textContent = '';
        return;
      }

      contactForm.reset();
      inputs.forEach((input) => input.classList.remove('is-invalid'));

      const successMessage = 'Thank you for submitting the form. Our team will call you shortly.';

      if (contactFeedback) {
        contactFeedback.textContent = successMessage;
      }

      if (contactToast) {
        contactToast.textContent = successMessage;
        contactToast.classList.add('show');
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
          contactToast.classList.remove('show');
        }, 5000);
      }
    });

    contactForm.addEventListener('input', (event) => {
      if (event.target.matches('input, textarea')) {
        validateField(event.target);
      }
    });
  }
});

