// Kickass Homebrew Showcase & Download Component
export class KickassPreview {
  constructor(container) {
    this.container = container;
  }

  render() {
    this.container.innerHTML = `
      <div class="tool-wrapper kickass-theme">
        <div class="tool-header">
          <div class="tool-brand">
            <span class="tool-icon">🕹️</span>
            <div>
              <h3>Kickass Homebrew — Showcase &amp; Package</h3>
              <p>Nintendo Switch • LÖVE Potion • Applet Mode Safe (~5.3 MB)</p>
            </div>
          </div>
          <div class="tool-actions">
            <a href="apps/kickass/downloads/kickass-homebrew-switch-v1.0.0.zip" download="kickass-homebrew-switch-v1.0.0.zip" class="btn btn-pink">
              <span>⬇️</span> Download Package (.ZIP)
            </a>
            <a href="https://github.com/vibecoderanon/kickass-homebrew/releases" target="_blank" class="btn btn-secondary">
              <span>📦</span> Releases
            </a>
            <a href="https://github.com/vibecoderanon/kickass-homebrew" target="_blank" class="btn btn-secondary">
              <span>⭐</span> Code
            </a>
          </div>
        </div>

        <div class="tool-body">
          <!-- Screenshot Preview / Placeholder Image -->
          <div class="app-screenshot-container">
            <img src="apps/kickass/placeholder.svg" alt="Kickass Homebrew Console Capture" class="app-screenshot-img" id="kickass-screenshot" />
            <div class="screenshot-caption">
              <span class="caption-icon">📷</span>
              <span>Nintendo Switch Capture — Automated console screen capture pending</span>
            </div>
          </div>

          <!-- Quick Download & Install Guide -->
          <div class="install-banner">
            <div class="install-left">
              <h4>Direct Executable Downloads</h4>
              <div class="download-row">
                <a href="apps/kickass/downloads/kickass-homebrew-switch-v1.0.0.zip" download="kickass-homebrew-switch-v1.0.0.zip" class="chip-btn pink">
                  <span>📦</span> Switch SD Package (.ZIP) <small>(All-in-One)</small>
                </a>
                <a href="apps/kickass/downloads/kickass-homebrew.nro" download="kickass-homebrew.nro" class="chip-btn outline">
                  <span>🎮</span> kickass-homebrew.nro <small>(Executable)</small>
                </a>
                <a href="apps/kickass/downloads/kickass-homebrew.xml" download="kickass-homebrew.xml" class="chip-btn outline">
                  <span>📄</span> kickass-homebrew.xml <small>(Metadata)</small>
                </a>
              </div>
            </div>
            <div class="install-right">
              <h4>Switch SD Installation</h4>
              <ol class="steps-list">
                <li>Extract <code>kickass-homebrew-switch-v1.0.0.zip</code> or copy <code>.nro</code> to <code>sdmc:/switch/</code></li>
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
              <h5>Strobe &amp; Color Tuner</h5>
              <p>High-contrast flash rates with photosensitivity protection banners.</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  destroy() {}
}
