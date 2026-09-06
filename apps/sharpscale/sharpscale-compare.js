// Sharpscale Multi-Console Showcase & Download Component
export class SharpscaleCompare {
  constructor(container) {
    this.container = container;
  }

  render() {
    this.container.innerHTML = `
      <div class="tool-wrapper sharpscale-theme">
        <div class="tool-header">
          <div class="tool-brand">
            <span class="tool-icon">🔍</span>
            <div>
              <h3>Sharpscale Multi-Console Suite — Showcase &amp; Downloads</h3>
              <p>Hardware Scaling Overrides • Nintendo Switch &amp; Nintendo 3DS</p>
            </div>
          </div>
          <div class="tool-actions">
            <a href="apps/sharpscale/downloads/Sharpscale-MultiConsole-Suite.zip" download="Sharpscale-MultiConsole-Suite.zip" class="btn btn-blue">
              <span>⬇️</span> Download Suite (.ZIP)
            </a>
            <a href="https://github.com/vibecoderanon/Sharpscale/releases" target="_blank" class="btn btn-secondary">
              <span>📦</span> Releases
            </a>
            <a href="https://github.com/vibecoderanon/Sharpscale" target="_blank" class="btn btn-secondary">
              <span>⭐</span> Code
            </a>
          </div>
        </div>

        <div class="tool-body">
          <!-- Screenshot Preview / Placeholder Image -->
          <div class="app-screenshot-container">
            <img src="apps/sharpscale/placeholder.svg" alt="Sharpscale Multi-Console Suite Console Capture" class="app-screenshot-img" id="sharpscale-screenshot" />
            <div class="screenshot-caption">
              <span class="caption-icon">📷</span>
              <span>Nintendo Switch &amp; 3DS Hardware Capture — Automated console screen capture pending</span>
            </div>
          </div>

          <!-- Direct Executable Downloads -->
          <div class="install-banner">
            <div class="install-left">
              <h4>All-In-One &amp; Standalone Downloads</h4>
              <div class="download-row">
                <a href="apps/sharpscale/downloads/Sharpscale-MultiConsole-Suite.zip" download="Sharpscale-MultiConsole-Suite.zip" class="chip-btn primary">
                  <span>📦</span> Multi-Console Suite (.ZIP) <small>(All-in-One SD)</small>
                </a>
                <a href="apps/sharpscale/downloads/ovl-sharpscale.ovl" download="ovl-sharpscale.ovl" class="chip-btn outline">
                  <span>🎮</span> ovl-sharpscale.ovl <small>(Tesla Overlay)</small>
                </a>
                <a href="apps/sharpscale/downloads/sharpscale.elf" download="sharpscale.elf" class="chip-btn outline">
                  <span>⚙️</span> sharpscale.elf <small>(SaltyNX Plugin)</small>
                </a>
                <a href="apps/sharpscale/downloads/Sharpscale-3DS.3dsx" download="Sharpscale-3DS.3dsx" class="chip-btn outline">
                  <span>🕹️</span> Sharpscale-3DS.3dsx <small>(3DS Configurator)</small>
                </a>
                <a href="apps/sharpscale/downloads/sharpscale.3gx" download="sharpscale.3gx" class="chip-btn outline">
                  <span>🔌</span> sharpscale.3gx <small>(Luma3DS Plugin)</small>
                </a>
              </div>
            </div>
            <div class="install-right">
              <h4>Console SD Installation</h4>
              <ol class="steps-list">
                <li><strong>Switch:</strong> Extract suite zip to SD card (<code>sdmc:/switch/.overlays/</code> &amp; <code>sdmc:/SaltySD/plugins/</code>)</li>
                <li><strong>Switch:</strong> Open Tesla Menu with <code>[L] + [D-Pad Down] + [R-Stick]</code></li>
                <li><strong>3DS:</strong> Copy <code>Sharpscale-3DS.3dsx</code> to <code>sdmc:/3ds/</code> and <code>sharpscale.3gx</code> to <code>sdmc:/luma/plugins/</code></li>
              </ol>
            </div>
          </div>

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
  }

  destroy() {}
}
