// DELTARUNE Switch Save Editor: In-Browser Save Editor & Tool Component
// Supports Chapters 1-5 GameMaker DS-List Hex Codec (2F010000)

const WEAPONS_CATALOG = [
  { id: 0, name: "(None)" },
  { id: 1, name: "Wood Blade" },
  { id: 2, name: "Mane Ax" },
  { id: 3, name: "Red Buster" },
  { id: 4, name: "Devilsknife" },
  { id: 5, name: "Puppet Scarf" },
  { id: 6, name: "Thorn Ring" },
  { id: 7, name: "Bounce Blade" },
  { id: 8, name: "Auto Ax" },
  { id: 9, name: "Star Wood" },
  { id: 10, name: "MechaSaber" },
  { id: 11, name: "Spookysword" },
  { id: 12, name: "Brave Ax" },
  { id: 13, name: "Dainty Scarf" },
  { id: 14, name: "Ragger" },
  { id: 15, name: "Ragger2" },
  { id: 16, name: "Fiber Scarf" },
  { id: 17, name: "Cheer Scarf" },
  { id: 18, name: "Snow Ring" },
  { id: 19, name: "Freeze Ring" }
];

const ARMORS_CATALOG = [
  { id: 0, name: "(None)" },
  { id: 1, name: "Amber Card" },
  { id: 2, name: "Dice Brace" },
  { id: 3, name: "White Ribbon" },
  { id: 4, name: "Iron Shackle" },
  { id: 5, name: "Dealmaker" },
  { id: 6, name: "Royal Pin" },
  { id: 7, name: "Shadow Mantle" },
  { id: 8, name: "Monarch Ribbon" },
  { id: 9, name: "Dog Widow" },
  { id: 10, name: "Pink Ribbon" },
  { id: 11, name: "Chain Mail" },
  { id: 12, name: "Bangle" },
  { id: 13, name: "SpikeBand" },
  { id: 14, name: "Silver Watch" },
  { id: 15, name: "Tension Bow" },
  { id: 16, name: "Twin Ribbon" },
  { id: 17, name: "Glow Wrist" }
];

export class DeltaruneTool {
  constructor(container) {
    this.container = container;
    this.animId = null;
    this.saveData = null;
    this.fileName = "filech2_0";
    this.activeChapter = 2;
    this.soulX = 60;
    this.soulTargetX = 60;
    this.quotes = [
      "At times, you may see a light in the dark...",
      "The power of Switch homebrew shines within you.",
      "A glowing light fills your soul with determination.",
      "Kris, Susie, and Ralsei's adventure awaits your tuning."
    ];
    this.currentQuote = 0;
    this.quoteTime = 0;
  }

  // --- DS-List Binary Codec (IEEE-754 Little-Endian) ---
  decodeDsList(hex) {
    const raw = hex.trim();
    if (raw.length < 16) return [];
    const bytes = new Uint8Array(raw.length / 2);
    for (let i = 0; i < raw.length; i += 2) {
      bytes[i / 2] = parseInt(raw.substring(i, i + 2), 16);
    }
    const view = new DataView(bytes.buffer);
    let pos = 8;
    const count = view.getUint32(4, true);
    const vals = [];
    const dec = new TextDecoder('utf-8');

    for (let i = 0; i < count; i++) {
      if (pos >= bytes.length) break;
      const tag = view.getUint32(pos, true);
      pos += 4;
      if (tag === 0 || tag === 10 || tag === 13) {
        const num = view.getFloat64(pos, true);
        pos += 8;
        vals.push(Number.isInteger(num) ? String(num) : String(num));
      } else if (tag === 1) {
        const len = view.getUint32(pos, true);
        pos += 4;
        const str = dec.decode(bytes.subarray(pos, pos + len));
        pos += len;
        vals.push(str);
      }
    }
    return vals;
  }

