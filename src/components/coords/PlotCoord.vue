<template>

  <header class="page-header">
    <h1>{{ $t('plotcoord.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="$t('labels.intro')">
        <div v-html="$t('plotcoord.long')" />
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
        <div class="form-group-vertical">
          <label class="checkbox-container">
            <input type="checkbox" v-model="showmarkers">
            <span class="checkmark"></span>
            {{ $t('mapmaker.showmark') }}
          </label>
          <label class="checkbox-container">
            <input type="checkbox" v-model="showlabels">
            <span class="checkmark"></span>
            {{ $t('mapmaker.showlabel') }}
          </label>
          <label class="checkbox-container">
            <input type="checkbox" v-model="drawlines">
            <span class="checkmark"></span>
            {{ $t('plotcoord.drawlines') }}
          </label>
          <label class="checkbox-container">
            <input type="checkbox" v-model="fillpoly">
            <span class="checkmark"></span>
            {{ $t('plotcoord.fillpoly') }}
          </label>
        </div>
        <div class="button-row mt-2">
          <button class="btn btn-primary"  @click="makeMap">
            {{ $t('buttons.show') }}
          </button>
        </div>
      </VCard>
      <VCard :title="$t('labels.input')">
        <textarea
          ref="coordFromInput"
          v-model="coordfrom"
          class="mb-2"
          :placeholder="$t('mapmaker.phcoord')"
          rows="5"
        />
        <textarea
          v-model="labels"
          :placeholder="$t('mapmaker.phlabel')"
          rows="5"
          class="mb-2"
        />
        <p
          v-show="errormsg"
          class="errormsg mb-2"
        >
          {{ errormsg }}.
        </p>          
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
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import L from 'leaflet'
import * as coords from '@/scripts/coords.js'
import VMap from '@/components/generic/VMap.vue'
import VCard from '@/components/generic/VCard.vue'
import VDatums from '@/components/generic/VDatums.vue'
import VShowOnMap from '@/components/generic/VShowOnMap.vue'

defineOptions({
  name: 'PlotCoord'
})

const store = useStore()
const { t } = useI18n()

// --- State ---
const errormsg = ref("")
const from = ref("WGS84")
const coordfrom = ref("")
const labels = ref("")
const drawlines = ref(true)
const fillpoly = ref(false)
const showlabels = ref(false)
const showmarkers = ref(false)

// --- Template Ref ---
const coordFromInput = ref(null)

onMounted(() => {
  coordFromInput.value?.focus()
})

// --- Methods ---

const makeMap = () => {
  // Reset error flag
  errormsg.value = ""
  let pointsForLine = []
  let promises = []
  let markerTexts = []

  // No input validation
  if (!coordfrom.value) {
    errormsg.value = t('errors.nocoords')
    return
  }

  // Handle Labels logic
  const inputLines = coordfrom.value.match(/[^\r\n]+/g) || []
  if (!labels.value) {
    markerTexts = inputLines
  } else {
    markerTexts = labels.value.match(/[^\r\n]+/g) || []
  }

  // Check if there are enough labels for the points
  if (inputLines.length !== markerTexts.length) {
    errormsg.value = t('mapmaker.error1')
    return
  }

  // Convert all points to WGS84 for Leaflet
  for (let i = 0; i < inputLines.length; i++) {
    promises.push(coords.convertCoordFromText(inputLines[i], from.value, 'WGS84'))
  }

  Promise.all(promises)
    .then((points) => {
      const mymap = store.state.mymap

      for (let i = 0; i < points.length; i++) {
        // Fill the array for polylines/polygons
        pointsForLine.push({ lon: points[i].lon, lat: points[i].lat })

        // Add a marker to the map for each coordinate if requested
        if (showmarkers.value) {
          const marker = L.marker(points[i]).addTo(mymap)

          // Create a popup that doesn't close and bind it to the marker
          if (showlabels.value) {
            const p = L.popup({ autoClose: false, closeOnClick: false })
              .setContent(markerTexts[i])
              .setLatLng(points[i])
            marker.bindPopup(p).openPopup()
          }
        }
      }

      // Draw polylines/polygons if requested
      if (drawlines.value && pointsForLine.length > 0) {
        // Add first point to end to close the loop
        const loop = [...pointsForLine, pointsForLine[0]]

        if (fillpoly.value) {
          L.polygon(loop, { color: 'red', fillColor: 'red', fillOpacity: 0.5 }).addTo(mymap)
        } else {
          L.polyline(loop, { color: 'red' }).addTo(mymap)
        }
      }
    })
    .catch((error) => {
      console.error('Error ', error)
      errormsg.value = t('errors.incorrectcoords')
    })
}
</script>