
document.addEventListener('DOMContentLoaded', () => {

  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      navToggle.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
      });
    });
  }

  const navbar = document.getElementById('navbar');
  if (navbar && !navbar.classList.contains('navbar-solid')) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  const animatedElements = document.querySelectorAll('[data-aos]');
  if (animatedElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    animatedElements.forEach(el => observer.observe(el));
  }

  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending it...';
      submitBtn.disabled = true;

      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());

      try {
        const formAction = contactForm.getAttribute('action');
        if (formAction && formAction.includes('formspree.io') && !formAction.includes('YOUR_FORM_ID')) {
          const response = await fetch(formAction, {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: formData
          });

          if (response.ok) {
            formStatus.textContent = 'Boom! Message received. I\'ll hit you back soon.';
            formStatus.className = 'form-status success';
            contactForm.reset();
          } else {
            throw new Error('Form submission failed');
          }
        } else {
          await new Promise(resolve => setTimeout(resolve, 1000));
          formStatus.textContent = 'Boom! Message received. I\'ll hit you back soon.';
          formStatus.className = 'form-status success';
          contactForm.reset();

          console.log('Contact form submission (demo mode):', data);
          console.log('To enable real submissions, sign up at formspree.io and add your form ID to contact.html');
        }
      } catch (error) {
        formStatus.textContent = 'Hmm, that didn\'t work. Try again or just email me directly!';
        formStatus.className = 'form-status error';
      }

      submitBtn.textContent = originalText;
      submitBtn.disabled = false;

      setTimeout(() => {
        formStatus.textContent = '';
        formStatus.className = 'form-status';
      }, 5000);
    });
  }

});
