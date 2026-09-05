// Sharpscale Interactive Split-Screen Comparison Component
export class SharpscaleCompare {
  constructor(container) {
    this.container = container;
    this.splitPos = 50; // percentage
    this.activeFilter = "point";
  }

  render() {
    this.container.innerHTML = `
      <div class="tool-wrapper sharpscale-theme">
        <div class="tool-header">
          <div class="tool-brand">
            <span class="tool-icon">🔍</span>
            <div>
              <h3>Sharpscale Multi-Console Suite — Interactive Visualizer</h3>
              <p>Hardware Scaling Overrides • Nintendo Switch &amp; Nintendo 3DS</p>
            </div>
          </div>
          <div class="tool-actions">
            <a href="https://github.com/vibecoderanon/Sharpscale/releases" target="_blank" class="btn btn-blue">
              <span>📦</span> GitHub Releases (CI Built)
            </a>
            <a href="https://github.com/vibecoderanon/Sharpscale" target="_blank" class="btn btn-secondary">
              <span>⭐</span> View Source
            </a>
          </div>
        </div>

        <div class="tool-body">
          <!-- Filter Preset Bar -->
          <div class="filter-pills">
            <span class="filter-lbl">Active Mode:</span>
            <button class="pill-btn active" data-filter="point">Nearest-Neighbor (Point)</button>
            <button class="pill-btn" data-filter="integer">Integer Scaling (Auto Fit)</button>
            <button class="pill-btn" data-filter="cas">AMD Contrast Adaptive Sharpening (CAS)</button>
          </div>

          <!-- Split-Screen Interactive Visualizer -->
          <div class="compare-container" id="compare-box">
            <!-- Background: Sharpscale Sharp Output -->
            <div class="compare-image sharp-view" id="sharp-layer">
              <canvas id="sharp-canvas" width="800" height="400"></canvas>
              <span class="view-tag right">SHARPSCALE: Crisp / Integer / CAS</span>
            </div>

            <!-- Foreground: Bilinear Blur Output (clipped with clip-path) -->
            <div class="compare-image blur-view" id="blur-layer">
              <canvas id="blur-canvas" width="800" height="400"></canvas>
              <span class="view-tag left">STOCK: Hardware Bilinear Blur</span>
            </div>

            <!-- Draggable Divider Line -->
            <div class="slider-handle" id="slider-handle" style="left: 50%;">
              <div class="handle-line"></div>
              <div class="handle-thumb">⯈⯇</div>
            </div>
          </div>
          <div class="compare-hint">⇄ Drag slider to inspect pixel clarity across hardware scaling modes</div>

          <!-- Architecture Comparison Cards -->
          <div class="arch-cards-grid">
            <div class="arch-card">
              <div class="arch-header">
                <span class="arch-badge red">Nintendo Switch</span>
                <h4>Sharpscale-NX</h4>
              </div>
              <ul class="arch-list">
                <li><strong>VI Hook:</strong> Intercepts NVN swapchain presentation layer</li>
                <li><strong>Integer Max-Fit:</strong> Auto-calculates integer crop for 720p/1080p</li>
                <li><strong>Custom Sampler:</strong> Point nearest-neighbor override on GPU textures</li>
                <li><strong>In-Game HUD:</strong> Configurable on-the-fly via Tesla Menu overlay</li>
              </ul>
            </div>

            <div class="arch-card">
              <div class="arch-header">
                <span class="arch-badge orange">Nintendo 3DS</span>
                <h4>Sharpscale-3DS</h4>
              </div>
              <ul class="arch-list">
                <li><strong>800px Mode:</strong> Unlocks progressive 2D mode for top screen (800 × 240)</li>
                <li><strong>Polyphase Matrix:</strong> Custom FIRM patch replacing blurry bilinear coefficients</li>
                <li><strong>GBA / DS 1:1:</strong> Integer scaling with centered bezels</li>
                <li><strong>Luma3DS Plugin:</strong> Real-time in-game configuration via 3GX menu</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;

    this.initCanvasGraphics();
    this.bindEvents();
  }

  bindEvents() {
    const box = this.container.querySelector('#compare-box');
    const blurLayer = this.container.querySelector('#blur-layer');
    const handle = this.container.querySelector('#slider-handle');

    const updateSlider = (clientX) => {
      const rect = box.getBoundingClientRect();
      let percent = ((clientX - rect.left) / rect.width) * 100;
      percent = Math.max(2, Math.min(98, percent));
      blurLayer.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
      handle.style.left = `${percent}%`;
    };

    let isDragging = false;
    handle.addEventListener('mousedown', () => { isDragging = true; });
    window.addEventListener('mouseup', () => { isDragging = false; });
    window.addEventListener('mousemove', (e) => {
      if (isDragging) updateSlider(e.clientX);
    });

    // Touch support
    handle.addEventListener('touchstart', () => { isDragging = true; });
    window.addEventListener('touchend', () => { isDragging = false; });
    window.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches.length) updateSlider(e.touches[0].clientX);
    });

    // Filter pills
    this.container.querySelectorAll('.pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.container.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeFilter = btn.dataset.filter;
        this.drawSharpCanvas();
      });
    });
  }

  initCanvasGraphics() {
    this.drawBlurCanvas();
    this.drawSharpCanvas();
  }

  drawRetroScene(ctx, isSharp, filterMode = 'point') {
    const w = 800;
    const h = 400;

    // 1. Twilight Sky Gradient
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.7);
    sky.addColorStop(0, '#0a0d1e');
    sky.addColorStop(0.5, '#1e1b4b');
    sky.addColorStop(1, '#312e81');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // Stars
    ctx.fillStyle = '#ffffff';
    const starCoords = [
      [45, 30], [120, 75], [210, 40], [330, 85], [420, 25], [510, 60],
      [630, 35], [740, 80], [690, 110], [150, 120], [280, 110]
    ];
    starCoords.forEach(([sx, sy]) => {
      ctx.fillRect(sx, sy, 3, 3);
    });

    // Moon
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(680, 80, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0a0d1e';
    ctx.beginPath();
    ctx.arc(692, 74, 25, 0, Math.PI * 2);
    ctx.fill();

    // 2. Silhouette Mountains
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.moveTo(0, 260);
    ctx.lineTo(140, 150);
    ctx.lineTo(280, 260);
    ctx.lineTo(440, 170);
    ctx.lineTo(600, 260);
    ctx.lineTo(720, 180);
    ctx.lineTo(800, 250);
    ctx.lineTo(800, 320);
    ctx.lineTo(0, 320);
    ctx.fill();

    // 3. Ground & Floating Platforms
    const drawPlatform = (px, py, pw, ph) => {
      // Grass top
      ctx.fillStyle = '#10b981';
      ctx.fillRect(px, py, pw, 8);
      ctx.fillStyle = '#34d399';
      for (let x = px; x < px + pw; x += 12) {
        ctx.fillRect(x, py, 6, 4);
      }

      // Dirt/Stone body
      ctx.fillStyle = '#78350f';
      ctx.fillRect(px, py + 8, pw, ph - 8);
      ctx.fillStyle = '#92400e';
      for (let y = py + 12; y < py + ph; y += 14) {
        for (let x = px + 4; x < px + pw - 8; x += 18) {
          ctx.fillRect(x + ((y % 28 === 0) ? 6 : 0), y, 10, 6);
        }
      }
    };

    // Main ground
    drawPlatform(0, 300, w, 100);
    // Floating platforms
    drawPlatform(120, 220, 160, 28);
    drawPlatform(480, 190, 180, 28);

    // 4. Hero Character Sprite (Pixel Art Knight)
    const charX = 180;
    const charY = 150;
    const p = 4; // 4px per sprite pixel

    // Sprite pattern: 16x18 matrix
    const hero = [
      "    0000000     ",
      "   011111110    ",
      "   012222210    ",
      "   012333210    ",
      "   011111110    ",
      "   004444400    ",
      "  05544444550   ",
      "  05544444550   ",
      "  05044444050   ",
      "  00044444000   ",
      "   006666600    ",
      "   011111110    ",
      "   011101110    ",
      "   011101110    ",
      "   077707770    ",
      "  07777077770   "
    ];

    const palette = {
      '0': '#0f172a', // Outline
      '1': '#94a3b8', // Steel Armor
      '2': '#38bdf8', // Glowing Visor Cyan
      '3': '#e0f2fe', // Visor Glint
      '4': '#dc2626', // Tunic Red
      '5': '#fbbf24', // Gold Pauldrons
      '6': '#b45309', // Leather Belt
      '7': '#334155'  // Boots
    };

    for (let r = 0; r < hero.length; r++) {
      for (let c = 0; c < hero[r].length; c++) {
        const key = hero[r][c];
        if (key !== ' ' && palette[key]) {
          ctx.fillStyle = palette[key];
          ctx.fillRect(charX + c * p, charY + r * p, p, p);
        }
      }
    }

    // Sword in hand
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(charX + 17 * p, charY + 2 * p, p, 10 * p);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(charX + 15 * p, charY + 11 * p, 5 * p, p);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(charX + 17 * p, charY + 12 * p, p, 3 * p);

    // 5. Golden Collectible Rupee / Gem on right platform
    const gemX = 560;
    const gemY = 135;
    const gem = [
      "   000   ",
      "  01110  ",
      " 0122210 ",
      "012333210",
      " 0122210 ",
      "  01110  ",
      "   000   "
    ];
    const gemPal = {
      '0': '#78350f',
      '1': '#f59e0b',
      '2': '#fde047',
      '3': '#ffffff'
    };
    for (let r = 0; r < gem.length; r++) {
      for (let c = 0; c < gem[r].length; c++) {
        const key = gem[r][c];
        if (key !== ' ' && gemPal[key]) {
          ctx.fillStyle = gemPal[key];
          ctx.fillRect(gemX + c * 4, gemY + r * 4, 4, 4);
        }
      }
    }

    // 6. Retro Gaming HUD (Top Bar)
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(0, 0, w, 44);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(0, 43, w, 2);

    // HUD Hearts
    const drawPixelHeart = (hx, hy) => {
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(hx + 2, hy, 4, 3);
      ctx.fillRect(hx + 8, hy, 4, 3);
      ctx.fillRect(hx, hy + 3, 14, 4);
      ctx.fillRect(hx + 2, hy + 7, 10, 3);
      ctx.fillRect(hx + 4, hy + 10, 6, 3);
      ctx.fillRect(hx + 6, hy + 13, 2, 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(hx + 3, hy + 3, 2, 2);
    };

    for (let i = 0; i < 5; i++) {
      drawPixelHeart(20 + i * 20, 14);
    }

    // HUD Text: Crisp Monospace
    ctx.font = "bold 15px 'Fira Code', monospace";
    ctx.fillStyle = '#fbbf24';
    ctx.fillText("♦ × 99", 140, 28);

    ctx.fillStyle = '#f8fafc';
    ctx.fillText("WORLD 1-1 // MT. LANAYRU", 260, 28);

    ctx.fillStyle = '#38bdf8';
    ctx.fillText("SCORE: 048200", 630, 28);

    // 7. Mode-Specific Post-Processing
    if (isSharp) {
      if (filterMode === 'point') {
        // Discrete pixel grid overlay
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 16) {
          ctx.beginPath(); ctx.moveTo(x, 44); ctx.lineTo(x, h); ctx.stroke();
        }
        for (let y = 44; y < h; y += 16) {
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }
      } else if (filterMode === 'integer') {
        // Pillarbox integer scale bezel
        ctx.fillStyle = '#05070c';
        ctx.fillRect(0, 0, 40, h);
        ctx.fillRect(w - 40, 0, 40, h);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.strokeRect(40, 0, w - 80, h);
      } else if (filterMode === 'cas') {
        // Contrast adaptive accentuation
        ctx.fillStyle = 'rgba(6, 182, 212, 0.03)';
        ctx.fillRect(charX - 10, charY - 10, 100, 100);
      }
    }

    // Bottom Resolution Stamp
    ctx.font = "12px 'Fira Code', monospace";
    ctx.fillStyle = isSharp ? '#10b981' : '#f87171';
    ctx.textAlign = 'center';
    ctx.fillText(
      isSharp ? "SHARPSCALE: 1080p DOCKED // 3X NATIVE INTEGER // ZERO BLUR" : "STOCK: 1080p HARDWARE BILINEAR INTERPOLATION // SMEARED EDGES",
      w / 2,
      h - 15
    );
    ctx.textAlign = 'left';
  }

  drawBlurCanvas() {
    const canvas = this.container.querySelector('#blur-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Simulate stock hardware bilinear smear
    ctx.filter = 'blur(3.5px)';
    this.drawRetroScene(ctx, false);
    ctx.filter = 'none';
  }

  drawSharpCanvas() {
    const canvas = this.container.querySelector('#sharp-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    this.drawRetroScene(ctx, true, this.activeFilter);
  }
}
