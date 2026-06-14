<template>

  <header class="page-header">
    <h1>{{ $t('filltool.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="$t('labels.intro')">
        <div v-html="$t('filltool.long')" />
      </VCard>
      <VCard :title="$t('labels.input')">
        <div class="form-horizontal">
          <label>{{ $t('labels.selectfile') }}</label>
          <input
            type="file"
            accept="image/*"
            ref="fileInputRef"
            @change="selectFile"
          >
        </div>
        <p
          v-show="errormsg"
          class="errormsg mt-2"
        >
          {{ errormsg }}
        </p>
      </VCard>
      <VCard :title="$t('labels.settings')">
          <div class="input-box mb-2">
            <h4>
              {{ $t('filltool.fill') }}
            </h4>
            <p>{{ $t('filltool.fillinfo') }}</p>
            <div class="form-horizontal">
              <label
                class="form-label sm-size"
                for="pick"
              >{{ $t('filltool.selfill') }}</label>
              <input id="pick" v-model="selfill" type="color" class="form-control sm-size" />
            </div>
            <div class="form-horizontal">
              <label> {{ $t('filltool.tol') }}: {{ tol }}</label>
              <input
                v-model="tol"
                class="range-input"
                type="range" min="0" max="100"
              />
            </div>
          </div>
          <div class="input-box mb-2">
            <h4>
              {{ $t('filltool.conbri') }}
            </h4>
            <div class="form-horizontal">
              <label>{{ $t('filltool.brigh') }}: {{ brigh }}</label>
              <input
                v-model="brigh"
                class="range-input"
                type="range" min="-100" max="100"
              />
            </div>
            <div class="form-horizontal">
              <label>{{ $t('filltool.contr') }}: {{ contr }}</label>
              <input
                v-model="contr"
                class="range-input"
                type="range" min="-100" max="100"
              />
            </div>  
            <div class="button-row">
              <button 
                class="btn btn-primary"  
                @click="contrastBrightness"
              > 
                {{ $t('buttons.apply') }}
              </button>
            </div>
          </div>
          <div class="input-box mb-2">
            <div class="form-horizontal">
              <label>{{ $t('filltool.filter') }}</label>
              <div class="custom-select-container" v-click-outside="() => isDropdownOpen = false">
                <div class="custom-select-trigger" @click="isDropdownOpen = !isDropdownOpen" :class="{ 'is-active': isDropdownOpen }">
                  {{ selectedFilter }}
                  <span class="chevron">▾</span>
                </div>
                <transition name="fade-slide">
                  <div v-if="isDropdownOpen" class="custom-options-list">
                    <div v-for="c in filterDef" class="custom-option" :class="{ 'selected': c.value === selfilt }" @click="selectFilter(c.value)">
                      {{ c.name }}
                      <span v-if="selfilt === filterDef.value" class="check">✓</span>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
            <div class="button-row">
              <button class="btn btn-primary" @click="filterColor">
                {{ $t('buttons.apply') }}
              </button>
            </div>
          </div>
          <div class="input-box">
            <div class="form-horizontal">
              <label>{{ $t('filltool.colordepth') }}</label>
              <div class="custom-select-container" v-click-outside="() => isDropdownOpen2 = false">
                <div class="custom-select-trigger" @click="isDropdownOpen2 = !isDropdownOpen2" :class="{ 'is-active': isDropdownOpen2 }">
                  {{ selectedCDepth }}
                  <span class="chevron">▾</span>
                </div>
                <transition name="fade-slide">
                  <div v-if="isDropdownOpen2" class="custom-options-list">
                    <div v-for="c in colorDepthDef" class="custom-option" :class="{ 'selected': c.value === cdepth }" @click="selectCDepth(c.value)">
                      {{ c.name }}
                      <span v-if="cdepth === colorDepthDef.value" class="check">✓</span>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
            <div class="button-row">
              <button class="btn btn-primary" @click="colorDepth">
                {{ $t('buttons.apply') }}
              </button>
            </div>
          </div>
      </VCard>
    </div>
    <div class="card-stack">
      <VCard title="Preview">
        <div class="button-row mb-2">
          <button class="btn btn-primary" @click="restore"> 
            {{  $t('buttons.original') }} 
          </button>
          <v-download 
            v-model:canvas ="canvasRef"
          />
        </div>
        <canvas
          ref="canvasRef"
          @mousedown="fillColor"
        />
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'
import VDownload from '@/components/generic/VDownload.vue'
import VCard from '@/components/generic/VCard.vue'
import '@/components/css/slidertheme.css'

defineOptions({
  name: 'FillTool'
})

const { t } = useI18n()

// --- Template Refs ---
const canvasRef = ref(null)
const fileInputRef = ref(null)

// --- Reactive State ---
const errormsg = ref("")
const selfill = ref("#FF0000")
const selfilt = ref(0)
const tol = ref(5)
const brigh = ref(0)
const contr = ref(0)
let cdepth = ref(0)
const isDropdownOpen = ref(false);
const isDropdownOpen2 = ref(false);

const colorDepthDef = [
  { name: "1 bits - 2 " + t('filltool.colors'), value: "0"},
  { name: "3 bits - 8 " + t('filltool.colors'), value: "1"},
  { name: "6 bits - 64 " + t('filltool.colors'), value: "2"},
  { name: "9 bits - 512 " + t('filltool.colors'), value: "3"},
  { name: "12 bits - 4k " + t('filltool.colors'), value: "4"},
  { name: "15 bits - 32k " + t('filltool.colors'), value: "5"},
  { name: "18 bits - 256k " + t('filltool.colors'), value: "6"}
]

const selectedCDepth = computed (() => {
  if (!colorDepthDef || colorDepthDef.length === 0) {
    return 'Loading...'; 
  }

  let found = colorDepthDef.find(a => a.value === cdepth.value);
  return found ? found.name : 'Select a colordepth';
})

const selectCDepth = (c) =>  {
  isDropdownOpen2.value = false;
  cdepth.value = c
};

const filterDef = [
  { name: t('filltool.gray1'), value: "0"},
  { name: t('filltool.gray2'), value: "1"},
  { name: t('filltool.invert'), value: "2"},
  { name: t('filltool.sepia'), value: "3"},
  { name: t('colors.red'), value: "4"},
  { name: t('colors.green'), value: "5"},
  { name: t('colors.blue'), value: "6"},
  { name: t('colors.cyan'), value: "7"},
  { name: t('colors.magenta'), value: "8"},
  { name: t('colors.yellow'), value: "9"},
]

const selectedFilter = computed (() => {
  if (!filterDef || filterDef.length === 0) {
    return 'Loading...'; 
  }

  let found = filterDef.find(a => a.value === selfilt.value);
  return found ? found.name : 'Select a filter';
})

const selectFilter = (c) =>  {
  isDropdownOpen.value = false;
  selfilt.value = c
};

// Internal Logic Variables
let ctx = null
let img = null

onMounted(() => {
  if (canvasRef.value) {
    ctx = canvasRef.value.getContext('2d')
    const rect = canvasRef.value.getBoundingClientRect()
    canvasRef.value.width = rect.width
    canvasRef.value.height = rect.width
  }
  fileInputRef.value?.focus()
})

// --- Logic Methods ---

const drawImageScaled = (image) => {
  const canvas = canvasRef.value
  if (!canvas || !ctx) return

  const hRatio = canvas.width / image.width
  const vRatio = canvas.height / image.height
  const ratio = Math.min(hRatio, vRatio)
  
  const centerShift_x = 0
  const centerShift_y = 0
  
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(
    image, 0, 0, image.width, image.height,
    centerShift_x, centerShift_y, image.width * ratio, image.height * ratio
  )
}

const restore = () => {
  if (img) drawImageScaled(img)
}

const filterColor = () => {
  if (!ctx) return
  if (parseInt(selfilt.value) === 2) {
    invertImage()
    return
  }

  const filters = [
    [[0.333, 0.333, 0.333], [0.333, 0.333, 0.333], [0.333, 0.333, 0.333]], // Average
    [[0.299, 0.587, 0.114], [0.299, 0.587, 0.114], [0.299, 0.587, 0.114]], // PAL
    ["invert"],
    [[0.393, 0.769, 0.189], [0.349, 0.686, 0.168], [0.272, 0.534, 0.131]], // Sepia
    [[1, 0, 0], [0, 0, 0], [0, 0, 0]], // Reds
    [[0, 0, 0], [0, 1, 0], [0, 0, 0]], // Greens
    [[0, 0, 0], [0, 0, 0], [0, 0, 1]], // Blues
    [[0, 0, 0], [0, 1, 0], [0, 0, 1]], // Cyan
    [[1, 0, 0], [0, 0, 0], [0, 0, 1]], // Magenta
    [[1, 0, 0], [0, 1, 0], [0, 0, 0]], // Yellow
  ]

  const filter = filters[parseInt(selfilt.value)]
  const imageData = ctx.getImageData(0, 0, canvasRef.value.width, canvasRef.value.height)
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    data[i]     = Math.min(Math.floor(r * filter[0][0] + g * filter[0][1] + b * filter[0][2]), 255)
    data[i + 1] = Math.min(Math.floor(r * filter[1][0] + g * filter[1][1] + b * filter[1][2]), 255)
    data[i + 2] = Math.min(Math.floor(r * filter[2][0] + g * filter[2][1] + b * filter[2][2]), 255)
  }

  ctx.putImageData(imageData, 0, 0)
}

const contrastBrightness = () => {
  if (!ctx) return
  const imageData = ctx.getImageData(0, 0, canvasRef.value.width, canvasRef.value.height)
  const data = imageData.data

  const factor = (105 * (contr.value + 100)) / (100 * (105 - contr.value))
  const brightness = brigh.value * 1.27

  for (let i = 0; i < data.length; i += 4) {
    data[i]     = Math.max(Math.min(Math.round(factor * (data[i] - 128) + 128 + brightness), 255), 0)
    data[i + 1] = Math.max(Math.min(Math.round(factor * (data[i + 1] - 128) + 128 + brightness), 255), 0)
    data[i + 2] = Math.max(Math.min(Math.round(factor * (data[i + 2] - 128) + 128 + brightness), 255), 0)
  }
  ctx.putImageData(imageData, 0, 0)
}

const fillColor = (event) => {
  if (!ctx) return
  
  const rFill = parseInt(selfill.value.slice(1, 3), 16)
  const gFill = parseInt(selfill.value.slice(3, 5), 16)
  const bFill = parseInt(selfill.value.slice(5, 7), 16)

  const x = Math.floor(event.offsetX * canvasRef.value.width / canvasRef.value.clientWidth)
  const y = Math.floor(event.offsetY * canvasRef.value.height / canvasRef.value.clientHeight)

  const pixel = ctx.getImageData(x, y, 1, 1).data
  const imageData = ctx.getImageData(0, 0, canvasRef.value.width, canvasRef.value.height)
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    if (Math.abs(data[i] - pixel[0]) <= tol.value &&
        Math.abs(data[i + 1] - pixel[1]) <= tol.value &&
        Math.abs(data[i + 2] - pixel[2]) <= tol.value) {
      data[i] = rFill
      data[i + 1] = gFill
      data[i + 2] = bFill
    }
  }
  ctx.putImageData(imageData, 0, 0)
}

const invertImage = () => {
  if (!ctx) return
  const imageData = ctx.getImageData(0, 0, canvasRef.value.width, canvasRef.value.height)
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i]
    data[i + 1] = 255 - data[i + 1]
    data[i + 2] = 255 - data[i + 2]
  }
  ctx.putImageData(imageData, 0, 0)
}

