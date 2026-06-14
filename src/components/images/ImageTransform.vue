<template>

  <header class="page-header">
    <h1>{{ $t('imagetransform.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="$t('labels.intro')">
        <div v-html="$t('imagetransform.long')" />
      </VCard>
      <VCard :title="$t('labels.input')">
        <div class="form-horizontal">
          <label>{{ $t('labels.selectfile') }}</label>
          <input
            type="file"
            ref="fileInputRef"
            class="form-control"
            @change="selectFile"
          >
        </div>
        <p
          v-show="errormsg"
          class="errormsg"
        >
          {{ errormsg }}
        </p>
      </VCard>
      <VCard :title="$t('labels.settings')">
        <h4>{{ $t('imagetransform.shift') }}</h4>
        <p>{{ $t('imagetransform.shiftinfo') }}</p>
        <div class="form-horizontal">
          <label>{{ $t('imagetransform.shiftr') }}</label>
          <input v-model="shiftr" type="number"/>
          <div class="button-row">
            <button 
              class="btn btn-primary"  
              @click="shiftRows"
            > 
              {{ $t('buttons.apply') }}
            </button>
          </div>
        </div>
        <div class="form-horizontal">
          <label>{{ $t('imagetransform.shiftc') }}</label>
          <input v-model="shiftc" type="number"/>
          <div class="button-row">
            <button 
              class="btn btn-primary"  
              @click="shiftCols"
            > 
              {{ $t('buttons.apply') }}
            </button>
          </div>
        </div>
        <hr>
        <h4>{{ $t('imagetransform.fliphalf') }}</h4>
        <p>{{ $t('imagetransform.flipinfo') }}</p>
        <div class="form-horizontal">
          <label>{{ $t('imagetransform.flipr') }}</label>
          <input v-model="flipr" type="number"/>
          <div class="button-row">
            <button 
              class="btn btn-primary"  
              @click="flipRows"
            > 
              {{ $t('buttons.apply') }}
            </button>
          </div>
        </div>
        <div class="form-horizontal">
          <label>{{ $t('imagetransform.flipc') }}</label>
          <input v-model="flipc" type="number"/>
          <div class="button-row">
            <button 
              class="btn btn-primary"  
              @click="flipCols"
            > 
              {{ $t('buttons.apply') }}
            </button>
          </div>
        </div>
        <hr>
        <h4>{{ $t('imagetransform.transform') }}</h4>
        <div class="button-row">
          <button 
            class="btn btn-primary"  
            @click="flipH"
          > 
            {{ $t('imagetransform.fliph') }}
          </button>
          <button 
            class="btn btn-primary"  
            @click="flipV"
          > 
            {{ $t('imagetransform.flipv') }}
          </button>
        </div>
      </VCard>
    </div>
    <div class="card-stack">
      <VCard title="Preview">
        <div class="button-row mb-2">
          <button class="btn btn-primary" @click="undoEdit"> 
            {{  $t('buttons.undo') }} 
          </button>
          <button class="btn btn-primary" @click="restore"> 
            {{  $t('buttons.original') }} 
          </button>
          <v-download 
            v-model:canvas ="canvasRef"
          />
        </div>
        <canvas
          ref="canvasRef"
        />
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { ref, shallowRef, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import VDownload from '@/components/generic/VDownload.vue'
import VCard from '@/components/generic/VCard.vue'
import '@/components/css/slidertheme.css'

defineOptions({
  name: 'ImageTransform'
})

const { t } = useI18n()

// --- Template Refs ---
const canvasRef = ref(null)
const fileInputRef = ref(null)

// --- Reactive State ---
const errormsg = ref("")
const shiftr = ref(0)
const shiftc = ref(0)
const flipr = ref(1)
const flipc = ref(1)
const undo = ref([])

// Image placement/dimensions
const dx = ref(0)
const dy = ref(0)
const dw = ref(0)
const dh = ref(0)

// Config objects
const controptions = { min: 0, max: 100, height: 8 }
const controptions2 = { min: -100, max: 100, height: 8 }

// Non-reactive / Shallow objects
const canvas = shallowRef(null)
const ctx = shallowRef(null)
const img = shallowRef(null)

onMounted(() => {
  if (canvasRef.value) {
    canvas.value = canvasRef.value
    ctx.value = canvas.value.getContext('2d')
    
    // Set initial canvas size based on container
    const rect = canvas.value.getBoundingClientRect()
    canvas.value.width = rect.width
    canvas.value.height = rect.width
  }
  
  // Set focus on file input
  fileInputRef.value?.focus()
})

// --- Methods ---

const drawImageScaled = (image) => {
  const cvs = canvas.value
  const context = ctx.value
  if (!cvs || !context) return

  const hRatio = cvs.width / image.width
  const vRatio = cvs.height / image.height
  const ratio = Math.min(hRatio, vRatio)

  // Calculate placement
  dx.value = Math.floor((cvs.width - image.width * ratio) / 2)
  dy.value = 0
  dw.value = Math.floor(image.width * ratio)
  dh.value = Math.floor(image.height * ratio)

  context.clearRect(0, 0, cvs.width, cvs.height)
  context.drawImage(
    image, 0, 0, image.width, image.height,
    dx.value, dy.value, dw.value, dh.value
  )
}

const restore = () => {
  if (img.value) drawImageScaled(img.value)
  undo.value = []
}

const undoEdit = () => {
  if (undo.value.length > 0 && ctx.value) {
    const imageData = ctx.value.getImageData(dx.value, dy.value, dw.value, dh.value)
    // Pop the last snapshot and set it
    imageData.data.set(undo.value.pop())
    ctx.value.putImageData(imageData, dx.value, dy.value)
  }
}

const shiftRows = () => {
  const imageData = ctx.value.getImageData(dx.value, dy.value, dw.value, dh.value)
  const { width, height, data } = imageData
  
  const oldData = Array.from(data)
  undo.value.push(new Uint8ClampedArray(oldData)) // Save state for undo

  let shift = shiftr.value
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      const idx1 = (r * width + c) * 4
      const c2 = (c + shift + width) % width
      const idx2 = (r * width + c2) * 4
      
      data[idx2] = oldData[idx1]
      data[idx2 + 1] = oldData[idx1 + 1]
      data[idx2 + 2] = oldData[idx1 + 2]
      data[idx2 + 3] = oldData[idx1 + 3]
    }
    shift = (shift + shiftr.value + width) % width
  }
  ctx.value.putImageData(imageData, dx.value, dy.value)
}

const shiftCols = () => {
  const imageData = ctx.value.getImageData(dx.value, dy.value, dw.value, dh.value)
  const { width, height, data } = imageData
  
  const oldData = Array.from(data)
  undo.value.push(new Uint8ClampedArray(oldData))

  let shift = shiftc.value
  for (let c = 0; c < width; c++) {
    for (let r = 0; r < height; r++) {
      const idx1 = (r * width + c) * 4
      const r2 = (r + shift + height) % height
      const idx2 = (r2 * width + c) * 4
      
      data[idx2] = oldData[idx1]
      data[idx2 + 1] = oldData[idx1 + 1]
      data[idx2 + 2] = oldData[idx1 + 2]
      data[idx2 + 3] = oldData[idx1 + 3]
    }
    shift = (shift + shiftc.value + height) % height
  }
  ctx.value.putImageData(imageData, dx.value, dy.value)
}

const flipRows = () => {
  const imageData = ctx.value.getImageData(dx.value, dy.value, dw.value, dh.value)
  const { width, height, data } = imageData
  undo.value.push(new Uint8ClampedArray(data))

  let isFlipping = true
  for (let r = 0; r < height; r++) {
    if ((r - 1) % flipr.value === 0) isFlipping = !isFlipping
    if (!isFlipping) continue

    for (let c = 0; c < width / 2; c++) {
      const idx1 = (r * width + c) * 4
      const idx2 = ((r + 1) * width - c - 1) * 4
      for (let i = 0; i < 4; i++) {
        const temp = data[idx1 + i]
        data[idx1 + i] = data[idx2 + i]
        data[idx2 + i] = temp
      }
    }
  }
  ctx.value.putImageData(imageData, dx.value, dy.value)
}

const flipCols = () => {
  const imageData = ctx.value.getImageData(dx.value, dy.value, dw.value, dh.value)
  const { width, height, data } = imageData
  undo.value.push(new Uint8ClampedArray(data))

  let isFlipping = true
  for (let c = 0; c < width; c++) {
    if ((c - 1) % flipc.value === 0) isFlipping = !isFlipping
    if (!isFlipping) continue

    for (let r = 0; r < height / 2; r++) {
      const idx1 = (r * width + c) * 4
      const idx2 = ((height - r - 1) * width + c) * 4
      for (let i = 0; i < 4; i++) {
        const temp = data[idx1 + i]
        data[idx1 + i] = data[idx2 + i]
        data[idx2 + i] = temp
      }
    }
  }
  ctx.value.putImageData(imageData, dx.value, dy.value)
}

const flipH = () => {
  const imageData = ctx.value.getImageData(dx.value, dy.value, dw.value, dh.value)
  const { width, height, data } = imageData
  undo.value.push(new Uint8ClampedArray(data))

  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width / 2; c++) {
      const idx1 = (r * width + c) * 4
      const idx2 = ((r + 1) * width - c - 1) * 4
      for (let i = 0; i < 4; i++) {
        const temp = data[idx1 + i]
        data[idx1 + i] = data[idx2 + i]
        data[idx2 + i] = temp
      }
    }
  }
  ctx.value.putImageData(imageData, dx.value, dy.value)
}

