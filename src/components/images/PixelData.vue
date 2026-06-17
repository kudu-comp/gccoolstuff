<template>

  <header class="page-header">
    <h1>{{ t('pixeldata.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')">
        <div v-html="t('pixeldata.long')" />
      </VCard>
      <VCard :title="t('labels.input')">
        <div class="form-horizontal">
          <label>{{ t('labels.selectfile') }}</label>
          <input
            type="file"
            ref="fileInputRef"
            class="form-control"
            @change="handleFileChange"
            accept="image/*"
          >
        </div>
        <p
          v-show="errormsg"
          class="errormsg"
        >
          {{ errormsg }}
        </p>
      </VCard>
      <VCard title="Preview">
          <!-- Hidden Canvas for Data Extraction -->
          <img :src="previewUrl" class="image-preview" @click="pickColor">
          <canvas ref="dataCanvasRef" style="display: none;"></canvas>    
      </VCard>
    </div>
    <div class="card-stack">
      <VCard :title="t('pixeldata.title')">
        <div class="card-grid mb-2">
          <VCard :title="t('pixeldata.targetcolor')">
            <p>{{ t('pixeldata.count')}}</p>
            <div class="rgb-inputs">
              <div class="input-group red">
                <label>R</label>
                <input type="number" v-model.number="targetColor.r" min="0" max="255" @input="countSpecificColor">
              </div>
              <div class="input-group green">
                <label>G</label>
                <input type="number" v-model.number="targetColor.g" min="0" max="255" @input="countSpecificColor">
              </div>
              <div class="input-group blue">
                <label>B</label>
                <input type="number" v-model.number="targetColor.b" min="0" max="255" @input="countSpecificColor">
              </div>
            </div>
            <div class="target-swatch" :style="{ backgroundColor: `rgb(${targetColor.r}, ${targetColor.g}, ${targetColor.b})` }"></div>
            <div v-if="matchCount !== null" class="match-result">
              <div class="match-total">{{ formatNum(matchCount) }}</div>
              <div class="match-label">Visible Matches</div>
            </div>
          </VCard>
          <VCard :title="t('pixeldata.metadata')">
              <div v-if="stats" class="stat-row"><span>{{t('exifscanner.width')}}</span> <strong>{{ stats.width }}px</strong></div>
              <div v-if="stats" class="stat-row"><span>{{t('exifscanner.height')}}</span> <strong>{{ stats.height }}px</strong></div>
              <div v-if="stats" class="stat-row"><span>Total Pixels</span> <strong>{{ formatNum(stats.totalPixels) }}</strong></div>
              <div v-if="stats" class="stat-row"><span>Avg Brightness</span> <strong>{{ stats.avgBrightness }}%</strong></div>
          </VCard>
        </div>
        <div class="mb-2">
          <div v-if="isLoading" class="empty-state"><div class="spinner"></div><p>Crunching pixels...</p></div>
          <div v-else-if="!imageLoaded" class="empty-state">
            <div class="icon-bg">📸</div>
            <p>Please upload an image to begin analysis.</p>
          </div>

          <template v-if="!isLoading && imageLoaded">
            <!-- 4. Histogram Section -->
          <VCard :title="t('pixeldata.histogram')">
              <div class="histogram-header">
                <div class="radio-group">
                  <label v-for="mode in ['red', 'green', 'blue', 'brightness']" :key="mode" :class="['radio-btn', mode, { active: histoMode === mode }]">
                    <input type="radio" :value="mode" v-model="histoMode" @change="drawHistogram" hidden />
                    {{ mode }}
                  </label>
                </div>
              </div>
              <div class="histogram-view">
                <canvas ref="histoCanvasRef" width="512" height="150"></canvas>
              </div>
            </VCard>

            <!-- Analysis Grid -->
            <div class="card-grid mt-2" v-if="stats">
              <!-- Channel Intensity Bars -->
              <VCard :title="t('pixeldata.channel')">
                <p>{{t('pixeldata.channelexpl')}}</p>
                <div class="channel-group">
                  <div v-for="c in ['red', 'green', 'blue']" :key="c" class="channel-item">
                    <div class="label-row"><span class="capitalize">{{ c }}</span> <span>{{ formatNum(stats[`${c.charAt(0)}Sum`]) }}</span></div>
                    <div class="bar-bg"><div :class="['fill', c]" :style="{ width: (stats[`${c.charAt(0)}Sum`] / stats.maxPossible * 100) + '%' }"></div></div>
                  </div>
                </div>
              </VCard>

              <!-- Zero Channels -->
              <VCard :title="t('pixeldata.deadzones')">
                <p>{{t('pixeldata.deadzonesexpl')}}</p>
                <div class="pill red">Zero Red: {{ formatNum(stats.zeroR) }}</div>
                <div class="pill green">Zero Green: {{ formatNum(stats.zeroG) }}</div>
                <div class="pill blue">Zero Blue: {{ formatNum(stats.zeroB) }}</div>
              </VCard>

              <!-- Avg Color -->
              <VCard title="Average color">
                <div class="swatch-large" :style="{ backgroundColor: stats.avgColorHex }"></div>
                <div class="hex-display">{{ stats.avgColorHex }}</div>
              </VCard>
            </div>
          </template>
        </div>
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, nextTick } from 'vue'
import VCard from '@/components/generic/VCard.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({
  useScope: 'local'
});

