/**
 * Skyward Sword HD (Switch) - wiiking2.sav Save Engine
 * Deterministic Specification Mode Engine using SAVE_SCHEMA.json
 */

import schema from './SAVE_SCHEMA.json' assert { type: 'json' };

// Standard CRC32 Generator
const CRC32_TABLE = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) {
    c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  }
  CRC32_TABLE[i] = c >>> 0;
}

export function computeCRC32(uint8Array, start = 0, length = uint8Array.length) {
  let crc = 0xFFFFFFFF;
  const end = start + length;
  for (let i = start; i < end; i++) {
    crc = (crc >>> 8) ^ CRC32_TABLE[(crc ^ uint8Array[i]) & 0xFF];
  }
  return ((crc ^ 0xFFFFFFFF) >>> 0);
}

// Complete Item Database
export const ITEM_DATABASE = {
  0x004E: { name: "Goddess Sword / Practice Sword", category: "sword" },
  0x0058: { name: "Wooden Shield", category: "shield" },
  0x0072: { name: "Beetle", category: "tool" },
  0x0075: { name: "Slingshot", category: "tool" },
  0x0077: { name: "Deku Seeds (Ammo)", category: "ammo" },
  0x0046: { name: "Digging Mitts", category: "tool" },
  0x0080: { name: "Adventure Pouch", category: "pouch_slot" },
  0x0086: { name: "Empty Bottle", category: "bottle" },
  0x008E: { name: "Bug Net", category: "tool" },
  0x001F: { name: "Gratitude Crystal", category: "quest" }
};

export class SSSaveEngine {
  constructor(arrayBuffer) {
    if (arrayBuffer.byteLength !== schema.file_size) {
      console.warn(`[SaveEngine Warning] Expected file size ${schema.file_size} bytes, got ${arrayBuffer.byteLength} bytes.`);
    }

    this.buffer = new Uint8Array(arrayBuffer);
    this.view = new DataView(this.buffer.buffer, this.buffer.byteOffset, this.buffer.byteLength);
    this.schema = schema;
    
    this.slotOffsets = [
      parseInt(schema.slot_offsets.slot_0.offset, 16),
      parseInt(schema.slot_offsets.slot_1.offset, 16),
      parseInt(schema.slot_offsets.slot_2.offset, 16),
      parseInt(schema.slot_offsets.slot_3.offset, 16)
    ];
    
    this.slotSize = schema.slot_size;
    this.checksumRelOffset = parseInt(schema.fields.checksum.rel_offset, 16);
  }

  getSlotOffset(slotIndex) {
    if (slotIndex < 0 || slotIndex >= this.slotOffsets.length) {
      throw new Error(`Out of bounds slot index: ${slotIndex}`);
    }
    return this.slotOffsets[slotIndex];
  }

  readUTF16LE(offset, maxBytes = 16) {
    let chars = [];
    for (let i = 0; i < maxBytes; i += 2) {
      const code = this.view.getUint16(offset + i, true);
      if (code === 0) break;
      chars.push(String.fromCharCode(code));
    }
    return chars.join("");
  }

  writeUTF16LE(offset, text, maxBytes = 16) {
    for (let i = 0; i < maxBytes; i++) {
      this.buffer[offset + i] = 0;
    }
    for (let i = 0; i < Math.min(text.length, maxBytes / 2); i++) {
      const code = text.charCodeAt(i);
      this.view.setUint16(offset + i * 2, code, true);
    }
  }

  readASCII(offset, maxBytes = 8) {
    let chars = [];
    for (let i = 0; i < maxBytes; i++) {
      const b = this.buffer[offset + i];
      if (b === 0) break;
      if (b >= 32 && b <= 126) chars.push(String.fromCharCode(b));
    }
    return chars.join("");
  }

