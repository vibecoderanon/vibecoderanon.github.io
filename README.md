# vibecoderanon // Homebrew & Tools Hub

[![Launch Web Portal](https://img.shields.io/badge/🌐_Launch-vibecoderanon.github.io-06b6d4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://vibecoderanon.github.io/)
[![Platform: Web / Switch / 3DS / Wii](https://img.shields.io/badge/Platforms-Web_%2F_Switch_%2F_3DS_%2F_Wii-e60012.svg)](#)
[![Applications Hosted: 6](https://img.shields.io/badge/Apps_Hosted-6_Applications-10b981.svg)](#applications-directory)
[![Architecture: Static Zero--Backend](https://img.shields.io/badge/Architecture-Static_Zero--Backend-8b5cf6.svg)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-success.svg)](LICENSE)

A cyber-retro unified web portal and interactive homebrew hub engineered by **vibecoderanon**. The hub provides zero-backend, client-side web tools, 60 FPS canvas visualizers, reverse-engineering save editors, and 1-click SD card distribution packages for Nintendo Switch and Nintendo 3DS homebrew.

> [!TIP]
> **Launch the live web portal online:** **[https://vibecoderanon.github.io/](https://vibecoderanon.github.io/)**
> Every tool, save converter, visualizer, and download package can be launched directly in your browser with zero installation.

---

## Quick Navigation

- [🌐 Launch Live Web Portal](https://vibecoderanon.github.io/)
- [Applications Directory & Feature Matrix](#applications-directory)
- [Hosted Applications & Tools](#hosted-applications--tools)
  - [1. Deltarune Switch Save Editor](#1-deltarune-switch-save-editor)
  - [2. DELTARUNE Save Manager (Native C++)](#2-deltarune-save-manager-native-c)
  - [3. Skyward Sword HD Save Editor (SSSE)](#3-skyward-sword-hd-save-editor-ssse)
  - [4. Xenoblade Chronicles Save Tool (XCDE)](#4-xenoblade-chronicles-save-tool-xcde)
  - [5. Kickass Homebrew](#5-kickass-homebrew)
  - [6. Sharpscale Multi-Console Suite](#6-sharpscale-multi-console-suite)
- [Repository Structure](#repository-structure)
- [App Pipeline: Registering New Applications](#app-pipeline-registering-new-applications)
- [Local Development & Testing](#local-development--testing)
- [Automated Deployment (GitHub Pages)](#automated-deployment-github-pages)
- [Credits & Acknowledgments](#credits--acknowledgments)

---

## Applications Directory

| Application | Category | Platform | In-Browser Capability | Direct Web Portal Link | Source Repository |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Deltarune Switch Save Editor** | Save Editor | Switch | Full Chapters 1–5 party, item, and Darkner editor | [Launch Editor](https://vibecoderanon.github.io/#deltarune) | [deltarune-save-editor](https://github.com/vibecoderanon/deltarune-save-editor) |
| **DELTARUNE Save Manager** | Save Manager | Switch | NAND eMMC mounting preview & SD card bundles | [View Manager](https://vibecoderanon.github.io/#deltarune-manager) | [deltarune-save-manager](https://github.com/vibecoderanon/deltarune-save-manager) |
| **Skyward Sword HD Save Editor** | Save Editor | Switch | In-browser binary editor & CRC32 recalculator | [Launch SSSE](https://vibecoderanon.github.io/#ssse) | [skyward-sword-hd-save-editor](https://github.com/vibecoderanon/skyward-sword-hd-save-editor) |
| **Xenoblade Chronicles Save Tool** | Save Converter | Wii / Switch | Wii `monado` $\rightarrow$ Switch `XC:DE` binary translation | [Launch XCDE](https://vibecoderanon.github.io/#xcde) | [xc-games-save-tool](https://github.com/vibecoderanon/xc-games-save-tool) |
| **Kickass Homebrew** | Switch Homebrew | Switch | 60 FPS synthwave grid visualizer & solver telemetry | [Launch Preview](https://vibecoderanon.github.io/#kickass) | [kickass-homebrew](https://github.com/vibecoderanon/kickass-homebrew) |
| **Sharpscale Multi-Console Suite** | Display Plugin | Switch / 3DS | Interactive split-screen integer scaling slider | [Compare Scaling](https://vibecoderanon.github.io/#sharpscale) | [Sharpscale](https://github.com/vibecoderanon/Sharpscale) |

---

## Hosted Applications & Tools

### 1. Deltarune Switch Save Editor
* **Direct Portal Link:** [`https://vibecoderanon.github.io/#deltarune`](https://vibecoderanon.github.io/#deltarune)
* **Source Repository:** [`vibecoderanon/deltarune-save-editor`](https://github.com/vibecoderanon/deltarune-save-editor)
* **Category:** Nintendo Switch Homebrew / Save Editor
* **Highlights:**
  - Controller-driven LÖVE Potion save editor engineered for DELTARUNE Chapters 1 through 5.
  - GameMaker DS-List hex codec engine for parsing complex dynamic arrays and nested maps.
  - Auto-discovers JKSV (`sdmc:/JKSV/DELTARUNE/`) and Checkpoint save backups on SD card.
  - Complete Dark World item catalog: 41 Weapons, 39 Armors, 52 Consumables, and 34 Key Items.
  - All 36 Recruitable Darkners with chapter filters and 1-click "Recruit All".
  - Secret Boss & Shadow Crystal toggles: Jevil, Spamton NEO, Tenna, Hammer of Justice, Pink, Snowgrave, and Crystals 1–5.
  - 1-click Max Money ($99,999) and automatic safety backups (`.bak`) before every write.
* **Downloads on Portal:** All-in-one SD package (`.zip`), standalone `.nro` executable, and hbmenu `.xml`.

---

### 2. DELTARUNE Save Manager (Native C++)
* **Direct Portal Link:** [`https://vibecoderanon.github.io/#deltarune-manager`](https://vibecoderanon.github.io/#deltarune-manager)
* **Source Repository:** [`vibecoderanon/deltarune-save-manager`](https://github.com/vibecoderanon/deltarune-save-manager)
* **Category:** Nintendo Switch Homebrew / Native Save Manager
* **Highlights:**
  - Native C++17 `libnx` homebrew that mounts, dumps, edits, and commits DELTARUNE save data directly to and from console NAND (eMMC USER partition via `fsdevMountSaveData`).
  - Zero external save managers required: dumps clean JKSV-compatible backups to SD card with 1 button press.
  - 1280×720 linear framebuffer Dark World UI with animated Kris SOUL cursor.
  - Title Override safety guards preventing Applet Mode `0x202` filesystem permission errors.
* **Downloads on Portal:** Pre-packaged SD package (`.zip`), standalone `.nro` executable, and metadata `.xml`.

---

### 3. Skyward Sword HD Save Editor (SSSE)
* **Direct Portal Link:** [`https://vibecoderanon.github.io/#ssse`](https://vibecoderanon.github.io/#ssse)
* **Source Repository:** [`vibecoderanon/skyward-sword-hd-save-editor`](https://github.com/vibecoderanon/skyward-sword-hd-save-editor)
* **Category:** In-Browser Save Editor
* **Highlights:**
  - Pure client-side binary editor for Nintendo Switch `wiiking2.sav` save files with zero server communication.
  - Real-time Little-Endian parsing of player name (UTF-16 LE), Rupees (up to 9,999 with Tycoon Wallet), heart containers, and pouch equipment.
  - Client-side IEEE 802.3 CRC32 recalculation engine producing byte-perfect saves that pass Switch integrity checks without corruption warnings.
  - Bundled sample save for immediate 1-click demonstration in the browser.

---

### 4. Xenoblade Chronicles Save Tool (XCDE)
* **Direct Portal Link:** [`https://vibecoderanon.github.io/#xcde`](https://vibecoderanon.github.io/#xcde)
* **Source Repository:** [`vibecoderanon/xc-games-save-tool`](https://github.com/vibecoderanon/xc-games-save-tool)
* **Category:** In-Browser Save Converter & Inspector
* **Highlights:**
  - Translates Nintendo Wii (`SX4E`) `monado01`–`monado03` saves into native Nintendo Switch *Definitive Edition* format.
  - Accurately converts character levels, EXP, AP, money, active party composition, and header play time timestamps.
  - Pre-clear title screen preservation (`ClearFlag = 0`) to prevent endgame story and visual spoilers.
  - Generates ready-to-restore JKSV saves (`bfsgame00.sav`–`bfsgame02.sav`) paired with verified `.tmb` thumbnail images.

---

### 5. Kickass Homebrew
* **Direct Portal Link:** [`https://vibecoderanon.github.io/#kickass`](https://vibecoderanon.github.io/#kickass)
* **Source Repository:** [`vibecoderanon/kickass-homebrew`](https://github.com/vibecoderanon/kickass-homebrew)
* **Category:** Nintendo Switch Homebrew
* **Highlights:**
  - Retro synthwave homebrew suite engineered natively in Lua using the LÖVE Potion framework.
  - Ultra-lightweight memory profile (~5.3 MB footprint) safe for restricted Nintendo Switch Applet Mode (Album overlay).
  - 60 FPS perspective grid projection and dynamic 3D WordArt displacement in JavaScript Canvas.
  - Real-time visual controller monitor with circular button & D-Pad telemetry HUD.
  - Self-solving Picross 5×5 logic engine and 9×9 Sudoku Minimum Remaining Values (MRV) constraint solver.
  - Hidden easter egg reward screen.
* **Downloads on Portal:** All-in-one SD package (`kickass-homebrew-switch-v1.0.0.zip`), standalone `.nro` executable, and metadata `.xml`.

---

### 6. Sharpscale Multi-Console Suite
* **Direct Portal Link:** [`https://vibecoderanon.github.io/#sharpscale`](https://vibecoderanon.github.io/#sharpscale)
* **Source Repository:** [`vibecoderanon/Sharpscale`](https://github.com/vibecoderanon/Sharpscale)
* **Category:** Display Plugins & Configuration Utilities
* **Highlights:**
  - Hardware display plugins designed to eliminate blurry bilinear hardware scaling across Nintendo Switch and Nintendo 3DS.
  - **Interactive Split-Screen Slider:** Compare stock bilinear blur vs. nearest-neighbor integer scaling and AMD Contrast Adaptive Sharpening (CAS).
  - **Nintendo Switch (`Sharpscale-NX`):** SaltyNX NVN/VI hook plugin (`sharpscale.elf`) and Tesla overlay (`ovl-sharpscale.ovl`) for on-the-fly tuning.
  - **Nintendo 3DS (`Sharpscale-3DS`):** Progressive 2D mode (800×240 top screen), custom bezels, FIRM polyphase matrix patcher, and Luma3DS 3GX plugin (`sharpscale.3gx`).
* **Downloads on Portal:** All-in-one SD package (`Sharpscale-MultiConsole-Suite.zip`), Tesla overlay (`.ovl`), SaltyNX plugin (`.elf`), 3DS configurator (`.3dsx`), and Luma3DS plugin (`.3gx`).

---

## Repository Structure

```
vibecoderanon.github.io/
├── index.html                                 # Cyber-glow responsive portal shell
├── style.css                                  # Neon glassmorphic dark theme
├── app.js                                     # Dynamic application pipeline & modal router
├── data/
│   └── apps.json                              # Central extensible application registry
├── apps/
│   ├── deltarune/                             # Deltarune Save Editor app assets & downloads
│   │   └── downloads/                         # .zip, .nro, and .xml release bundles
│   ├── deltarune-manager/                     # DELTARUNE Save Manager app assets & downloads
│   │   └── downloads/                         # .zip, .nro, and .xml release bundles
│   ├── ssse/                                  # Skyward Sword HD Save Editor
│   │   ├── ssse-tool.js                       # Client-side binary editor & CRC32 recalculator
│   │   ├── SAVE_SCHEMA.json                   # Offset definitions
│   │   └── wiiking2.sav                       # Bundled sample save
│   ├── xcde/                                  # Xenoblade Save Suite
│   │   ├── xcde-tool.js                       # Wii -> Switch DE converter & party inspector
│   │   └── samples/                           # Pre-converted saves & templates (bfsgame00-02)
│   ├── kickass/                               # Kickass Homebrew Showcase
│   │   ├── kickass-preview.js                 # 60 FPS Canvas synthwave visualizer
│   │   └── downloads/                         # .zip, .nro, and .xml release bundles
│   └── sharpscale/                            # Sharpscale Multi-Console Suite
│       ├── sharpscale-compare.js              # Interactive split-screen comparison slider
│       └── downloads/                         # .zip, .ovl, .elf, .3dsx, .3gx release bundles
└── .github/workflows/
    └── deploy.yml                             # Automated GitHub Pages CI/CD deployment
```

---

## App Pipeline: Registering New Applications

Adding a new application to this portal requires **zero layout or HTML refactoring**. Simply append an entry to [`data/apps.json`](data/apps.json):

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
  "previewComponent": "my-new-preview",
  "repoUrl": "https://github.com/vibecoderanon/my-new-app",
  "downloads": [
    {
      "label": "Download SD Package (.ZIP)",
      "filename": "my-new-app-switch-v1.0.0.zip",
      "path": "apps/my-new-app/downloads/my-new-app-switch-v1.0.0.zip",
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

The portal automatically renders the card, updates search indices, connects category filter chips, and handles deep-link modal routing (`#my-new-app`).

---

## Local Development & Testing

Since the portal is built using native ES modules and client-side web APIs without build tool friction, you can test it locally with any static HTTP server:

```bash
# Python
python -m http.server 8080

# Node.js
npx serve .
```

Open `http://localhost:8080` in your web browser.

---

## Automated Deployment (GitHub Pages)

The repository includes a GitHub Actions workflow ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)) that automatically builds and publishes changes pushed to the `main` branch directly to:

**[`https://vibecoderanon.github.io/`](https://vibecoderanon.github.io/)**

---

## Credits & Acknowledgments

- **vibecoderanon**: Portal design, client-side binary engines, and homebrew development.
- **devkitPro**: Homebrew toolchains and libraries for Nintendo Switch (`libnx`) and Nintendo 3DS (`libctru`).
- **TurtleP & Contributors**: [LÖVE Potion](https://github.com/lovebrew/LOVE-Potion) framework for Nintendo Switch.
- **Toby Fox**: Creator of *DELTARUNE* and *UNDERTALE*.
- **Electry & cuevavirus**: Original creators of *Sharpscale* for PS Vita / PSTV.

