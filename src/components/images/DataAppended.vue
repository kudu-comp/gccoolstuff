<template>
  <div class="sectionhead">
    {{ $t('dataappended.title') }}
  </div>
  <div class="mainpage mx-4 d-flex flex-column">
    <div
      class="card pb-2"
      v-html="$t('dataappended.long')"
    />
    <div class="card card-body">
      <div class="h4 card-title">{{$t('labels.selectfile')}}</div>
      <input class="form-control mb-2" type="file" @change="handleCarrierUpload" />
    </div>

    <div v-if="carrierFile" class="results">
      <div class="card card-body">
        <div class="h4 card-title">Carrier: {{ carrierFile.name }}</div>
        <p class="card-text">Format: <strong>{{ carrierStats.hostType }}</strong></p>
        <p :class="carrierStats.hasExtra ? 'found' : 'not-found'">
          {{ carrierStats.hasExtra ? `⚠️ Found ${carrierStats.extraSize} appended bytes` : '✅ No existing secret found.' }}
        </p>
      </div>

      <!-- Existing Secret Analysis -->
      <div v-if="carrierStats.hasExtra">
        <ShowSecret :data="existingSecretData" />
      </div>

      <!-- Append New Secret -->
      <div class="card">
        <label class="form-check-label">
          <input class="form-check-input me-2" type="checkbox" v-model="wantsToAppend" />
          <strong>Append new secret to this file</strong>
        </label>

        <div v-if="wantsToAppend">
          <LoadSecret ref="loader" @update:secret="(val) => { newSecretData = val }" />
          
          <div class="mt-2">
            <button @click="saveCombined" class="btn md-size">
              Download Carrier + Secret
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import LoadSecret from '@/components/generic/LoadSecret.vue';
import ShowSecret from '@/components/generic/ShowSecret.vue';

const carrierFile = ref(null);
const carrierBuffer = ref(null);
const carrierStats = reactive({ hostType: '', eof: 0, hasExtra: false, extraSize: 0 });
const existingSecretData = ref(null);

const wantsToAppend = ref(false);
const newSecretData = ref(null);
const loader = ref(null);

const handleCarrierUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  carrierFile.value = file;
  wantsToAppend.value = false;
  if (loader.value) loader.value.reset();

  const buffer = await file.arrayBuffer();
  carrierBuffer.value = new Uint8Array(buffer);
  analyze();
};