const colorDepth = () => {
  if (!ctx) return
  const imageData = ctx.getImageData(0, 0, canvasRef.value.width, canvasRef.value.height)
  const data = imageData.data

  const bw = Math.pow(2, (7 - cdepth.value))
  
  for (let i = 0; i < data.length; i += 4) {
    if (cdepth.value === 0) {
      const bwcol = (data[i] + data[i + 1] + data[i + 2] < 384) ? 0 : 255
      data[i] = data[i + 1] = data[i + 2] = bwcol
    } else {
      data[i]     = Math.min(Math.round(data[i] / bw) * bw, 255)
      data[i + 1] = Math.min(Math.round(data[i + 1] / bw) * bw, 255)
      data[i + 2] = Math.min(Math.round(data[i + 2] / bw) * bw, 255)
    }
  }
  ctx.putImageData(imageData, 0, 0)
}

const selectFile = (event) => {
  errormsg.value = ""
  const input = event.target

  if (input.files && input.files[0]) {
    // Revoke previous URL to prevent memory leaks
    if (img && img.src) URL.revokeObjectURL(img.src)

    img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = URL.createObjectURL(input.files[0])

    img.onerror = () => {
      errormsg.value = t('errors.loadingimage')
    }

    img.onload = () => {
      try {
        drawImageScaled(img)
      } catch (err) {
        errormsg.value = t('colorpicker.error')
      }
    }
  }
}
</script>

<style scoped>

.card-grid {
   grid-template-columns: 1fr;
}

canvas {
  width: 100%;
  height: auto;
  border-radius: 10px;
}

h4 {
  margin-top: 0px;
  margin-bottom: 10px;
}

@media (min-width: 750px) {
  .card-grid {
    grid-template-columns: 33% 1fr;
  }

  .form-horizontal {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px; /* Tighten the space between label and input */
  }

  .form-horizontal label {
    /* KEY FIX: Reset flex so 150px height doesn't apply */
    flex: none !important; 
    width: 100% !important;
    height: auto !important;
    margin-bottom: 2px;
    /* Optional: reduce font size slightly for mobile if needed */
    font-size: 0.85rem; 
  }

  .form-horizontal .range-input {
    height: 6px;
    min-height: 6px;
  }

  .form-horizontal input, 
  .form-horizontal select, 
  .form-horizontal textarea 
  .form-horizontal .custom-select-container {
    /* KEY FIX: Ensure it doesn't try to grow vertically */
    flex: none !important; 
    width: 100% !important;
    height: 25px; /* Set a standard touch-friendly height */
    min-height: 25px;
  }
}

</style>
