<template>

  <header class="page-header">
    <h1>{{ $t('colorpicker.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="$t('labels.intro')">
        <div v-html="$t('colorpicker.long')" />
      </VCard>
      <VCard :title="$t('labels.input')">
        <div class="form-group-vertical">
          <label>{{ $t('labels.selectfile') }}</label>
          <input
            type="file"
            ref="fileInput"
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
      <VCard :title="$t('labels.result')">
        <div class="form-horizontal">
          <label>{{ $t('colorpicker.selcolor') }}</label>
          <span
            ref="selColorBox"
            colspan="2"
            style="height: 50px;"
            >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        </div>
        <div class="table-responsive">
          <table class="p-table-small mb-2">
            <thead>
              <tr>
                <th colspan="2" class="subhead">
                  {{ $t('colorpicker.rgbval') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr><td>{{ $t('colors.red') }}</td><td>{{ slr }}</td></tr>
              <tr><td>{{ $t('colors.green') }}</td><td>{{ slg }}</td></tr>
              <tr><td>{{ $t('colors.blue') }}</td><td>{{ slb }}</td></tr>
              <tr><td>{{ $t('colorpicker.alpha') }}</td><td>{{ sla }}</td></tr>
            </tbody>
          </table>
          <table class="p-table-small mb-2">
            <thead>
              <tr>
                <th colspan="2" class="subhead">
                  {{ $t('colorpicker.hexval') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr><td>{{ $t('colorpicker.hex') }}</td><td>{{ slx }}</td></tr>
            </tbody>
          </table>
          <table class="p-table-small mb-2">
            <thead>
              <tr>
                <th colspan="2" class="subhead">
                  {{ $t('colorpicker.hslval') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr><td>{{ $t('colorpicker.hue') }}</td><td>{{ hue }}°</td></tr>
              <tr><td>{{ $t('colorpicker.sat') }}</td><td>{{ sat }}</td></tr>
              <tr><td>{{ $t('colorpicker.lum') }}</td><td>{{ lum }}</td></tr>
            </tbody>
          </table>
          <table class="p-table-small mb-2">
            <thead>
              <tr>
                <th colspan="2" class="subhead">
                  {{ $t('colorpicker.hsvval') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr><td>{{ $t('colorpicker.hue') }}</td><td>{{ hue2 }}°</td></tr>
              <tr><td>{{ $t('colorpicker.sat') }}</td><td>{{ sat2 }}</td></tr>
              <tr><td>{{ $t('colorpicker.bri') }}</td><td>{{ bri }}</td></tr>
            </tbody>
          </table>
          <table class="p-table-small mb-2">
            <thead>
              <tr>
                <th colspan="2" class="subhead">
                  {{ $t('colorpicker.cmykval') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr><td>{{ $t('colors.cyan') }}</td><td>{{ c }}</td></tr>
              <tr><td>{{ $t('colors.magenta') }}</td><td>{{ m }}</td></tr>
              <tr><td>{{ $t('colors.yellow') }}</td><td>{{ y }}</td></tr>
              <tr><td>{{ $t('colors.black') }}</td><td>{{ k }}</td></tr>
            </tbody>
          </table>
          <table class="p-table-small mb-2">
            <thead>
              <tr>
                <th colspan="2" class="subhead">
                  {{ $t('colorpicker.cmyval') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr><td>{{ $t('colors.cyan') }}</td><td>{{ c2 }}</td></tr>
              <tr><td>{{ $t('colors.magenta') }}</td><td>{{ m2 }}</td></tr>
              <tr><td>{{ $t('colors.yellow') }}</td><td>{{ y2 }}</td></tr>
            </tbody>
          </table>
        </div>
      </VCard>
    </div>
    <div class="card-stack">
      <VCard title="Preview">
        <canvas
          ref="canvas"
          @mousedown="selColor"
        />
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import VCard from '@/components/generic/VCard.vue'

defineOptions({
  name: 'ColorPicker'
})

const { t } = useI18n()

// --- Template Refs ---
const fileInput = ref(null)
const canvas = ref(null)
const selColorBox = ref(null)

// --- State ---
const errormsg = ref("")
const slr = ref(0)
const slg = ref(0)
const slb = ref(0)
const sla = ref(0)
const slx = ref("#")
const hue = ref(0)
const sat = ref(0)
const lum = ref(0)
const hue2 = ref(0)
const sat2 = ref(0)
const bri = ref(0)
const c = ref(0)
const m = ref(0)
const y = ref(0)
const k = ref(0)
const c2 = ref(0)
const m2 = ref(0)
const y2 = ref(0)

// Internal variables (non-reactive or used for DOM)
let ctx = null
let img = null

onMounted(() => {
  // Set focus on file input
  fileInput.value?.focus()

  // Initialize Canvas
  if (canvas.value) {
    ctx = canvas.value.getContext('2d')
    const rect = canvas.value.getBoundingClientRect()
    canvas.value.width = rect.width
    canvas.value.height = rect.width // Keep it square as per original logic
  }
})

// --- Helper Methods ---

const rgbToHsl = (r, g, b) => {
  const rf = r / 255, gf = g / 255, bf = b / 255
  const min = Math.min(rf, gf, bf), max = Math.max(rf, gf, bf)
  let l = Math.round((max + min) / 2 * 100)
  let s = 0, h = 0

  if (min !== max) {
    s = l <= 50 ? (max - min) / (max + min) : (max - min) / (2.0 - max - min)
    s = Math.round(s * 100)
    if (rf === max) h = (gf - bf) / (max - min)
    if (gf === max) h = 2.0 + (bf - rf) / (max - min)
    if (bf === max) h = 4.0 + (rf - gf) / (max - min)
    h = Math.round(h * 60)
    if (h < 0) h += 360
  }
  return { h, s, l }
}

const rgbToHsv = (r, g, b) => {
  const rf = r / 255, gf = g / 255, bf = b / 255
  const min = Math.min(rf, gf, bf), max = Math.max(rf, gf, bf)
  let s = 0, h = 0

  if (min !== max) {
    s = (max - min) / max
    s = Math.round(s * 100)
    if (rf === max) h = (gf - bf) / (max - min)
    if (gf === max) h = 2.0 + (bf - rf) / (max - min)
    if (bf === max) h = 4.0 + (rf - gf) / (max - min)
    h = Math.round(h * 60)
    if (h < 0) h += 360
  }
  return { h, s, v: Math.round(max * 100) }
}

const rgbToCmy = (r, g, b) => {
  c2.value = Math.round((1 - r / 255) * 100) + "%"
  m2.value = Math.round((1 - g / 255) * 100) + "%"
  y2.value = Math.round((1 - b / 255) * 100) + "%"
}

const rgbToCmyk = (r, g, b) => {
  const rf = r / 255, gf = g / 255, bf = b / 255
  const kVal = 1 - Math.max(rf, gf, bf)
  if (kVal === 1) {
    c.value = m.value = y.value = "0%"
  } else {
    c.value = Math.round((1 - rf - kVal) / (1 - kVal) * 100) + "%"
    m.value = Math.round((1 - gf - kVal) / (1 - kVal) * 100) + "%"
    y.value = Math.round((1 - bf - kVal) / (1 - kVal) * 100) + "%"
  }
  k.value = Math.round(kVal * 100) + "%"
}

const drawImageScaled = (image) => {
  const cvs = canvas.value
  const hRatio = cvs.width / image.width
  const vRatio = cvs.height / image.height
  const ratio = Math.min(hRatio, vRatio)
  ctx.clearRect(0, 0, cvs.width, cvs.height)
  ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, image.width * ratio, image.height * ratio)
}

// --- Event Handlers ---

const selColor = (event) => {
  if (!ctx) return

  // Adjust for CSS scaling vs Canvas coordinate system
  const x = Math.floor(event.offsetX * canvas.value.width / canvas.value.clientWidth)
  const y = Math.floor(event.offsetY * canvas.value.height / canvas.value.clientHeight)

  const pixel = ctx.getImageData(x, y, 1, 1)
  const data = pixel.data

  // Update Color Preview
  const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`
  if (selColorBox.value) {
    selColorBox.value.style.background = rgba
  }

  // RGB values
  slr.value = data[0]
  slg.value = data[1]
  slb.value = data[2]
  sla.value = (data[3] / 255).toFixed(4)

  // Hex
  slx.value = "#" + data[0].toString(16).padStart(2, '0') + 
                  data[1].toString(16).padStart(2, '0') + 
                  data[2].toString(16).padStart(2, '0')

  // HSL
  const hsl = rgbToHsl(data[0], data[1], data[2])
  hue.value = hsl.h
  sat.value = hsl.s + "%"
  lum.value = hsl.l + "%"

  // HSV
  const hsv = rgbToHsv(data[0], data[1], data[2])
  hue2.value = hsv.h
  sat2.value = hsv.s + "%"
  bri.value = hsv.v + "%"

  // CMYK / CMY
  rgbToCmyk(data[0], data[1], data[2])
  rgbToCmy(data[0], data[1], data[2])
}

const selectFile = (event) => {
  errormsg.value = ""
  const input = event.target

  if (input.files && input.files[0]) {
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
        console.log(err)
      }
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

.subhead {
  font-weight: bold;
  color: var(--primary-green);
}

canvas {
  width: 100%;
  height: auto;
  border-radius: 10px;
  cursor: crosshair;
}

</style>
