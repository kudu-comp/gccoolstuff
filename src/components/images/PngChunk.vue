<template>
  <div class="sectionhead">
    {{ $t('pngchunk.title') }}
  </div>
  <div class="mainpage mx-4 d-flex flex-column">
    <div
      class="card card-body mb-2 pb-0"
      v-html="$t('pngchunk.long')"
    />
    
    <!-- Global Error Message -->
    <div v-if="globalError" class="alert error">
      {{ globalError }}
      <button @click="globalError = ''" class="close-btn">&times;</button>
    </div>

    <!-- Upload Section -->
    <div class="card card-body mb-2">
      <div class="h4 card-title">{{ $t('labels.selectfile') }}</div>
      <input class="form-control mb-2" type="file" accept="image/png" @change="handleFileUpload" />
      <p v-if="originalFileName !== 'image'" class="card-text mt-2">
        File: <strong>{{ originalFileName }}.png</strong>
      </p>
    </div>

    <!-- Editor Section -->
    <div v-if="rawBuffer" class="card card-body mb-2">
      <div class="card-title h4">
        Add New Metadata Chunk
      </div>

      <div class="form-group">
        <label class="form-label">Keyword (Required, max 79 chars):</label>
        <input v-model="newKeyword" 
          class="form-control mb-2" 
          placeholder="e.g. Author, Software"
        />
        <span v-if="keywordError" class="error-text">{{ keywordError }}</span>
      </div>

      <div class="form-group">
        <label class="form-label">Text Content:</label>
        <textarea class="form-control mb-2" v-model="newText" rows="3" placeholder="Enter metadata value here..."></textarea>
      </div>

      <div class="button-group">
        <div class="add-buttons">
          <button class="btn sm-size" @click="addChunk('tEXt')">Add tEXt</button>
          <button class="btn sm-size" @click="addChunk('zTXt')">Add zTXt</button>
          <button class="btn sm-size" @click="addChunk('iTXt')">Add iTXt</button>
        </div>
        
        <!-- Download button moved here, disabled until modified -->
        <button 
          class="md-size btn" 
          :disabled="!hasBeenModified" 
          @click="downloadPng"
          :title="!hasBeenModified ? 'Add a chunk first to enable download' : 'Download the modified PNG'"
        >
        <i class="fa-solid fa-download me-2"></i>
          Modified PNG
        </button>
      </div>
      <p v-if="!hasBeenModified" class="hint-text">Add at least one chunk to enable download.</p>
    </div>

    <!-- Chunks Display (Hiding IDAT) -->
    <div v-if="filteredChunks.length" class="card card-body">
      <div class="card-title h4">
        Metadata & Header Chunks
      </div>

      <div v-for="(chunk, index) in filteredChunks" :key="index" class="chunk-card">
        <div class="chunk-header">
          <div class="chunk-id">
            <span class="chunk-type">{{ chunk.type }}</span>
            <span class="chunk-size">{{ chunk.length.toLocaleString() }} bytes</span>
          </div>
          <div class="header-actions">
            <button v-if="chunk.metadata" class="btn me-2 md-size " @click="saveChunkAsTxt(chunk)"><i class="fa-solid fa-save me-2"></i>{{$t('buttons.save')}} .txt</button>
            <button v-if="isMetadataType(chunk.type)" class="btn md-size" @click="removeChunk(chunk.originalIndex)"><i class="fa-solid fa-trash me-2"></i>{{$t('buttons.delete')}}</button>
          </div>
        </div>
        
        <div v-if="chunk.metadata" class="chunk-content">
          <div class="metadata-row">
            <span class="label">Keyword</span>
            <span class="keyword-value">{{ chunk.metadata.keyword }}</span>
          </div>
          <div class="metadata-row">
            <span class="label">Value</span>
            <pre class="text-value">{{ chunk.metadata.text }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const PNG_SIG = new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

const chunks = ref([]);
const rawBuffer = ref(null);
const loading = ref(false);
const globalError = ref('');
const keywordError = ref('');
const hasBeenModified = ref(false); // Track modification state

const originalFileName = ref('image');
const lastActionTag = ref('loaded');
const newKeyword = ref('');
const newText = ref('');

const filteredChunks = computed(() => {
  return chunks.value
    .map((chunk, index) => ({ ...chunk, originalIndex: index }))
    .filter(chunk => chunk.type !== 'IDAT');
});

watch(newKeyword, () => { if (newKeyword.value) keywordError.value = ''; });

const isMetadataType = (type) => ['tEXt', 'zTXt', 'iTXt'].includes(type);

async function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  if (file.type !== 'image/png') {
    globalError.value = "Please upload a valid PNG file.";
    return;
  }
  
  loading.value = true;
  globalError.value = '';
  hasBeenModified.value = false; // Reset modification flag on new file
  originalFileName.value = file.name.replace(/\.[^/.]+$/, "");
  
  try {
    const buffer = await file.arrayBuffer();
    await parseChunks(buffer);
  } catch (err) {
    globalError.value = "Error: " + err.message;
  } finally {
    loading.value = false;
  }
}

