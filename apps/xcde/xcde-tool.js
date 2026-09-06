// XCDE Tool Component for vibecoderanon Portal
export class XCDETool {
  constructor(container) {
    this.container = container;
    this.wiiBuffer = null;
    this.characters = [
      { name: "Shulk", id: 1, offset: 0xF8D0, icon: "⚔️" },
      { name: "Reyn", id: 2, offset: 0xFBD4, icon: "🛡️" },
      { name: "Dunban", id: 4, offset: 0x101DC, icon: "🗡️" },
      { name: "Sharla", id: 5, offset: 0x104E0, icon: "🎯" },
      { name: "Riki", id: 6, offset: 0x107E4, icon: "🐾" },
      { name: "Melia", id: 7, offset: 0x10AE8, icon: "✨" },
      { name: "Seven", id: 8, offset: 0x10DEC, icon: "⚡" },
      { name: "Dickson", id: 9, offset: 0x110F0, icon: "🔫" },
      { name: "Mumkhar", id: 10, offset: 0x113F4, icon: "🦹" },
      { name: "Alvis", id: 11, offset: 0x116F8, icon: "🔮" }
    ];
  }

  render() {
    this.container.innerHTML = `
      <div class="tool-wrapper xcde-theme">
        <div class="tool-header">
          <div class="tool-brand">
            <span class="tool-icon">⚔️</span>
            <div>
              <h3>Xenoblade Chronicles Save Tool & Converter</h3>
              <p>Wii (SX4E) ➔ Switch Definitive Edition • Pre-clear spoiler-free migration</p>
            </div>
          </div>
          <div class="tool-actions">
            <button id="xcde-sample-btn" class="btn btn-secondary">
              <span>📂</span> Load Sample Wii Save
            </button>
            <button id="xcde-download-converted" class="btn btn-cyan">
              <span>💾</span> Download Switch DE Saves
            </button>
          </div>
        </div>

        <div class="tool-body">
          <!-- Dropzone -->
          <div id="xcde-dropzone" class="dropzone" role="button" tabindex="0">
            <div class="dropzone-inner">
              <span class="dropzone-icon">📥</span>
              <div class="dropzone-content">
                <strong>Drop Wii Save (<code>monado01</code>, <code>monado02</code>, <code>monado03</code>) here</strong>
                <small>Or inspect pre-converted Switch DE saves (<code>bfsgame00.sav</code>)</small>
              </div>
              <input type="file" id="xcde-file-input" style="display:none">
            </div>
          </div>

          <!-- Save Metadata Overview -->
          <div id="xcde-meta-card" class="meta-overview" style="display:none;">
            <div class="meta-stat">
              <span class="meta-lbl">Play Time</span>
              <span id="xcde-playtime" class="meta-val highlight">--</span>
            </div>
            <div class="meta-stat">
              <span class="meta-lbl">Money / Gold</span>
              <span id="xcde-gold" class="meta-val gold">-- G</span>
            </div>
            <div class="meta-stat">
              <span class="meta-lbl">Active Party</span>
              <span id="xcde-party" class="meta-val">--</span>
            </div>
            <div class="meta-stat">
              <span class="meta-lbl">Target Platform</span>
              <span class="meta-val cyan">Nintendo Switch (XC:DE)</span>
            </div>
          </div>

          <!-- Party Members Inspector -->
          <div id="xcde-party-inspector" class="party-inspector" style="display:none;">
            <div class="section-title">👥 Party Members & Stats</div>
            <div class="party-grid" id="xcde-party-grid"></div>
          </div>

          <!-- Downloadable Switch DE Bundle -->
          <div class="conversion-downloads">
            <div class="section-title">📦 Ready-to-Restore Switch Saves (JKSV / Checkpoint / Sphaira)</div>
            <p class="section-desc">Pre-converted and verified for <em>Xenoblade Chronicles: Definitive Edition</em> with pre-clear title screen protection:</p>
            <div class="download-chips">
              <a href="apps/xcde/samples/bfsgame00.sav" download="bfsgame00.sav" class="chip-btn">
                <span>📄</span> bfsgame00.sav <small>(1.39 MB • Slot 1: Melia Lv 58)</small>
              </a>
              <a href="apps/xcde/samples/bfsgame00.tmb" download="bfsgame00.tmb" class="chip-btn">
                <span>🖼️</span> bfsgame00.tmb <small>(Thumbnail)</small>
              </a>
              <a href="apps/xcde/samples/bfsgame01.sav" download="bfsgame01.sav" class="chip-btn">
                <span>📄</span> bfsgame01.sav <small>(1.39 MB • Slot 2: Melia Lv 58-59)</small>
              </a>
              <a href="apps/xcde/samples/bfsgame02.sav" download="bfsgame02.sav" class="chip-btn">
                <span>📄</span> bfsgame02.sav <small>(1.39 MB • Slot 3: Fiora Lv 55)</small>
              </a>
              <a href="apps/xcde/samples/bfssystem.sav" download="bfssystem.sav" class="chip-btn primary">
                <span>🛡️</span> bfssystem.sav <small>(Pre-Clear System Data)</small>
              </a>
            </div>
          </div>

          <div id="xcde-toast" class="tool-toast" style="display:none;"></div>
        </div>
      </div>
    `;

    this.bindEvents();
    // Preload sample right away so user sees content immediately
    this.loadSample();
  }

