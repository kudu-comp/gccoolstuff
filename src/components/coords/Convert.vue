<template>

  <header class="page-header">
    <h1>{{ t('convert.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')" :initialOpen="startOpen">
        <div v-html="t('convert.long')" />
      </VCard>
      <VCard :title="t('labels.settings')">
        <div class="form-horizontal">
          <label>{{ t('labels.from') }}</label>
          <DatumSelect
            id="from"
            v-model:datum="from"
          />
        </div>
        <div class="form-horizontal">
          <label>{{ t('labels.to') }}</label>
          <DatumSelect
            id="to"
            v-model:datum="to"
          />
        </div>
        <div class="form-horizontal">
          <WgsSelect v-model:format="wgsformat" />
          <div v-if="to == 'Proj4js' || from == 'Proj4js'">
            <div v-html="t('convert.proj4jsmsg')" />
            <label>{{ t('convert.proj4jslabel') }}</label>
            <input
              v-model="proj4jsdef"
              type="text"
            >
          </div>
        </div>
      </VCard>
      <VCard :title="t('labels.input')">
        <textarea
          ref="coordFromInput"
          v-model="coordfrom"
          :placeholder="t('convert.phfrom')"
          rows="5"
          @input="wordValue"
          class="mb-2"
        />
        <div v-show="errormsg" class="errormsg mb-2">
          {{ errormsg }}
        </div>          
        <div class="button-row">
          <button id="convert" class="btn btn-primary"  @click="convertCoordinates">
            {{ t('buttons.convert') }}
          </button>
        </div>
      </VCard>
      <VCard :title="t('labels.result')">
        <div
          v-if="result"
          v-html="result"
          class="resultbox"
        >
        </div>
      </VCard>
    </div>
    <div class="card-stack">
      <VCard :title="t('labels.map')">
        <MapView v-model:mylocation="coordfrom" />     
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import * as coords from '@/scripts/coords.js'
import DatumSelect from '@/components/generic/DatumSelect.vue'
import VCard from '@/components/generic/VCard.vue'
import WgsSelect from '@/components/generic/WgsSelect.vue'
import MapView from '@/components/generic/MapView.vue'

defineOptions({
  name: 'Convert'
})

// --- Setup Hooks ---
const store = useStore()
const { t } = useI18n()

// --- Reactive State ---
const errormsg = ref("")
const coordfrom = ref("")
const to = ref("WGS84")
const from = ref("WGS84")
const result = ref("")
const proj4jsdef = ref("")
const count = ref(0)
const wgsformat = ref("N52 12.345 E4 12.345")

// --- Template Ref ---
const coordFromInput = ref(null)
const startOpen = window.innerWidth > 768;

watch([wgsformat, to], () => {
  convertCoordinates()
})

onMounted(() => {
  coordFromInput.value?.focus()
})

// --- Methods ---

const convertCoordinates = () => {
  // Reset
  result.value = ""
  errormsg.value = ""

  // No input validation
  if (!coordfrom.value || coordfrom.value.trim() === "") {
    errormsg.value = t('errors.nocoords')
    return
  }

  // Special case: W3W
  if (to.value === "W3W") {
    result.value = "No longer supported\nfree of charge\nby what3words.com."
    return
  }

  // Parse lines from input
  const inputLines = coordfrom.value.match(/[^\r\n]+/g) || []
  count.value = 0

  try {
    // 1. Logic for text output conversion
    const conversionPromises = inputLines.map(line => 
      coords.convertCoordFromText(line, from.value, to.value, proj4jsdef.value)
    )

    Promise.all(conversionPromises)
      .then(convcoords => {
        let outputBuilder = ""
        for (const c of convcoords) {
          outputBuilder += coords.getTextFromCoord(c, to.value, 7, wgsformat.value) + "<br>"
        }
        result.value = outputBuilder
      })
      .catch(e => {
        errormsg.value = t('errors.incorrectcoords')
        console.error("Conversion Error:", e)
      })

    // 2. Logic for map marker generation (Always to WGS84)
    const mapPromises = inputLines.map(line => 
      coords.convertCoordFromText(line, from.value, 'WGS84', proj4jsdef.value)
    )

    Promise.all(mapPromises)
      .then(mapcoords => {
        const mymap = store.state.mymap
        for (const m of mapcoords) {
          count.value++
          coords.displayMarker(mymap, m, t('labels.point') + " " + count.value)
        }
      })
      .catch(e => {
        errormsg.value = t('errors.incorrectcoords')
        console.error("Map Marker Error:", e)
      })

  } catch (e) {
    errormsg.value = t('errors.incorrectcoords')
    console.error("Unexpected Error:", e)
  }
}
</script>

<i18n locale="en">
{
  "convert": {
    "proj4jsmsg": "You can convert any coordinate system using the definition below. The convertor uses Proj4js. First select Proj4js from the dropdown. The definition to use can be found on <a href='http://epsg.io'>EPSG.io</a>. Take the Proj4js.def (it can be found near the bottom of the page). Take the second string (the one that starts with +) without the quotes and copy / paste it in the field below.",
    "proj4jslabel": "Proj4js definition",
    "phfrom": "Coordinates to convert",
    "phto": "Converted coordinates"
  }
}
</i18n>

<i18n locale="nl">
{
  "convert": {
    "proj4jsmsg": "Je kan elk coördinaat systeem converteren door hieronder de proj4js definitie in te voeren. De definitie kan gevonden worden op <a href='http://epsg.io'>EPSG.io</a>. Neem de Proj4js.def (onderaan op de pagina) en kopieer de string die begint met + (zonder de aanhalingstekens).",
    "proj4jslabel": "Proj4js definitie",
    "phfrom": "Coördinaten om te converteren",
    "phto": "Geconverteerde coördinaten"
  }
}
</i18n>