// DELTARUNE Save Manager: Native NAND eMMC Homebrew Cockpit Simulation Component
export class DeltaruneManagerPreview {
  constructor(container) {
    this.container = container;
    this.animId = null;
    this.activeTab = 0;
    this.tabs = ["NAND Operations", "Party Stats", "Inventory", "Recruits & Bosses", "SD Backups"];
    this.time = 0;
    this.logs = [
      "[SYS] Initializing Horizon OS IPC services...",
      "[ACC] Preselected User Profile: 0x7B92841E3A49C901",
      "[FSP] Mounting Save Data for Title ID: 0x0100A0D022A68000...",
      "[NAND] Successfully mounted eMMC USER partition to `save:/`!",
      "[HBL] Title Override verified: Full kernel save RW privileges granted."
    ];
    this.dumpCount = 0;
    this.activeChapter = 2;
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
          <!-- 1280x720 Linear Framebuffer Simulation Canvas -->
          <div class="canvas-container manager-canvas-box">
            <canvas id="manager-canvas" width="800" height="420"></canvas>
            <div class="canvas-overlay-controls">
              <button id="sim-btn-dump" class="canvas-btn red"><span>[X]</span> Simulate NAND Dump</button>
              <button id="sim-btn-restore" class="canvas-btn gold"><span>[Y]</span> Simulate NAND Restore</button>
              <button id="sim-btn-commit" class="canvas-btn green"><span>[+]</span> Atomic Flash Commit</button>
            </div>
          </div>

          <!-- Interactive Tab Selector Bar -->
          <div class="mgr-tab-bar">
            <span class="mgr-tab-label">Switch Views:</span>
            <div class="mgr-tab-group">
              ${this.tabs.map((t, idx) => `
                <button class="mgr-tab-btn ${idx === this.activeTab ? 'active' : ''}" data-tab="${idx}">
                  ${t}
                </button>
              `).join('')}
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

    this.initCanvas();
    this.bindEvents();
  }

