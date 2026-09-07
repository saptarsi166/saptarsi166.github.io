/**
 * Multi-Pass Render Comparison Slider
 * Allows interactive dragging to inspect Beauty Pass vs Clay Pass vs Wireframe Topology.
 * Supports mouse drag, touch drag, keyboard arrow keys, pass selector buttons, and spec badges.
 */

class RenderComparisonSlider {
  constructor(containerElement, options = {}) {
    this.container = typeof containerElement === 'string' 
      ? document.querySelector(containerElement) 
      : containerElement;
    if (!this.container) return;

    this.options = Object.assign({
      initialPosition: 50, // percentage
      primaryPass: 'beauty',
      secondaryPass: 'clay',
      passes: {
        beauty: 'assets/images/mecha-beauty.jpg',
        clay: 'assets/images/mecha-clay.jpg',
        wireframe: 'assets/images/mecha-wireframe.jpg'
      }
    }, options);

    this.position = this.options.initialPosition;
    this.isDragging = false;
    
    this.render();
    this.bindEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="slider-wrapper" tabindex="0" role="region" aria-label="3D Render Pass Comparison Slider">
        <!-- Background Layer (Secondary Pass) -->
        <div class="slider-layer layer-secondary">
          <img src="${this.options.passes[this.options.secondaryPass]}" alt="${this.options.secondaryPass} render pass" class="slider-img img-secondary" draggable="false">
          <div class="pass-tag tag-right">${this.getPassLabel(this.options.secondaryPass)}</div>
        </div>

        <!-- Foreground Clipped Layer (Primary Pass) -->
        <div class="slider-layer layer-primary" style="clip-path: polygon(0 0, ${this.position}% 0, ${this.position}% 100%, 0 100%);">
          <img src="${this.options.passes[this.options.primaryPass]}" alt="${this.options.primaryPass} render pass" class="slider-img img-primary" draggable="false">
          <div class="pass-tag tag-left">${this.getPassLabel(this.options.primaryPass)}</div>
        </div>

        <!-- Slider Divider Handle -->
        <div class="slider-handle" style="left: ${this.position}%;">
          <div class="handle-line"></div>
          <div class="handle-thumb" aria-hidden="true">
            <svg class="handle-arrows" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
              <polyline points="9 18 15 12 9 6" style="transform: rotate(180deg); transform-origin: center;"></polyline>
            </svg>
          </div>
          <div class="handle-line"></div>
        </div>

        <!-- HUD Details Overlay -->
        <div class="slider-hud">
          <div class="hud-item">
            <span class="hud-label">ASSET</span>
            <span class="hud-value">AEGIS-09 TAC-HELMET</span>
          </div>
          <div class="hud-item">
            <span class="hud-label">TOPOLOGY</span>
            <span class="hud-value">SUB-D QUADS (316.4K TRIS)</span>
          </div>
          <div class="hud-item">
            <span class="hud-label">SHADING</span>
            <span class="hud-value">8K UDIM PBR METALLIC</span>
          </div>
        </div>
      </div>

      <!-- Controls bar below slider -->
      <div class="slider-controls-bar">
        <div class="pass-selector-group">
          <span class="controls-label">Compare Left:</span>
          <div class="pass-buttons" data-side="primary">
            <button type="button" class="btn-pass ${this.options.primaryPass === 'beauty' ? 'active' : ''}" data-pass="beauty">Beauty</button>
            <button type="button" class="btn-pass ${this.options.primaryPass === 'clay' ? 'active' : ''}" data-pass="clay">Clay / AO</button>
            <button type="button" class="btn-pass ${this.options.primaryPass === 'wireframe' ? 'active' : ''}" data-pass="wireframe">Wireframe</button>
          </div>
        </div>

        <div class="pass-divider-indicator">
          <span>Divider: <strong>${Math.round(this.position)}%</strong></span>
        </div>

        <div class="pass-selector-group">
          <span class="controls-label">Compare Right:</span>
          <div class="pass-buttons" data-side="secondary">
            <button type="button" class="btn-pass ${this.options.secondaryPass === 'beauty' ? 'active' : ''}" data-pass="beauty">Beauty</button>
            <button type="button" class="btn-pass ${this.options.secondaryPass === 'clay' ? 'active' : ''}" data-pass="clay">Clay / AO</button>
            <button type="button" class="btn-pass ${this.options.secondaryPass === 'wireframe' ? 'active' : ''}" data-pass="wireframe">Wireframe</button>
          </div>
        </div>
      </div>
    `;

    this.wrapper = this.container.querySelector('.slider-wrapper');
    this.primaryLayer = this.container.querySelector('.layer-primary');
    this.handle = this.container.querySelector('.slider-handle');
    this.indicator = this.container.querySelector('.pass-divider-indicator strong');
    this.imgPrimary = this.container.querySelector('.img-primary');
    this.imgSecondary = this.container.querySelector('.img-secondary');
  }

  getPassLabel(passKey) {
    switch (passKey) {
      case 'beauty': return 'BEAUTY PASS (PBR)';
      case 'clay': return 'CLAY / AO PASS';
      case 'wireframe': return 'WIREFRAME TOPOLOGY';
      default: return passKey.toUpperCase();
    }
  }

  updatePosition(percent) {
    const clamped = Math.max(0, Math.min(100, percent));
    this.position = clamped;
    this.primaryLayer.style.clipPath = `polygon(0 0, ${clamped}% 0, ${clamped}% 100%, 0 100%)`;
    this.handle.style.left = `${clamped}%`;
    if (this.indicator) {
      this.indicator.textContent = `${Math.round(clamped)}%`;
    }
  }

  setPass(side, passName) {
    if (side === 'primary') {
      this.options.primaryPass = passName;
      this.imgPrimary.src = this.options.passes[passName];
      this.container.querySelector('.tag-left').textContent = this.getPassLabel(passName);
    } else {
      this.options.secondaryPass = passName;
      this.imgSecondary.src = this.options.passes[passName];
      this.container.querySelector('.tag-right').textContent = this.getPassLabel(passName);
    }

    // Update active button states
    const group = this.container.querySelector(`.pass-buttons[data-side="${side}"]`);
    if (group) {
      group.querySelectorAll('.btn-pass').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.pass === passName);
      });
    }
  }

  bindEvents() {
    const getPercentageFromClientX = (clientX) => {
      const rect = this.wrapper.getBoundingClientRect();
      const x = clientX - rect.left;
      return (x / rect.width) * 100;
    };

    // Mouse drag
    const onMouseDown = (e) => {
      this.isDragging = true;
      this.wrapper.classList.add('is-dragging');
      this.updatePosition(getPercentageFromClientX(e.clientX));
      e.preventDefault();
    };

    const onMouseMove = (e) => {
      if (!this.isDragging) return;
      this.updatePosition(getPercentageFromClientX(e.clientX));
    };

    const onMouseUp = () => {
      if (this.isDragging) {
        this.isDragging = false;
        this.wrapper.classList.remove('is-dragging');
      }
    };

    this.wrapper.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Touch drag
    this.wrapper.addEventListener('touchstart', (e) => {
      this.isDragging = true;
      this.wrapper.classList.add('is-dragging');
      this.updatePosition(getPercentageFromClientX(e.touches[0].clientX));
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!this.isDragging || !e.touches[0]) return;
      this.updatePosition(getPercentageFromClientX(e.touches[0].clientX));
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.isDragging = false;
      this.wrapper.classList.remove('is-dragging');
    });

    // Keyboard accessibility
    this.wrapper.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.updatePosition(this.position - 5);
        e.preventDefault();
      } else if (e.key === 'ArrowRight') {
        this.updatePosition(this.position + 5);
        e.preventDefault();
      } else if (e.key === 'Home') {
        this.updatePosition(0);
        e.preventDefault();
      } else if (e.key === 'End') {
        this.updatePosition(100);
        e.preventDefault();
      }
    });

    // Button Clicks for Pass Switching
    this.container.querySelectorAll('.btn-pass').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const side = btn.closest('.pass-buttons').dataset.side;
        const pass = btn.dataset.pass;
        this.setPass(side, pass);
      });
    });
  }
}

// Attach globally
window.RenderComparisonSlider = RenderComparisonSlider;
