<template>

  <header class="page-header">
    <h1>{{ $t('bitplane.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="$t('labels.intro')">
        <div v-html="$t('bitplane.long')" />
      </VCard>
      <VCard :title="$t('labels.input')">
        <div class="form-horizontal">
          <label>{{ $t('labels.selectfile') }}</label>
          <input type="file" accept="image/*" @change="handleImageUpload" />
        </div>
        <p
          v-show="errormsg"
          class="errormsg mt-2"
        >
          {{ errormsg }}.
        </p>          
        <div class="form-horizontal">
          <CustomDropdown 
            v-model="selectedChannel" 
            :options="channelOptions" 
            title="Channel Select"
          />
        </div>
        <div class="form-horizontal">
          <label>Bit Plane: <strong>{{ selectedBit }}</strong><br>(0=LSB, 7=MSB)</label>
          <input type="range" class="range-input" v-model.number="selectedBit" min="0" max="7" step="1" />
        </div>
      </VCard>
      <VCard title="Extracted Data (preview)">
        <div v-if="extractedData">
          <ShowSecret :data="extractedData" />
        </div>
      </VCard>
      <VCard title="Injection">
        <label class="checkbox-container">
          <input type="checkbox" v-model="wantsToInject">
          <span class="checkmark"></span>
          Inject new secret
        </label>
        <div v-if="wantsToInject" class="mt-2">
            ⚠️ <strong>Notice:</strong> Injection is only supported for Native (RGBA) channels to prevent data corruption during color conversion.
          <div class="info-alert mt-2">Capacity: {{ maxCapacityBytes.toLocaleString() }} bytes</div>
          <div style="border-style: solid; border-width: 2px; border-radius: 6px; border-color: var(--border-color); padding: 5px;">
            <LoadSecret @update:secret="val => newSecretData = val" />
          </div>
          <div class="button-row">
            <button @click="injectAndSave" class="btn btn-primary mt-2">Inject & Download Stego PNG</button>
          </div>
        </div>
      </VCard>
    </div> 
    <div class="card-stack">
      <VCard title="Original Image">
        <div v-if="imageLoaded">
          <canvas ref="originalCanvas"></canvas>
        </div>
      </VCard>
      <VCard :title='"Bitplane: " + channelName + " - Bit " + selectedBit' >
        <div v-if="imageLoaded">
          <canvas ref="bitplaneCanvas"></canvas>
        </div>
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue';
import VCard from '@/Components/generic/VCard.vue';
import CustomDropdown from '@/Components/generic/CustomDropdown.vue';
import LoadSecret from '@/Components/generic/LoadSecret.vue';
import ShowSecret from '@/Components/generic/ShowSecret.vue';

const imageLoaded = ref(false);
const originalCanvas = ref(null);
const bitplaneCanvas = ref(null);
const selectedChannel = ref('r');
const selectedBit = ref(0);
const extractedData = ref(null);
const wantsToInject = ref(false);
const newSecretData = ref(null);

const channelOptions = [
  { label: 'Native (RGBA)', value: '', disabled:true },
  { label: 'Red', value: 'r' },
  { label: 'Green', value: 'g' },
  { label: 'Blue', value: 'b' },
  { label: 'Alpha', value: 'a' },
  { label: 'Subtractive (CMYK)', value: '', disabled:true },
  { label: 'Cyan', value: 'c' },
  { label: 'Magenta', value: 'm' },
  { label: 'Yellow', value: 'y' },
  { label: 'Black (Key)', value: 'k' },
  { label: 'Perceptual (HSV)', value: '', disabled:true },
  { label: 'Hue', value: 'h' },
  { label: 'Saturation', value: 's' },
  { label: 'Value', value: 'v' },
]

let ctxOrig = null;
let ctxBit = null;
let imgW = 0;
let imgH = 0;

const channelName = computed(() => {
  const map = { r:'Red', g:'Green', b:'Blue', a:'Alpha', c:'Cyan', m:'Magenta', y:'Yellow', k:'Black', h:'Hue', s:'Saturation', v:'Value' };
  return map[selectedChannel.value];
});

const isExperimental = computed(() => !['r','g','b','a'].includes(selectedChannel.value));
const maxCapacityBytes = computed(() => Math.floor((imgW * imgH) / 8));

/**
 * Robust Color Logic
 * Optimized to handle CMYK/HSV more reliably for bitwise viewing
 */
const getPixelValue = (r, g, b, a, channel) => {
  if (channel === 'r') return r;
  if (channel === 'g') return g;
  if (channel === 'b') return b;
  if (channel === 'a') return a;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  // CMYK logic (Integer based)
  if (['c', 'm', 'y', 'k'].includes(channel)) {
    if (channel === 'k') return 255 - max;
    if (max === 0) return 0; // Pure black
    if (channel === 'c') return ((max - r) / max) * 255;
    if (channel === 'm') return ((max - g) / max) * 255;
    if (channel === 'y') return ((max - b) / max) * 255;
  }

  // HSV logic
  if (['h', 's', 'v'].includes(channel)) {
    if (channel === 'v') return max;
    if (channel === 's') return max === 0 ? 0 : (delta / max) * 255;
    if (channel === 'h') {
      let h = 0;
      if (delta !== 0) {
        if (max === r) h = (g - b) / delta + (g < b ? 6 : 0);
        else if (max === g) h = (b - r) / delta + 2;
        else h = (r - g) / delta + 4;
        h /= 6;
      }
      return h * 255;
    }
  }
  return 0;
};

const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const img = new Image();
  img.onload = () => {
    imgW = img.width; imgH = img.height;
    imageLoaded.value = true;
    setTimeout(() => {
      originalCanvas.value.width = imgW; originalCanvas.value.height = imgH;
      bitplaneCanvas.value.width = imgW; bitplaneCanvas.value.height = imgH;
      ctxOrig = originalCanvas.value.getContext('2d', { willReadFrequently: true });
      ctxBit = bitplaneCanvas.value.getContext('2d');
      ctxOrig.drawImage(img, 0, 0);
      process();
    }, 0);
  };
  img.src = URL.createObjectURL(file);
};

const process = () => {
  if (!ctxOrig) return;
  const imgData = ctxOrig.getImageData(0, 0, imgW, imgH);
  const pixels = imgData.data;
  const bitView = ctxBit.createImageData(imgW, imgH);
  const bitstream = new Uint8Array(maxCapacityBytes.value);
  
  let bitBuf = 0, bitCnt = 0, byteIdx = 0;
  const targetBit = selectedBit.value;
  const chan = selectedChannel.value;

  for (let i = 0; i < pixels.length; i += 4) {
    const val = Math.round(getPixelValue(pixels[i], pixels[i+1], pixels[i+2], pixels[i+3], chan));
    const bit = (val >> targetBit) & 1;

    const color = bit === 1 ? 255 : 0;
    bitView.data[i] = color;
    bitView.data[i+1] = color;
    bitView.data[i+2] = color;
    bitView.data[i+3] = 255;

    bitBuf = (bitBuf << 1) | bit;
    bitCnt++;
    if (bitCnt === 8) {
      bitstream[byteIdx++] = bitBuf;
      bitBuf = 0; bitCnt = 0;
    }
  }
  ctxBit.putImageData(bitView, 0, 0);
  extractedData.value = bitstream;
};

const injectAndSave = () => {
  if (!newSecretData.value || isExperimental.value) return;
  const imgData = ctxOrig.getImageData(0, 0, imgW, imgH);
  const pixels = imgData.data;
  
  const bits = [];
  for (let byte of newSecretData.value) {
    for (let i = 7; i >= 0; i--) bits.push((byte >> i) & 1);
  }

  const chanMap = { r:0, g:1, b:2, a:3 };
  const targetOffset = chanMap[selectedChannel.value];
  const bitMask = 1 << selectedBit.value;

  for (let i = 0; i < bits.length; i++) {
    const pIdx = i * 4 + targetOffset;
    if (bits[i] === 1) pixels[pIdx] |= bitMask;
    else pixels[pIdx] &= ~bitMask;
  }

  const canvas = document.createElement('canvas');
  canvas.width = imgW; canvas.height = imgH;
  canvas.getContext('2d').putImageData(imgData, 0, 0);
  const link = document.createElement('a');
  link.download = `stego_${selectedChannel.value}_bit${selectedBit.value}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
};

watch([selectedChannel, selectedBit], process);
</script>

<style scoped>

canvas {
  width: 100%;
  height: auto;
  border-radius: 10px;
}

</style>