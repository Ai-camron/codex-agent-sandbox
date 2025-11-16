/* Kadence Custom JS for CEBASTIAN Co. */
(function () {
    const body = document.body;

    const onScroll = () => {
        if (window.scrollY > 60) {
            body.classList.add('has-scrolled');
        } else {
            body.classList.remove('has-scrolled');
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const animateEls = document.querySelectorAll('.kdn-animate');
    if ('IntersectionObserver' in window && animateEls.length) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -60px 0px'
        });

        animateEls.forEach((el) => observer.observe(el));
    } else {
        animateEls.forEach((el) => el.classList.add('is-visible'));
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            const href = anchor.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                event.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    const newsletterForms = document.querySelectorAll('.kdn-newsletter__form');
    newsletterForms.forEach((form) => {
        const submitBtn = form.querySelector('button, input[type="submit"]');
        const status = form.querySelector('[data-newsletter-status]');
        form.addEventListener('submit', (event) => {
            if (!submitBtn) return;
            event.preventDefault();
            const emailField = form.querySelector('input[type="email"]');
            const originalLabel = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Subscribing…';

            setTimeout(() => {
                submitBtn.textContent = 'Subscribed!';
                submitBtn.classList.add('is-success');
                if (status) {
                    status.textContent = `Subscribed with ${emailField.value}`;
                }

                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalLabel;
                    submitBtn.classList.remove('is-success');
                    form.reset();
                    if (status) {
                        status.textContent = '';
                    }
                }, 2200);
            }, 1200);
        });
    });

    const contactForms = document.querySelectorAll('.kdn-contact-form');
    contactForms.forEach((form) => {
        const submitBtn = form.querySelector('button, input[type="submit"]');
        const status = form.querySelector('[data-newsletter-status]');
        form.addEventListener('submit', (event) => {
            if (!submitBtn) return;
            event.preventDefault();
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending…';

            setTimeout(() => {
                submitBtn.textContent = 'Message Sent';
                submitBtn.classList.add('is-success');
                if (status) {
                    status.textContent = 'Thank you! Our concierge will respond within 24 hours.';
                }

                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                    submitBtn.classList.remove('is-success');
                    form.reset();
                    if (status) {
                        status.textContent = '';
                    }
                }, 2400);
            }, 1400);
        });
    });
})();
