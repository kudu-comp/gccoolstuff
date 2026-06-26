<template>

  <header class="page-header">
    <h1>{{ t('pixelbuild.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')" :initialOpen="startOpen">
        <div v-html="t('pixelbuild.long')" />
      </VCard>
      <VCard :title="t('labels.input')">
        <textarea
            v-model="message"
            ref="messageInput"
            :placeholder="t('pixelbuild.input')"
            rows="5"
          />
        <div class="button-row mt-2">
          <button id="draw" class="btn btn-primary" @click="drawPixels">
            {{ t('buttons.show') }}
          </button>
          <DownloadButton
            v-model:canvas = "canvasRef"
          />
        </div>
        <p
          v-show="errormsg"
          class="errormsg"
        >
          {{ errormsg }}
        </p>
      </VCard>
      <VCard :title="t('labels.settings')">
        <div class="form-horizontal">
          <label>{{ t('pixelbuild.height') }}</label>
          <input
            id="imgheight"
            v-model="imgHeight"
            type="number"
          >
        </div>
        <div class="form-horizontal">
          <label>{{ t('pixelbuild.width') }}</label>
          <input
            id="imgwidth"
            v-model="imgWidth"
            type="number"
          >
        </div>
        <div v-for="(v, idx) in vars">
          <div class="form-horizontal">
            <label>{{ t('labels.variable') }}</label>
            <input type="text" v-model="vars[idx]">
            <label>{{ t('labels.color') }}</label>
            <input type="color" v-model="cols[idx]">
          </div>
        </div>
      </VCard>
    </div>
    <div class="card-stack">
      <VCard title='Preview'>
        <canvas
          ref="canvasRef"
        />
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { ref, shallowRef, onMounted } from 'vue'
import DownloadButton from '@/components/generic/DownloadButton.vue'
import VCard from '@/components/generic/VCard.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n();

defineOptions({
  name: 'PixelBuild'
})

// --- Template Refs ---
const canvasRef = ref(null)
const messageInput = ref(null)
const startOpen = window.innerWidth > 768;

// --- State ---
const errormsg = ref("")
const message = ref("")
const imgHeight = ref(null)
const imgWidth = ref(null)

// Constants
const vars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
const cols = [
  "#FFFFFF", "#000000", "#FF0000", "#00FF00", "#0000FF", 
  "#FFFF00", "#FF00FF", "#00FFFF", "#888888", "#444444"
]

// Non-reactive context
let ctx = null

onMounted(() => {
  if (canvasRef.value) {
    ctx = canvasRef.value.getContext('2d')
    const rect = canvasRef.value.getBoundingClientRect()
    // Setup initial size
    canvasRef.value.width = rect.width
    canvasRef.value.height = rect.width
  }
  
  // Focus textarea
  messageInput.value?.focus()
})

// --- Methods ---

const drawPixels = () => {
  if (!ctx || !message.value) return
  
  errormsg.value = ""
  const lines = message.value.split(/\n/g)
  
  if (lines.length === 0 || lines[0].length === 0) {
    errormsg.value = "No valid data to draw"
    return
  }

  // Determine grid dimensions
  const h = imgHeight.value || lines.length
  const w = imgWidth.value || lines[0].length

  // Clear previous drawings
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)

  // Size of a rectangle
  const rectHeight = Math.trunc(canvasRef.value.height / h)
  const rectWidth = Math.trunc(canvasRef.value.width / w)

  // Draw rectangles
  for (let r = 0; r < h; r++) {
    // Safety check for row existence
    if (!lines[r]) continue;

    for (let c = 0; c < w; c++) {
      // Default to transparent if no match
      ctx.fillStyle = "rgba(0,0,0,0)"
      
      const char = lines[r][c]
      
      // Map character to color
      for (let i = 0; i < 10; i++) {
        if (char === vars[i]) {
          ctx.fillStyle = cols[i]
          break
        }
      }

      // Draw the pixel
      // Note: kept the +5 offset from your original code
      ctx.fillRect(c * rectWidth + 5, r * rectHeight, rectWidth, rectHeight)
    }
  }
}
</script>

<style scoped>

.card-grid {
   grid-template-columns: 1fr;
}

@media (min-width: 750px) {
  .card-grid {
    grid-template-columns: 33% 1fr;
  }
}

canvas {
  width: 100%;
  height: auto;
  padding-right: 15px
}

.form-horizontal label{
  flex: 0 0 100px;
}
</style>

<i18n locale="en">
{
  "pixelbuild": {
    "width": "Width",
    "height": "Height",
    "input": "Use variables to draw the picture..."
  }
}
</i18n>

<i18n locale="nl">
{
  "pixelbuild": {
    "size": "Grootte",
    "width": "Breedte",
    "input": "Gebruik de variabelen om een afbeelding te tekenen..."
  }
}
</i18n>