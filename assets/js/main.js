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
    return localStorage.getItem('selectedCurrency') || null;
  };

  const setCurrencyPreference = (region) => {
    if (region) {
      localStorage.setItem('selectedCurrency', region);
    } else {
      localStorage.removeItem('selectedCurrency');
    }
  };

  const updatePrices = (region) => {
    if (!region) return; // Don't update if no region selected
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
    // Load saved currency preference only if it exists
    const savedCurrency = getCurrencyPreference();
    if (savedCurrency && currencyConfig[savedCurrency]) {
      currencySelector.value = savedCurrency;
      updatePrices(savedCurrency);
    }
    
    currencySelector.addEventListener('change', (event) => {
      const selectedValue = event.target.value;
      if (selectedValue) {
        updatePrices(selectedValue);
      } else {
        // Reset to base prices if "Select" is chosen
        setCurrencyPreference(null);
        priceAmounts.forEach((priceEl) => {
          const base = Number(priceEl.dataset.basePrice) || 0;
          priceEl.textContent = formatPrice(base, currencyConfig.usa);
        });
      }
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
    phone: (value) => {
      const trimmed = value.trim();
      // Phone is optional, but if provided, must be valid
      if (!trimmed) return true;
      
      // Remove all formatting characters (spaces, dashes, parentheses, plus, dots)
      const digitsOnly = trimmed.replace(/[\s\-\(\)\+\.]/g, '');
      
      // Must have 7-15 digits (international standard E.164)
      if (digitsOnly.length < 7 || digitsOnly.length > 15) {
        return false;
      }
      
      // Check if it contains only valid phone characters (digits and common formatting)
      // Allow: digits, +, spaces, dashes, parentheses, dots
      const validPhonePattern = /^[\+]?[0-9\s\-\(\)\.]{7,20}$/;
      if (!validPhonePattern.test(trimmed)) {
        return false;
      }
      
      // Ensure it contains at least some digits
      if (!/[0-9]/.test(trimmed)) {
        return false;
      }
      
      return true;
    },
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
        // Always validate the field first
        const isValid = validateField(event.target);
        
        // Special handling for phone field - show validation in real-time
        if (event.target.name === 'phone') {
          const phoneInput = event.target;
          const trimmed = phoneInput.value.trim();
          
          // Set custom validity for better browser validation
          if (!trimmed) {
            phoneInput.setCustomValidity('');
          } else {
            const digitsOnly = trimmed.replace(/[\s\-\(\)\+\.]/g, '');
            if (digitsOnly.length < 7) {
              phoneInput.setCustomValidity('Phone number must contain at least 7 digits.');
            } else if (digitsOnly.length > 15) {
              phoneInput.setCustomValidity('Phone number cannot exceed 15 digits.');
            } else if (!/[0-9]/.test(trimmed)) {
              phoneInput.setCustomValidity('Phone number must contain at least one digit.');
            } else {
              phoneInput.setCustomValidity('');
            }
          }
        }
      }
    });
    
    // Also validate on blur for better UX
    contactForm.addEventListener('blur', (event) => {
      if (event.target.matches('input, textarea, select')) {
        validateField(event.target);
      }
    }, true);
    
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

    // Auto-populate or update message field with package info
    const messageField = document.querySelector('#contactMessage');
    if (messageField) {
      const formattedPrice = getFormattedPrice(packageKey);
      const messageText = `I'm interested in the ${package.name} package (${formattedPrice}). Please provide more details.`;
      
      // If message is empty or contains package info, update it
      if (!messageField.value.trim() || messageField.value.includes('interested in the')) {
        messageField.value = messageText;
      }
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
    const config = (selectedCurrency && currencyConfig[selectedCurrency]) ? currencyConfig[selectedCurrency] : currencyConfig.usa;

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

  // Listen for currency changes on contact page (if package selector exists, we're on contact page)
  const packageSelector = document.querySelector('#packageSelector');
  if (packageSelector) {
    // This is the contact page
    const contactCurrencySelector = document.querySelector('#currencySelector');
    if (contactCurrencySelector) {
      const savedCurrency = getCurrencyPreference();
      if (savedCurrency && currencyConfig[savedCurrency]) {
        contactCurrencySelector.value = savedCurrency;
      }
      
      contactCurrencySelector.addEventListener('change', (event) => {
        const selectedCurrency = event.target.value;
        if (selectedCurrency) {
          setCurrencyPreference(selectedCurrency);
          updateContactFormPrices();
          // Refresh package details if one is selected to update the displayed price and message
          if (packageSelector.value) {
            // Force update by calling displayPackageDetails which will update price preview and message
            displayPackageDetails(packageSelector.value);
          }
        } else {
          setCurrencyPreference(null);
          updateContactFormPrices();
          // If a package is selected, refresh it to show base USD price
          if (packageSelector.value) {
            displayPackageDetails(packageSelector.value);
          }
        }
      });
    }
  }

  // Handle package selection from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const selectedPackage = urlParams.get('package');
  if (selectedPackage) {
    displayPackageDetails(selectedPackage);
  }

  // Handle manual package selection from dropdown (reuse packageSelector from above if on contact page)
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
      const packageSelectorForStorage = document.querySelector('#packageSelector');
      if (packageSelectorForStorage && packageSelectorForStorage.value) {
        displayPackageDetails(packageSelectorForStorage.value);
      }
    }
  });

  // Interactive Chart with Hover Tooltips
  const chartPoints = document.querySelectorAll('.chart-point');
  const chartTooltip = document.querySelector('#chartTooltip');
  const chartContainer = document.querySelector('.hero-chart-grid');

  if (chartPoints.length && chartTooltip && chartContainer) {
    chartPoints.forEach((point) => {
      point.addEventListener('mouseenter', (e) => {
        const year = point.getAttribute('data-year');
        const value = point.getAttribute('data-value');
        
        const tooltipYear = chartTooltip.querySelector('.tooltip-year');
        const tooltipValue = chartTooltip.querySelector('.tooltip-value');
        
        if (tooltipYear && tooltipValue) {
          tooltipYear.textContent = year;
          tooltipValue.textContent = value;
        }
        
        chartTooltip.style.display = 'block';
        updateTooltipPosition(point, chartTooltip, chartContainer);
        // Add show class for fade-in effect
        setTimeout(() => {
          chartTooltip.classList.add('show');
        }, 10);
      });
      
      point.addEventListener('mouseleave', () => {
        chartTooltip.classList.remove('show');
        setTimeout(() => {
          chartTooltip.style.display = 'none';
        }, 200);
      });
      
      point.addEventListener('mousemove', () => {
        updateTooltipPosition(point, chartTooltip, chartContainer);
      });
    });
    
    function updateTooltipPosition(point, tooltip, container) {
      const svg = point.closest('svg');
      if (!svg) return;
      
      const containerRect = container.getBoundingClientRect();
      const svgRect = svg.getBoundingClientRect();
      const viewBox = svg.viewBox.baseVal;
      
      const cx = parseFloat(point.getAttribute('cx'));
      const cy = parseFloat(point.getAttribute('cy'));
      
      // Convert SVG coordinates to pixel coordinates
      const scaleX = svgRect.width / viewBox.width;
      const scaleY = svgRect.height / viewBox.height;
      
      let x = (cx * scaleX) + (svgRect.left - containerRect.left);
      let y = (cy * scaleY) + (svgRect.top - containerRect.top);
      
      // Get tooltip dimensions to prevent overflow
      tooltip.style.visibility = 'hidden';
      tooltip.style.display = 'block';
      const tooltipRect = tooltip.getBoundingClientRect();
      tooltip.style.visibility = 'visible';
      
      // Adjust position to keep tooltip within container bounds
      const tooltipWidth = tooltipRect.width;
      const tooltipHeight = tooltipRect.height;
      const containerWidth = containerRect.width;
      const containerHeight = containerRect.height;
      
      // Center horizontally above the point
      let tooltipX = x;
      
      // Adjust if tooltip would overflow left edge
      if (tooltipX - tooltipWidth / 2 < 10) {
        tooltipX = tooltipWidth / 2 + 10;
      }
      // Adjust if tooltip would overflow right edge
      else if (tooltipX + tooltipWidth / 2 > containerWidth - 10) {
        tooltipX = containerWidth - tooltipWidth / 2 - 10;
      }
      
      // Position tooltip above the point with better spacing
      let tooltipY = y - tooltipHeight - 20;
      
      // If tooltip would go above container, position below instead
      if (tooltipY < 10) {
        tooltipY = y + 25;
      }
      // If tooltip would go below container, position above
      else if (tooltipY + tooltipHeight > containerHeight - 10) {
        tooltipY = y - tooltipHeight - 20;
      }
      
      tooltip.style.left = `${tooltipX}px`;
      tooltip.style.top = `${tooltipY}px`;
    }
  }
});