  initCanvas() {
    const canvas = this.container.querySelector('#manager-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const animate = () => {
      this.animId = requestAnimationFrame(animate);
      this.time = (this.time || 0) + 0.025;

      // 1280x720 Switch Framebuffer Simulation (scaled to 800x420)
      ctx.fillStyle = "#0a0914";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Top Title Bar
      ctx.fillStyle = "#16132b";
      ctx.fillRect(0, 0, canvas.width, 36);

      ctx.font = "bold 13px 'Fira Code', monospace";
      ctx.fillStyle = "#ffffff";
      ctx.fillText("DELTARUNE SAVE MANAGER v1.0.0", 16, 23);

      ctx.fillStyle = "#a855f7";
      ctx.fillText("by vibecoderanon", 280, 23);

      // Telemetry Tags
      ctx.font = "11px 'Fira Code', monospace";
      ctx.fillStyle = "#10b981";
      ctx.fillText("[NAND MOUNTED] save:/", 480, 23);

      ctx.fillStyle = "#f59e0b";
      ctx.fillText("[TITLE OVERRIDE]", 670, 23);

      // Sub Header: IPC Telemetry
      ctx.fillStyle = "#120e24";
      ctx.fillRect(16, 46, canvas.width - 32, 40);
      ctx.strokeStyle = "#312e81";
      ctx.lineWidth = 1;
      ctx.strokeRect(16, 46, canvas.width - 32, 40);

      ctx.font = "11px 'Fira Code', monospace";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText("Account UID: 0x7B92841E3A49C901", 26, 64);
      ctx.fillText("Title ID: 0x0100A0D022A68000 (Retail)", 26, 78);

      ctx.fillStyle = "#ef4444";
      ctx.fillText("Active Chapter: Chapter " + this.activeChapter, 480, 64);
      ctx.fillStyle = "#38bdf8";
      ctx.fillText("Target: eMMC USER Partition", 480, 78);

      // Main View Tabs Header
      ctx.fillStyle = "#1e1b4b";
      ctx.fillRect(16, 96, canvas.width - 32, 28);

      for (let i = 0; i < this.tabs.length; i++) {
        const tx = 24 + i * 150;
        const isActive = i === this.activeTab;
        if (isActive) {
          ctx.fillStyle = "#dc2626";
          ctx.fillRect(tx - 6, 98, 140, 24);
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 11px 'Inter', sans-serif";
        } else {
          ctx.fillStyle = "#94a3b8";
          ctx.font = "11px 'Inter', sans-serif";
        }
        ctx.fillText(`[${i + 1}] ${this.tabs[i]}`, tx, 114);
      }

      // Tab Content Area
      ctx.fillStyle = "#0d0b1a";
      ctx.fillRect(16, 128, canvas.width - 32, 220);
      ctx.strokeStyle = "#2e1065";
      ctx.strokeRect(16, 128, canvas.width - 32, 220);

      if (this.activeTab === 0) {
        // NAND Operations View
        ctx.fillStyle = "#f8fafc";
        ctx.font = "bold 14px 'Inter', sans-serif";
        ctx.fillText("Console NAND Direct Operations (a la JKSV)", 32, 155);

        ctx.font = "12px 'Inter', sans-serif";
        ctx.fillStyle = "#94a3b8";
        ctx.fillText("Press [X] on controller to dump all active saves to SD card.", 32, 178);
        ctx.fillText("Press [Y] to restore and commit backups to eMMC USER partition.", 32, 196);

        // Terminal Log Box
        ctx.fillStyle = "#05040a";
        ctx.fillRect(32, 210, canvas.width - 64, 124);
        ctx.strokeStyle = "#374151";
        ctx.strokeRect(32, 210, canvas.width - 64, 124);

        ctx.font = "11px 'Fira Code', monospace";
        ctx.fillStyle = "#4ade80";
        const visibleLogs = this.logs.slice(-6);
        for (let l = 0; l < visibleLogs.length; l++) {
          ctx.fillText(visibleLogs[l], 42, 230 + l * 18);
        }
      } else if (this.activeTab === 1) {
        // Party Stats View
        ctx.fillStyle = "#f8fafc";
        ctx.font = "bold 14px 'Inter', sans-serif";
        ctx.fillText("Party Members & Live In-Memory Telemetry", 32, 155);

        const chars = [
          { name: "Kris", hp: 120, max: 120, atk: 14, def: 2, icon: "🗡️" },
          { name: "Susie", hp: 140, max: 140, atk: 18, def: 2, icon: "🪓" },
          { name: "Ralsei", hp: 100, max: 100, atk: 10, def: 2, icon: "🧣" },
          { name: "Noelle", hp: 90, max: 90, atk: 8, def: 1, icon: "❄️" }
        ];

        for (let c = 0; c < chars.length; c++) {
          const ch = chars[c];
          const cx = 32 + c * 180;
          ctx.fillStyle = "#1e1b4b";
          ctx.fillRect(cx, 175, 170, 155);
          ctx.strokeStyle = "#4338ca";
          ctx.strokeRect(cx, 175, 170, 155);

          ctx.fillStyle = "#f8fafc";
          ctx.font = "bold 13px 'Inter', sans-serif";
          ctx.fillText(`${ch.icon} ${ch.name}`, cx + 12, 198);

          ctx.font = "11px 'Fira Code', monospace";
          ctx.fillStyle = "#a5b4fc";
          ctx.fillText(`HP:     ${ch.hp} / ${ch.max}`, cx + 12, 222);
          ctx.fillText(`ATK:    ${ch.atk}`, cx + 12, 240);
          ctx.fillText(`DEF:    ${ch.def}`, cx + 12, 258);
          ctx.fillText(`Status: READY`, cx + 12, 276);

          // Health bar
          ctx.fillStyle = "#374151";
          ctx.fillRect(cx + 12, 292, 146, 8);
          ctx.fillStyle = "#10b981";
          ctx.fillRect(cx + 12, 292, 146, 8);
        }
      } else if (this.activeTab === 2) {
        // Inventory View
        ctx.fillStyle = "#f8fafc";
        ctx.font = "bold 14px 'Inter', sans-serif";
        ctx.fillText("Dark World Equipment Catalog (41 Weapons • 39 Armors)", 32, 155);

        const items = [
          "Wood Blade", "Mane Ax", "Devilsknife", "Puppet Scarf",
          "Thorn Ring", "Auto Ax", "Star Wood", "Dealmaker",
          "Royal Pin", "Shadow Mantle", "Monarch Ribbon", "Dog Widow"
        ];

        for (let i = 0; i < items.length; i++) {
          const col = i % 3;
          const row = Math.floor(i / 3);
          const ix = 32 + col * 240;
          const iy = 175 + row * 36;

          ctx.fillStyle = "#17142b";
          ctx.fillRect(ix, iy, 230, 30);
          ctx.strokeStyle = "#3730a3";
          ctx.strokeRect(ix, iy, 230, 30);

          ctx.font = "12px 'Inter', sans-serif";
          ctx.fillStyle = "#e2e8f0";
          ctx.fillText(`✦ ${items[i]}`, ix + 12, iy + 20);
        }
      } else if (this.activeTab === 3) {
        // Recruits & Bosses View
        ctx.fillStyle = "#f8fafc";
        ctx.font = "bold 14px 'Inter', sans-serif";
        ctx.fillText("Darkner Recruits & Secret Boss Shadow Crystals", 32, 155);

        const bosses = [
          { name: "Jevil (Chapter 1)", status: "DEFEATED [Flag 112 = 1]", color: "#a855f7" },
          { name: "Spamton NEO (Chapter 2)", status: "DEFEATED [Flag 571 = 1]", color: "#38bdf8" },
          { name: "Tenna (Chapter 3)", status: "FLAG SET [Flag 121 = 1]", color: "#f59e0b" },
          { name: "Snowgrave Route", status: "ACTIVE [Flag 915 = 1]", color: "#38bdf8" }
        ];

        for (let b = 0; b < bosses.length; b++) {
          const by = 175 + b * 38;
          ctx.fillStyle = "#16122c";
          ctx.fillRect(32, by, canvas.width - 64, 32);
          ctx.strokeStyle = "#3b3363";
          ctx.strokeRect(32, by, canvas.width - 64, 32);

          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 12px 'Inter', sans-serif";
          ctx.fillText(bosses[b].name, 48, by + 21);

          ctx.fillStyle = bosses[b].color;
          ctx.font = "11px 'Fira Code', monospace";
          ctx.fillText(bosses[b].status, 360, by + 21);
        }
      } else {
        // SD Backups View
        ctx.fillStyle = "#f8fafc";
        ctx.font = "bold 14px 'Inter', sans-serif";
        ctx.fillText("Scanned SD Card Save Slots (JKSV, Sphaira & Checkpoint)", 32, 155);

        const slots = [
          "sdmc:/dumps/Save/DELTARUNE/2026-09-06 14.30.00 (Sphaira Backup)",
          "sdmc:/JKSV/DELTARUNE/2026-09-05 @ 19.10.12 (JKSV All Chapters)",
          "sdmc:/dumps/Save/0100A0D022A68000/Main (Sphaira Title ID Slot)",
          "sdmc:/switch/Checkpoint/saves/DELTARUNE/Default (Checkpoint Slot)"
        ];

        for (let s = 0; s < slots.length; s++) {
          const sy = 175 + s * 38;
          ctx.fillStyle = s === 0 ? "#241838" : "#131024";
          ctx.fillRect(32, sy, canvas.width - 64, 32);
          ctx.strokeStyle = s === 0 ? "#ef4444" : "#2d2752";
          ctx.strokeRect(32, sy, canvas.width - 64, 32);

          ctx.fillStyle = s === 0 ? "#fca5a5" : "#cbd5e1";
          ctx.font = "12px 'Fira Code', monospace";
          ctx.fillText(`📁 ${slots[s]}`, 48, sy + 21);
        }
      }

      // Bottom Controller Status & Hints Bar
      ctx.fillStyle = "#120e24";
      ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
      ctx.strokeStyle = "#312e81";
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 40);
      ctx.lineTo(canvas.width, canvas.height - 40);
      ctx.stroke();

      // Pulsing Kris SOUL cursor indicator
      const soulPulse = Math.sin(this.time * 4) * 2;
      ctx.save();
      ctx.translate(26, canvas.height - 20);
      ctx.scale(1 + soulPulse * 0.05, 1 + soulPulse * 0.05);
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.moveTo(0, 7);
      ctx.bezierCurveTo(-10, -4, -14, -13, -7, -16);
      ctx.bezierCurveTo(-1, -17, 0, -10, 0, -9);
      ctx.bezierCurveTo(0, -10, 1, -17, 7, -16);
      ctx.bezierCurveTo(14, -13, 10, -4, 0, 7);
      ctx.fill();
      ctx.restore();

      ctx.font = "11px 'Fira Code', monospace";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText("[A] Edit  [X] Dump to SD  [Y] Restore to NAND  [L/R] Tab  [+] Commit  [-] Exit", 44, canvas.height - 16);
    };

