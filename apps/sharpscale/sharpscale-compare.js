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
              <canvas id="sharp-canvas" width="640" height="360"></canvas>
              <span class="view-tag right">SHARPSCALE: Crisp / Integer / CAS</span>
            </div>

            <!-- Foreground: Bilinear Blur Output (clipped) -->
            <div class="compare-image blur-view" id="blur-layer" style="width: 50%;">
              <canvas id="blur-canvas" width="640" height="360"></canvas>
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
                <li><strong>800px Mode:</strong> Unlocks progressive 2D mode for top screen ($800\times240$)</li>
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
      percent = Math.max(5, Math.min(95, percent));
      blurLayer.style.width = `${percent}%`;
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

  drawPattern(ctx, isSharp, filterMode = 'point') {
    const w = 640;
    const h = 360;

    // Dark high-tech gaming scene
    ctx.fillStyle = '#111319';
    ctx.fillRect(0, 0, w, h);

    // Draw retro pixel sprite character and health UI
    const pixelSize = 14;
    const startX = 140;
    const startY = 80;

    // Sprite matrix (Retro hero icon)
    const sprite = [
      "  00000000  ",
      " 0111111110 ",
      "011001100110",
      "011001100110",
      "011111111110",
      "011100001110",
      " 0110  0110 ",
      "  000  000  "
    ];

    for (let r = 0; r < sprite.length; r++) {
      for (let c = 0; c < sprite[r].length; c++) {
        const char = sprite[r][c];
        if (char === '0') ctx.fillStyle = '#0f172a';
        else if (char === '1') ctx.fillStyle = '#06b6d4';
        else continue;

        ctx.fillRect(startX + c * pixelSize, startY + r * pixelSize, pixelSize, pixelSize);
      }
    }

    // Health HUD bar
    ctx.fillStyle = '#e11d48';
    ctx.fillRect(startX, startY + sprite.length * pixelSize + 20, 160, 16);
    ctx.fillStyle = '#10b981';
    ctx.fillRect(startX, startY + sprite.length * pixelSize + 20, 110, 16);

    // Text label
    ctx.font = 'bold 16px monospace';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText("HP: 110/160  [REAL-MODE 1:1]", startX, startY + sprite.length * pixelSize + 56);

    // Sub-pixel grid overlay
    if (isSharp) {
      if (filterMode === 'point') {
        // High contrast razor-sharp grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += pixelSize) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        }
        for (let y = 0; y < h; y += pixelSize) {
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }
      } else if (filterMode === 'cas') {
        // Contrast adaptive sharpening: micro edge accentuation
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.strokeRect(startX - 4, startY - 4, sprite[0].length * pixelSize + 8, sprite.length * pixelSize + 8);
      }
    }
  }

  drawBlurCanvas() {
    const canvas = this.container.querySelector('#blur-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Simulate bilinear smear with canvas blur filter
    ctx.filter = 'blur(4.5px)';
    this.drawPattern(ctx, false);
    ctx.filter = 'none';
  }

  drawSharpCanvas() {
    const canvas = this.container.querySelector('#sharp-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    this.drawPattern(ctx, true, this.activeFilter);
  }
}
