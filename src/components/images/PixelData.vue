<template>
  <header class="page-header">
    <h1>{{ t('pixeldata.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <!-- Intro Card -->
      <VCard :title="t('labels.intro')" :initialOpen="startOpen">
        <div v-html="t('pixeldata.long')" />
      </VCard>

      <!-- Input Card -->
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
        <p v-show="errormsg" class="errormsg">
          {{ errormsg }}
        </p>
      </VCard>

      <!-- Preview Card -->
      <VCard :title="t('labels.preview')">
          <img :src="previewUrl" class="image-preview" @click="pickColor">
          <canvas ref="dataCanvasRef" style="display: none;"></canvas>    
      </VCard>
    </div>

    <div class="card-stack">
      <VCard :title="t('pixeldata.analysis_title')">
        <div class="card-grid mb-2">
          <!-- Target Color Picker -->
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
              <div class="match-label">{{ t('pixeldata.visible_matches') }}</div>
            </div>
          </VCard>

          <!-- Metadata -->
          <VCard :title="t('pixeldata.metadata')">
              <div v-if="stats" class="stat-row"><span>{{ t('pixeldata.width') }}</span> <strong>{{ stats.width }}px</strong></div>
              <div v-if="stats" class="stat-row"><span>{{ t('pixeldata.height') }}</span> <strong>{{ stats.height }}px</strong></div>
              <div v-if="stats" class="stat-row"><span>{{ t('pixeldata.total_pixels') }}</span> <strong>{{ formatNum(stats.totalPixels) }}</strong></div>
              <div v-if="stats" class="stat-row"><span>{{ t('pixeldata.avg_brightness') }}</span> <strong>{{ stats.avgBrightness }}%</strong></div>
          </VCard>
        </div>

        <div class="mb-2">
          <!-- Loading / Empty States -->
          <div v-if="isLoading" class="empty-state">
            <div class="spinner"></div>
            <p>{{ t('pixeldata.processing') }}</p>
          </div>
          <div v-else-if="!imageLoaded" class="empty-state">
            <div class="icon-bg">📸</div>
            <p>{{ t('pixeldata.empty_state') }}</p>
          </div>

          <template v-if="!isLoading && imageLoaded">
            <!-- Histogram Section -->
            <VCard :title="t('pixeldata.histogram')">
              <div class="histogram-header">
                <div class="radio-group">
                  <label 
                    v-for="mode in ['red', 'green', 'blue', 'brightness']" 
                    :key="mode" 
                    :class="['radio-btn', mode, { active: histoMode === mode }]"
                  >
                    <input type="radio" :value="mode" v-model="histoMode" @change="drawHistogram" hidden />
                    {{ t(`pixeldata.modes.${mode}`) }}
                  </label>
                </div>
              </div>
              <div class="histogram-view">
                <canvas ref="histoCanvasRef" width="512" height="150"></canvas>
              </div>
            </VCard>

            <!-- Analysis Grid -->
            <div class="card-grid mt-2" v-if="stats">
              <!-- Channel Intensity -->
              <VCard :title="t('pixeldata.channel')">
                <p>{{ t('pixeldata.channelexpl') }}</p>
                <div class="channel-group">
                  <div v-for="c in ['red', 'green', 'blue']" :key="c" class="channel-item">
                    <div class="label-row">
                      <span class="capitalize">{{ t(`pixeldata.modes.${c}`) }}</span> 
                      <span>{{ formatNum(stats[`${c.charAt(0)}Sum`]) }}</span>
                    </div>
                    <div class="bar-bg">
                      <div :class="['fill', c]" :style="{ width: (stats[`${c.charAt(0)}Sum`] / stats.maxPossible * 100) + '%' }"></div>
                    </div>
                  </div>
                </div>
              </VCard>

              <!-- Zero Channels -->
              <VCard :title="t('pixeldata.deadzones')">
                <p>{{ t('pixeldata.deadzonesexpl') }}</p>
                <div class="pill red">{{ t('pixeldata.modes.red') }}: {{ formatNum(stats.zeroR) }}</div>
                <div class="pill green">{{ t('pixeldata.modes.green') }}: {{ formatNum(stats.zeroG) }}</div>
                <div class="pill blue">{{ t('pixeldata.modes.blue') }}: {{ formatNum(stats.zeroB) }}</div>
              </VCard>

              <!-- Avg Color -->
              <VCard :title="t('pixeldata.avg_color')">
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
import { ref, reactive, nextTick } from 'vue'
import VCard from '@/components/generic/VCard.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({
  useScope: 'local'
});

const startOpen = window.innerWidth > 768;

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
      histoData = { red: Array(256).fill(0), green: Array(256).fill(0), blue: Array(256).fill(0), brightness: Array(256).fill(0) }
      
      let rSum = 0, gSum = 0, bSum = 0, zeroR = 0, zeroG = 0, zeroB = 0, brightnessSum = 0, visiblePixels = 0

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3]
        if (a > 0) {
          visiblePixels++
          rSum += r; gSum += g; bSum += b
          if (r === 0) zeroR++
          if (g === 0) zeroG++
          if (b === 0) zeroB++
          const lum = Math.round(r * 0.299 + g * 0.587 + b * 0.114)
          brightnessSum += lum
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
      nextTick(() => { drawHistogram() })
    }, 50)
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
  targetColor.r = pixel[0]; targetColor.g = pixel[1]; targetColor.b = pixel[2]
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