const dataCanvasRef = ref(null)
const histoCanvasRef = ref(null)
const previewUrl = ref(null)
const fileName = ref('')
const imageLoaded = ref(false)
const isLoading = ref(false)
const stats = ref(null)
const matchCount = ref(null)

const histoMode = ref('brightness')
const targetColor = reactive({ r: 255, g: 255, b: 255 })

// We store 256 bins for each channel
let histoData = { red: [], green: [], blue: [], brightness: [] }

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    fileName.value = file.name
    isLoading.value = true
    imageLoaded.value = false
    const reader = new FileReader()
    reader.onload = (ev) => analyzeImage(ev.target.result)
    reader.readAsDataURL(file)
  }
}

function analyzeImage(url) {
  const img = new Image()
  img.src = url
  img.onload = () => {
    previewUrl.value = url
    const canvas = dataCanvasRef.value
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)
    
    setTimeout(() => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      
      // Initialize Histogram Bins
      histoData = { red: Array(256).fill(0), green: Array(256).fill(0), blue: Array(256).fill(0), brightness: Array(256).fill(0) }
      
      let rSum = 0, gSum = 0, bSum = 0, zeroR = 0, zeroG = 0, zeroB = 0, brightnessSum = 0, visiblePixels = 0

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3]
        
        // Fix: Only process non-transparent pixels
        if (a > 0) {
          visiblePixels++
          rSum += r; gSum += g; bSum += b
          if (r === 0) zeroR++
          if (g === 0) zeroG++
          if (b === 0) zeroB++
          
          const lum = Math.round(r * 0.299 + g * 0.587 + b * 0.114)
          brightnessSum += lum
          
          // Populate Histogram
          histoData.red[r]++
          histoData.green[g]++
          histoData.blue[b]++
          histoData.brightness[lum]++
        }
      }

      stats.value = {
        width: img.width, height: img.height, totalPixels: visiblePixels,
        rSum, gSum, bSum, zeroR, zeroG, zeroB,
        maxPossible: visiblePixels * 255,
        avgBrightness: Math.round((brightnessSum / visiblePixels) / 2.55),
        avgColorHex: rgbToHex(Math.round(rSum/visiblePixels), Math.round(gSum/visiblePixels), Math.round(bSum/visiblePixels))
      }
      imageLoaded.value = true
      isLoading.value = false

      // Wait for one "tick" so the histoCanvasRef is actually available in the DOM
      nextTick(() => {
        drawHistogram()
      })    }, 50)
  }
}

function drawHistogram() {
  if (!histoCanvasRef.value) return
  const canvas = histoCanvasRef.value
  const ctx = canvas.getContext('2d')
  const data = histoData[histoMode.value]
  const max = Math.max(...data)
  
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  const colors = { red: '#ef4444', green: '#22c55e', blue: '#3b82f6', brightness: '#6b7280' }
  ctx.fillStyle = colors[histoMode.value]
  
  const binWidth = canvas.width / 256
  for (let i = 0; i < 256; i++) {
    const height = (data[i] / max) * canvas.height
    ctx.fillRect(i * binWidth, canvas.height - height, binWidth, height)
  }
}

