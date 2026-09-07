/**
 * Graphics Portfolio Projects Data Store
 * Contains project definitions, render passes (Beauty, Clay, Wireframe),
 * technical specifications, tools, and case study breakdowns.
 */

const PROJECTS = [
  {
    id: "aegis-09",
    title: "AEGIS-09: Tactical Cybernetic Mecha",
    subtitle: "Hard-surface AAA game asset & cinematic PBR texturing",
    category: "3d-art",
    categoryLabel: "3D Art & CGI",
    year: "2026",
    client: "Personal Showcase / Studio Pitch",
    role: "Lead 3D Hard-Surface & Texture Artist",
    thumbnail: "assets/images/mecha-beauty.jpg",
    featured: true,
    passes: {
      beauty: "assets/images/mecha-beauty.jpg",
      clay: "assets/images/mecha-clay.jpg",
      wireframe: "assets/images/mecha-wireframe.jpg"
    },
    metrics: {
      triangles: "316,400 (Cinematic) / 48,200 (LOD0 Game)",
      textureSets: "4x 8K UDIM (PBR Metallic/Roughness)",
      drawCalls: "1 (Optimized Merged Atlas)",
      renderEngine: "Cycles / Unreal Engine 5.4 Lumen"
    },
    tools: [
      { name: "Blender 4.2", color: "#f5792a" },
      { name: "Substance Painter", color: "#e83929" },
      { name: "ZBrush", color: "#8a5c36" },
      { name: "Unreal Engine 5", color: "#0078d4" },
      { name: "Marmoset Toolbag", color: "#259b85" }
    ],
    tags: ["Hard-Surface", "Sub-D Modeling", "PBR Shading", "Game Ready", "Cyberpunk"],
    overview: "A flagship tactical cybernetic helmet designed for next-generation cinematic game engines. Built with strict quad topology sub-D workflows, carbon fiber structural laminates, dual-aperture sensor optics, and realistic mechanical ventilation housings.",
    challenges: "Balancing cinematic-level micro-bevels with game-ready edge flow. Required intricate non-destructive modifier stacks in Blender, curvature baking in Marmoset, and high-frequency carbon fiber weave maps in Substance Painter.",
    breakdown: [
      "Sub-D Topology: 100% quad mesh flow along critical silhouette curves with zero pinching on complex compound fillets.",
      "Optics System: Dual-chamber chromatic sensor glass with internal refraction, micro-OLED heads-up display mounts, and amber telemetry rings.",
      "Material Hierarchy: High-modulus clear-coated carbon fiber weave, matte titanium casing with EDM wire-cut finish, and silicone weather gaskets.",
      "Real-time Lighting: Tuned for real-time emission in Unreal Engine 5 Lumen with specular occlusion to eliminate light leaks."
    ]
  },
  {
    id: "neo-shinjuku",
    title: "NEO-SHINJUKU: Volumetric Cyber Alley",
    subtitle: "Cinematic real-time environment with dynamic Lumen lighting & rain shaders",
    category: "environment",
    categoryLabel: "Environment & Lighting",
    year: "2026",
    client: "Short Film VFX / Unreal Engine Tech Demo",
    role: "Environment Artist & Lighting Specialist",
    thumbnail: "assets/images/cyberpunk-city.jpg",
    featured: true,
    passes: {
      beauty: "assets/images/cyberpunk-city.jpg",
      clay: "assets/images/cyberpunk-city.jpg",
      wireframe: "assets/images/cyberpunk-city.jpg"
    },
    metrics: {
      framerate: "60 FPS @ 4K (RTX 4080 / DLSS 3.5)",
      lighting: "Unreal Engine 5 Lumen (Hardware RT)",
      geometry: "Nanite Virtualized Meshes (35M Traces)",
      atmosphere: "Volumetric Fog & Niagara Rain Particles"
    },
    tools: [
      { name: "Unreal Engine 5", color: "#0078d4" },
      { name: "Houdini (Puddles/Wires)", color: "#ff6600" },
      { name: "Quixel Megascans", color: "#0f80e6" },
      { name: "DaVinci Resolve", color: "#de3a48" }
    ],
    tags: ["Real-time", "Lumen GI", "Nanite", "Atmospheric VFX", "Niagara"],
    overview: "A dense, rain-slicked cyberpunk alleyway set in 2088 Neo-Tokyo. Features fully dynamic global illumination, multi-layer refractive neon signages, screen-space water ripple solvers, and atmospheric volumetric mist.",
    challenges: "Managing thousands of emissive neon lights without severe GPU memory throttling. Solved through emissive surface caching, grouped light profiles, and custom vertex-painted puddle masks with anisotropic wetness highlights.",
    breakdown: [
      "Dynamic Surface Wetness: Multi-layered master material blending dry asphalt, damp grit, and standing puddles with animated normal ripples.",
      "Holographic Signage: Custom GLSL/HLSL pixel shaders simulating CRT scanlines, chromatic aberration, and sub-pixel phosphors.",
      "Volumetric Rain & Steam: Niagara GPU particle system interacting with collision depth buffers for realistic ground splatters."
    ]
  },
  {
    id: "chroma-fractal",
    title: "CHROMA FRACTAL: Spectral Raymarching",
    subtitle: "Real-time WebGL/GLSL 4D quaternion fractal shader with dispersion",
    category: "shaders",
    categoryLabel: "Shaders & Procedural",
    year: "2026",
    client: "Open Source / Interactive Web Art",
    role: "Creative Technologist & Shader Programmer",
    thumbnail: "assets/images/crystal-fractal.jpg",
    featured: true,
    passes: {
      beauty: "assets/images/crystal-fractal.jpg",
      clay: "assets/images/crystal-fractal.jpg",
      wireframe: "assets/images/crystal-fractal.jpg"
    },
    metrics: {
      performance: "120 FPS on Desktop / 60 FPS Mobile",
      algorithm: "Signed Distance Field (SDF) Sphere Tracing",
      codeSize: "Under 12KB GLSL Shader Program",
      technology: "WebGL 2.0 / GLSL ES 3.0"
    },
    tools: [
      { name: "GLSL", color: "#5586a4" },
      { name: "Three.js", color: "#000000" },
      { name: "WebGL 2.0", color: "#990000" },
      { name: "Shadertoy", color: "#222222" }
    ],
    tags: ["GLSL", "Raymarching", "SDF", "Caustics", "Chromatic Dispersion"],
    overview: "An exploratory mathematical raymarching engine rendering an infinite 4D quaternion fractal crystal. Utilizes analytic distance estimators, spectral rainbow dispersion, and internal total internal reflection.",
    challenges: "Raymarching complex non-Euclidean distance fields without step-skipping artifacts or excessive GPU iteration counts.",
    breakdown: [
      "Analytic Distance Estimator: Dynamic step over-relaxation algorithm cutting raymarching iterations by 45%.",
      "Cauchy Dispersion Formula: Simulates wavelength-dependent index of refraction for authentic spectral prismatic fringes.",
      "Interactive Matrix Transform: Direct gyroscope and mouse pointer orientation binding for tactile exploration."
    ]
  },
  {
    id: "vortex-fluid",
    title: "VORTEX KINETIC: Liquid Chrome Simulation",
    subtitle: "High-viscosity FLIP fluid simulation & procedural ribbon solvers",
    category: "motion",
    categoryLabel: "Motion Graphics",
    year: "2026",
    client: "Global Tech Launch / Visual ID",
    role: "Houdini FX Artist & Motion Designer",
    thumbnail: "assets/images/kinetic-fluid.jpg",
    featured: true,
    passes: {
      beauty: "assets/images/kinetic-fluid.jpg",
      clay: "assets/images/kinetic-fluid.jpg",
      wireframe: "assets/images/kinetic-fluid.jpg"
    },
    metrics: {
      particles: "14.8 Million FLIP Particles",
      simTime: "4.2 Hours on Dual RTX 4090",
      resolution: "4K 60fps ProRes 4444XQ",
      renderEngine: "Houdini Solaris / Karma XPU"
    },
    tools: [
      { name: "Houdini 20", color: "#ff6600" },
      { name: "Karma XPU", color: "#3282b8" },
      { name: "After Effects", color: "#9999ff" },
      { name: "VEX Scripting", color: "#1b262c" }
    ],
    tags: ["Houdini", "FLIP Fluids", "Karma XPU", "Motion Graphics", "Procedural"],
    overview: "Kinetic brand sculpture combining liquid mercury fluid dynamics with high-energy luminescent neon velocity ribbons. Created for an international product keynote visual identity.",
    challenges: "Achieving razor-thin liquid sheets without surface mesh tearing during turbulent rotational acceleration.",
    breakdown: [
      "Adaptive FLIP Meshing: VEX-driven particle remeshing preserving capillary droplet dispersion and micro-splashes.",
      "Velocity-Coupled Ribbons: Dual-torus curves sweeping along the curl-noise fluid velocity vectors with emissive falloff.",
      "Studio Lighting: High-contrast HDRI map paired with custom directional rim gobos to highlight specular highlights."
    ]
  },
  {
    id: "aura-webgl",
    title: "AURA: Real-time GPU Particle Cosmos",
    subtitle: "Interactive WebGL 3D sound-reactive visualizer and particle physics",
    category: "webgl",
    categoryLabel: "Real-time & WebGL",
    year: "2026",
    client: "Interactive Web Experience",
    role: "WebGL Engineer & Technical Artist",
    thumbnail: "assets/images/crystal-fractal.jpg",
    featured: false,
    passes: {
      beauty: "assets/images/crystal-fractal.jpg",
      clay: "assets/images/crystal-fractal.jpg",
      wireframe: "assets/images/crystal-fractal.jpg"
    },
    metrics: {
      particleCount: "1,000,000 GPU Particles",
      runtime: "WebGPU / WebGL Fallback",
      bandwidth: "Under 1.5MB Initial Load",
      controls: "Pointer Attraction, Vortex Force, Color Presets"
    },
    tools: [
      { name: "Three.js", color: "#000000" },
      { name: "WebGPU", color: "#5c33f6" },
      { name: "TypeScript", color: "#3178c6" },
      { name: "Web Audio API", color: "#10b981" }
    ],
    tags: ["Three.js", "WebGPU", "Particles", "Audio Reactive", "Real-Time"],
    overview: "A million-particle simulation calculating position and velocity updates directly inside GPU compute shaders. Features interactive gravity fields, curl noise turbulence, and frequency band audio reaction.",
    challenges: "Delivering instantaneous 60fps interactivity across integrated laptop GPUs without CPU thread bottlenecking.",
    breakdown: [
      "GPGPU / Compute Shaders: Dual ping-pong framebuffer textures updating particle coordinates purely on the GPU.",
      "Spatial Octree Optimization: Frustum culling and point density LOD scaling based on camera distance.",
      "Custom Post-Processing: Optimized single-pass bloom and depth of field shader pipeline."
    ]
  },
  {
    id: "valkyrie-concept",
    title: "VALKYRIE: Hard-Surface Chassis Study",
    subtitle: "Sub-D topology study and industrial design functional joint analysis",
    category: "3d-art",
    categoryLabel: "3D Art & CGI",
    year: "2025",
    client: "Sci-Fi IP Worldbuilding",
    role: "Concept & 3D Modeler",
    thumbnail: "assets/images/mecha-beauty.jpg",
    featured: false,
    passes: {
      beauty: "assets/images/mecha-beauty.jpg",
      clay: "assets/images/mecha-clay.jpg",
      wireframe: "assets/images/mecha-wireframe.jpg"
    },
    metrics: {
      geometry: "High-D Sub-D (Zero Tris in Primary Silhouettes)",
      detailing: "Custom Floating Geometry & DecalMachine",
      materials: "Dielectric Powder Coat & Anodized Alloys"
    },
    tools: [
      { name: "Blender", color: "#f5792a" },
      { name: "Plasticity CAD", color: "#1a73e8" },
      { name: "Substance Painter", color: "#e83929" }
    ],
    tags: ["Hard-Surface", "CAD Modeling", "Industrial Design", "Topology"],
    overview: "An exploration of production-grade functional articulation in speculative robotics. Combines CAD surface fillets with traditional polygonal edge flows for mechanical integrity.",
    challenges: "Merging precision NURBS/CAD booleans into clean quad meshes for deformation and UV unwrapping.",
    breakdown: [
      "Hybrid CAD-to-Polygonal Pipeline: Precision fillets modeled in Plasticity and re-topologized with automated and manual quad flows.",
      "Micro-Mechanical Detailing: Functional hydraulic hose channels, recessed fastener countersinks, and serial stampings.",
      "Wear & Tear Micro-Surface: Subtle edge wear, grease accumulation around pivot bearings, and protective ceramic baked enamel."
    ]
  }
];