  encodeDsList(values, forceStrings = false) {
    const parts = [];
    // 2F010000 header
    parts.push(new Uint8Array([0x2F, 0x01, 0x00, 0x00]));
    const countBuf = new Uint8Array(4);
    new DataView(countBuf.buffer).setUint32(0, values.length, true);
    parts.push(countBuf);

    for (const v of values) {
      const s = String(v ?? "").trim();
      let num = null;
      if (!forceStrings && s !== "" && !isNaN(Number(s))) {
        num = Number(s);
      }
      if (num !== null) {
        const tagBuf = new Uint8Array([0x00, 0x00, 0x00, 0x00]);
        const valBuf = new Uint8Array(8);
        new DataView(valBuf.buffer).setFloat64(0, num, true);
        parts.push(tagBuf, valBuf);
      } else {
        const tagBuf = new Uint8Array([0x01, 0x00, 0x00, 0x00]);
        const enc = new TextEncoder().encode(String(v ?? ""));
        const lenBuf = new Uint8Array(4);
        new DataView(lenBuf.buffer).setUint32(0, enc.length, true);
        parts.push(tagBuf, lenBuf, enc);
      }
    }

    let totalLen = 0;
    for (const p of parts) totalLen += p.length;
    const out = new Uint8Array(totalLen);
    let offset = 0;
    for (const p of parts) {
      out.set(p, offset);
      offset += p.length;
    }

    let hex = "";
    for (let i = 0; i < out.length; i++) {
      hex += out[i].toString(16).padStart(2, '0').toUpperCase();
    }
    return hex;
  }

  parseSwitchSave(text, filename = "filech2_0") {
    const rawLines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
    while (rawLines.length > 0 && rawLines[rawLines.length - 1].trim() === '') {
      rawLines.pop();
    }

    let ch = 2;
    const match = filename.match(/filech([1-5])/i);
    if (match) {
      ch = parseInt(match[1], 10);
    } else if (rawLines.length > 1000) {
      ch = 1;
    }

    const isCh1 = ch === 1;
    const numChars = isCh1 ? 4 : 5;
    const charNames = ["Kris", "Susie", "Ralsei", "Noelle", "Slot 5"];

    const playerName = rawLines[0] || "Kris";
    const vesselList = this.decodeDsList(rawLines[1] || "");
    const vesselName = vesselList[0] || "Vessel";

    const partyMembers = [
      parseInt(rawLines[2] || "1", 10),
      parseInt(rawLines[3] || "2", 10),
      parseInt(rawLines[4] || "3", 10)
    ];

    const money = parseInt(rawLines[5] || "0", 10);
    const xp = parseInt(rawLines[6] || "0", 10);
    const lv = parseInt(rawLines[7] || "1", 10);

    // 10 Stat DS-Lists
    const statLists = [];
    for (let i = 0; i < 10; i++) {
      statLists.push(this.decodeDsList(rawLines[11 + i] || ""));
    }

    const characters = [];
    for (let c = 0; c < numChars; c++) {
      characters.push({
        name: charNames[c] || `Char ${c + 1}`,
        hp: parseInt(statLists[0]?.[c] || "90", 10),
        maxHp: parseInt(statLists[1]?.[c] || "90", 10),
        atk: parseInt(statLists[2]?.[c] || "10", 10),
        def: parseInt(statLists[3]?.[c] || "2", 10),
        mag: parseInt(statLists[4]?.[c] || "0", 10),
        guts: parseInt(statLists[5]?.[c] || "0", 10),
        weapon: parseInt(statLists[7]?.[c] || "1", 10),
        armor1: parseInt(statLists[8]?.[c] || "0", 10),
        armor2: parseInt(statLists[9]?.[c] || "0", 10)
      });
    }

    // Find flags list
    let flagsList = [];
    let flagsLineIndex = -1;
    for (let i = rawLines.length - 1; i >= 0; i--) {
      if (rawLines[i].startsWith('2F010000') || rawLines[i].startsWith('2E010000')) {
        const decoded = this.decodeDsList(rawLines[i]);
        if (decoded.length >= 2000) {
          flagsList = decoded;
          flagsLineIndex = i;
          break;
        }
      }
    }

    const getFlag = (idx) => parseInt(flagsList[idx] || "0", 10);
    const setFlag = (idx, val) => {
      while (flagsList.length <= idx) flagsList.push("0");
      flagsList[idx] = String(val);
    };

    return {
      filename,
      chapter: ch,
      rawLines,
      flagsLineIndex,
      flagsList,
      playerName,
      vesselName,
      partyMembers,
      money,
      xp,
      lv,
      characters,
      flags: {
        jevil: getFlag(112) > 0,
        spamtonNeo: getFlag(571) > 0,
        tenna: getFlag(121) > 0,
        snowgrave: getFlag(915) > 0,
        crystals: [
          getFlag(280) > 0,
          getFlag(353) > 0,
          getFlag(856) > 0,
          getFlag(941) > 0,
          getFlag(950) > 0
        ]
      },
      setFlag
    };
  }

