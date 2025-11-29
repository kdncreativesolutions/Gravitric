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

  // Get or set currency preference
  const getCurrencyPreference = () => {
    return localStorage.getItem('selectedCurrency') || 'usa';
  };

  const setCurrencyPreference = (region) => {
    localStorage.setItem('selectedCurrency', region);
  };

  const updatePrices = (region) => {
    const config = currencyConfig[region] || currencyConfig.usa;
    priceAmounts.forEach((priceEl) => {
      const base = Number(priceEl.dataset.basePrice) || 0;
      const converted = base * config.rate;
      priceEl.textContent = formatPrice(converted, config);
    });
    // Save currency preference
    setCurrencyPreference(region);
  };

  if (currencySelector && priceAmounts.length) {
    // Load saved currency preference
    const savedCurrency = getCurrencyPreference();
    currencySelector.value = savedCurrency;
    updatePrices(savedCurrency);
    
    currencySelector.addEventListener('change', (event) => {
      updatePrices(event.target.value);
    });
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
    package: (value) => value.trim().length > 0,
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

      const inputs = contactForm.querySelectorAll('input, textarea, select');
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
      // Hide package details section after reset
      const packageDetailsSection = document.querySelector('#packageDetailsSection');
      if (packageDetailsSection) packageDetailsSection.style.display = 'none';

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
      if (event.target.matches('input, textarea, select')) {
        validateField(event.target);
      }
    });
    
    contactForm.addEventListener('change', (event) => {
      if (event.target.matches('select')) {
        validateField(event.target);
      }
    });
  }

  // Package base prices
  const packageBasePrices = {
    'golden-package': 2500,
    'premium-package': 5800,
    'meta-ads-package': 10900
  };

  // Get formatted price based on selected currency
  const getFormattedPrice = (packageKey) => {
    const basePrice = packageBasePrices[packageKey] || 0;
    const selectedCurrency = getCurrencyPreference();
    const config = currencyConfig[selectedCurrency] || currencyConfig.usa;
    const converted = basePrice * config.rate;
    const formatted = formatPrice(converted, config);
    return `${formatted} / month`;
  };

  // Package data mapping
  const packageData = {
    'golden-package': {
      name: 'Golden Package',
      basePrice: 2500,
      features: [
        'Facebook+Instagram Account Management',
        'Weekly 3 Posting On Social Media',
        '5 Lac+ Reach & Impressions',
        'Festival Post',
        '6 Days Leads Generation in Week',
        'Customize Inquiry form for Genuine Inquiry in Meta Ads'
      ]
    },
    'premium-package': {
      name: 'Premium Package',
      basePrice: 5800,
      features: [
        'Facebook+Instagram Account Management',
        'Weekly 3 Posting On Social Media',
        '8 Lac+ Reach & Impressions',
        'Festival Post',
        'Calling Support from our side',
        'End to end follow-ups from our side',
        '7 Days Leads Generation in Week',
        'Customize Inquiry form for Genuine Inquiry in Meta Ads'
      ]
    },
    'meta-ads-package': {
      name: 'Meta Ads Package',
      basePrice: 10900,
      features: [
        'Facebook+Instagram Account Management',
        'Weekly 3 Posting On Social Media',
        '8 Lac+ Reach & Impressions',
        'Festival Post',
        '7 Days Leads Generation in Week'
      ]
    }
  };

  // Function to display package details
  const displayPackageDetails = (packageKey) => {
    const packageDetailsSection = document.querySelector('#packageDetailsSection');
    const selectedPackageName = document.querySelector('#selectedPackageName');
    const selectedPackagePrice = document.querySelector('#selectedPackagePrice');
    const selectedPackageFeatures = document.querySelector('#selectedPackageFeatures');
    const packageSelector = document.querySelector('#packageSelector');

    if (!packageDetailsSection || !packageKey || !packageData[packageKey]) {
      if (packageDetailsSection) packageDetailsSection.style.display = 'none';
      if (packageSelector) packageSelector.value = '';
      return;
    }

    const package = packageData[packageKey];

    // Show package details section
    packageDetailsSection.style.display = 'block';
    
    // Populate package details with current currency
    if (selectedPackageName) selectedPackageName.textContent = package.name;
    if (selectedPackagePrice) {
      selectedPackagePrice.textContent = getFormattedPrice(packageKey);
    }
    
    if (selectedPackageFeatures) {
      selectedPackageFeatures.innerHTML = '';
      package.features.forEach(feature => {
        const li = document.createElement('li');
        li.style.paddingLeft = '1.25rem';
        li.style.position = 'relative';
        li.style.marginBottom = '0.5rem';
        li.style.color = 'rgba(255, 255, 255, 0.9)';
        li.style.lineHeight = '1.6';
        li.innerHTML = `<span style="position: absolute; left: 0; color: var(--primary); font-size: 0.85rem;">▹</span><span style="display: inline-block; padding-left: 0.5rem;">${feature}</span>`;
        selectedPackageFeatures.appendChild(li);
      });
    }

    // Auto-populate message field with package info
    const messageField = document.querySelector('#contactMessage');
    if (messageField && !messageField.value.trim()) {
      const formattedPrice = getFormattedPrice(packageKey);
      messageField.value = `I'm interested in the ${package.name} package (${formattedPrice}). Please provide more details.`;
    }

    // Update package selector if it exists
    if (packageSelector) {
      packageSelector.value = packageKey;
    }
  };

  // Update contact form dropdown prices based on currency
  const updateContactFormPrices = () => {
    const packageSelector = document.querySelector('#packageSelector');
    if (!packageSelector) return;

    const selectedCurrency = getCurrencyPreference();
    const config = currencyConfig[selectedCurrency] || currencyConfig.usa;

    // Update dropdown option texts
    const options = packageSelector.querySelectorAll('option');
    options.forEach((option) => {
      const value = option.value;
      if (value && packageBasePrices[value]) {
        const basePrice = packageBasePrices[value];
        const converted = basePrice * config.rate;
        const formatted = formatPrice(converted, config);
        const packageName = packageData[value]?.name || value;
        option.textContent = `${packageName} - ${formatted}/month`;
      }
    });
  };

  // Update contact form prices on page load
  updateContactFormPrices();

  // Listen for currency changes (if currency selector exists on contact page)
  const contactCurrencySelector = document.querySelector('#currencySelector');
  if (contactCurrencySelector && !currencySelector) {
    // This is the contact page currency selector
    const savedCurrency = getCurrencyPreference();
    contactCurrencySelector.value = savedCurrency;
    contactCurrencySelector.addEventListener('change', (event) => {
      const selectedCurrency = event.target.value;
      setCurrencyPreference(selectedCurrency);
      updateContactFormPrices();
      // Refresh package details if one is selected
      const packageSelector = document.querySelector('#packageSelector');
      if (packageSelector && packageSelector.value) {
        displayPackageDetails(packageSelector.value);
      }
    });
  }

  // Handle package selection from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const selectedPackage = urlParams.get('package');
  if (selectedPackage) {
    displayPackageDetails(selectedPackage);
  }

  // Handle manual package selection from dropdown
  const packageSelector = document.querySelector('#packageSelector');
  if (packageSelector) {
    packageSelector.addEventListener('change', (event) => {
      const selectedValue = event.target.value;
      if (selectedValue) {
        displayPackageDetails(selectedValue);
      } else {
        const packageDetailsSection = document.querySelector('#packageDetailsSection');
        if (packageDetailsSection) packageDetailsSection.style.display = 'none';
        const messageField = document.querySelector('#contactMessage');
        if (messageField && messageField.value.includes('interested in the')) {
          messageField.value = '';
        }
      }
    });
  }

  // Listen for storage events to update prices when currency changes on another page
  window.addEventListener('storage', (event) => {
    if (event.key === 'selectedCurrency') {
      updateContactFormPrices();
      const packageSelector = document.querySelector('#packageSelector');
      if (packageSelector && packageSelector.value) {
        displayPackageDetails(packageSelector.value);
      }
    }
  });
});

