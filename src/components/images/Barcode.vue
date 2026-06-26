<template>

  <header class="page-header">
    <h1>{{ t('barcode.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')" :initialOpen="startOpen">
        <div v-html="t('barcode.long')" />
      </VCard>
      <VCard :title="t('labels.input')">
        <div class="form-horizontal">
          <CustomDropdown 
            v-model="bctype" 
            :options="bcdefs" 
            :title="t('barcode.bctype')"
          />
        </div>
        <p
          v-show="errormsg"
          class="errormsg"
        >
          {{ errormsg }}
        </p>
        <div class="form-horizontal">
          <label>{{t('barcode.msg')}}</label>
          <input
            v-model="msg"
            type="text"
            autofocus
          >
        </div>
         <label class="checkbox-container mb-2">
          <input type="checkbox" v-model="showtxt">
          <span class="checkmark"></span>
          {{ t('barcode.showtxt') }}
        </label>
        <div class='form-horizontal'>
          <label>{{ t('barcode.clr')}}</label>
          <input type='color' v-model='clr' style="flex: 0 0 40px"/>
        </div>
        <div class='form-horizontal'>
          <label >{{ t('barcode.bgclr')}}</label>
          <input type='color' v-model='bgclr' style="flex: 0 0 40px" />
        </div>
        <div class="button-row">
          <button id="convert" class="btn btn-primary"  @click="generate()">
            {{ t('buttons.generate') }}
          </button>
        </div>
      </VCard>
      <VCard :title="t('labels.result')">     
        <canvas ref="canvasRef"></canvas>      
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import bwipjs from "bwip-js"
import VCard from '@/components/generic/VCard.vue'
import CustomDropdown from '@/components/generic/CustomDropdown.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n();

defineOptions({
  name: "Barcode"
})

// --- Constants ---
const bcdefs = [
  { value : "", label : "--- 2D ---", disabled: true},
  { value : "qrcode", label : "QR Code"},
  { value : "datamatrix", label : "Data matrix"},
  { value : "azteccode", label : "Aztec code"},
  { value : "pdf417", label : "PDF417"},
  { value : "", label : "--- 1D ---", disabled: true},
  { value : "ean13", label : "EAN13"},
  { value : "ean8", label : "EAN8"},
  { value : "upca", label : "UPCA"},
  { value : "upce", label : "UPCE"},
  { value : "isbn", label : "ISBN"},
  { value : "code39", label : "CODE39"},
  { value : "code93", label : "CODE93"},
  { value : "code128", label : "CODE128"},
  { value : "rationalizedCodabar", label : "CODABAR"},
  { value : "itf14", label : "ITF14"},
  { value : "msi", label : "MSI"},
  { value : "pharmacode", label : "Pharmacode"},
]

// --- State ---
const errormsg = ref("")
const msg = ref("Hello World")
const num1 = ref(0)
const bctype = ref("qrcode")
const showtxt = ref(true)
const clr = ref("#000000")
const bgclr = ref("#FFFFFF")

// --- Template Ref ---
const canvasRef = ref(null)
const startOpen = window.innerWidth > 768;

// --- Methods ---

const generate = () => {
  errormsg.value = ""
  
  if (!canvasRef.value) return
  if (!msg.value) {
    // Clear canvas if message is empty
    const ctx = canvasRef.value.getContext('2d')
    ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
    return
  }

  // Generate the code
  // Note: clr.value and bgclr.value usually need to be stripped of the '#' 
  // for some bwip-js versions, but typically hex strings work.
  const options = {
    bcid: bctype.value,
    text: msg.value,
    backgroundcolor: bgclr.value.replace('#', ''),
    barcolor: clr.value.replace('#', ''),
    textcolor: clr.value.replace('#', ''),
    padding: 8,
    includetext: showtxt.value,
    scale: 3 // Added scale for better quality
  }

  try {
    bwipjs.toCanvas(canvasRef.value, options)
  } catch (e) {
    // Clean up error message
    const rawError = e.message || String(e)
    errormsg.value = rawError.includes(":") 
        ? rawError.slice(rawError.indexOf(":") + 1).trim() 
        : rawError
  }
}

// --- Watchers & Lifecycle ---

// Automatically update whenever any setting changes
watch([msg, bctype, clr, bgclr, showtxt], () => {
  generate()
})

onMounted(() => {
  generate()
})
</script>

<i18n locale="en">
{
  "barcode": {
    "bctype": "Barcode type",
    "msg": "Message",
    "clr": "Bar color",
    "bgclr": "Background color",
    "showtxt": "Show text (works only for some barcodes)"
  }
}
</i18n>

<i18n locale="nl">
{
  "barcode": {
    "bctype": "Barcode type",
    "msg": "Bericht",
    "clr": "Barcode kleur",
    "bgclr": "Achtergrond color",
    "showtxt": "Toon tekst (werkt niet voor all barcodes)"
  }
}
</i18n>