/**
 * Interactive 3D Shader & Material Lab
 * A live interactive shader sandbox demonstrating GLSL custom vertex & fragment shaders,
 * noise displacement, Fresnel chromatic fringes, and real-time GUI parameters.
 */

class ShaderLab {
  constructor(canvasContainerId) {
    this.container = document.getElementById(canvasContainerId);
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.mesh = null;
    this.material = null;
    this.uniforms = null;
    this.clock = new THREE.Clock();

    // Shader Parameters
    this.params = {
      frequency: 2.2,
      amplitude: 0.45,
      speed: 1.0,
      wireframe: false,
      colorPalette: 'cyber', // cyber, prismatic, deepSea, goldPlasma
      roughness: 0.2
    };

    this.init();
  }

  init() {
    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    this.camera.position.set(0, 0, 4.5);

    // 2. Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    // 3. Create Custom Shader Mesh
    this.createShaderMesh();

    // 4. Setup Controls and Events
    this.setupUIControls();
    this.bindEvents();

    // 5. Render Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  createShaderMesh() {
    // 3D Icosahedron with fine subdivision for vertex displacement
    const geometry = new THREE.IcosahedronGeometry(1.6, 64);

    // GLSL Vertex & Fragment Shaders with Simplex Noise & Fresnel
    const vertexShader = `
      uniform float uTime;
      uniform float uFrequency;
      uniform float uAmplitude;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec2 vUv;
      varying float vDisplacement;

      // Simplex 3D noise generator
      vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
      vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

      float snoise(vec3 v){
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i  = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min( g.xyz, l.zxy );
        vec3 i2 = max( g.xyz, l.zxy );
        vec3 x1 = x0 - i1 + 1.0 * C.xxx;
        vec3 x2 = x0 - i2 + 2.0 * C.xxx;
        vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
        i = mod(i, 289.0 );
        vec4 p = permute( permute( permute(
                  i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
        float n_ = 0.142857142857;
        vec3  ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z.xxxx);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_ );
        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4( x.xy, y.xy );
        vec4 b1 = vec4( x.zw, y.zw );
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
      }

      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        
        // Compute procedural noise displacement along normal
        float noise = snoise(position * uFrequency + vec3(uTime * 0.4));
        vDisplacement = noise;
        vec3 newPosition = position + normal * (noise * uAmplitude);
        
        vPosition = (modelViewMatrix * vec4(newPosition, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float uTime;
      uniform int uPalette;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec2 vUv;
      varying float vDisplacement;

      void main() {
        vec3 viewDir = normalize(-vPosition);
        vec3 normal = normalize(vNormal);

        // Fresnel Rim Glow
        float fresnel = pow(1.0 - max(0.0, dot(viewDir, normal)), 2.8);

        vec3 colorA;
        vec3 colorB;
        vec3 colorRim;

        if (uPalette == 0) {
          // Cyber Neon (Cyan, Magenta, Gold)
          colorA = vec3(0.02, 0.08, 0.16);
          colorB = vec3(0.0, 0.94, 1.0);
          colorRim = vec3(1.0, 0.0, 0.48);
        } else if (uPalette == 1) {
          // Prismatic Glass (Rainbow iridescence)
          colorA = vec3(0.12, 0.05, 0.22);
          colorB = vec3(0.2, 0.8, 0.9);
          colorRim = vec3(1.0, 0.65, 0.1);
        } else if (uPalette == 2) {
          // Deep Sea Bioluminescence (Teal, Emerald, Ultraviolet)
          colorA = vec3(0.01, 0.04, 0.08);
          colorB = vec3(0.05, 0.75, 0.6);
          colorRim = vec3(0.3, 0.95, 0.9);
        } else {
          // Golden Plasma (Molten gold, amber flare)
          colorA = vec3(0.15, 0.03, 0.01);
          colorB = vec3(1.0, 0.45, 0.05);
          colorRim = vec3(1.0, 0.85, 0.2);
        }

        // Blend colors based on vertex displacement
        float t = smoothstep(-0.4, 0.5, vDisplacement);
        vec3 baseColor = mix(colorA, colorB, t);

        // Add specular rim glow
        vec3 finalColor = baseColor + colorRim * fresnel * 1.8;

        // Subtle Grid scanline overlay
        float scanline = sin(vPosition.y * 35.0 + uTime * 2.0) * 0.04;
        finalColor += vec3(scanline);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    this.uniforms = {
      uTime: { value: 0 },
      uFrequency: { value: this.params.frequency },
      uAmplitude: { value: this.params.amplitude },
      uPalette: { value: 0 } // 0: cyber, 1: prismatic, 2: deepSea, 3: goldPlasma
    };

    this.material = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: this.uniforms,
      wireframe: this.params.wireframe
    });

    this.mesh = new THREE.Mesh(geometry, this.material);
    this.scene.add(this.mesh);
  }

  setupUIControls() {
    // Frequency
    const freqSlider = document.getElementById('sl-freq');
    const freqVal = document.getElementById('sl-freq-val');
    if (freqSlider) {
      freqSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        this.uniforms.uFrequency.value = val;
        if (freqVal) freqVal.textContent = val.toFixed(1);
      });
    }

    // Amplitude
    const ampSlider = document.getElementById('sl-amp');
    const ampVal = document.getElementById('sl-amp-val');
    if (ampSlider) {
      ampSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        this.uniforms.uAmplitude.value = val;
        if (ampVal) ampVal.textContent = val.toFixed(2);
      });
    }

    // Speed
    const speedSlider = document.getElementById('sl-speed');
    const speedVal = document.getElementById('sl-speed-val');
    if (speedSlider) {
      speedSlider.addEventListener('input', (e) => {
        this.params.speed = parseFloat(e.target.value);
        if (speedVal) speedVal.textContent = this.params.speed.toFixed(1) + 'x';
      });
    }

    // Wireframe Toggle
    const wireframeBtn = document.getElementById('sl-wireframe-btn');
    if (wireframeBtn) {
      wireframeBtn.addEventListener('click', () => {
        this.material.wireframe = !this.material.wireframe;
        wireframeBtn.classList.toggle('active', this.material.wireframe);
      });
    }

    // Palette Selector
    const paletteSelect = document.getElementById('sl-palette');
    if (paletteSelect) {
      paletteSelect.addEventListener('change', (e) => {
        this.setPalette(e.target.value);
      });
    }

    // Presets
    document.querySelectorAll('.sl-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const preset = btn.dataset.preset;
        this.applyPreset(preset);
        document.querySelectorAll('.sl-preset-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  }

  setPalette(name) {
    const map = { cyber: 0, prismatic: 1, deepSea: 2, goldPlasma: 3 };
    this.uniforms.uPalette.value = map[name] !== undefined ? map[name] : 0;
  }

  applyPreset(presetName) {
    const presets = {
      cyberCore: { freq: 2.2, amp: 0.45, speed: 1.0, palette: 'cyber', wire: false },
      quantumCrystal: { freq: 4.0, amp: 0.25, speed: 0.6, palette: 'prismatic', wire: false },
      wireGrid: { freq: 1.5, amp: 0.65, speed: 1.4, palette: 'cyber', wire: true },
      moltenGold: { freq: 1.2, amp: 0.75, speed: 1.8, palette: 'goldPlasma', wire: false },
      abyssalBio: { freq: 3.1, amp: 0.50, speed: 0.8, palette: 'deepSea', wire: false }
    };

    const cfg = presets[presetName];
    if (!cfg) return;

    this.uniforms.uFrequency.value = cfg.freq;
    this.uniforms.uAmplitude.value = cfg.amp;
    this.params.speed = cfg.speed;
    this.setPalette(cfg.palette);
    this.material.wireframe = cfg.wire;

    // Update UI Elements
    const freqEl = document.getElementById('sl-freq');
    const ampEl = document.getElementById('sl-amp');
    const speedEl = document.getElementById('sl-speed');
    const paletteEl = document.getElementById('sl-palette');
    const wireBtn = document.getElementById('sl-wireframe-btn');

    if (freqEl) freqEl.value = cfg.freq;
    if (ampEl) ampEl.value = cfg.amp;
    if (speedEl) speedEl.value = cfg.speed;
    if (paletteEl) paletteEl.value = cfg.palette;
    if (wireBtn) wireBtn.classList.toggle('active', cfg.wire);

    const freqVal = document.getElementById('sl-freq-val');
    const ampVal = document.getElementById('sl-amp-val');
    const speedVal = document.getElementById('sl-speed-val');
    if (freqVal) freqVal.textContent = cfg.freq.toFixed(1);
    if (ampVal) ampVal.textContent = cfg.amp.toFixed(2);
    if (speedVal) speedVal.textContent = cfg.speed.toFixed(1) + 'x';
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      if (!this.container) return;
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    });
  }

  animate() {
    requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();
    this.uniforms.uTime.value += delta * this.params.speed;

    if (this.mesh) {
      this.mesh.rotation.y += 0.005 * this.params.speed;
      this.mesh.rotation.x += 0.003 * this.params.speed;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// Attach globally
window.ShaderLab = ShaderLab;