const flipV = () => {
  const imageData = ctx.value.getImageData(dx.value, dy.value, dw.value, dh.value)
  const { width, height, data } = imageData
  undo.value.push(new Uint8ClampedArray(data))

  for (let c = 0; c < width; c++) {
    for (let r = 0; r < height / 2; r++) {
      const idx1 = (r * width + c) * 4
      const idx2 = ((height - r - 1) * width + c) * 4
      for (let i = 0; i < 4; i++) {
        const temp = data[idx1 + i]
        data[idx1 + i] = data[idx2 + i]
        data[idx2 + i] = temp
      }
    }
  }
  ctx.value.putImageData(imageData, dx.value, dy.value)
}

const selectFile = (event) => {
  errormsg.value = ""
  const input = event.target

  if (input.files && input.files[0]) {
    // Revoke old URL if exists
    if (img.value && img.value.src) URL.revokeObjectURL(img.value.src)

    const newImg = new Image()
    newImg.crossOrigin = 'anonymous'
    newImg.src = URL.createObjectURL(input.files[0])

    newImg.onerror = (e) => {
      errormsg.value = t('errors.loadingimage')
      console.log(e);
    }

    newImg.onload = () => {
      try {
        img.value = newImg
        drawImageScaled(newImg)
        undo.value = []
      } catch (err) {
        console.error(err)
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
}

@media (max-width: 1250px) {
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
    height: 45px; /* Set a standard touch-friendly height */
    min-height: 45px;
  }
}

</style>