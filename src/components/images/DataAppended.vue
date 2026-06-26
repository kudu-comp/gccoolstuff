<template>
  <header class="page-header">
    <h1>{{ t('dataappended.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')" :initialOpen="startOpen">
        <div v-html="t('dataappended.long')" />
      </VCard>
      <VCard :title="t('labels.input')">
        <div class="form-horizontal">
          <label>{{ t('labels.selectfile') }}</label>
          <input type="file" @change="handleCarrierUpload" />
        </div>
        <p v-sif="errormsg" class="errormsg">
          {{ errormsg }}.
        </p>
      </VCard>
      <VCard :title="t('dataappended.injection.title')">
        <label class="checkbox-container">
          <input type="checkbox" v-model="wantsToAppend">
          <span class="checkmark"></span>
          {{ t('dataappended.injection.checkbox') }}
        </label>
        <div v-if="wantsToAppend" class="mt-2">
          <div style="border-style: solid; border-width: 2px; border-radius: 6px; border-color: var(--border-color); padding: 5px;">
            <LoadSecret ref="loader" @update:secret="(val) => { newSecretData = val }" />
          </div>
          <div class="button-row">
            <button @click="saveCombined" class="btn btn-primary mt-2">
              {{ t('dataappended.injection.button') }}
            </button>
          </div>
        </div>
      </VCard>
    </div>
    <div class="card-stack">
      <VCard :title="t('labels.result')">
        <div v-if="carrierFile" class="results">
          <div class="h4 card-title">{{ t('dataappended.results.carrier') }}: <strong>{{ carrierFile.name }}</strong></div>
          <p class="card-text">{{ t('dataappended.results.format') }}: <strong>{{ t(`dataappended.formats.${carrierStats.hostType}`) }}</strong></p>
          
          <p :class="carrierStats.hasExtra ? 'found' : 'not-found'">
            <template v-if="carrierStats.hasExtra">
              ⚠️ {{ t('dataappended.results.found', carrierStats.extraSize) }}
            </template>
            <template v-else>
              ✅ {{ t('dataappended.results.not_found') }}
            </template>
          </p>

          <div v-if="carrierStats.hasExtra">
            <ShowSecret :data="existingSecretData" />
          </div>
        </div>  
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import VCard from '@/components/generic/VCard.vue';
import LoadSecret from '@/components/generic/LoadSecret.vue';
import ShowSecret from '@/components/generic/ShowSecret.vue';
import { useI18n } from 'vue-i18n'

const { t } = useI18n({
  useScope: 'local'
});

const carrierFile = ref(null);
const carrierBuffer = ref(null);
const carrierStats = reactive({ hostType: 'generic', eof: 0, hasExtra: false, extraSize: 0 });
const existingSecretData = ref(null);

const wantsToAppend = ref(false);
const newSecretData = ref(null);
const loader = ref(null);
const startOpen = window.innerWidth > 768;
const errormsg = ref("");
const infomsg = "";

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
  let type = 'generic';

  if (data[4] === 0x66 && data[5] === 0x74 && data[6] === 0x79 && data[7] === 0x70) {
    type = 'mp4';
    let offset = 0;
    while (offset < data.length - 8) {
      const size = (data[offset] << 24) | (data[offset + 1] << 16) | (data[offset + 2] << 8) | data[offset + 3];
      if (size <= 0 || offset + size > data.length) break;
      eof = offset + size;
      offset += size;
    }
  } 
  else if (data[0] === 0x4F && data[1] === 0x67 && data[2] === 0x67 && data[3] === 0x53) {
    type = 'ogg';
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
      if (headerType & 0x04) break; 
      searchPos = idx + pageSize;
    }
  }
  else if (data[0] === 0x46 && data[1] === 0x4F && data[2] === 0x52 && data[3] === 0x4D) {
    type = 'aiff';
    const size = (data[4] << 24) | (data[5] << 16) | (data[6] << 8) | data[7];
    eof = size + 8;
  }
  else if (data[0] === 0x52 && data[1] === 0x49 && data[2] === 0x46 && data[3] === 0x46) {
    type = 'wav';
    const size = data[4] | (data[5] << 8) | (data[6] << 16) | (data[7] << 24);
    eof = size + 8;
  }
  else if (data[0] === 0x89 && data[1] === 0x50 && data[2] === 0x4E && data[3] === 0x47) {
    type = 'png';
    const idx = indexOfSig(data, [0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82], 8);
    if (idx !== -1) eof = idx + 8;
  }
  else if (data[0] === 0xFF && data[1] === 0xD8) {
    type = 'jpg';
    const idx = indexOfSig(data, [0xFF, 0xD9], 2);
    if (idx !== -1) eof = idx + 2;
  }
  else if (data[0] === 0x25 && data[1] === 0x50 && data[2] === 0x44 && data[3] === 0x46) {
    type = 'pdf';
    const idx = indexOfSig(data, [0x25, 0x25, 0x45, 0x4F, 0x46], 5);
    if (idx !== -1) {
      eof = idx + 5;
      while (eof < data.length && (data[eof] === 0x0A || data[eof] === 0x0D || data[eof] === 0x20)) eof++;
    }
  }
  else if (data[0] === 0x49 && data[1] === 0x44 && data[2] === 0x33 || (data[0] === 0xFF && (data[1] & 0xE0) === 0xE0)) {
    type = 'mp3';
    const tagIdx = indexOfSig(data, [0x54, 0x41, 0x47]);
    if (tagIdx !== -1) {
      eof = tagIdx + 128;
    } else {
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
  if (!newSecretData.value || newSecretData.value.length === 0) {
    errormsg.value = t('dataappended.injection.empty_error');
    return;
  }

  const base = carrierBuffer.value.slice(0, carrierStats.eof);
  const final = new Uint8Array(base.length + newSecretData.value.length);
  final.set(base);
  final.set(newSecretData.value, base.length);

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

<i18n lang="json">
{
  "en": {
    "dataappended": {
      "injection": {
        "title": "Injection",
        "checkbox": "Append new secret",
        "button": "Download Carrier + Secret",
        "empty_error": "Please enter text or select a file to append as a secret."
      },
      "results": {
        "carrier": "Carrier",
        "format": "Format",
        "found": "Found {n} appended byte | Found {n} appended bytes",
        "not_found": "No existing secret found."
      },
      "formats": {
        "generic": "Generic Binary",
        "mp4": "MP4 Video",
        "ogg": "OGG Audio/Video",
        "aiff": "AIFF Audio",
        "wav": "WAV Audio",
        "png": "PNG Image",
        "jpg": "JPEG Image",
        "pdf": "PDF Document",
        "mp3": "MP3 Audio"
      }
    }
  },
  "nl": {
    "dataappended": {
      "injection": {
        "title": "Injectie",
        "checkbox": "Nieuw geheim toevoegen",
        "button": "Download Drager + Geheim",
        "empty_error": "Voer a.u.b. tekst in of selecteer een bestand om als geheim toe te voegen."
      },
      "results": {
        "carrier": "Drager",
        "format": "Formaat",
        "found": "{n} toegevoegde byte gevonden | {n} toegevoegde bytes gevonden",
        "not_found": "Geen bestaand geheim gevonden."
      },
      "formats": {
        "generic": "Generiek Binair",
        "mp4": "MP4 Video",
        "ogg": "OGG Audio/Video",
        "aiff": "AIFF Audio",
        "wav": "WAV Audio",
        "png": "PNG Afbeelding",
        "jpg": "JPEG Afbeelding",
        "pdf": "PDF Document",
        "mp3": "MP3 Audio"
      }
    }
  }
}
</i18n>

<style scoped>
.found { color: #d63031; font-weight: bold; }
.not-found { color: #00b894; }
.checkbox-container { display: flex; align-items: center; gap: 10px; cursor: pointer; }
</style>