  // Parse a save slot deterministically according to SAVE_SCHEMA.json
  parseSlot(slotIndex) {
    const base = this.getSlotOffset(slotIndex);
    
    let nonZero = 0;
    for (let i = 0; i < 0x1000; i++) {
      if (this.buffer[base + i] !== 0) nonZero++;
    }
    const isEmpty = (nonZero <= 10);

    const storedChecksumBE = this.view.getUint32(base + this.checksumRelOffset, false);
    const calculatedCRC32 = computeCRC32(this.buffer, base, this.checksumRelOffset);

    // Read fields defined in schema
    const nameOffset = base + parseInt(schema.fields.hero_name.rel_offset, 16);
    const name = this.readUTF16LE(nameOffset, schema.fields.hero_name.bytes);
    
    const maxHealthOffset = base + parseInt(schema.fields.max_hearts.rel_offset, 16);
    const maxHealthQuarter = this.view.getUint16(maxHealthOffset, true);
    
    const curHealthOffset = base + parseInt(schema.fields.current_hearts.rel_offset, 16);
    const curHealthQuarter = this.buffer[curHealthOffset];
    
    const rupeesOffset = base + parseInt(schema.fields.rupees.rel_offset, 16);
    const rupees = this.view.getUint16(rupeesOffset, true);

    const stageOffset = base + parseInt(schema.fields.stage_id.rel_offset, 16);
    const stageId = this.readASCII(stageOffset, schema.fields.stage_id.bytes);
    let stageName = "Skyloft";
    if (stageId.includes("F002")) stageName = "Faron Woods";
    else if (stageId.includes("F000")) stageName = "Skyloft";
    else if (stageId.includes("F100")) stageName = "Eldin Volcano";
    else if (stageId.includes("F200")) stageName = "Lanayru Desert";

    // Pouch Array
    const pouchBase = base + parseInt(schema.fields.pouch_equipment_array.rel_offset, 16);
    const pouchItems = [];
    if (!isEmpty) {
      for (let i = 0; i < schema.fields.pouch_equipment_array.bytes; i += 4) {
        const itemId = this.view.getUint16(pouchBase + i, true);
        const qtyLvl = this.view.getUint16(pouchBase + i + 2, true);
        if (itemId !== 0 || qtyLvl !== 0) {
          const itemName = ITEM_DATABASE[itemId]?.name || `Item 0x${itemId.toString(16).toUpperCase()}`;
          pouchItems.push({ itemId, itemName, qtyLvl, location: "pouch" });
        }
      }
    }

    // Locker Storage Array
    const lockerBase = base + parseInt(schema.fields.item_check_locker_array.rel_offset, 16);
    const lockerItems = [];
    if (!isEmpty) {
      for (let i = 0; i < schema.fields.item_check_locker_array.bytes; i += 4) {
        const itemId = this.view.getUint16(lockerBase + i, true);
        const qtyLvl = this.view.getUint16(lockerBase + i + 2, true);
        if (itemId !== 0 || qtyLvl !== 0) {
          const itemName = ITEM_DATABASE[itemId]?.name || `Locker Item 0x${itemId.toString(16).toUpperCase()}`;
          lockerItems.push({ itemId, itemName, qtyLvl, location: "locker" });
        }
      }
    }

    // Treasures
    const amberOffset = base + parseInt(schema.fields.amber_relics.rel_offset, 16);
    const hornOffset  = base + parseInt(schema.fields.monster_horns.rel_offset, 16);
    const plumeOffset = base + parseInt(schema.fields.goddess_plumes.rel_offset, 16);
    const jellyOffset = base + parseInt(schema.fields.jelly_blobs.rel_offset, 16);
    const oreOffset   = base + parseInt(schema.fields.eldin_ore.rel_offset, 16);

    const amberRelics   = (!isEmpty && this.buffer[amberOffset] < 99) ? this.buffer[amberOffset] : 0;
    const monsterHorns  = (!isEmpty && this.buffer[hornOffset] < 99)  ? this.buffer[hornOffset]  : 0;
    const goddessPlumes = (!isEmpty && this.buffer[plumeOffset] < 99) ? this.buffer[plumeOffset] : 0;
    const jellyBlobs    = (!isEmpty && this.buffer[jellyOffset] < 99) ? this.buffer[jellyOffset] : 0;
    const eldinOre      = (!isEmpty && this.buffer[oreOffset] < 99)   ? this.buffer[oreOffset]   : 0;

    return {
      slotIndex,
      isAutosave: (slotIndex === 3),
      isEmpty,
      name: name || (isEmpty ? "Empty Slot" : "Link"),
      stageId,
      stageName: isEmpty ? "Unsaved" : stageName,
      curHealthHearts: isEmpty ? 0 : (curHealthQuarter > 0 && curHealthQuarter <= 80 ? curHealthQuarter / 4 : 4.0),
      curHealthQuarter: isEmpty ? 0 : curHealthQuarter,
      maxHealthHearts: isEmpty ? 0 : (maxHealthQuarter > 0 && maxHealthQuarter <= 80 ? maxHealthQuarter / 4 : 6.0),
      maxHealthQuarter: isEmpty ? 0 : maxHealthQuarter,
      rupees: isEmpty ? 0 : rupees,
      pouchItems,
      lockerItems,
      amberRelics,
      monsterHorns,
      goddessPlumes,
      jellyBlobs,
      eldinOre,
      storedChecksum: `0x${storedChecksumBE.toString(16).padStart(8, '0').toUpperCase()}`,
      calculatedChecksum: `0x${calculatedCRC32.toString(16).padStart(8, '0').toUpperCase()}`,
      isValidChecksum: (storedChecksumBE === calculatedCRC32)
    };
  }