const pickColor = (event) => {
  const canvas = dataCanvasRef.value
  const ctx = canvas.getContext('2d')
  const rect = event.target.getBoundingClientRect()
  const scaleX = canvas.width / rect.width
  const scaleY = canvas.height / rect.height
  const x = (event.clientX - rect.left) * scaleX
  const y = (event.clientY - rect.top) * scaleY
  
  const pixel = ctx.getImageData(x, y, 1, 1).data
  targetColor.r = pixel[0]
  targetColor.g = pixel[1]
  targetColor.b = pixel[2]
  countSpecificColor()
}

const countSpecificColor = () => {
  if (!imageLoaded.value) return
  const data = dataCanvasRef.value.getContext('2d').getImageData(0, 0, dataCanvasRef.value.width, dataCanvasRef.value.height).data
  let count = 0
  const { r, g, b } = targetColor
  for (let i = 0; i < data.length; i += 4) {
    if (data[i] === r && data[i+1] === g && data[i+2] === b && data[i+3] > 0) count++
  }
  matchCount.value = count
}

const rgbToHex = (r, g, b) => "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
const formatNum = (num) => new Intl.NumberFormat().format(num)
</script>

<style scoped>
.pixel-analyzer { font-family: 'Inter', sans-serif; padding: 25px; background: #f3f4f6; min-height: 100vh; color: #1f2937; }
.analyzer-header h1 { margin: 0 0 20px 0; font-size: 1.8rem; color: #111827; }
.main-layout { display: grid; grid-template-columns: 320px 1fr; gap: 25px; max-width: 1400px; margin: 0 auto; }

/* Histogram */
.histogram-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.radio-group { display: flex; gap: 5px; }
.radio-btn { font-size: 0.7rem; padding: 4px 8px; border-radius: 4px; cursor: pointer; border: 1px solid #e5e7eb; text-transform: capitalize; }
.radio-btn.active { color: white; border-color: transparent; }
.radio-btn.red.active { background: #ef4444; }
.radio-btn.green.active { background: #22c55e; }
.radio-btn.blue.active { background: #3b82f6; }
.radio-btn.brightness.active { background: #6b7280; }
.histogram-view canvas { width: 100%; height: 200px; background: #f9fafb; border-radius: 4px; }

/* Existing Sidebar Styles */
.stat-row { display: flex; justify-content: space-between; font-size: 0.9rem; padding: 6px 0; border-bottom: 1px solid #f9fafb; }
.rgb-inputs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 10px; }
.input-group { display: flex; flex-direction: column; align-items: center; padding: 8px; border-radius: 8px; }
.input-group label { font-size: 0.7rem; font-weight: bold; margin-bottom: 4px; }
.input-group input { width: 100%; border: 1px solid #ddd; border-radius: 4px; text-align: center; }
.input-group.red { background: #fee2e2; }
.input-group.green { background: #dcfce7; }
.input-group.blue { background: #dbeafe; }
.target-swatch { height: 30px; border-radius: 4px; border: 1px solid #d1d5db; margin-bottom: 10px; }
.match-result { text-align: center; background: #f9fafb; padding: 8px; }
.match-total { font-size: 1.2rem; font-weight: 800; }

.image-preview { max-width: 100%; max-height: 400px; cursor: crosshair; display: block; margin: 0 auto; border-radius: 8px; }
.analysis-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }

.channel-item { margin-bottom: 12px; }
.label-row { display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 600; margin-bottom: 4px; }
.bar-bg { background: #e5e7eb; height: 8px; border-radius: 4px; overflow: hidden; }
.fill { height: 100%; }
.fill.red { background: #ef4444; }
.fill.green { background: #22c55e; }
.fill.blue { background: #3b82f6; }
.pill { padding: 8px; border-radius: 6px; font-weight: 600; margin-bottom: 6px; font-size: 0.8rem; border-left: 4px solid; }
.pill.red { background: var(--bg-color); border-color: #ef4444; }
.pill.green { background: var(--bg-color); border-color: #22c55e; }
.pill.blue { background: var(--bg-color); border-color: #3b82f6; }
.swatch-large { height: 60px; border-radius: 8px; margin-bottom: 10px; }
.hex-display { text-align: center; font-family: monospace; font-weight: bold; }

.spinner { width: 30px; height: 30px; border: 3px solid #e5e7eb; border-top-color: #6366f1; border-radius: 50%; animation: spin 1s infinite linear; margin: 0 auto 10px; }
@keyframes spin { to { transform: rotate(360deg); } }
.empty-state { text-align: center; padding: 100px 20px; color: #9ca3af; background: white; border-radius: 12px; }
.capitalize { text-transform: capitalize; }
</style>