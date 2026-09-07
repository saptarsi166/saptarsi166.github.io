/**
 * Three.js Interactive 3D Hero Viewport
 * Real-time 3D procedural geometries, shader materials, lighting presets,
 * particle dust field, mouse inertia, and interactive HUD controls.
 */

class HeroViewport3D {
  constructor(canvasContainerId) {
    this.container = document.getElementById(canvasContainerId);
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.mesh = null;
    this.particles = null;
    this.lights = [];
    
    // State
    this.currentGeometryType = 'torusKnot';
    this.currentMaterialType = 'chrome';
    this.isWireframe = false;
    this.autoRotate = true;
    this.rotationSpeed = 0.006;
    this.targetRotation = { x: 0, y: 0 };
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0, isDown: false, prevX: 0, prevY: 0 };
    
    this.init();
  }

  init() {
    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x06080d, 0.035);

    // 2. Camera
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    this.camera.position.set(0, 0, 6.2);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    this.container.appendChild(this.renderer.domElement);

    // 4. Lights
    this.setupLights();

    // 5. Create Core Mesh & Particles
    this.createMesh();
    this.createParticles();

    // 6. Event Listeners
    this.bindEvents();

    // 7. Start Render Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  setupLights() {
    const ambientLight = new THREE.AmbientLight(0x0a101d, 1.5);
    this.scene.add(ambientLight);

    // Key Light (Cyan)
    const keyLight = new THREE.PointLight(0x00f0ff, 4.5, 20);
    keyLight.position.set(4, 3, 4);
    this.scene.add(keyLight);
    this.lights.push(keyLight);

    // Fill Light (Neon Magenta)
    const fillLight = new THREE.PointLight(0xff0077, 4.0, 20);
    fillLight.position.set(-4, -2, 3);
    this.scene.add(fillLight);
    this.lights.push(fillLight);

    // Rim / Accent Light (Amber Gold)
    const rimLight = new THREE.DirectionalLight(0xffaa00, 2.8);
    rimLight.position.set(0, 5, -4);
    this.scene.add(rimLight);
    this.lights.push(rimLight);
  }

  getGeometry(type) {
    switch (type) {
      case 'torusKnot':
        return new THREE.TorusKnotGeometry(1.4, 0.42, 160, 36, 2, 3);
      case 'icosahedron':
        return new THREE.IcosahedronGeometry(1.85, 2);
      case 'sphere':
        return new THREE.SphereGeometry(1.7, 64, 48);
      case 'octahedron':
        return new THREE.OctahedronGeometry(1.8, 3);
      default:
        return new THREE.TorusKnotGeometry(1.4, 0.42, 160, 36, 2, 3);
    }
  }

  getMaterial(type, isWireframe) {
    switch (type) {
      case 'chrome':
        return new THREE.MeshStandardMaterial({
          color: 0x182436,
          metalness: 0.95,
          roughness: 0.12,
          wireframe: isWireframe,
          emissive: 0x001528,
          emissiveIntensity: 0.2
        });
      case 'clay':
        return new THREE.MeshStandardMaterial({
          color: 0xdcdfe4,
          metalness: 0.05,
          roughness: 0.75,
          wireframe: isWireframe
        });
      case 'normal':
        return new THREE.MeshNormalMaterial({
          wireframe: isWireframe
        });
      case 'hologram':
        return new THREE.MeshPhysicalMaterial({
          color: 0x00f0ff,
          emissive: 0x004455,
          metalness: 0.1,
          roughness: 0.1,
          transmission: 0.75,
          thickness: 1.2,
          transparent: true,
          opacity: 0.85,
          wireframe: isWireframe
        });
      default:
        return new THREE.MeshStandardMaterial({
          color: 0x1a2638,
          metalness: 0.9,
          roughness: 0.15,
          wireframe: isWireframe
        });
    }
  }

  createMesh() {
    if (this.mesh) {
      this.scene.remove(this.mesh);
      this.mesh.geometry.dispose();
      if (Array.isArray(this.mesh.material)) {
        this.mesh.material.forEach(m => m.dispose());
      } else {
        this.mesh.material.dispose();
      }
    }

    const geometry = this.getGeometry(this.currentGeometryType);
    const material = this.getMaterial(this.currentMaterialType, this.isWireframe);

    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);
  }

  createParticles() {
    const particleCount = 750;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const palette = [
      new THREE.Color(0x00f0ff),
      new THREE.Color(0xff0077),
      new THREE.Color(0xffaa00),
      new THREE.Color(0x38bdf8)
    ];

    for (let i = 0; i < particleCount; i++) {
      const radius = 3.5 + Math.random() * 8.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.035,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  bindEvents() {
    // Mouse Move & Hover
    window.addEventListener('mousemove', (e) => {
      const rect = this.container.getBoundingClientRect();
      this.mouse.targetX = ((e.clientX - rect.left) / this.container.clientWidth) * 2 - 1;
      this.mouse.targetY = -(((e.clientY - rect.top) / this.container.clientHeight) * 2 - 1);
    });

    // Mouse Drag Rotation
    this.container.addEventListener('mousedown', (e) => {
      this.mouse.isDown = true;
      this.mouse.prevX = e.clientX;
      this.mouse.prevY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      this.mouse.isDown = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.mouse.isDown) return;
      const deltaX = e.clientX - this.mouse.prevX;
      const deltaY = e.clientY - this.mouse.prevY;
      this.targetRotation.y += deltaX * 0.008;
      this.targetRotation.x += deltaY * 0.008;
      this.mouse.prevX = e.clientX;
      this.mouse.prevY = e.clientY;
    });

    // Touch Support
    this.container.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.mouse.isDown = true;
        this.mouse.prevX = e.touches[0].clientX;
        this.mouse.prevY = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.mouse.isDown = false;
    });

    window.addEventListener('touchmove', (e) => {
      if (!this.mouse.isDown || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - this.mouse.prevX;
      const deltaY = e.touches[0].clientY - this.mouse.prevY;
      this.targetRotation.y += deltaX * 0.008;
      this.targetRotation.x += deltaY * 0.008;
      this.mouse.prevX = e.touches[0].clientX;
      this.mouse.prevY = e.touches[0].clientY;
    }, { passive: true });

    // Resize
    window.addEventListener('resize', () => {
      if (!this.container) return;
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    });
  }

  // Public HUD Controls API
  setGeometry(type) {
    this.currentGeometryType = type;
    this.createMesh();
  }

  setMaterial(type) {
    this.currentMaterialType = type;
    this.createMesh();
  }

  toggleWireframe(state) {
    this.isWireframe = typeof state === 'boolean' ? state : !this.isWireframe;
    this.createMesh();
    return this.isWireframe;
  }

  toggleAutoRotate(state) {
    this.autoRotate = typeof state === 'boolean' ? state : !this.autoRotate;
    return this.autoRotate;
  }

  setSpeed(speed) {
    this.rotationSpeed = parseFloat(speed);
  }

  pulse() {
    if (!this.mesh) return;
    const initialScale = 1;
    const peakScale = 1.15;
    let t = 0;
    const interval = setInterval(() => {
      t += 0.1;
      const scale = initialScale + Math.sin(t * Math.PI) * (peakScale - initialScale);
      this.mesh.scale.set(scale, scale, scale);
      if (t >= 1) {
        this.mesh.scale.set(1, 1, 1);
        clearInterval(interval);
      }
    }, 16);
  }

  animate() {
    requestAnimationFrame(this.animate);

    // Smooth Mouse Interpolation
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    const time = performance.now() * 0.001;

    // Mesh Rotation
    if (this.mesh) {
      if (this.autoRotate && !this.mouse.isDown) {
        this.mesh.rotation.y += this.rotationSpeed;
        this.mesh.rotation.x += this.rotationSpeed * 0.5;
      }
      
      this.mesh.rotation.y += (this.targetRotation.y - this.mesh.rotation.y) * 0.08;
      this.mesh.rotation.x += (this.targetRotation.x - this.mesh.rotation.x) * 0.08;

      // Subtle parallax tilt from mouse
      this.mesh.position.x = this.mouse.x * 0.35;
      this.mesh.position.y = this.mouse.y * 0.25;
    }

    // Particle Swarm Orbit
    if (this.particles) {
      this.particles.rotation.y = time * 0.04;
      this.particles.rotation.x = Math.sin(time * 0.02) * 0.15;
    }

    // Orbiting Lights
    if (this.lights.length >= 2) {
      this.lights[0].position.x = Math.sin(time * 0.8) * 4.5;
      this.lights[0].position.z = Math.cos(time * 0.8) * 4.5;
      this.lights[1].position.x = Math.cos(time * 0.6) * 4.5;
      this.lights[1].position.z = Math.sin(time * 0.6) * 4.5;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// Attach globally
window.HeroViewport3D = HeroViewport3D;
