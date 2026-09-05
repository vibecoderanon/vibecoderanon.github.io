// Kickass Homebrew Live Canvas Preview & Download Component
export class KickassPreview {
  constructor(container) {
    this.container = container;
    this.animId = null;
    this.time = 0;
    this.speed = 1.0;
    this.colorTheme = "synthwave";
  }

  render() {
    this.container.innerHTML = `
      <div class="tool-wrapper kickass-theme">
        <div class="tool-header">
          <div class="tool-brand">
            <span class="tool-icon">🕹️</span>
            <div>
              <h3>Kickass Homebrew — Live Visualizer & Package</h3>
              <p>Nintendo Switch • LÖVE Potion • Applet Mode Safe (~5.3 MB)</p>
            </div>
          </div>
          <div class="tool-actions">
            <a href="apps/kickass/downloads/kickass-homebrew.nro" download="kickass-homebrew.nro" class="btn btn-pink">
              <span>⬇️</span> Download .NRO (6.39 MB)
            </a>
          </div>
        </div>

        <div class="tool-body">
          <!-- Canvas Visualizer -->
          <div class="canvas-container">
            <canvas id="synthwave-canvas" width="800" height="400"></canvas>
            <div class="canvas-overlay-controls">
              <button id="btn-toggle-speed" class="canvas-btn">Speed: Normal</button>
              <button id="btn-toggle-theme" class="canvas-btn">Theme: Synthwave</button>
            </div>
          </div>

          <!-- Quick Download & Install Guide -->
          <div class="install-banner">
            <div class="install-left">
              <h4>Direct Executable Downloads</h4>
              <div class="download-row">
                <a href="apps/kickass/downloads/kickass-homebrew.nro" download="kickass-homebrew.nro" class="chip-btn pink">
                  <span>🎮</span> kickass-homebrew.nro <small>(Ready for Switch CFW)</small>
                </a>
                <a href="apps/kickass/downloads/kickass-homebrew.xml" download="kickass-homebrew.xml" class="chip-btn outline">
                  <span>📄</span> kickass-homebrew.xml <small>(Title Metadata)</small>
                </a>
              </div>
            </div>
            <div class="install-right">
              <h4>Switch SD Installation</h4>
              <ol class="steps-list">
                <li>Copy <code>kickass-homebrew.nro</code> to <code>sdmc:/switch/</code></li>
                <li>Boot Switch into Custom Firmware (Atmosphère)</li>
                <li>Launch <strong>Homebrew Menu</strong> (Album or Title Override)</li>
              </ol>
            </div>
          </div>

          <!-- Feature Highlights -->
          <div class="feature-pills-grid">
            <div class="feature-card">
              <span class="feat-icon">⚡</span>
              <h5>Applet Mode Safe</h5>
              <p>Stably runs within ~5.3 MB memory limits, avoiding Album OOM crashes.</p>
            </div>
            <div class="feature-card">
              <span class="feat-icon">🧩</span>
              <h5>Picross 5×5 Solver</h5>
              <p>Visual deduction engine solving Nonograms row-by-row with live hints.</p>
            </div>
            <div class="feature-card">
              <span class="feat-icon">🔢</span>
              <h5>Sudoku MRV Engine</h5>
              <p>Minimum Remaining Values heuristic backtracking solver completing in &lt;85 steps.</p>
            </div>
            <div class="feature-card">
              <span class="feat-icon">💡</span>
              <h5>Strobe & Color Tuner</h5>
              <p>High-contrast flash rates with photosensitivity protection banners.</p>
            </div>
          </div>
        </div>
      </div>
    `;

    this.initCanvas();
    this.bindEvents();
  }

  bindEvents() {
    const btnSpeed = this.container.querySelector('#btn-toggle-speed');
    const btnTheme = this.container.querySelector('#btn-toggle-theme');

    btnSpeed.addEventListener('click', () => {
      if (this.speed === 1.0) {
        this.speed = 2.0;
        btnSpeed.textContent = 'Speed: Hyper';
      } else if (this.speed === 2.0) {
        this.speed = 0.5;
        btnSpeed.textContent = 'Speed: Chill';
      } else {
        this.speed = 1.0;
        btnSpeed.textContent = 'Speed: Normal';
      }
    });

    btnTheme.addEventListener('click', () => {
      if (this.colorTheme === 'synthwave') {
        this.colorTheme = 'cyberpunk';
        btnTheme.textContent = 'Theme: Cyber Cyan';
      } else if (this.colorTheme === 'cyberpunk') {
        this.colorTheme = 'sunset';
        btnTheme.textContent = 'Theme: Golden Sunset';
      } else {
        this.colorTheme = 'synthwave';
        btnTheme.textContent = 'Theme: Synthwave';
      }
    });
  }

