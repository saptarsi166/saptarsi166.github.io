/**
 * Main Application Logic
 * Orchestrates themes, gallery rendering, filtering, modals,
 * skills matrix, commission estimator, and interactive UI feedback.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeSystem();
  initCustomCursor();
  initHero3D();
  initComparisonSlider();
  initShaderLab();
  initProjectGallery();
  initSkillsSection();
  initTimeline();
  initCommissionEstimator();
  initContactForm();
  initSmoothScroll();
});

/* ==========================================================================
   1. Theme Management (Cyber Neon, Obsidian Gold, Ethereal Hologram, Minimal)
   ========================================================================== */
function initThemeSystem() {
  const root = document.documentElement;
  const themeBtns = document.querySelectorAll('.theme-btn');
  const savedTheme = localStorage.getItem('vortex-theme') || 'cyber';

  setTheme(savedTheme);

  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.theme;
      setTheme(theme);
    });
  });

  function setTheme(themeName) {
    root.setAttribute('data-theme', themeName);
    localStorage.setItem('vortex-theme', themeName);

    themeBtns.forEach(b => {
      b.classList.toggle('active', b.dataset.theme === themeName);
    });
  }
}

/* ==========================================================================
   2. Custom Ambient Cursor Tracker
   ========================================================================== */
function initCustomCursor() {
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  if (!cursorDot || !cursorRing) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  });

  function renderCursor() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Hover states on interactive elements
  const interactives = 'a, button, input, select, textarea, .project-card, .slider-handle, .btn-pass';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactives)) {
      document.body.classList.add('cursor-hover');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactives)) {
      document.body.classList.remove('cursor-hover');
    }
  });
}

/* ==========================================================================
   3. 3D Hero Viewport Initialization & HUD Controls
   ========================================================================== */
let hero3D = null;
function initHero3D() {
  if (typeof HeroViewport3D !== 'undefined' && document.getElementById('hero-3d-canvas')) {
    hero3D = new HeroViewport3D('hero-3d-canvas');

    // Geometry Switchers
    document.querySelectorAll('.hud-geo-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.hud-geo-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        hero3D.setGeometry(btn.dataset.geo);
      });
    });

    // Material Mode Switchers
    document.querySelectorAll('.hud-mat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.hud-mat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        hero3D.setMaterial(btn.dataset.mat);
      });
    });

    // Wireframe Toggle
    const wireframeBtn = document.getElementById('hud-wireframe-toggle');
    if (wireframeBtn) {
      wireframeBtn.addEventListener('click', () => {
        const isWire = hero3D.toggleWireframe();
        wireframeBtn.classList.toggle('active', isWire);
      });
    }

    // Auto Rotate Toggle
    const rotateBtn = document.getElementById('hud-rotate-toggle');
    if (rotateBtn) {
      rotateBtn.addEventListener('click', () => {
        const isRotating = hero3D.toggleAutoRotate();
        rotateBtn.classList.toggle('active', isRotating);
      });
    }

    // Interactive Pulse on Hero Click
    const canvasContainer = document.getElementById('hero-3d-canvas');
    if (canvasContainer) {
      canvasContainer.addEventListener('dblclick', () => {
        hero3D.pulse();
        showToast('3D Geometry Pulse Triggered');
      });
    }
  }
}

/* ==========================================================================
   4. Signature Multi-Pass Render Comparison Slider
   ========================================================================== */
let comparisonSlider = null;
function initComparisonSlider() {
  const container = document.getElementById('render-comparison-container');
  if (container && typeof RenderComparisonSlider !== 'undefined') {
    comparisonSlider = new RenderComparisonSlider(container, {
      initialPosition: 50,
      primaryPass: 'beauty',
      secondaryPass: 'clay',
      passes: {
        beauty: 'assets/images/mecha-beauty.jpg',
        clay: 'assets/images/mecha-clay.jpg',
        wireframe: 'assets/images/mecha-wireframe.jpg'
      }
    });
  }
}

/* ==========================================================================
   5. Interactive 3D Shader & Material Lab Sandbox
   ========================================================================== */
let shaderLab = null;
function initShaderLab() {
  const container = document.getElementById('shader-lab-canvas');
  if (container && typeof ShaderLab !== 'undefined') {
    shaderLab = new ShaderLab('shader-lab-canvas');
  }
}

/* ==========================================================================
   6. Project Gallery & Filtering & Case Study Modal
   ========================================================================== */
