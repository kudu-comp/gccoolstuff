<template>

  <header class="page-header">
    <h1>{{ $t('convert.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="$t('labels.intro')">
        <div v-html="$t('convert.long')" />
      </VCard>
      <VCard :title="$t('labels.settings')">
        <div class="form-horizontal">
          <label
          >{{ $t('labels.from') }}</label>
          <v-datums
            id="from"
            v-model:datum="from"
          />
        </div>
        <div class="form-horizontal">
          <label
          >{{ $t('labels.to') }}</label>
          <v-datums
            id="to"
            v-model:datum="to"
          />
        </div>
        <div class="form-horizontal">
          <v-wgsformat
            id="wgsformat"
            v-model:format="wgsformat"
          />
          <div v-if="to == 'Proj4js' || from == 'Proj4js'">
            <div v-html="$t('convert.proj4jsmsg')" />
            <label
              for="proj4jsdef"
            >{{ $t('convert.proj4jslabel') }}</label>
            <input
              id="proj4jsdef"
              v-model="proj4jsdef"
              type="text"
            >
          </div>
        </div>
        <div class="button-row">
          <button id="convert" class="btn btn-primary"  @click="convertCoordinates">
            {{ $t('buttons.convert') }}
          </button>
        </div>
      </VCard>
      <VCard :title="$t('labels.input')">
        <textarea
          id="coordfrom"
          ref="coordFromInput"
          v-model="coordfrom"
          :placeholder="$t('convert.phfrom')"
          rows="5"
          @input="wordValue"
        />
        <div
          v-show="errormsg"
          class="errormsg mt-2"
        >
          {{ errormsg }}.
      </div>          
      </VCard>
      <VCard :title="$t('labels.result')">
        <div
          v-if="result"
          v-html="result"
          class="card resultbox"
        >
        </div>
      </VCard>
    </div>
    <div class="card-stack">
      <VCard :title="$t('labels.map')">
        <v-map v-model:mylocation="coordfrom" />     
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import * as coords from '@/scripts/coords.js'
import VDatums from '@/components/generic/VDatums.vue'
import VCard from '@/components/generic/VCard.vue'
import VWgsformat from '@/components/generic/VWgsformat.vue'
import VMap from '@/components/generic/VMap.vue'

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