  serializeSwitchSave() {
    if (!this.saveData) return null;
    const d = this.saveData;
    const lines = [...d.rawLines];

    lines[0] = d.playerName;
    lines[5] = String(d.money);
    lines[6] = String(d.xp);
    lines[7] = String(d.lv);

    // Re-pack the 10 character stat DS-lists
    const numChars = d.characters.length;
    for (let statIdx = 0; statIdx < 10; statIdx++) {
      const vals = [];
      for (let c = 0; c < numChars; c++) {
        const char = d.characters[c];
        if (statIdx === 0) vals.push(String(char.hp));
        else if (statIdx === 1) vals.push(String(char.maxHp));
        else if (statIdx === 2) vals.push(String(char.atk));
        else if (statIdx === 3) vals.push(String(char.def));
        else if (statIdx === 4) vals.push(String(char.mag));
        else if (statIdx === 5) vals.push(String(char.guts));
        else if (statIdx === 6) vals.push(String(c + 1));
        else if (statIdx === 7) vals.push(String(char.weapon));
        else if (statIdx === 8) vals.push(String(char.armor1));
        else if (statIdx === 9) vals.push(String(char.armor2));
      }
      lines[11 + statIdx] = this.encodeDsList(vals);
    }

    // Apply flags
    d.setFlag(112, d.flags.jevil ? 1 : 0);
    d.setFlag(571, d.flags.spamtonNeo ? 1 : 0);
    d.setFlag(121, d.flags.tenna ? 1 : 0);
    d.setFlag(915, d.flags.snowgrave ? 1 : 0);
    const crystalIndices = [280, 353, 856, 941, 950];
    for (let i = 0; i < 5; i++) {
      d.setFlag(crystalIndices[i], d.flags.crystals[i] ? 1 : 0);
    }

    if (d.flagsLineIndex >= 0) {
      lines[d.flagsLineIndex] = this.encodeDsList(d.flagsList);
    }

    return lines.join('\r\n');
  }

