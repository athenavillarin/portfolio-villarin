// Dynamically render skills from skills.json
fetch('skills.json')
  .then(response => response.json())
  .then(skills => {
    const grid = document.querySelector('.skills-grid');
    if (!grid) return;
    grid.innerHTML = '';
    skills.forEach(skill => {
      const card = document.createElement('div');
      card.className = 'skill-card';
      card.innerHTML = `<img src="${skill.icon}" alt="${skill.name}" class="skill-icon"/><span>${skill.name}</span>`;
      grid.appendChild(card);
    });
  });
// Dark mode toggle with persistence
(function() {
  const root = document.documentElement;
  const modeBtn = document.querySelector('.mode-toggle');
  const navToggle = document.querySelector('.nav__toggle');
  const navMenu = document.getElementById('nav-menu');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  const stored = localStorage.getItem('theme');

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      modeBtn.textContent = '☀️';
    } else {
      root.removeAttribute('data-theme');
      modeBtn.textContent = '🌙';
    }
  }

  applyTheme(stored || (prefersDark.matches ? 'dark' : 'light'));

  modeBtn.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next);
  });

  // Mobile nav toggle
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    const open = navMenu.getAttribute('data-open') === 'true';
    navMenu.setAttribute('data-open', String(!open));
    if(!expanded) {
      navToggle.focus();
    }
  });

  // Close nav on link click (mobile)
  navMenu.addEventListener('click', e => {
    if(e.target.tagName === 'A' && window.innerWidth < 821) {
      navToggle.setAttribute('aria-expanded','false');
      navMenu.setAttribute('data-open','false');
    }
  });

  // Scroll spy & reveal
  const sections = [...document.querySelectorAll('main section[id]')];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.classList.add('visible');
        const id = entry.target.id;
        document.querySelectorAll('.nav__menu a').forEach(a => {
          if(a.getAttribute('href') === '#' + id) a.classList.add('active'); else a.classList.remove('active');
        });
      }
    });
  }, { threshold: 0.2 });

  sections.forEach(sec => {
    sec.classList.add('reveal');
    observer.observe(sec);
  });

  // Contact form (front-end only mock)
  const form = document.querySelector('.contact-form');
  if(form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const status = form.querySelector('.form-status');
      const data = new FormData(form);
      let valid = true;
      form.querySelectorAll('[required]').forEach(field => {
        const errEl = form.querySelector(`[data-error-for="${field.id}"]`);
        if(!field.value.trim()) {
          errEl.textContent = 'Required';
          valid = false;
        } else if(field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
          errEl.textContent = 'Invalid email';
          valid = false;
        } else {
          errEl.textContent = '';
        }
      });
      if(!valid) return;
      status.textContent = 'Sending...';
      setTimeout(() => {
        status.textContent = 'Message sent (simulation).';
        form.reset();
      }, 900);
    });
  }

  // Dynamic year
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();
})();