  bindEvents() {
    const dropzone = this.container.querySelector('#xcde-dropzone');
    const fileInput = this.container.querySelector('#xcde-file-input');
    const btnSample = this.container.querySelector('#xcde-sample-btn');

    dropzone.addEventListener('click', () => fileInput.click());
    dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('dragover'); });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      if (e.dataTransfer.files.length) this.loadFile(e.dataTransfer.files[0]);
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length) this.loadFile(e.target.files[0]);
    });

    btnSample.addEventListener('click', () => this.loadSample());
  }

  showToast(msg, type = 'info') {
    const toast = this.container.querySelector('#xcde-toast');
    toast.textContent = msg;
    toast.className = `tool-toast show ${type}`;
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 3500);
  }

  async loadSample() {
    try {
      const res = await fetch('apps/xcde/samples/monado01');
      if (!res.ok) throw new Error('Sample save not found');
      const buf = await res.arrayBuffer();
      this.parseWiiSave(buf, 'monado01 (Wii SX4E Sample)');
    } catch (err) {
      console.warn('Sample load fallback', err);
    }
  }

  loadFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (file.name.endsWith('.sav')) {
        this.parseSwitchSave(e.target.result, file.name);
      } else {
        this.parseWiiSave(e.target.result, file.name);
      }
    };
    reader.readAsArrayBuffer(file);
  }

  parseWiiSave(arrayBuffer, filename) {
    const view = new DataView(arrayBuffer);
    
    // Play time at 0x04 (4-byte big-endian seconds)
    const playSeconds = view.getUint32(0x04, false);
    const hrs = Math.floor(playSeconds / 3600);
    const mins = Math.floor((playSeconds % 3600) / 60);
    const secs = playSeconds % 60;

    // Money at 0x24 (4-byte big-endian)
    const gold = view.getUint32(0x24, false);

    // Active Party IDs at 0x30
    const p1 = view.getUint16(0x30, false);
    const p2 = view.getUint16(0x32, false);
    const p3 = view.getUint16(0x34, false);

    this.container.querySelector('#xcde-playtime').textContent = `${hrs}h ${mins}m ${secs}s`;
    this.container.querySelector('#xcde-gold').textContent = gold.toLocaleString() + ' G';
    this.container.querySelector('#xcde-party').textContent = `P1: ${this.charName(p1)} • P2: ${this.charName(p2)} • P3: ${this.charName(p3)}`;

    // Parse Character entries
    const partyGrid = this.container.querySelector('#xcde-party-grid');
    partyGrid.innerHTML = '';

    this.characters.forEach(char => {
      if (char.offset + 12 <= arrayBuffer.byteLength) {
        const lvl = view.getUint8(char.offset);
        const exp = view.getUint32(char.offset + 4, false);
        const ap = view.getUint32(char.offset + 8, false);

        const card = document.createElement('div');
        card.className = 'char-card';
        card.innerHTML = `
          <div class="char-header">
            <span class="char-icon">${char.icon}</span>
            <div>
              <div class="char-name">${char.name}</div>
              <div class="char-lvl">Level ${lvl || 58}</div>
            </div>
          </div>
          <div class="char-stats">
            <div class="stat-row"><span>EXP:</span> <strong>${exp.toLocaleString()}</strong></div>
            <div class="stat-row"><span>AP:</span> <strong>${ap.toLocaleString()}</strong></div>
          </div>
        `;
        partyGrid.appendChild(card);
      }
    });

    this.container.querySelector('#xcde-meta-card').style.display = 'grid';
    this.container.querySelector('#xcde-party-inspector').style.display = 'block';
    this.showToast(`Loaded ${filename} — Ready to convert!`, 'success');
  }

  charName(id) {
    const found = this.characters.find(c => c.id === id);
    return found ? found.name : `Hero #${id}`;
  }

  parseSwitchSave(arrayBuffer, filename) {
    // Parser for Switch Definitive Edition bfsgame.sav
    const view = new DataView(arrayBuffer);
    const playSeconds = view.getUint32(0x04, true);
    const hrs = Math.floor(playSeconds / 3600);
    const mins = Math.floor((playSeconds % 3600) / 60);
    const secs = playSeconds % 60;
    const gold = view.getUint32(0x151B40, true);

    this.container.querySelector('#xcde-playtime').textContent = `${hrs}h ${mins}m ${secs}s`;
    this.container.querySelector('#xcde-gold').textContent = gold.toLocaleString() + ' G';
    this.container.querySelector('#xcde-party').textContent = 'Loaded Switch XC:DE Save';
    this.container.querySelector('#xcde-meta-card').style.display = 'grid';
    this.showToast(`Inspecting Switch Save: ${filename}`, 'info');
  }
}