  render() {
    this.container.innerHTML = `
      <div class="tool-wrapper deltarune-theme">
        <div class="tool-header">
          <div class="tool-brand">
            <span class="tool-icon">❤️</span>
            <div>
              <h3>Deltarune Switch Save Editor</h3>
              <p>Nintendo Switch • LÖVE Potion • Chapters 1–5 GameMaker DS-List Hex Engine</p>
            </div>
          </div>
          <div class="tool-actions">
            <button id="dr-export-btn" class="btn btn-purple" disabled>
              <span>💾</span> Export Save
            </button>
            <a href="apps/deltarune/downloads/deltarune-save-editor-switch-v1.0.0.zip" download="deltarune-save-editor-switch-v1.0.0.zip" class="btn btn-secondary">
              <span>⬇️</span> Switch SD ZIP
            </a>
          </div>
        </div>

        <div class="tool-body">
          <!-- Screenshot Preview / Placeholder Image -->
          <div class="app-screenshot-container">
            <img src="apps/deltarune/placeholder.svg" alt="Deltarune Switch Save Editor Console Capture" class="app-screenshot-img" id="deltarune-screenshot" />
            <div class="screenshot-caption">
              <span class="caption-icon">📷</span>
              <span>Nintendo Switch Capture — Automated console screen capture pending</span>
            </div>
          </div>

          <!-- Dropzone & Quick Samples -->
          <div class="dr-sample-bar">
            <span class="sample-label">1-Click Chapter Templates:</span>
            <div class="sample-btn-group">
              <button class="sample-chip" data-ch="1">Chapter 1</button>
              <button class="sample-chip active" data-ch="2">Chapter 2</button>
              <button class="sample-chip" data-ch="3">Chapter 3</button>
              <button class="sample-chip" data-ch="4">Chapter 4</button>
              <button class="sample-chip" data-ch="5">Chapter 5</button>
            </div>
          </div>

          <div id="dr-dropzone" class="dropzone" role="button" tabindex="0">
            <div class="dropzone-inner">
              <span class="dropzone-icon">📥</span>
              <div class="dropzone-content">
                <strong>Drop <code>filech1_0</code> through <code>filech5_5</code> here</strong> (from JKSV, Sphaira, or Checkpoint) or click to choose file
                <small>100% private in-browser editing — files never leave your computer</small>
              </div>
              <input type="file" id="dr-file-input" style="display:none">
            </div>
          </div>

          <!-- Main Interactive Save Editor -->
          <div id="dr-editor-panels" class="dr-panels" style="display: none;">
            
            <!-- Quick Mod Actions -->
            <div class="dr-quick-bar">
              <button id="btn-max-money" class="dr-quick-btn gold">
                <span>⚡</span> Max Money ($99,999)
              </button>
              <button id="btn-full-heal" class="dr-quick-btn green">
                <span>❤️</span> Full Party Revive &amp; Heal
              </button>
              <button id="btn-all-crystals" class="dr-quick-btn cyan">
                <span>💎</span> Unlock 5 Shadow Crystals
              </button>
              <button id="btn-recruit-all" class="dr-quick-btn purple">
                <span>🌟</span> Recruit All Darkners
              </button>
            </div>

            <!-- General Stats -->
            <div class="dr-card">
              <h4 class="dr-card-title"><span>👤</span> General Save Parameters</h4>
              <div class="dr-form-grid">
                <div class="dr-field">
                  <label>Player Name</label>
                  <input type="text" id="dr-player-name" class="dr-input" maxlength="12">
                </div>
                <div class="dr-field">
                  <label>Dark Dollars ($)</label>
                  <input type="number" id="dr-money" class="dr-input" min="0" max="99999">
                </div>
                <div class="dr-field">
                  <label>Party LV</label>
                  <input type="number" id="dr-lv" class="dr-input" min="1" max="99">
                </div>
                <div class="dr-field">
                  <label>Active Chapter</label>
                  <input type="text" id="dr-active-ch" class="dr-input" readonly>
                </div>
              </div>
            </div>

            <!-- Party Character Stats Grid -->
            <div class="dr-card">
              <h4 class="dr-card-title"><span>⚔️</span> Party Members &amp; Equipment</h4>
              <div class="dr-party-grid" id="dr-party-container">
                <!-- Dynamically injected -->
              </div>
            </div>

            <!-- Secret Bosses, Crystals & Route Flags -->
            <div class="dr-card">
              <h4 class="dr-card-title"><span>🗝️</span> Secret Bosses &amp; Story Route Flags</h4>
              <div class="dr-flag-grid">
                <label class="dr-flag-toggle">
                  <input type="checkbox" id="flag-jevil">
                  <span class="flag-box"></span>
                  <div class="flag-info">
                    <strong>Jevil Defeated (Ch 1)</strong>
                    <small>Unlocks Devilsknife &amp; Jevilstail</small>
                  </div>
                </label>

                <label class="dr-flag-toggle">
                  <input type="checkbox" id="flag-spamton">
                  <span class="flag-box"></span>
                  <div class="flag-info">
                    <strong>Spamton NEO Defeated (Ch 2)</strong>
                    <small>Unlocks Dealmaker &amp; Puppet Scarf</small>
                  </div>
                </label>

                <label class="dr-flag-toggle">
                  <input type="checkbox" id="flag-tenna">
                  <span class="flag-box"></span>
                  <div class="flag-info">
                    <strong>Tenna Flag (Ch 3)</strong>
                    <small>Dark Sanctuary Television Boss</small>
                  </div>
                </label>

                <label class="dr-flag-toggle">
                  <input type="checkbox" id="flag-snowgrave">
                  <span class="flag-box"></span>
                  <div class="flag-info">
                    <strong>Snowgrave / Weird Route</strong>
                    <small>Thorn Ring &amp; Pipis flags enabled</small>
                  </div>
                </label>
              </div>

              <!-- Shadow Crystals -->
              <div class="dr-crystal-row">
                <span class="crystal-lbl">💎 Shadow Crystals:</span>
                <div class="crystal-pills" id="dr-crystal-pills">
                  <label class="crystal-pill"><input type="checkbox" id="crys-1"> <span>Crystal 1</span></label>
                  <label class="crystal-pill"><input type="checkbox" id="crys-2"> <span>Crystal 2</span></label>
                  <label class="crystal-pill"><input type="checkbox" id="crys-3"> <span>Crystal 3</span></label>
                  <label class="crystal-pill"><input type="checkbox" id="crys-4"> <span>Crystal 4</span></label>
                  <label class="crystal-pill"><input type="checkbox" id="crys-5"> <span>Crystal 5</span></label>
                </div>
              </div>
            </div>

          </div>

          <!-- Executable Downloads & SD Installation -->
          <div class="install-banner">
            <div class="install-left">
              <h4>Direct Executable Downloads</h4>
              <div class="download-row">
                <a href="apps/deltarune/downloads/deltarune-save-editor-switch-v1.0.0.zip" download="deltarune-save-editor-switch-v1.0.0.zip" class="chip-btn purple">
                  <span>📦</span> Switch SD Package (.ZIP) <small>(All-in-One)</small>
                </a>
                <a href="apps/deltarune/downloads/deltarune-save-editor.nro" download="deltarune-save-editor.nro" class="chip-btn outline">
                  <span>🎮</span> deltarune-save-editor.nro <small>(Executable)</small>
                </a>
                <a href="apps/deltarune/downloads/deltarune-save-editor.xml" download="deltarune-save-editor.xml" class="chip-btn outline">
                  <span>📄</span> deltarune-save-editor.xml <small>(Metadata)</small>
                </a>
              </div>
            </div>
            <div class="install-right">
              <h4>Switch SD Installation</h4>
              <ol class="steps-list">
                <li>Extract <code>deltarune-save-editor-switch-v1.0.0.zip</code> to <code>sdmc:/</code></li>
                <li>Dump save via <strong>JKSV</strong> (<code>sdmc:/JKSV/DELTARUNE/</code>) or <strong>Sphaira</strong> (<code>sdmc:/dumps/Save/DELTARUNE/</code>)</li>
                <li>Launch <strong>Deltarune Save Editor</strong> from Homebrew Menu to edit stats</li>
                <li>Restore modified save via JKSV or Sphaira</li>
              </ol>
            </div>
          </div>

        </div>
      </div>
    `;

    this.bindEvents();
    // Auto-load Chapter 2 sample by default
    this.loadSampleChapter(2);
  }

