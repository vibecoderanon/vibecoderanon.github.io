// DELTARUNE Save Manager: Native NAND eMMC Homebrew Showcase Component
export class DeltaruneManagerPreview {
  constructor(container) {
    this.container = container;
  }

  render() {
    this.container.innerHTML = `
      <div class="tool-wrapper manager-theme">
        <div class="tool-header">
          <div class="tool-brand">
            <span class="tool-icon">💾</span>
            <div>
              <h3>DELTARUNE Save Manager — Native NAND Engine</h3>
              <p>Nintendo Switch • Native C++17 libnx • Title ID 0100A0D022A68000 a la JKSV</p>
            </div>
          </div>
          <div class="tool-actions">
            <a href="apps/deltarune-manager/downloads/deltarune-save-manager-switch-v1.0.0.zip" download="deltarune-save-manager-switch-v1.0.0.zip" class="btn btn-red">
              <span>⬇️</span> Download SD Bundle (.ZIP)
            </a>
            <a href="https://github.com/vibecoderanon/deltarune-save-manager" target="_blank" class="btn btn-secondary">
              <span>⭐</span> Source
            </a>
          </div>
        </div>

        <div class="tool-body">
          <!-- Screenshot Preview / Placeholder Image -->
          <div class="app-screenshot-container">
            <img src="apps/deltarune-manager/placeholder.svg" alt="DELTARUNE Save Manager Console Capture" class="app-screenshot-img" id="deltarune-manager-screenshot" />
            <div class="screenshot-caption">
              <span class="caption-icon">📷</span>
              <span>Nintendo Switch Capture — Automated console screen capture pending</span>
            </div>
          </div>

          <!-- Title Override Safety Guide -->
          <div class="override-alert-banner">
            <div class="override-icon">🛡️</div>
            <div class="override-content">
              <h4>Title Override Privilege Guard (fsp-srv 0x202 Protection)</h4>
              <p>
                In Horizon OS, commercial game saves reside in encrypted NAND eMMC partitions.
                Launching homebrew via the <strong>Album</strong> runs in restricted <em>Applet Mode</em>, causing <code>fsp-srv</code> to throw error <code>0x202</code> (Permission Denied).
              </p>
              <div class="override-steps">
                <span>1. Hold <strong>[R]</strong> button</span> ➔ 
                <span>2. Launch any installed game/demo</span> ➔ 
                <span>3. Homebrew Menu opens with full kernel save RW access</span>
              </div>
            </div>
          </div>

          <!-- Technical Feature Grid -->
          <div class="feature-pills-grid">
            <div class="feature-card">
              <span class="feat-icon">⚡</span>
              <h5>Direct NAND Mounting</h5>
              <p>Mounts <code>0x0100A0D022A68000</code> to <code>save:/</code> directly without needing separate dumpers.</p>
            </div>
            <div class="feature-card">
              <span class="feat-icon">📂</span>
              <h5>JKSV &amp; Sphaira Bridge</h5>
              <p>1-click export to <code>sdmc:/JKSV/</code> and auto-discovery across Sphaira (<code>sdmc:/dumps/Save/</code>) and Checkpoint.</p>
            </div>
            <div class="feature-card">
              <span class="feat-icon">🚀</span>
              <h5>Zero GPU Dependencies</h5>
              <p>Direct 1280x720 32-bit linear framebuffer rendering. Instant &lt;100ms boot time.</p>
            </div>
            <div class="feature-card">
              <span class="feat-icon">🎮</span>
              <h5>Full Chapters 1–5 Codec</h5>
              <p>C++17 GameMaker DS-list hex packing/unpacking for party stats, 41 weapons, and 39 armors.</p>
            </div>
          </div>

          <!-- Direct Executable Downloads -->
          <div class="install-banner">
            <div class="install-left">
              <h4>Direct Executable Downloads</h4>
              <div class="download-row">
                <a href="apps/deltarune-manager/downloads/deltarune-save-manager-switch-v1.0.0.zip" download="deltarune-save-manager-switch-v1.0.0.zip" class="chip-btn red">
                  <span>📦</span> Switch SD Package (.ZIP) <small>(All-in-One)</small>
                </a>
                <a href="apps/deltarune-manager/downloads/deltarune-save-manager.nro" download="deltarune-save-manager.nro" class="chip-btn outline">
                  <span>🎮</span> deltarune-save-manager.nro <small>(AArch64)</small>
                </a>
                <a href="apps/deltarune-manager/downloads/deltarune-save-manager.xml" download="deltarune-save-manager.xml" class="chip-btn outline">
                  <span>📄</span> deltarune-save-manager.xml <small>(Metadata)</small>
                </a>
              </div>
            </div>
            <div class="install-right">
              <h4>Switch SD Installation</h4>
              <ol class="steps-list">
                <li>Extract <code>deltarune-save-manager-switch-v1.0.0.zip</code> to SD root</li>
                <li>Hold <strong>[R]</strong> and launch any game for <strong>Title Override</strong></li>
                <li>Launch <strong>DELTARUNE Save Manager</strong> from Homebrew Menu</li>
                <li>Press <strong>[X]</strong> to dump NAND saves, edit stats, and press <strong>[+]</strong> to commit</li>
              </ol>
            </div>
          </div>

        </div>
      </div>
    `;
  }

  destroy() {}
}