const SKILLS_DATA = {
  categories: [
    {
      title: "3D Modeling & DCC Software",
      icon: "box",
      skills: [
        { name: "Blender 4.x (Sub-D, Geometry Nodes)", level: 95 },
        { name: "Unreal Engine 5 (Lumen, Nanite, PCG)", level: 92 },
        { name: "Houdini (SOPs, FLIP, VEX)", level: 85 },
        { name: "Substance 3D Painter & Designer", level: 94 },
        { name: "ZBrush (Sculpting & Retopology)", level: 88 },
        { name: "Marmoset Toolbag (Baking & LookDev)", level: 96 }
      ]
    },
    {
      title: "Real-time Graphics & WebGL",
      icon: "cpu",
      skills: [
        { name: "Three.js & WebGL 2.0", level: 94 },
        { name: "GLSL / HLSL Custom Shaders", level: 90 },
        { name: "Real-time Optimization & LODs", level: 96 },
        { name: "Post-Processing & Bloom FX", level: 92 },
        { name: "Linear Algebra & 3D Math", level: 90 },
        { name: "WebGPU & Compute Shaders", level: 82 }
      ]
    },
    {
      title: "Lighting, Texturing & Artistry",
      icon: "sun",
      skills: [
        { name: "PBR Material Authoring", level: 98 },
        { name: "Cinematic Studio & HDR Lighting", level: 94 },
        { name: "UV Unwrapping & UDIM Workflows", level: 95 },
        { name: "Color Science (ACES / AgX / Filmic)", level: 90 },
        { name: "Look Development & Art Direction", level: 92 }
      ]
    }
  ],
  stats: [
    { number: "8+", label: "Years in 3D & Graphics" },
    { number: "45+", label: "Shipped Projects & Studies" },
    { number: "1M+", label: "Real-time Particles Simulated" },
    { number: "60+", label: "FPS Real-time Benchmark Standard" }
  ]
};

const TIMELINE_DATA = [
  {
    year: "2024 - Present",
    role: "Senior 3D & Technical Artist",
    company: "Apex Interactive / Independent",
    description: "Engineering high-fidelity real-time 3D assets, custom WebGL/Three.js interactive web apps, and Unreal Engine 5 cinematic environments for leading brands and game studios."
  },
  {
    year: "2022 - 2024",
    role: "3D Generalist & Shading Specialist",
    company: "Voxel Creative Studios",
    description: "Led hard-surface modeling, procedural material development, and lighting for commercial visual effects, game pitches, and product visualization."
  },
  {
    year: "2020 - 2022",
    role: "Real-time Graphics & WebGL Developer",
    company: "Nexus Digital Labs",
    description: "Developed browser-based 3D experiences, custom GLSL shaders, and interactive 3D product configurators handling complex geometry."
  },
  {
    year: "Featured Honors",
    role: "Awards & Recognitions",
    company: "Industry Recognition",
    description: "• Awwwards Site of the Day (3D Interaction)\n• ArtStation Trending Showcase\n• Shadertoy Featured Shader Algorithm\n• Unreal Engine Community Spotlight"
  }
];
