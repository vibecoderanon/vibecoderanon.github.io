# vibecoderanon // Homebrew & Tools Hub

[![Live Site: vibecoderanon.github.io](https://img.shields.io/badge/Live_Site-vibecoderanon.github.io-06b6d4.svg)](https://vibecoderanon.github.io/)
[![Platform: Web / Switch / 3DS](https://img.shields.io/badge/Platforms-Web_%2F_Switch_%2F_3DS-e60012.svg)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-success.svg)](LICENSE)

A unified web portal and interactive suite showcasing homebrew applications, reverse-engineering save editors, and display plugins developed by **vibecoderanon**.

---

## Live Tools & Showcases

1. **Skyward Sword HD Save Editor (SSSE):**
   - Pure client-side binary editor for Nintendo Switch `wiiking2.sav`.
   - Modifies hero name, rupees, quarter-heart containers, and pouch equipment.
   - Live IEEE 802.3 CRC32 recalculator producing corruption-free save exports.

2. **Xenoblade Chronicles Save Tool (XCDE Suite):**
   - In-browser Wii (`SX4E`) to Switch (`XC:DE`) save converter and stat inspector.
   - Translates character levels, EXP, AP, play time, and money.
   - Pre-clear system save template preservation (retains classic title screen without endgame spoilers).

3. **Kickass Homebrew:**
   - 60 FPS animated retro synthwave canvas visualizer with 3D undulating WordArt.
   - Direct 1-click download of `kickass-homebrew.nro` and `kickass-homebrew.xml`.
   - Step-by-step SD card installation guide for Switch Custom Firmware (`sdmc:/switch/`).

4. **Sharpscale Multi-Console Suite:**
   - Interactive before/after split-screen slider comparing stock hardware bilinear blur against nearest-neighbor integer scaling and AMD Contrast Adaptive Sharpening (CAS).
   - Architectural deep-dive for Switch (`Sharpscale-NX`) and 3DS (`Sharpscale-3DS`).
   - Links to automated devkitPro CI release builds.

---

## App Pipeline: Adding New Apps in the Future

Adding a new application to this portal requires **zero layout or code refactoring**. Simply append a new entry to [`data/apps.json`](data/apps.json):

```json
{
  "id": "my-new-app",
  "name": "My New Homebrew",
  "shortName": "NewHB",
  "icon": "🚀",
  "accentColor": "#10b981",
  "category": "Switch Homebrew",
  "platforms": ["Switch"],
  "tagline": "Short description of the homebrew",
  "description": "Extended multi-sentence summary of functionality.",
  "badge": "New Release",
  "version": "v1.0.0",
  "actionType": "preview",
  "repoUrl": "https://github.com/vibecoderanon/my-new-app",
  "downloads": [
    {
      "label": "Download .NRO",
      "filename": "my-new-app.nro",
      "path": "apps/my-new-app/downloads/my-new-app.nro",
      "size": "4.2 MB",
      "primary": true
    }
  ],
  "features": [
    "Feature 1 description",
    "Feature 2 description",
    "Feature 3 description"
  ]
}
```

The portal automatically registers the card, updates search indexes, connects category chips, and handles modal routing!

---

## Local Development & Testing

Since the portal is built using native ES modules and client-side web APIs without complex build chains, you can run it locally with any standard static HTTP server:

```bash
# Python
python -m http.server 8080

# Or Node.js
npx serve .
```

Open `http://localhost:8080` in your browser.

---

## Automated Deployment (GitHub Pages)

The repository includes a GitHub Actions workflow ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)) that automatically deploys changes pushed to the `main` branch directly to:
**`https://vibecoderanon.github.io/`**