function initProjectGallery() {
  const grid = document.getElementById('projects-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (!grid || typeof PROJECTS === 'undefined') return;

  let currentCategory = 'all';

  function renderCards(category) {
    grid.innerHTML = '';
    const filtered = category === 'all' 
      ? PROJECTS 
      : PROJECTS.filter(p => p.category === category);

    filtered.forEach((project, index) => {
      const card = document.createElement('article');
      card.className = 'project-card';
      card.style.animationDelay = `${index * 0.08}s`;
      card.setAttribute('data-id', project.id);

      const toolsBadges = project.tools.slice(0, 3).map(t => 
        `<span class="tool-tag" style="border-color: ${t.color}44; color: ${t.color};">${t.name}</span>`
      ).join('');

      card.innerHTML = `
        <div class="card-media">
          <img src="${project.thumbnail}" alt="${project.title}" loading="lazy" class="card-img">
          <div class="card-overlay">
            <span class="btn-inspect">Inspect Case Study &rarr;</span>
          </div>
          <span class="card-badge">${project.categoryLabel}</span>
        </div>
        <div class="card-content">
          <div class="card-meta">
            <span class="card-year">${project.year}</span>
            <span class="card-client">${project.client}</span>
          </div>
          <h3 class="card-title">${project.title}</h3>
          <p class="card-desc">${project.subtitle}</p>
          <div class="card-tools">
            ${toolsBadges}
          </div>
        </div>
      `;

      card.addEventListener('click', () => openProjectModal(project));
      grid.appendChild(card);
    });
  }

  // Filter Buttons Click
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.category;
      renderCards(currentCategory);
    });
  });

  // Initial Render
  renderCards('all');

  // Modal Close Listeners
  const modal = document.getElementById('case-study-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalBackdrop = document.getElementById('modal-backdrop');

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', closeProjectModal);
  }
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeProjectModal();
    }
  });
}

