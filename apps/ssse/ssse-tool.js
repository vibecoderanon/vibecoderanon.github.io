// SSSE Tool Component for vibecoderanon Portal
export class SSSETool {
  constructor(container) {
    this.container = container;
    this.saveBuffer = null;
    this.activeSlot = 0;
    this.slotOffsets = [0x00020, 0x053E0, 0x0A7A0, 0x0FB60];
    this.slotLabels = ["Save File 1", "Save File 2", "Save File 3", "Autosave"];
    
    // CRC32 Table
    this.crcTable = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let j = 0; j < 8; j++) {
        c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      }
      this.crcTable[i] = c >>> 0;
    }
  }

  computeCRC32(uint8Array, start = 0, length = uint8Array.length) {
    let crc = 0xFFFFFFFF;
    const end = start + length;
    for (let i = start; i < end; i++) {
      crc = (crc >>> 8) ^ this.crcTable[(crc ^ uint8Array[i]) & 0xFF];
    }
    return ((crc ^ 0xFFFFFFFF) >>> 0);
  }

  render() {
    this.container.innerHTML = `
      <div class="tool-wrapper ssse-theme">
        <div class="tool-header">
          <div class="tool-brand">
            <span class="tool-icon">🗡️</span>
            <div>
              <h3>Skyward Sword HD — Save Editor</h3>
              <p>Nintendo Switch • Verified Little-Endian <code>wiiking2.sav</code> engine</p>
            </div>
          </div>
          <div class="tool-actions">
            <button id="ssse-load-sample" class="btn btn-secondary">
              <span>📂</span> Load Sample Save
            </button>
            <button id="ssse-export-btn" class="btn btn-primary" disabled>
              <span>💾</span> Export Updated Save
            </button>
          </div>
        </div>

        <div class="tool-body">
          <!-- Dropzone -->
          <div id="ssse-dropzone" class="dropzone" role="button" tabindex="0">
            <div class="dropzone-inner">
              <span class="dropzone-icon">📥</span>
              <div class="dropzone-content">
                <strong>Drop <code>wiiking2.sav</code> here</strong> or click to choose file
                <small>100% private in-browser editing — files never leave your computer</small>
              </div>
              <input type="file" id="ssse-file-input" accept=".sav" style="display:none">
            </div>
          </div>

          <!-- Slot Selector -->
          <div id="ssse-slots" class="slot-grid" style="display:none;">
            ${this.slotLabels.map((label, idx) => `
              <div class="slot-pill ${idx === 0 ? 'active' : ''}" data-slot="${idx}">
                <span class="slot-idx">Slot ${idx + 1}</span>
                <span class="slot-name" id="ssse-slot-name-${idx}">${label}</span>
              </div>
            `).join('')}
          </div>

          <!-- Editor Panel -->
          <div id="ssse-editor" class="editor-panel" style="display:none;">
            <div class="editor-grid">
              <!-- Player Name & Rupees -->
              <div class="panel-card">
                <div class="card-title">👤 Hero Details</div>
                <div class="field-group">
                  <label>Hero Name (UTF-16 LE)</label>
                  <input type="text" id="ssse-name" class="input-text" maxlength="8" placeholder="Link">
                </div>
                <div class="field-group">
                  <div class="label-row">
                    <label>Rupees</label>
                    <span id="ssse-rupee-val" class="field-badge gold">0</span>
                  </div>
                  <input type="range" id="ssse-rupees" class="range-slider gold" min="0" max="9999" value="0">
                  <div class="range-marks"><span>0</span><span>Tycoon Wallet (9999)</span></div>
                </div>
              </div>

              <!-- Health & Heart Containers -->
              <div class="panel-card">
                <div class="card-title">❤️ Health & Hearts</div>
                <div class="field-group">
                  <div class="label-row">
                    <label>Current Health</label>
                    <span id="ssse-cur-hearts-val" class="field-badge red">6.0 Hearts</span>
                  </div>
                  <input type="range" id="ssse-cur-hearts" class="range-slider red" min="1" max="80" value="24">
                  <div class="range-marks"><span>0.25</span><span id="ssse-cur-hearts-max-lbl">6.0 Max</span></div>
                </div>
                <div class="field-group">
                  <div class="label-row">
                    <label>Max Heart Containers</label>
                    <span id="ssse-max-hearts-val" class="field-badge red">6.0 Containers</span>
                  </div>
                  <input type="range" id="ssse-max-hearts" class="range-slider red" min="12" max="80" step="4" value="24">
                  <div class="range-marks"><span>3.0 (Start)</span><span>20.0 (Max)</span></div>
                </div>
              </div>

              <!-- Integrity & Checksum -->
              <div class="panel-card">
                <div class="card-title">🛡️ Slot Integrity & CRC32</div>
                <div class="checksum-display">
                  <div class="checksum-item">
                    <span class="chk-label">Original CRC32:</span>
                    <span id="ssse-orig-crc" class="chk-val">0x00000000</span>
                  </div>
                  <div class="checksum-item">
                    <span class="chk-label">Recalculated CRC32:</span>
                    <span id="ssse-new-crc" class="chk-val highlight">0x00000000</span>
                  </div>
                </div>
                <div class="checksum-status green">
                  <span>✓</span> Automatic CRC32 verification enabled on export
                </div>
              </div>
            </div>
          </div>

          <div id="ssse-toast" class="tool-toast" style="display:none;"></div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const dropzone = this.container.querySelector('#ssse-dropzone');
    const fileInput = this.container.querySelector('#ssse-file-input');
    const btnSample = this.container.querySelector('#ssse-load-sample');
    const btnExport = this.container.querySelector('#ssse-export-btn');

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
    btnExport.addEventListener('click', () => this.exportSave());

    // Slot pills
    this.container.querySelectorAll('.slot-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        this.container.querySelectorAll('.slot-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.activeSlot = parseInt(pill.dataset.slot, 10);
        this.populateSlot(this.activeSlot);
      });
    });

    // Inputs
    const inName = this.container.querySelector('#ssse-name');
    const inRupees = this.container.querySelector('#ssse-rupees');
    const inCurHearts = this.container.querySelector('#ssse-cur-hearts');
    const inMaxHearts = this.container.querySelector('#ssse-max-hearts');

    inName.addEventListener('input', () => this.updateField('name', inName.value));
    inRupees.addEventListener('input', () => {
      this.container.querySelector('#ssse-rupee-val').textContent = inRupees.value;
      this.updateField('rupees', parseInt(inRupees.value, 10));
    });
    inCurHearts.addEventListener('input', () => {
      const q = parseInt(inCurHearts.value, 10);
      this.container.querySelector('#ssse-cur-hearts-val').textContent = `${(q / 4).toFixed(2)} Hearts`;
      this.updateField('curHearts', q);
    });
    inMaxHearts.addEventListener('input', () => {
      const q = parseInt(inMaxHearts.value, 10);
      this.container.querySelector('#ssse-max-hearts-val').textContent = `${(q / 4).toFixed(1)} Containers`;
      inCurHearts.max = q;
      this.container.querySelector('#ssse-cur-hearts-max-lbl').textContent = `${(q / 4).toFixed(1)} Max`;
      this.updateField('maxHearts', q);
    });
  }

  showToast(msg, type = 'info') {
    const toast = this.container.querySelector('#ssse-toast');
    toast.textContent = msg;
    toast.className = `tool-toast show ${type}`;
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 3500);
  }

  async loadSample() {
    try {
      const res = await fetch('apps/ssse/wiiking2.sav');
      if (!res.ok) throw new Error('Sample save not found');
      const buf = await res.arrayBuffer();
      this.initBuffer(buf, 'wiiking2.sav (Sample)');
    } catch (err) {
      this.showToast('Could not load sample: ' + err.message, 'error');
    }
  }

  loadFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => this.initBuffer(e.target.result, file.name);
    reader.readAsArrayBuffer(file);
  }

  initBuffer(arrayBuffer, filename) {
    if (arrayBuffer.byteLength !== 122400) {
      this.showToast(`Warning: Save file size is ${arrayBuffer.byteLength} bytes (expected 122,400). Parsing best-effort.`, 'error');
    }
    this.saveBuffer = new Uint8Array(arrayBuffer);
    this.view = new DataView(this.saveBuffer.buffer);

    this.container.querySelector('#ssse-slots').style.display = 'flex';
    this.container.querySelector('#ssse-editor').style.display = 'block';
    this.container.querySelector('#ssse-export-btn').disabled = false;

    // Refresh slot names
    for (let i = 0; i < 4; i++) {
      const slotBase = this.slotOffsets[i];
      let name = '';
      for (let c = 0; c < 8; c++) {
        const code = this.view.getUint16(slotBase + 0x08D4 + c * 2, true);
        if (code === 0) break;
        name += String.fromCharCode(code);
      }
      if (name.trim()) {
        const lbl = this.container.querySelector(`#ssse-slot-name-${i}`);
        if (lbl) lbl.textContent = `${this.slotLabels[i]} (${name})`;
      }
    }

    this.populateSlot(this.activeSlot);
    this.showToast(`Loaded ${filename} successfully!`, 'success');
  }

  populateSlot(slotIdx) {
    if (!this.view) return;
    const base = this.slotOffsets[slotIdx];

    // Name
    let name = '';
    for (let c = 0; c < 8; c++) {
      const code = this.view.getUint16(base + 0x08D4 + c * 2, true);
      if (code === 0) break;
      name += String.fromCharCode(code);
    }
    this.container.querySelector('#ssse-name').value = name || 'Link';

    // Rupees
    const rupees = this.view.getUint16(base + 0x0908, true);
    this.container.querySelector('#ssse-rupees').value = rupees;
    this.container.querySelector('#ssse-rupee-val').textContent = rupees;

    // Hearts
    const curH = this.view.getUint8(base + 0x090D);
    const maxH = this.view.getUint16(base + 0x09EC, true) || 24;

    this.container.querySelector('#ssse-max-hearts').value = maxH;
    this.container.querySelector('#ssse-max-hearts-val').textContent = `${(maxH / 4).toFixed(1)} Containers`;

    const inCurH = this.container.querySelector('#ssse-cur-hearts');
    inCurH.max = maxH;
    inCurH.value = Math.min(curH, maxH);
    this.container.querySelector('#ssse-cur-hearts-val').textContent = `${(inCurH.value / 4).toFixed(2)} Hearts`;
    this.container.querySelector('#ssse-cur-hearts-max-lbl').textContent = `${(maxH / 4).toFixed(1)} Max`;

    // CRC
    const origCRC = this.view.getUint32(base + 0x53BC, false);
    this.container.querySelector('#ssse-orig-crc').textContent = '0x' + origCRC.toString(16).toUpperCase().padStart(8, '0');
    
    this.recomputeCRC(slotIdx);
  }

  updateField(field, value) {
    if (!this.view) return;
    const base = this.slotOffsets[this.activeSlot];

    if (field === 'name') {
      for (let c = 0; c < 8; c++) {
        const code = c < value.length ? value.charCodeAt(c) : 0;
        this.view.setUint16(base + 0x08D4 + c * 2, code, true);
      }
    } else if (field === 'rupees') {
      this.view.setUint16(base + 0x0908, Math.min(9999, Math.max(0, value)), true);
    } else if (field === 'curHearts') {
      this.view.setUint8(base + 0x090D, value);
    } else if (field === 'maxHearts') {
      this.view.setUint16(base + 0x09EC, value, true);
    }

    this.recomputeCRC(this.activeSlot);
  }

  recomputeCRC(slotIdx) {
    const base = this.slotOffsets[slotIdx];
    // First 0x53BC bytes of the slot
    const slotBytes = this.saveBuffer.subarray(base, base + 0x53BC);
    const newCRC = this.computeCRC32(slotBytes, 0, 0x53BC);
    this.container.querySelector('#ssse-new-crc').textContent = '0x' + newCRC.toString(16).toUpperCase().padStart(8, '0');
    return newCRC;
  }

  exportSave() {
    if (!this.saveBuffer) return;

    // Recalculate CRC for each of the 4 slots
    for (let i = 0; i < 4; i++) {
      const base = this.slotOffsets[i];
      const newCRC = this.recomputeCRC(i);
      this.view.setUint32(base + 0x53BC, newCRC, false);
    }

    const blob = new Blob([this.saveBuffer], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wiiking2.sav';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.showToast('Exported wiiking2.sav with valid Big-Endian CRC32 checksums!', 'success');
  }
}
