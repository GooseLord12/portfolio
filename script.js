
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

  // ---- Project Highlights Gallery ----
  // Maps each project key to its display title and 4 image paths.
  // Replace the placeholder filenames (image-2/3/4.png) with real screenshots
  // dropped into the portfolio folder. The JS will display whatever's listed.
  const PROJECT_HIGHLIGHTS = {
    actionvault: {
      title: 'ActionVault Highlights',
      images: ['actionvault-1.png', 'actionvault-2.png', 'actionvault-3.png', 'actionvault-4.png']
    },
    unclerogers: {
      title: "Uncle Roger's Highlights",
      images: ['uncle-rogers.png', 'uncle-rogers-2.png', 'uncle-rogers-3.png', 'uncle-rogers-4.png']
    },
    explorlando: {
      title: 'Explorlando Highlights',
      images: ['explore.png', 'explore-2.png', 'explore-3.png', 'explore-4.png']
    },
    comet: {
      title: 'Comet Tales Highlights',
      images: ['comet.png', 'comet-2.png', 'comet-3.png', 'comet-4.png']
    },
    kennel: {
      title: 'Kennel Highlights',
      images: ['dog.png', 'dog-2.png', 'dog-3.png', 'dog-4.png']
    }
  };

  const highlightsModal = document.getElementById('highlightsModal');
  const highlightsClose = document.getElementById('highlightsClose');
  const highlightsTitle = document.getElementById('highlightsTitle');
  const highlightsGrid = document.getElementById('highlightsGrid');

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  if (highlightsModal) {
    const openHighlights = (projectKey) => {
      const project = PROJECT_HIGHLIGHTS[projectKey];
      if (!project) return;

      highlightsTitle.textContent = project.title;
      highlightsGrid.innerHTML = '';
      project.images.forEach((src, i) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `${project.title} image ${i + 1}`;
        img.className = 'highlights-img';
        highlightsGrid.appendChild(img);
      });

      highlightsModal.hidden = false;
      document.body.style.overflow = 'hidden';
    };

    const closeHighlights = () => {
      highlightsModal.hidden = true;
      document.body.style.overflow = '';
    };

    const openLightbox = (src, alt) => {
      lightboxImg.src = src;
      lightboxImg.alt = alt;
      lightbox.hidden = false;
    };

    const closeLightbox = () => {
      lightbox.hidden = true;
      lightboxImg.src = '';
    };

    document.querySelectorAll('.btn-highlights').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        openHighlights(btn.dataset.project);
      });
    });

    highlightsClose.addEventListener('click', closeHighlights);

    // Click outside the modal content closes the gallery
    highlightsModal.addEventListener('click', e => {
      if (e.target === highlightsModal) closeHighlights();
    });

    // Click a gallery image to expand it in the lightbox (event delegation
    // since images are dynamically created when the gallery opens)
    if (lightbox) {
      highlightsGrid.addEventListener('click', e => {
        const target = e.target;
        if (target.classList.contains('highlights-img')) {
          openLightbox(target.src, target.alt);
        }
      });

      lightboxClose.addEventListener('click', closeLightbox);

      // Click the dark backdrop (but not the image itself) to close
      lightbox.addEventListener('click', e => {
        if (e.target === lightbox) closeLightbox();
      });
    }

    // Escape closes whichever overlay is on top: lightbox first, then gallery
    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return;
      if (lightbox && !lightbox.hidden) {
        closeLightbox();
      } else if (!highlightsModal.hidden) {
        closeHighlights();
      }
    });
  }

});
