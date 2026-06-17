<template>
  <div class="mb-2" style="display: flex; justify-content: space-between; align-items: center;">
    <div class="h4">Detected filetype: {{ detected.ext.toUpperCase()  }}</div>
    <div class="badge" :class="detected.ext">{{ detected.ext.toUpperCase() }}</div>
  </div>

  <div class="card-title mb-2">Choose how to view and save your secret:</div>
  <div class="radio-group">
    <div class="radio-options">
      <label class="radio-item"><input type="radio" v-model="previewMode" value="auto" /><span class="radio-mark"></span> Detected</label>
      <label class="radio-item"><input type="radio" v-model="previewMode" value="binary" /><span class="radio-mark"></span> Binary</label>
      <label class="radio-item"><input type="radio" v-model="previewMode" value="hex" /><span class="radio-mark"></span> Hex</label>
      <label class="radio-item"><input type="radio" v-model="previewMode" value="txt" /><span class="radio-mark"></span> TXT</label>
      <label class="radio-item"><input type="radio" v-model="previewMode" value="bin" /><span class="radio-mark"></span> BIN</label>
    </div>
  </div>
  <div class="preview-display">
    <!-- Image Preview -->
    <div v-if="previewMode === 'auto' && isImage" class="image-preview">
      <img :src="imageUrl" alt="Secret preview" />
    </div>
    
    <!-- NEW: Audio Preview -->
    <div v-else-if="previewMode === 'auto' && isAudio" class="audio-preview">
      <audio controls :src="audioUrl"></audio>
    </div>

    <!-- Text/Code Preview -->
    <pre v-else class="code-preview">{{ formattedContent }}</pre>
  </div>

  <div class="button-row">
    <button @click="save" class="btn btn-primary mt-2">
      Save Secret as .{{ saveExt }}
      </button>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const props = defineProps({
  data: { type: Uint8Array, required: true }
});

const previewMode = ref('auto');
const imageUrl = ref(null);
const audioUrl = ref(null);

const MAGIC_BYTES = [
  { ext: 'jpg', sig: [0xFF, 0xD8, 0xFF], mime: 'image/jpeg' },
  { ext: 'png', sig: [0x89, 0x50, 0x4E, 0x47], mime: 'image/png' },
  { ext: 'gif', sig: [0x47, 0x49, 0x46, 0x38], mime: 'image/gif' },
  { ext: 'mp4', sig: [0x66, 0x74, 0x79, 0x70], offset: 4, mime: 'video/mp4' },
  { ext: 'ogg', sig: [0x4F, 0x67, 0x67, 0x53], mime: 'audio/ogg' },
  { ext: 'mp3', sig: [0x49, 0x44, 0x33], mime: 'audio/mpeg' },
  { ext: 'zip', sig: [0x50, 0x4B, 0x03, 0x04], mime: 'application/zip' },
  { ext: 'pdf', sig: [0x25, 0x50, 0x44, 0x46], mime: 'application/pdf' },
  { ext: 'wav', sig: [0x52, 0x49, 0x46, 0x46], mime: 'audio/wav' },
  { ext: 'aiff', sig: [0x46, 0x4F, 0x52, 0x4D], mime: 'audio/aiff' },
];

const detected = computed(() => {
  for (const s of MAGIC_BYTES) {
    const offset = s.offset || 0;
    const match = s.sig.every((byte, i) => props.data[offset + i] === byte);
    if (match) return s;
  }
  const isAscii = Array.from(props.data.slice(0, 500)).every(b => (b >= 32 && b <= 126) || [9, 10, 13].includes(b));
  return isAscii ? { ext: 'txt', mime: 'text/plain' } : { ext: 'bin' };
});

const isImage = computed(() => detected.value.mime?.startsWith('image/'));
const isAudio = computed(() => detected.value.mime?.startsWith('audio/'));

watch(() => props.data, (newData) => {
  // Cleanup
  if (imageUrl.value) URL.revokeObjectURL(imageUrl.value);
  if (audioUrl.value) URL.revokeObjectURL(audioUrl.value);
  imageUrl.value = null;
  audioUrl.value = null;

  if (newData && newData.length > 0) {
    if (isImage.value) {
      imageUrl.value = URL.createObjectURL(new Blob([newData], { type: detected.value.mime }));
    } else if (isAudio.value) {
      audioUrl.value = URL.createObjectURL(new Blob([newData], { type: detected.value.mime }));
    }
  }
}, { immediate: true });

const formattedContent = computed(() => {
  const slice = props.data.slice(0, 4096);
  if (previewMode.value === 'binary') return Array.from(slice).map(b => b.toString(2).padStart(8, '0')).join(' ');
  if (previewMode.value === 'hex') return Array.from(slice).map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ');
  if (previewMode.value === 'auto' && detected.value.ext === 'bin') return Array.from(slice).map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ');
  return new TextDecoder().decode(slice);
});

const saveExt = computed(() => {
  if (previewMode.value === 'auto') return detected.value.ext;
  return previewMode.value === 'bin' ? 'bin' : 'txt';
});

const save = () => {
  const isStringMode = ['binary', 'hex'].includes(previewMode.value);
  const blob = new Blob([isStringMode ? formattedContent.value : props.data], { 
    type: isStringMode ? 'text/plain' : 'application/octet-stream' 
  });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `extracted_secret.${saveExt.value}`;
  a.click();
  URL.revokeObjectURL(a.href);
};

onUnmounted(() => imageUrl.value && URL.revokeObjectURL(imageUrl.value));
</script>

<style scoped>
.preview-display { background: #2d3436; border-radius: 8px; max-height: 350px; overflow-y: auto; margin-top: 10px; }
.code-preview { padding: 15px; font-family: 'Courier New', monospace; font-size: 13px; color: #dfe6e9; margin: 0; white-space: pre-wrap; word-break: normal; line-height: 1.8; }
.audio-preview audio { width: 100%; filter: invert(1) hue-rotate(180deg); }
.image-preview img { max-width: 100%; display: block; margin: 0 auto; }
.badge { font-size: 0.75rem; padding: 3px 10px; border-radius: 5px; color: white; background: #b2bec3; }
.badge.txt { background: #00b894; }
.badge.jpg, .badge.png { background: #e84393; }
</style>