async function parseChunks(buffer) {
  const view = new DataView(buffer);
  if (buffer.byteLength < 8) throw new Error("File too small.");
  for (let i = 0; i < 8; i++) if (view.getUint8(i) !== PNG_SIG[i]) throw new Error("Invalid PNG signature.");

  let offset = 8;
  const found = [];
  while (offset < buffer.byteLength) {
    const length = view.getUint32(offset);
    const type = String.fromCharCode(...new Uint8Array(buffer, offset + 4, 4));
    const fullBytes = new Uint8Array(buffer.slice(offset, offset + 12 + length));
    const data = fullBytes.slice(8, 8 + length);
    
    let metadata = null;
    try {
      if (type === 'tEXt') metadata = parsePlainText(data);
      else if (type === 'zTXt') metadata = await parseCompressedText(data);
      else if (type === 'iTXt') metadata = await parseInternationalText(data);
    } catch (e) { metadata = { keyword: "Error", text: "[Decode Failed]" }; }

    found.push({ type, length, fullBytes, metadata });
    offset += 12 + length;
    if (type === 'IEND') break;
  }
  chunks.value = found;
  rawBuffer.value = buffer;
}

async function addChunk(type) {
  if (!newKeyword.value.trim()) { keywordError.value = "Keyword is required."; return; }
  loading.value = true;
  try {
    const encoder = new TextEncoder();
    let data;
    const kBytes = encoder.encode(newKeyword.value);

    if (type === 'tEXt') {
      data = new Uint8Array([...kBytes, 0, ...encoder.encode(newText.value)]);
    } else if (type === 'zTXt') {
      const compressed = await compressData(encoder.encode(newText.value));
      data = new Uint8Array([...kBytes, 0, 0, ...compressed]);
    } else if (type === 'iTXt') {
      data = new Uint8Array([...kBytes, 0, 0, 0, 0, 0, ...encoder.encode(newText.value)]);
    }

    const fullBytes = assembleChunk(type, data);
    chunks.value.splice(chunks.value.length - 1, 0, { 
      type, length: data.length, fullBytes, 
      metadata: { keyword: newKeyword.value, text: newText.value } 
    });

    lastActionTag.value = type;
    hasBeenModified.value = true; // Enable download
    await rebuildFile();
    newKeyword.value = ''; newText.value = '';
  } catch (err) { globalError.value = "Add failed: " + err.message; }
  loading.value = false;
}

async function removeChunk(originalIndex) {
  lastActionTag.value = `del_${chunks.value[originalIndex].type}`;
  chunks.value.splice(originalIndex, 1);
  hasBeenModified.value = true; // Enable download
  await rebuildFile();
}

async function rebuildFile() {
  const parts = [PNG_SIG];
  for (const chunk of chunks.value) parts.push(chunk.fullBytes);
  rawBuffer.value = await new Blob(parts).arrayBuffer();
}

function downloadPng() {
  const name = `${originalFileName.value}_${lastActionTag.value}_${Date.now()}.png`;
  saveBlob(new Blob([rawBuffer.value]), name);
}