  initCanvas() {
    const canvas = this.container.querySelector('#synthwave-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Make canvas crisp on high-DPI
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = (rect.width || 800) * dpr;
    canvas.height = 400 * dpr;
    ctx.scale(dpr, dpr);

    const width = canvas.width / dpr;
    const height = 400;

    const renderFrame = () => {
      this.time += 0.03 * this.speed;

      // Clear with dark gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (this.colorTheme === 'synthwave') {
        bgGrad.addColorStop(0, '#0f051d');
        bgGrad.addColorStop(0.5, '#2e0854');
        bgGrad.addColorStop(1, '#060012');
      } else if (this.colorTheme === 'cyberpunk') {
        bgGrad.addColorStop(0, '#021b24');
        bgGrad.addColorStop(0.5, '#043b4d');
        bgGrad.addColorStop(1, '#010c12');
      } else {
        bgGrad.addColorStop(0, '#260a08');
        bgGrad.addColorStop(0.5, '#541c0b');
        bgGrad.addColorStop(1, '#140502');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Horizon line
      const horizonY = height * 0.52;

      // Draw Sun
      const sunGrad = ctx.createLinearGradient(0, horizonY - 120, 0, horizonY);
      if (this.colorTheme === 'synthwave') {
        sunGrad.addColorStop(0, '#ff007f');
        sunGrad.addColorStop(0.5, '#ff7700');
        sunGrad.addColorStop(1, '#ffee00');
      } else if (this.colorTheme === 'cyberpunk') {
        sunGrad.addColorStop(0, '#00f7ff');
        sunGrad.addColorStop(1, '#0066ff');
      } else {
        sunGrad.addColorStop(0, '#ffcc00');
        sunGrad.addColorStop(1, '#ff3300');
      }
      ctx.beginPath();
      ctx.arc(width / 2, horizonY, 80, Math.PI, 0);
      ctx.fillStyle = sunGrad;
      ctx.fill();

      // Sun horizontal blinds lines
      ctx.fillStyle = bgGrad;
      for (let i = 1; i <= 6; i++) {
        const y = horizonY - 75 + i * 11;
        ctx.fillRect(width / 2 - 85, y, 170, 2 + i * 0.6);
      }

      // Draw Perspective Grid
      ctx.save();
      ctx.strokeStyle = this.colorTheme === 'synthwave' ? '#ff00aa' : (this.colorTheme === 'cyberpunk' ? '#00e5ff' : '#ff9900');
      ctx.lineWidth = 1.5;

      // Perspective vanishing lines
      const vanishingX = width / 2;
      const numLines = 22;
      for (let i = -numLines / 2; i <= numLines / 2; i++) {
        const bottomX = width / 2 + i * (width / (numLines / 1.5));
        ctx.beginPath();
        ctx.moveTo(vanishingX, horizonY);
        ctx.lineTo(bottomX, height);
        ctx.stroke();
      }

      // Horizontal receding lines
      const numHoriz = 10;
      const scroll = (this.time * 20) % 30;
      for (let i = 0; i < numHoriz; i++) {
        const norm = Math.pow((i * 30 + scroll) / (numHoriz * 30), 2.2);
        const y = horizonY + norm * (height - horizonY);
        if (y <= height) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      }
      ctx.restore();

      // Undulating WordArt Text: "KICKASS HOMEBREW"
      ctx.save();
      const text = "KICKASS HOMEBREW";
      const fontSize = Math.min(width * 0.055, 36);
      ctx.font = `900 ${fontSize}px 'Arial Black', Impact, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const chars = text.split('');
      const charWidth = fontSize * 0.7;
      const totalWidth = chars.length * charWidth;
      const startX = width / 2 - totalWidth / 2;

      for (let i = 0; i < chars.length; i++) {
        const x = startX + i * charWidth + charWidth / 2;
        // Exact wave formula from main.lua: math.sin(x * freq + time) * amp
        const waveY = horizonY - 45 + Math.sin(i * 0.45 + this.time * 2) * 14;

        // Neon Glow Shadow
        ctx.shadowColor = this.colorTheme === 'synthwave' ? '#00f7ff' : '#ff00aa';
        ctx.shadowBlur = 15;

        // 3D Extrusion
        for (let d = 4; d > 0; d--) {
          ctx.fillStyle = "#220033";
          ctx.fillText(chars[i], x + d, waveY + d);
        }

        // Face text gradient
        const textGrad = ctx.createLinearGradient(0, waveY - fontSize / 2, 0, waveY + fontSize / 2);
        textGrad.addColorStop(0, '#ffffff');
        textGrad.addColorStop(0.5, '#ffff55');
        textGrad.addColorStop(1, '#ff0077');
        ctx.fillStyle = textGrad;
        ctx.fillText(chars[i], x, waveY);
      }
      ctx.restore();

      // Subtitle: "MADE BY AI // LÖVE POTION NX"
      ctx.save();
      ctx.font = "700 13px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = "#00ffff";
      ctx.shadowColor = "#00ffff";
      ctx.shadowBlur = 8;
      ctx.fillText("LÖVE POTION • NINTENDO SWITCH • 60 FPS", width / 2, horizonY + 22);
      ctx.restore();

      this.animId = requestAnimationFrame(renderFrame);
    };

    renderFrame();
  }

  destroy() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }
}