  bindEvents() {
    // Dropzone
    const dropzone = this.container.querySelector('#dr-dropzone');
    const fileInput = this.container.querySelector('#dr-file-input');

    if (dropzone && fileInput) {
      dropzone.addEventListener('click', () => fileInput.click());
      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      });
      dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
          this.loadFile(e.dataTransfer.files[0]);
        }
      });

      fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
          this.loadFile(fileInput.files[0]);
        }
      });
    }

    // Sample Chapter Chips
    this.container.querySelectorAll('.sample-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        this.container.querySelectorAll('.sample-chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const ch = parseInt(btn.dataset.ch, 10);
        this.loadSampleChapter(ch);
      });
    });

    // Export button
    const exportBtn = this.container.querySelector('#dr-export-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportSaveFile());
    }

    // Quick Mod buttons
    this.container.querySelector('#btn-max-money')?.addEventListener('click', () => {
      if (!this.saveData) return;
      this.saveData.money = 99999;
      const inp = this.container.querySelector('#dr-money');
      if (inp) inp.value = 99999;
      this.showToast("⚡ Dark Dollars maxed to $99,999!");
    });

    this.container.querySelector('#btn-full-heal')?.addEventListener('click', () => {
      if (!this.saveData) return;
      for (const char of this.saveData.characters) {
        char.hp = char.maxHp;
      }
      this.updatePartyUI();
      this.showToast("❤️ All party members revived & fully restored!");
    });

    this.container.querySelector('#btn-all-crystals')?.addEventListener('click', () => {
      if (!this.saveData) return;
      for (let i = 0; i < 5; i++) {
        this.saveData.flags.crystals[i] = true;
        const cb = this.container.querySelector(`#crys-${i + 1}`);
        if (cb) cb.checked = true;
      }
      this.showToast("💎 All 5 Shadow Crystals collected!");
    });

    this.container.querySelector('#btn-recruit-all')?.addEventListener('click', () => {
      if (!this.saveData) return;
      // Set recruit threshold flags
      for (let r = 600; r < 640; r++) {
        this.saveData.setFlag(r, 10);
      }
      this.showToast("🌟 All 36 Darkners recruited for Castle Town!");
    });

    // Form inputs
    this.container.querySelector('#dr-player-name')?.addEventListener('input', (e) => {
      if (this.saveData) this.saveData.playerName = e.target.value;
    });
    this.container.querySelector('#dr-money')?.addEventListener('input', (e) => {
      if (this.saveData) this.saveData.money = parseInt(e.target.value || "0", 10);
    });
    this.container.querySelector('#dr-lv')?.addEventListener('input', (e) => {
      if (this.saveData) this.saveData.lv = parseInt(e.target.value || "1", 10);
    });

    // Flags
    this.container.querySelector('#flag-jevil')?.addEventListener('change', (e) => {
      if (this.saveData) this.saveData.flags.jevil = e.target.checked;
    });
    this.container.querySelector('#flag-spamton')?.addEventListener('change', (e) => {
      if (this.saveData) this.saveData.flags.spamtonNeo = e.target.checked;
    });
    this.container.querySelector('#flag-tenna')?.addEventListener('change', (e) => {
      if (this.saveData) this.saveData.flags.tenna = e.target.checked;
    });
    this.container.querySelector('#flag-snowgrave')?.addEventListener('change', (e) => {
      if (this.saveData) this.saveData.flags.snowgrave = e.target.checked;
    });

    // Crystals
    for (let i = 1; i <= 5; i++) {
      this.container.querySelector(`#crys-${i}`)?.addEventListener('change', (e) => {
        if (this.saveData) this.saveData.flags.crystals[i - 1] = e.target.checked;
      });
    }
  }

  async loadSampleChapter(ch) {
    try {
      const url = `apps/deltarune/samples/filech${ch}_0`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Could not fetch ${url}`);
      const text = await res.text();
      this.saveData = this.parseSwitchSave(text, `filech${ch}_0`);
      this.fileName = `filech${ch}_0`;
      this.activeChapter = ch;
      this.populateEditor();
    } catch (err) {
      console.error('Failed to load sample save:', err);
    }
  }

  loadFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      this.saveData = this.parseSwitchSave(text, file.name);
      this.fileName = file.name;
      this.populateEditor();
      this.showToast(`Loaded ${file.name} (Chapter ${this.saveData.chapter})`);
    };
    reader.readAsText(file);
  }

  populateEditor() {
    if (!this.saveData) return;
    const d = this.saveData;

    // Show panels
    const panels = this.container.querySelector('#dr-editor-panels');
    if (panels) panels.style.display = 'block';

    // Enable export button
    const exportBtn = this.container.querySelector('#dr-export-btn');
    if (exportBtn) exportBtn.removeAttribute('disabled');

    // Update status badge
    const badge = this.container.querySelector('#dr-status-badge');
    if (badge) {
      badge.textContent = `Chapter ${d.chapter} • ${d.filename}`;
      badge.className = "dr-tag green";
    }

    // Populate general inputs
    const pName = this.container.querySelector('#dr-player-name');
    if (pName) pName.value = d.playerName;

    const pMoney = this.container.querySelector('#dr-money');
    if (pMoney) pMoney.value = d.money;

    const pLv = this.container.querySelector('#dr-lv');
    if (pLv) pLv.value = d.lv;

    const pCh = this.container.querySelector('#dr-active-ch');
    if (pCh) pCh.value = `Chapter ${d.chapter} (${d.characters.length} Party Members)`;

    // Populate Flags
    const fJevil = this.container.querySelector('#flag-jevil');
    if (fJevil) fJevil.checked = d.flags.jevil;

    const fSpamton = this.container.querySelector('#flag-spamton');
    if (fSpamton) fSpamton.checked = d.flags.spamtonNeo;

    const fTenna = this.container.querySelector('#flag-tenna');
    if (fTenna) fTenna.checked = d.flags.tenna;

    const fSnowgrave = this.container.querySelector('#flag-snowgrave');
    if (fSnowgrave) fSnowgrave.checked = d.flags.snowgrave;

    for (let i = 1; i <= 5; i++) {
      const cb = this.container.querySelector(`#crys-${i}`);
      if (cb) cb.checked = d.flags.crystals[i - 1];
    }

    this.updatePartyUI();
  }

  updatePartyUI() {
    if (!this.saveData) return;
    const container = this.container.querySelector('#dr-party-container');
    if (!container) return;

    container.innerHTML = this.saveData.characters.map((c, idx) => `
      <div class="dr-char-card">
        <div class="char-header">
          <span class="char-icon">${this.getCharIcon(c.name)}</span>
          <div>
            <h5>${c.name}</h5>
            <small>Party Member ${idx + 1}</small>
          </div>
        </div>

        <div class="char-stat-row">
          <div class="stat-col">
            <label>HP</label>
            <input type="number" class="dr-stat-input" data-char="${idx}" data-field="hp" value="${c.hp}" min="0" max="999">
          </div>
          <div class="stat-col">
            <label>Max HP</label>
            <input type="number" class="dr-stat-input" data-char="${idx}" data-field="maxHp" value="${c.maxHp}" min="1" max="999">
          </div>
          <div class="stat-col">
            <label>ATK</label>
            <input type="number" class="dr-stat-input" data-char="${idx}" data-field="atk" value="${c.atk}" min="0" max="999">
          </div>
          <div class="stat-col">
            <label>DEF</label>
            <input type="number" class="dr-stat-input" data-char="${idx}" data-field="def" value="${c.def}" min="0" max="999">
          </div>
          <div class="stat-col">
            <label>MAG</label>
            <input type="number" class="dr-stat-input" data-char="${idx}" data-field="mag" value="${c.mag}" min="0" max="999">
          </div>
        </div>

        <div class="char-equip-row">
          <div class="equip-col">
            <label>Weapon</label>
            <select class="dr-equip-select" data-char="${idx}" data-field="weapon">
              ${WEAPONS_CATALOG.map(w => `<option value="${w.id}" ${w.id === c.weapon ? 'selected' : ''}>${w.name}</option>`).join('')}
            </select>
          </div>
          <div class="equip-col">
            <label>Armor 1</label>
            <select class="dr-equip-select" data-char="${idx}" data-field="armor1">
              ${ARMORS_CATALOG.map(a => `<option value="${a.id}" ${a.id === c.armor1 ? 'selected' : ''}>${a.name}</option>`).join('')}
            </select>
          </div>
          <div class="equip-col">
            <label>Armor 2</label>
            <select class="dr-equip-select" data-char="${idx}" data-field="armor2">
              ${ARMORS_CATALOG.map(a => `<option value="${a.id}" ${a.id === c.armor2 ? 'selected' : ''}>${a.name}</option>`).join('')}
            </select>
          </div>
        </div>
      </div>
    `).join('');

    // Bind stat inputs
    container.querySelectorAll('.dr-stat-input').forEach(inp => {
      inp.addEventListener('input', (e) => {
        const cIdx = parseInt(e.target.dataset.char, 10);
        const field = e.target.dataset.field;
        const val = parseInt(e.target.value || "0", 10);
        if (this.saveData && this.saveData.characters[cIdx]) {
          this.saveData.characters[cIdx][field] = val;
        }
      });
    });

    // Bind equip selects
    container.querySelectorAll('.dr-equip-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const cIdx = parseInt(e.target.dataset.char, 10);
        const field = e.target.dataset.field;
        const val = parseInt(e.target.value || "0", 10);
        if (this.saveData && this.saveData.characters[cIdx]) {
          this.saveData.characters[cIdx][field] = val;
        }
      });
    });
  }

  getCharIcon(name) {
    if (name.includes("Kris")) return "🗡️";
    if (name.includes("Susie")) return "🪓";
    if (name.includes("Ralsei")) return "🧣";
    if (name.includes("Noelle")) return "❄️";
    return "⭐";
  }

  exportSaveFile() {
    const serialized = this.serializeSwitchSave();
    if (!serialized) return;

    const blob = new Blob([serialized], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = this.fileName || `filech${this.saveData.chapter}_0`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.showToast(`💾 Successfully exported ${a.download}! Ready for JKSV.`);
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
