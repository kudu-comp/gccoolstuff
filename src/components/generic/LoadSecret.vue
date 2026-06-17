<template>
  <div class="load-secret">
    <div class="input-toggle">
      <button @click="mode = 'text'" :class="{ active: mode === 'text' }">Text</button>
      <button @click="mode = 'file'" :class="{ active: mode === 'file' }">File</button>
      <button @click="mode = 'bitplane'" :class="{ active: mode === 'bitplane' }">Bitplane Image</button>
    </div>

    <div v-if="mode === 'text'" class="input-area">
      <textarea 
        v-model="textInput" 
        @input="emitText"
        placeholder="Enter secret message..." 
        class="secret-textarea"
      ></textarea>
    </div>

    <div v-else-if="mode === 'file'" class="input-area">
      <input class="form-control" type="file" @change="handleFile" ref="fileRef" />
    </div>

    <div v-else-if="mode === 'bitplane'" class="input-area">
      <div class="file-input-wrapper">
        <input class="form-control" type="file" accept="image/*" @change="handleBitplaneFile" ref="bitplaneRef" />
        <p class="hint">Image bits will be extracted based on brightness (>128).</p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const emit = defineEmits(['update:secret']);

const mode = ref('text');
const textInput = ref('');
const fileRef = ref(null);
const bitplaneRef = ref(null);

// Watch for text changes and emit immediately
watch(textInput, (newVal) => {
  if (mode.value === 'text') {
    const encoder = new TextEncoder();
    emit('update:secret', encoder.encode(newVal || ''));
  }
});

// Watch for mode switches to clear/reset the emitted data
watch(mode, () => {
  if (mode.value === 'text') {
    const encoder = new TextEncoder();
    emit('update:secret', encoder.encode(textInput.value || ''));
  } else {
    // If switching to file, reset to null until a file is picked
    emit('update:secret', null);
  }
});

const handleFile = async (e) => {
  const file = e.target.files[0];
  if (file) {
    const buffer = await file.arrayBuffer();
    emit('update:secret', new Uint8Array(buffer));
  } else {
    emit('update:secret', null);
  }
};

const handleBitplaneFile = (e) => {
  const file = e.target.files[0];
  if (!file) {
    emit('update:secret', null);
    return;
  }

  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, img.width, img.height).data;
    const byteLen = Math.floor((img.width * img.height) / 8);
    const output = new Uint8Array(byteLen);
    
    let bitBuf = 0, bitCnt = 0, byteIdx = 0;

    for (let i = 0; i < imageData.length; i += 4) {
      const r = imageData[i];
      const g = imageData[i + 1];
      const b = imageData[i + 2];
      
      const avg = (r + g + b) / 3;
      const bit = avg > 128 ? 1 : 0;

      bitBuf = (bitBuf << 1) | bit;
      bitCnt++;

      if (bitCnt === 8) {
        output[byteIdx++] = bitBuf;
        bitBuf = 0;
        bitCnt = 0;
        if (byteIdx >= byteLen) break;
      }
    }
    emit('update:secret', output);
    URL.revokeObjectURL(img.src);
  };
  img.src = URL.createObjectURL(file);
};

defineExpose({
  reset: () => {
    textInput.value = '';
    if (fileRef.value) fileRef.value.value = '';
    mode.value = 'text';
    emit('update:secret', null);
  }
});
</script>

<style scoped>
.input-toggle { display: flex; background: #f1f2f6; padding: 4px; border-radius: 8px; margin-bottom: 10px; }
.input-toggle button { flex: 1; border: none; padding: 8px; cursor: pointer; border-radius: 6px; background: transparent; font-weight: bold; }
.input-toggle button.active { background: white; color: #09776E; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
.secret-textarea { width: 100%; height: 100px; padding: 10px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; font-family: inherit; }
</style>