function saveChunkAsTxt(chunk) {
  const safeK = chunk.metadata.keyword.replace(/[^a-z0-9]/gi, '_');
  const name = `${originalFileName.value}_${safeK}.txt`;
  const content = `Keyword: ${chunk.metadata.keyword}\nType: ${chunk.type}\nValue: ${chunk.metadata.text}`;
  saveBlob(new Blob([content], { type: 'text/plain' }), name);
}

function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// --- LOGIC HELPERS ---
function assembleChunk(type, data) {
  const typeBytes = new TextEncoder().encode(type);
  const res = new Uint8Array(12 + data.length);
  const view = new DataView(res.buffer);
  view.setUint32(0, data.length);
  res.set(typeBytes, 4);
  res.set(data, 8);
  const crcIn = new Uint8Array([...typeBytes, ...data]);
  view.setUint32(8 + data.length, calculateCRC32(crcIn));
  return res;
}

async function compressData(data) {
  const cs = new CompressionStream('deflate');
  const writer = cs.writable.getWriter();
  writer.write(data); writer.close();
  return new Uint8Array(await new Response(cs.readable).arrayBuffer());
}

function calculateCRC32(data) {
  let crc = -1;
  const table = new Int32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    table[i] = c;
  }
  for (let i = 0; i < data.length; i++) crc = (crc >>> 8) ^ table[(crc ^ data[i]) & 0xFF];
  return (crc ^ -1) >>> 0;
}

function parsePlainText(d) { 
  const i = d.indexOf(0); 
  return { keyword: new TextDecoder('iso-8859-1').decode(d.slice(0, i)), text: new TextDecoder('iso-8859-1').decode(d.slice(i + 1)) };
}

async function parseCompressedText(d) {
  const i = d.indexOf(0);
  const ds = new DecompressionStream('deflate');
  const writer = ds.writable.getWriter();
  writer.write(d.slice(i+2)); writer.close();
  const res = await new Response(ds.readable).arrayBuffer();
  return { keyword: new TextDecoder('iso-8859-1').decode(d.slice(0, i)), text: new TextDecoder('iso-8859-1').decode(new Uint8Array(res)) };
}

async function parseInternationalText(d) {
  const i = d.indexOf(0);
  return { keyword: new TextDecoder('utf-8').decode(d.slice(0, i)), text: new TextDecoder('utf-8').decode(d.slice(i + 5)) };
}
</script>

<style scoped>
.alert { background: #ffeaa7; padding: 15px; border-radius: 8px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #fdcb6e; }
.close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; }

/* Form Section */

/* Buttons */
.button-group { display: flex; justify-content: space-between; align-items: flex-end; gap: 20px; flex-wrap: wrap; }
.add-buttons { display: flex; gap: 8px; }

/* Display List */
.flex-header { display: flex; justify-content: space-between; align-items: center; margin-top: 40px; border-bottom: 2px solid #dfe6e9; padding-bottom: 10px; }
.chunk-card { border: 1px solid #dfe6e9; margin: 5px 0; border-radius: 10px; background: white; overflow: hidden; }
.chunk-header { color: #09776E; background: #f8f9fa; padding: 10px 15px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; }
.chunk-type { font-family: 'Courier New', Courier, monospace; font-weight: bold; font-size: 1.1rem; }
.chunk-size { font-size: 0.75rem; color: #676e70; margin-left: 10px; }

/* Keyword and Value Display */
.chunk-content { padding: 20px; }
.metadata-row { margin-bottom: 10px; }
.metadata-row:last-child { margin-bottom: 0; }
.metadata-row .label { display: block; font-size: 0.7rem; color: #09776E; font-weight: 800; margin-bottom: 2px; letter-spacing: 1px; }
.keyword-value { font-size: 0.9rem; font-weight: 700; color: #2d3436; margin-left: 2px; }
.text-value { font-size: 0.9rem; font-weight: 700; color: #2d3436; margin-left: 2px; white-space: pre-wrap; font-family: inherit; line-height: 1.1; }
.meta-tag { font-size: 0.65rem; color: #b2bec3; font-weight: bold; text-transform: uppercase; }
</style>