    animate();
  }

  bindEvents() {
    // Tab switching
    this.container.querySelectorAll('.mgr-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.container.querySelectorAll('.mgr-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeTab = parseInt(btn.dataset.tab, 10);
      });
    });

    // Simulated Action buttons
    this.container.querySelector('#sim-btn-dump')?.addEventListener('click', () => {
      this.dumpCount++;
      const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
      this.logs.push(`[DUMP] Copied save:/filech${this.activeChapter}_0 -> sdmc:/JKSV/DELTARUNE/${now}/`);
      this.logs.push(`[DUMP] Verified DS-list hex container integrity (100% OK).`);
      this.showToast(`[X] Dumped save data to sdmc:/JKSV/DELTARUNE/${now}/`);
    });

    this.container.querySelector('#sim-btn-restore')?.addEventListener('click', () => {
      this.logs.push(`[RESTORE] Staged sdmc:/JKSV/DELTARUNE/ -> save:/filech${this.activeChapter}_0`);
      this.logs.push(`[FLASH] fsdevCommitDevice("save") executed with return code 0x0.`);
      this.showToast(`[Y] Save safely restored to console NAND eMMC!`);
    });

    this.container.querySelector('#sim-btn-commit')?.addEventListener('click', () => {
      this.logs.push(`[COMMIT] Flushed in-memory modifications to eMMC USER.`);
      this.showToast(`[+] All changes committed to console NAND!`);
    });
  }

  showToast(msg) {
    const existing = document.querySelector('.tool-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'tool-toast success';
    toast.textContent = msg;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  destroy() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }
}