const analyze = () => {
  const data = carrierBuffer.value;
  let eof = data.length;
  let type = 'Generic';

  // 1. MP4 Logic (Atom Parsing)
  if (data[4] === 0x66 && data[5] === 0x74 && data[6] === 0x79 && data[7] === 0x70) {
    type = 'MP4 Video';
    let offset = 0;
    while (offset < data.length - 8) {
      const size = (data[offset] << 24) | (data[offset + 1] << 16) | (data[offset + 2] << 8) | data[offset + 3];
      if (size <= 0 || offset + size > data.length) break;
      eof = offset + size;
      offset += size;
    }
  } 
  // 2. OGG Logic (Page Parsing for EOS bit)
  else if (data[0] === 0x4F && data[1] === 0x67 && data[2] === 0x67 && data[3] === 0x53) {
    type = 'OGG Audio/Video';
    let searchPos = 0;
    while (true) {
      const idx = indexOfSig(data, [0x4F, 0x67, 0x67, 0x53], searchPos);
      if (idx === -1) break;
      const headerType = data[idx + 5];
      const nSegments = data[idx + 26];
      let segmentSum = 0;
      for (let i = 0; i < nSegments; i++) segmentSum += data[idx + 27 + i];
      const pageSize = 27 + nSegments + segmentSum;
      eof = idx + pageSize;
      if (headerType & 0x04) break; // End of Stream bit
      searchPos = idx + pageSize;
    }
  }
  // 3. AIFF Logic (Big Endian RIFF)
  else if (data[0] === 0x46 && data[1] === 0x4F && data[2] === 0x52 && data[3] === 0x4D) {
    type = 'AIFF Audio';
    const size = (data[4] << 24) | (data[5] << 16) | (data[6] << 8) | data[7];
    eof = size + 8;
  }
  // 4. WAV Logic (Little Endian RIFF)
  else if (data[0] === 0x52 && data[1] === 0x49 && data[2] === 0x46 && data[3] === 0x46) {
    type = 'WAV Audio';
    const size = data[4] | (data[5] << 8) | (data[6] << 16) | (data[7] << 24);
    eof = size + 8;
  }
  // 5. PNG Logic (IEND chunk)
  else if (data[0] === 0x89 && data[1] === 0x50 && data[2] === 0x4E && data[3] === 0x47) {
    type = 'PNG Image';
    const idx = indexOfSig(data, [0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82], 8);
    if (idx !== -1) eof = idx + 8;
  }
  // 6. JPG Logic (EOI marker)
  else if (data[0] === 0xFF && data[1] === 0xD8) {
    type = 'JPEG Image';
    const idx = indexOfSig(data, [0xFF, 0xD9], 2);
    if (idx !== -1) eof = idx + 2;
  }
  // 7. PDF Logic (%%EOF marker)
  else if (data[0] === 0x25 && data[1] === 0x50 && data[2] === 0x44 && data[3] === 0x46) {
    type = 'PDF Document';
    const idx = indexOfSig(data, [0x25, 0x25, 0x45, 0x4F, 0x46], 5);
    if (idx !== -1) {
      eof = idx + 5;
      // Skip trailing PDF whitespace/linefeeds
      while (eof < data.length && (data[eof] === 0x0A || data[eof] === 0x0D || data[eof] === 0x20)) eof++;
    }
  }
  // 8. MP3 Logic (ID3v1 Footer check)
  else if (data[0] === 0x49 && data[1] === 0x44 && data[2] === 0x33 || (data[0] === 0xFF && (data[1] & 0xE0) === 0xE0)) {
    type = 'MP3 Audio';
    // Check for ID3v1 "TAG" near the end of the byte stream
    const tagIdx = indexOfSig(data, [0x54, 0x41, 0x47]);
    if (tagIdx !== -1) {
      eof = tagIdx + 128;
    } else {
      // Fallback: search for last likely frame sync
      for (let i = data.length - 2; i > 0; i--) {
        if (data[i] === 0xFF && (data[i + 1] & 0xE0) === 0xE0) {
          eof = i + 2;
          break;
        }
      }
    }
  }

  const extra = eof < data.length ? data.slice(eof) : null;
  carrierStats.hostType = type;
  carrierStats.eof = eof;
  carrierStats.hasExtra = !!extra && extra.length > 0;
  carrierStats.extraSize = extra ? extra.length : 0;
  existingSecretData.value = extra;
};

const saveCombined = () => {
  // Check if we actually have data to append
  if (!newSecretData.value || newSecretData.value.length === 0) {
    alert('Please enter text or select a file to append as a secret.');
    return;
  }

  // 1. Get the "Clean" base (original file up to its first EOF)
  const base = carrierBuffer.value.slice(0, carrierStats.eof);
  
  // 2. Create new array with combined length
  const final = new Uint8Array(base.length + newSecretData.value.length);
  
  // 3. Set the parts
  final.set(base);
  final.set(newSecretData.value, base.length);

  // 4. Download logic
  const blob = new Blob([final], { type: carrierFile.value.type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  
  const fileName = carrierFile.value.name;
  const lastDot = fileName.lastIndexOf('.');
  const newName = lastDot !== -1 
    ? `${fileName.substring(0, lastDot)}_secret${fileName.substring(lastDot)}`
    : `${fileName}_secret`;

  a.download = newName;
  a.click();
  URL.revokeObjectURL(a.href);
};

function indexOfSig(data, sig, startAt = 0) {
  for (let i = startAt; i <= data.length - sig.length; i++) {
    let match = true;
    for (let j = 0; j < sig.length; j++) if (data[i+j] !== sig[j]) { match = false; break; }
    if (match) return i;
  }
  return -1;
}
</script>

<style>
/* Global-ish container styles */
.analyzer-container { font-family: sans-serif; max-width: 750px; margin: 2rem auto; color: #2d3436; }
.card { border-radius: 10px; padding: 1.5rem; margin-bottom: 1.2rem; box-shadow: 0 4px 12px rgba(0,0,0,0.08); border: 1px solid #dfe6e9; }
.upload-box { border: 2px dashed #0984e3; text-align: center; background: #f0f7ff; }
.found { color: #d63031; font-weight: bold; }
.not-found { color: #00b894; }
.btn-save.primary { background: #0984e3; color: white; width: 100%; border: none; padding: 12px; border-radius: 6px; font-weight: bold; cursor: pointer; }
.section-title { font-size: 0.8rem; font-weight: bold; color: #636e72; text-transform: uppercase; margin-bottom: 10px; }
.checkbox-container { display: flex; align-items: center; gap: 10px; cursor: pointer; }
</style>