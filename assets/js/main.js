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
});