function openProjectModal(project) {
  const modal = document.getElementById('case-study-modal');
  if (!modal) return;

  // Populate data
  document.getElementById('modal-title').textContent = project.title;
  document.getElementById('modal-subtitle').textContent = project.subtitle;
  document.getElementById('modal-category').textContent = project.categoryLabel;
  document.getElementById('modal-year').textContent = project.year;
  document.getElementById('modal-client').textContent = project.client;
  document.getElementById('modal-role').textContent = project.role;
  document.getElementById('modal-overview').textContent = project.overview;
  document.getElementById('modal-challenges').textContent = project.challenges;

  // Hero Image
  const modalImg = document.getElementById('modal-hero-img');
  if (modalImg) {
    modalImg.src = project.thumbnail;
    modalImg.alt = project.title;
  }

  // Pass Switchers if available
  const passContainer = document.getElementById('modal-passes-bar');
  if (passContainer) {
    if (project.passes && (project.passes.clay !== project.passes.beauty || project.passes.wireframe !== project.passes.beauty)) {
      passContainer.style.display = 'flex';
      passContainer.innerHTML = `
        <span class="pass-selector-label">Inspect Pass:</span>
        <button type="button" class="modal-pass-btn active" data-src="${project.passes.beauty}">Beauty</button>
        <button type="button" class="modal-pass-btn" data-src="${project.passes.clay}">Clay</button>
        <button type="button" class="modal-pass-btn" data-src="${project.passes.wireframe}">Wireframe</button>
      `;
      passContainer.querySelectorAll('.modal-pass-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          passContainer.querySelectorAll('.modal-pass-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          modalImg.src = btn.dataset.src;
        });
      });
    } else {
      passContainer.style.display = 'none';
    }
  }

  // Metrics Grid
  const metricsGrid = document.getElementById('modal-metrics-grid');
  if (metricsGrid) {
    metricsGrid.innerHTML = Object.entries(project.metrics).map(([key, val]) => `
      <div class="modal-metric-card">
        <span class="metric-label">${formatKeyName(key)}</span>
        <span class="metric-val">${val}</span>
      </div>
    `).join('');
  }

  // Tools Badges
  const toolsList = document.getElementById('modal-tools-list');
  if (toolsList) {
    toolsList.innerHTML = project.tools.map(t => `
      <span class="tool-pill" style="border-color: ${t.color}66; color: ${t.color};">
        <span class="tool-dot" style="background: ${t.color};"></span>
        ${t.name}
      </span>
    `).join('');
  }

  // Breakdown List
  const breakdownList = document.getElementById('modal-breakdown-list');
  if (breakdownList) {
    breakdownList.innerHTML = project.breakdown.map(item => `
      <li class="breakdown-item">${item}</li>
    `).join('');
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  const modal = document.getElementById('case-study-modal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function formatKeyName(key) {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
}

/* ==========================================================================
   7. Skills & Tooling Section
   ========================================================================== */
function initSkillsSection() {
  const container = document.getElementById('skills-container');
  const statsContainer = document.getElementById('skills-stats-grid');
  if (!container || typeof SKILLS_DATA === 'undefined') return;

  // Render Stats
  if (statsContainer) {
    statsContainer.innerHTML = SKILLS_DATA.stats.map(s => `
      <div class="stat-card">
        <div class="stat-number">${s.number}</div>
        <div class="stat-label">${s.label}</div>
      </div>
    `).join('');
  }

  // Render Skill Categories
  container.innerHTML = SKILLS_DATA.categories.map(cat => `
    <div class="skill-category-card">
      <div class="category-header">
        <h3 class="category-title">${cat.title}</h3>
      </div>
      <div class="skills-list">
        ${cat.skills.map(sk => `
          <div class="skill-item">
            <div class="skill-info">
              <span class="skill-name">${sk.name}</span>
              <span class="skill-percent">${sk.level}%</span>
            </div>
            <div class="skill-bar-track">
              <div class="skill-bar-fill" style="width: ${sk.level}%;"></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

/* ==========================================================================
   8. Experience & Recognition Timeline
   ========================================================================== */
function initTimeline() {
  const timelineEl = document.getElementById('experience-timeline');
  if (!timelineEl || typeof TIMELINE_DATA === 'undefined') return;

  timelineEl.innerHTML = TIMELINE_DATA.map((item, idx) => `
    <div class="timeline-node">
      <div class="timeline-dot"></div>
      <div class="timeline-content">
        <div class="timeline-header">
          <span class="timeline-year">${item.year}</span>
          <span class="timeline-company">${item.company}</span>
        </div>
        <h4 class="timeline-role">${item.role}</h4>
        <p class="timeline-desc">${item.description.replace(/\n/g, '<br>')}</p>
      </div>
    </div>
  `).join('');
}

/* ==========================================================================
   9. Commission Estimator Interactive Calculator
   ========================================================================== */
function initCommissionEstimator() {
  const typeSelect = document.getElementById('est-type');
  const scopeSelect = document.getElementById('est-scope');
  const urgencySelect = document.getElementById('est-urgency');
  const outputBudget = document.getElementById('est-output-budget');
  const outputTimeline = document.getElementById('est-output-timeline');
  const applyBtn = document.getElementById('est-apply-btn');

  if (!typeSelect || !scopeSelect || !urgencySelect) return;

  function calculate() {
    const baseRates = {
      'hardsurface': { base: 1200, weeks: 2 },
      'environment': { base: 2800, weeks: 4 },
      'shaders': { base: 1500, weeks: 2 },
      'motion': { base: 2200, weeks: 3 },
      'webgl': { base: 3500, weeks: 4 }
    };

    const scopeMultipliers = {
      'asset': { mult: 1.0, weekMult: 1.0 },
      'scene': { mult: 2.2, weekMult: 1.8 },
      'full': { mult: 4.0, weekMult: 2.5 }
    };

    const urgencyMultipliers = {
      'normal': { mult: 1.0, weekMult: 1.0 },
      'priority': { mult: 1.35, weekMult: 0.7 },
      'rush': { mult: 1.75, weekMult: 0.5 }
    };

    const type = baseRates[typeSelect.value] || baseRates['hardsurface'];
    const scope = scopeMultipliers[scopeSelect.value] || scopeMultipliers['asset'];
    const urgency = urgencyMultipliers[urgencySelect.value] || urgencyMultipliers['normal'];

    const totalCost = Math.round((type.base * scope.mult * urgency.mult) / 100) * 100;
    const estWeeks = Math.max(1, Math.round(type.weeks * scope.weekMult * urgency.weekMult));

    if (outputBudget) {
      outputBudget.textContent = `$${totalCost.toLocaleString()} - $${Math.round(totalCost * 1.3).toLocaleString()} USD`;
    }
    if (outputTimeline) {
      outputTimeline.textContent = `${estWeeks} - ${estWeeks + 1} Weeks`;
    }
  }

  typeSelect.addEventListener('change', calculate);
  scopeSelect.addEventListener('change', calculate);
  urgencySelect.addEventListener('change', calculate);

  calculate();

  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      const msgField = document.getElementById('contact-message');
      const projectType = typeSelect.options[typeSelect.selectedIndex].text;
      const scope = scopeSelect.options[scopeSelect.selectedIndex].text;
      const budget = outputBudget ? outputBudget.textContent : '';
      const timeline = outputTimeline ? outputTimeline.textContent : '';

      if (msgField) {
        msgField.value = `Hi! I'm interested in commissioning a project:\n\n• Type: ${projectType}\n• Scope: ${scope}\n• Estimated Budget: ${budget}\n• Estimated Timeline: ${timeline}\n\nProject details:\n`;
        msgField.focus();
        showToast('Estimator details applied to message form!');
        
        // Scroll to contact form
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }
}

/* ==========================================================================
   10. Contact Form & Clipboard Copy System
   ========================================================================== */
function initContactForm() {
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const contactForm = document.getElementById('portfolio-contact-form');

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = copyEmailBtn.dataset.email || 'banerjeesaptarsi622@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast(`Copied ${email} to clipboard!`);
      }).catch(() => {
        showToast(`Email: ${email}`);
      });
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = `<span>Sending Message...</span>`;
      submitBtn.disabled = true;

      setTimeout(() => {
        showToast('Thank you! Your message has been sent successfully.');
        contactForm.reset();
        submitBtn.innerHTML = `<span>Message Dispatched &check;</span>`;
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }, 3000);
      }, 900);
    });
  }
}

/* ==========================================================================
   11. Toast Notification Helper
   ========================================================================== */
function showToast(message) {
  let toast = document.querySelector('.vortex-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'vortex-toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <div class="toast-content">
      <span class="toast-indicator"></span>
      <span class="toast-text">${message}</span>
    </div>
  `;

  toast.classList.add('active');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('active');
  }, 3200);
}

/* ==========================================================================
   12. Smooth Anchor Navigation
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}