  // Update a save slot using SAVE_SCHEMA.json specification
  updateSlot(slotIndex, data) {
    const base = this.getSlotOffset(slotIndex);

    if (data.name !== undefined) {
      const nameOffset = base + parseInt(schema.fields.hero_name.rel_offset, 16);
      this.writeUTF16LE(nameOffset, data.name, schema.fields.hero_name.bytes);
    }

    if (data.curHealthHearts !== undefined) {
      const curHealthOffset = base + parseInt(schema.fields.current_hearts.rel_offset, 16);
      const quarters = Math.round(data.curHealthHearts * 4);
      this.buffer[curHealthOffset] = quarters;
    }

    if (data.maxHealthHearts !== undefined) {
      const maxHealthOffset = base + parseInt(schema.fields.max_hearts.rel_offset, 16);
      const quarters = Math.round(data.maxHealthHearts * 4);
      this.view.setUint16(maxHealthOffset, quarters, true);
    }

    if (data.rupees !== undefined) {
      const rupeesOffset = base + parseInt(schema.fields.rupees.rel_offset, 16);
      const maxVal = schema.fields.rupees.max_value || 9999;
      this.view.setUint16(rupeesOffset, Math.min(maxVal, Math.max(0, data.rupees)), true);
    }

    if (data.amberRelics !== undefined) {
      const offset = base + parseInt(schema.fields.amber_relics.rel_offset, 16);
      this.buffer[offset] = Math.min(99, data.amberRelics);
    }
    if (data.monsterHorns !== undefined) {
      const offset = base + parseInt(schema.fields.monster_horns.rel_offset, 16);
      this.buffer[offset] = Math.min(99, data.monsterHorns);
    }
    if (data.goddessPlumes !== undefined) {
      const offset = base + parseInt(schema.fields.goddess_plumes.rel_offset, 16);
      this.buffer[offset] = Math.min(99, data.goddessPlumes);
    }
    if (data.jellyBlobs !== undefined) {
      const offset = base + parseInt(schema.fields.jelly_blobs.rel_offset, 16);
      this.buffer[offset] = Math.min(99, data.jellyBlobs);
    }
    if (data.eldinOre !== undefined) {
      const offset = base + parseInt(schema.fields.eldin_ore.rel_offset, 16);
      this.buffer[offset] = Math.min(99, data.eldinOre);
    }

    const newCRC32 = computeCRC32(this.buffer, base, this.checksumRelOffset);
    this.view.setUint32(base + this.checksumRelOffset, newCRC32, false);

    return newCRC32;
  }

  recalculateAllChecksums() {
    for (let i = 0; i < this.slotOffsets.length; i++) {
      const base = this.slotOffsets[i];
      const crc = computeCRC32(this.buffer, base, this.checksumRelOffset);
      this.view.setUint32(base + this.checksumRelOffset, crc, false);
    }
  }

  exportBuffer() {
    this.recalculateAllChecksums();
    return this.buffer;
  }
}