<i18n lang="json">
{
  "en": {
    "pixeldata": {
      "width": "Width",
      "height": "Height",
      "analysis_title": "Analysis Results",
      "targetcolor": "Target color search",
      "metadata": "Image metadata",
      "channelexpl": "Sum of all R, G and B values in the image",
      "deadzones": "Dead zones",
      "avgcol": "Average color",
      "count": "Count how many pixels exactly match this color. Click in the preview or select R, G and B.",
      "visible_matches": "Visible Matches",
      "total_pixels": "Total Pixels",
      "avg_brightness": "Avg Brightness",
      "histogram": "Color Distribution (Histogram)",
      "channel": "Channel Intensity",
      "deadzonesexpl": "Number of pixels where a channel is exactly 0.",
      "avg_color": "Average Color",
      "processing": "Crunching pixels...",
      "empty_state": "Please upload an image to begin analysis.",
      "modes": {
        "red": "Red",
        "green": "Green",
        "blue": "Blue",
        "brightness": "Brightness"
      }
    }
  },
  "nl": {
    "pixeldata": {
      "size": "Grootte",
      "width": "Breedte",
      "analysis_title": "Analyseresultaten",
      "count": "Klik in de preview of selecteer rood, groen en blauw om het aantal pixels met deze kleur te tellen.",
      "targetcolor": "Tel een specifieke kleur",
      "metadata": "Afbeelding metadata",
      "channel": "RGB Intensiteit",
      "channelexpl": "Som van alle R, G en  B waardes in de afbeelding",
      "deadzones": "Dead zones",
      "deadzonesexpl": "Pixels waar R, G of B gelijk is aan 0",
      "avgcol": "Gemiddelde kleur",
      "visible_matches": "Gevonden Overeenkomsten",
      "total_pixels": "Totaal aantal pixels",
      "avg_brightness": "Gem. Helderheid",
      "histogram": "Kleurverdeling (Histogram)",
      "avg_color": "Gemiddelde Kleur",
      "processing": "Pixels verwerken...",
      "empty_state": "Upload a.u.b. een afbeelding om de analyse te starten.",
      "modes": {
        "red": "Rood",
        "green": "Groen",
        "blue": "Blauw",
        "brightness": "Helderheid"
      }
    }
  }
}


</i18n>

<style scoped>
.histogram-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.radio-group { display: flex; gap: 5px; }
.radio-btn { font-size: 0.7rem; padding: 4px 8px; border-radius: 4px; cursor: pointer; border: 1px solid #e5e7eb; text-transform: capitalize; }
.radio-btn.active { color: white; border-color: transparent; }
.radio-btn.red.active { background: #ef4444; }
.radio-btn.green.active { background: #22c55e; }
.radio-btn.blue.active { background: #3b82f6; }
.radio-btn.brightness.active { background: #6b7280; }
.histogram-view canvas { width: 100%; height: 200px; background: #f9fafb; border-radius: 4px; }
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