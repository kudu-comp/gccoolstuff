<template>
  <div class="sectionhead">
    {{ $t('bitplane.title') }}
  </div>
  <div class="mainpage mx-4 d-flex flex-column">
    <div
      class="card  pb-2 mb-2"
      v-html="$t('bitplane.long')"
    />

    <!-- Step 1: Carrier Upload -->
    <div class="card card-body mb-2">
      <div class="h4 card-title">{{ $t('labels.selectfile') }}</div>
      <input class="form-control mb-2" type="file" accept="image/*" @change="handleImageUpload" />
    </div>

    <div v-if="imageLoaded" class="results">
      
      <!-- Step 2: Visualization -->
      <div class="card viz-card">
        <div class="h4 card-title">Visual Analysis</div>
        <div class="viz-grid">
          <div class="viz-column">
            <p class="viz-label">Original Image</p>
            <div class="canvas-wrapper">
              <canvas ref="originalCanvas"></canvas>
            </div>
          </div>
          <div class="viz-column">
            <p class="viz-label">
              {{ channelName }} - Bit {{ selectedBit }}
            </p>
            <div class="canvas-wrapper">
              <canvas ref="bitplaneCanvas"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 3: Controls -->
      <div class="card controls-card">
        <div class="h4 card-title">Channel & Bit Selection</div>
        <div class="setting-row">
          <div class="setting-group">
            <label class="form-label">Channel Select:</label>
            <select class="form-select" v-model="selectedChannel">
              <optgroup label="Native (RGBA)">
                <option value="r">Red</option>
                <option value="g">Green</option>
                <option value="b">Blue</option>
                <option value="a">Alpha</option>
              </optgroup>
              <optgroup label="Subtractive (CMYK)">
                <option value="c">Cyan</option>
                <option value="m">Magenta</option>
                <option value="y">Yellow</option>
                <option value="k">Black (Key)</option>
              </optgroup>
              <optgroup label="Perceptual (HSV)">
                <option value="h">Hue</option>
                <option value="s">Saturation</option>
                <option value="v">Value</option>
              </optgroup>
            </select>
          </div>

          <div class="setting-group flex-grow">
            <label>Bit Plane: <strong>{{ selectedBit }}</strong> (0=LSB, 7=MSB)</label>
            <input type="range" v-model.number="selectedBit" min="0" max="7" step="1" />
          </div>
        </div>
        <div class="status-bar">
            Data Reliability: <strong>{{ isExperimental ? 'Low (Derived Space)' : 'High (Native Space)' }}</strong>
        </div>
      </div>

      <!-- Step 4: Extraction -->
      <div v-if="extractedData" class="card">
        <div class="h4 card-title">Extracted Data (Preview)</div>
        <ShowSecret :data="extractedData" />
      </div>

      <!-- Step 5: Injection -->
      <div class="card card-bodyform-check">
        <label class="form-check-label">
          <input class="form-check-input me-2" type="checkbox" v-model="wantsToInject" />
          <strong>Inject new secret</strong>
        </label>

        <div v-if="wantsToInject" class="mt-1">
          <div v-if="isExperimental" class="error-msg">
            ⚠️ <strong>Notice:</strong> Injection is only supported for Native (RGBA) channels to prevent data corruption during color conversion.
          </div>
          <template v-else>
            <div class="info-alert">Capacity: {{ maxCapacityBytes.toLocaleString() }} bytes</div>
            <LoadSecret @update:secret="val => newSecretData = val" />
            <button @click="injectAndSave" class="btn xl-size">Inject & Download Stego PNG</button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue';
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
.analyzer-container { font-family: sans-serif; max-width: 900px; margin: 2rem auto; color: #2d3436; padding: 0 20px; }
.main-title { text-align: center; color: #0984e3; margin-bottom: 2rem; }
.card { background: white; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #dfe6e9; }
.viz-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px; }
.canvas-wrapper { background: #f1f2f6; border: 1px solid #ddd; border-radius: 8px; line-height: 0; min-height: 100px; display: flex; align-items: center; justify-content: center; }
canvas { max-width: 100%; height: auto; display: block; }
.viz-label { font-weight: bold; font-size: 0.8rem; margin-bottom: 8px; color: #636e72; text-transform: uppercase; text-align: center; }
.setting-row { display: flex; flex-wrap: wrap; gap: 20px; align-items: center; }
.setting-group { display: flex; flex-direction: column; gap: 5px; }
.flex-grow { flex-grow: 1; }
.status-bar { margin-top: 15px; font-size: 0.85rem; border-top: 1px solid #eee; padding-top: 10px; color: #636e72; }
.error-msg { color: #d63031; background: #fff5f5; padding: 12px; border-radius: 8px; border: 1px solid #fed7d7; font-size: 0.9rem; }
.btn-save.primary { background: #0984e3; color: white; width: 100%; border: none; padding: 15px; border-radius: 8px; font-weight: bold; cursor: pointer; }
.section-title { font-size: 0.8rem; font-weight: bold; color: #b2bec3; margin-bottom: 15px; text-transform: uppercase; border-bottom: 1px solid #f1f2f6; padding-bottom: 8px; }
.info-alert { background: #cfe6d5; padding: 12px; border-radius: 8px; color: #09776E; margin-bottom: 15px; text-align: center; font-weight: bold; }
@media (max-width: 600px) { .viz-grid { grid-template-columns: 1fr; } }
</style>