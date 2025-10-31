
function ready(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
}

ready(() => {
  const navToggle = document.querySelector('.nav-toggle');
  const primaryNav = document.querySelector('.primary-nav');
  const popTrigger = document.querySelector('.pop-trigger');
  const popMenu = document.querySelector('.pop-menu');

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isExpanded));
      primaryNav.classList.toggle('open', !isExpanded);
    });
  }

  if (popTrigger && popMenu) {
    const navPop = popTrigger.closest('.nav-pop');

    const closePop = () => {
      popTrigger.setAttribute('aria-expanded', 'false');
      navPop?.classList.remove('open');
    };

    popTrigger.addEventListener('click', (event) => {
      const isExpanded = popTrigger.getAttribute('aria-expanded') === 'true';
      popTrigger.setAttribute('aria-expanded', String(!isExpanded));
      navPop?.classList.toggle('open', !isExpanded);
      event.stopPropagation();
    });

    document.addEventListener('click', (event) => {
      if (!navPop?.contains(event.target)) {
        closePop();
      }
    });

    popMenu.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closePop();
        popTrigger.focus();
      }
    });

    popMenu.addEventListener('focusout', (event) => {
      const nextTarget = event.relatedTarget;
      if (navPop && (!nextTarget || !navPop.contains(nextTarget))) {
        closePop();
      }
    });

    popTrigger.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closePop();
      }
    });
  }

  // Animate on scroll
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));
  } else {
    document.querySelectorAll('.animate-on-scroll').forEach((el) => el.classList.add('in-view'));
  }

  // Newsletter form behavior
  const newsletterForm = document.querySelector('.newsletter-form');
  const statusRegion = document.getElementById('newsletter-status');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const submitButton = newsletterForm.querySelector('button[type="submit"]');
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      const originalText = submitButton?.textContent ?? '';

      if (!emailInput?.value) {
        return;
      }

      submitButton.disabled = true;
      submitButton.textContent = 'Signing you up…';

      window.setTimeout(() => {
        submitButton.textContent = 'Signed Up!';
        submitButton.classList.add('success');
        if (statusRegion) {
          statusRegion.textContent = `Subscribed with ${emailInput.value.trim()}`;
        }

        window.setTimeout(() => {
          submitButton.textContent = originalText;
          submitButton.classList.remove('success');
          submitButton.disabled = false;
          newsletterForm.reset();
          if (statusRegion) {
            statusRegion.textContent = '';
          }
        }, 1800);
      }, 900);
    });
  }
});
