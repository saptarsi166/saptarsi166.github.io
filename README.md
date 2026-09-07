# VORTEX // 3D & Graphics Portfolio

A high-performance, interactive portfolio website engineered specifically for 3D generalists, technical artists, hard-surface modelers, and real-time shader developers.

---

## 🌟 Highlights & Signature Features

1. **Interactive 3D Hero Viewport (Three.js)**
   - Real-time 3D procedural geometry responding to mouse tracking, inertia, and user rotation.
   - On-canvas HUD controls: switch between geometries (Torus Knot, Crystal, Sphere, Prism) and shading modes (PBR Chrome, Matte Clay, Normal Vectors, Hologram).
   - Real-time wireframe toggle and auto-rotation controls.

2. **Signature Multi-Pass Render Comparison Slider**
   - Essential for proving topology and shading competence.
   - Interactive draggable split divider comparing **Beauty Pass (PBR)** vs **Clay / Ambient Occlusion** vs **Wireframe Mesh Topology**.
   - On-the-fly pass switcher buttons for both left and right sides.
   - Arrow keys (`Left` / `Right`) accessibility support.

3. **Interactive 3D Shader & Material Lab**
   - Live procedural GLSL vertex displacement and fragment Fresnel caustics running in real time on the GPU.
   - Interactive UI sliders for Noise Frequency, Displacement Amplitude, and Turbulence Speed.
   - Built-in presets: *Cyber Core*, *Quantum Crystal*, *Wire Grid*, *Molten Gold*, and *Abyssal Bio*.

4. **Filterable Project Showcase & In-Depth Case Study Modal**
   - Categorized by: *3D Art & CGI*, *Environment & Lighting*, *Shaders & Procedural*, *Motion Graphics*, and *Real-time & WebGL*.
   - Deep-dive case study modal with technical specs (triangles, UDIM sets, draw calls, engines), software badges, artistic challenges, and pipeline breakdown.

5. **Multi-Theme System with LocalStorage Persistence**
   - **Cyber Neon**: Deep cyan and hot magenta sci-fi aesthetic.
   - **Obsidian Gold**: Champagne gold and warm brass luxury look.
   - **Ethereal Hologram**: Cosmic violet and ultraviolet luminescence.
   - **Monochrome Studio**: High-contrast editorial monochrome.

6. **Interactive Commission Estimator & Contact Form**
   - Real-time investment and timeline calculator based on project type, scope, and urgency.
   - "Pre-fill Into Contact Form" button transfer.
   - One-click copy email button with animated toast notification.

---

## 🚀 Quick Start (Local Preview)

### Option 1: Direct File Launch
Simply double-click `index.html` in your file explorer to open it in any modern browser (Chrome, Edge, Firefox, Safari).

### Option 2: Local HTTP Server (Recommended)
Run Python's built-in lightweight web server from this directory:

```bash
# In PowerShell / Terminal:
cd "C:\Users\Saptarsi\.gemini\antigravity\scratch\graphics-portfolio"
python -m http.server 8000
```
Then visit `http://localhost:8000` in your web browser.

---

## 📁 Project Structure

```
graphics-portfolio/
├── index.html                  # Core semantic layout & HUD overlays
├── css/
│   ├── style.css               # Core typography, themes, navigation, hero
│   └── components.css          # Comparison slider, shader lab, modals, cards
├── js/
│   ├── projects-data.js        # Project database, metrics, skills, timeline
│   ├── three-hero.js           # Three.js 3D hero canvas & interactive controls
│   ├── comparison-slider.js    # Multi-pass render comparison slider
│   ├── shader-lab.js           # Live GLSL procedural shader sandbox
│   └── main.js                 # Theme switcher, gallery filters, modals, toast
├── assets/
│   └── images/                 # Beauty, clay, wireframe, and thumbnail renders
└── README.md                   # Documentation & customization guide
```

---

## 🎨 Customizing Your Portfolio

### 1. Updating Projects & Data
Open `js/projects-data.js` to modify:
- `PROJECTS`: Add, remove, or edit your 3D models, art passes, polycounts, and client roles.
- `SKILLS_DATA`: Update your software tools (Blender, Unreal, Houdini, ZBrush) and proficiency scores.
- `TIMELINE_DATA`: Update your career milestones and awards.

### 2. Changing Artist Name & Contact Email
1. In `index.html`, search for `SAPTARSI BANERJEE` or `VORTEX` and replace with your name / studio.
2. In `index.html`, search for `data-email="banerjeesaptarsi622@gmail.com"` to set your email.
3. In `js/main.js`, update the fallback email address if desired.

### 3. Adding Your Own Renders
Drop your images into `assets/images/` and update the paths in `js/projects-data.js`.
For best results with the comparison slider:
- Ensure the **Beauty**, **Clay**, and **Wireframe** images share the identical camera angle and resolution (e.g. 1920x1080).

---

## 🌐 Deploying to the Web

You can host this portfolio completely free on:
- **GitHub Pages**: Push this repository to GitHub and enable Pages under Settings > Pages.
- **Vercel**: Drag and drop the `graphics-portfolio` folder directly into Vercel dashboard.
- **Netlify**: Drag and drop the folder into Netlify Drop for instant 0-second deployment.
