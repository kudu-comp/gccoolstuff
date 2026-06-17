<template>

<header class="page-header">
    <h1>{{ t('triangles.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')">
        <div v-html="t('triangles.long')" />
      </VCard>
      <VCard :title="t('labels.input')">
        <div class="form-horizontal">
          <v-coord
            v-model:coord="coordinate1"
            v-model:datum="selecteddatum1"
          >
            <template #label>
              {{ t('labels.point') }} 1
            </template>
          </v-coord>
        </div>
        <div class="form-horizontal">
          <v-coord
            v-model:coord="coordinate2"
            v-model:datum="selecteddatum2"
          >
            <template #label>
              {{ t('labels.point') }} 2
            </template>
          </v-coord>
        </div>
        <div class="form-horizontal">
          <v-coord
            v-model:coord="coordinate3"
            v-model:datum="selecteddatum3"
          >
            <template #label>
              {{ t('labels.point') }} 3
            </template>
          </v-coord>
        </div>
        <div class="button-row">
          <v-show-on-map id="go" class="btn bn-primary" @Show="getPoints()" />
        </div>  
        <div
          v-show="errormsg"
          class="errormsg"
        >
          {{ errormsg }}
        </div>
      </VCard>
      <VCard :title="t('labels.result')">
        <div
          v-if="result"
          class="card resultbox"
          v-html="result"
        />
      </VCard>
      </div>
    <div class="card-stack">
      <VCard :title="t('labels.map')">
        <v-map v-model:mylocation="coordinate1" />
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import L from "leaflet"

// Logic Imports
import * as coords from '@/scripts/coords.js'
import { calculateTriangleProperties } from '@/scripts/triangle.js'

// UI Component Imports (The missing part!)
import VCoord from '@/components/generic/VCoord.vue'
import VCard from '@/components/generic/VCard.vue'
import VMap from '@/components/generic/VMap.vue'
import VShowOnMap from '@/components/generic/VShowOnMap.vue'

defineOptions({
  name: 'Triangles'
})

const store = useStore()
const { t } = useI18n()

// --- State ---
const coordinate1 = ref("")
const coordinate2 = ref("")
const coordinate3 = ref("")
const selecteddatum1 = ref("WGS84")
const selecteddatum2 = ref("WGS84")
const selecteddatum3 = ref("WGS84")
const result = ref("")
const errormsg = ref("")

// --- Methods ---

const getPoints = async () => {
  // Reset outputs
  errormsg.value = ""
  result.value = ""

  try {
    const mymap = store.state.mymap
    if (!mymap) throw new Error("Map not initialized")

    // 1. Convert input strings to WGS84 Lat/Lon
    const coord1 = await coords.convertCoordFromText(coordinate1.value, selecteddatum1.value, "WGS84")
    const coord2 = await coords.convertCoordFromText(coordinate2.value, selecteddatum2.value, "WGS84")
    const coord3 = await coords.convertCoordFromText(coordinate3.value, selecteddatum3.value, "WGS84")

    // 2. Convert WGS84 to RD Grid (needed for accurate meters/surface math)
    const grid1 = await coords.convertCoordFromLatLon(coord1, "WGS84", "RD")
    const grid2 = await coords.convertCoordFromLatLon(coord2, "WGS84", "RD")
    const grid3 = await coords.convertCoordFromLatLon(coord3, "WGS84", "RD")

    // 3. Draw on Map
    coords.displayMarker(mymap, coord1, `${t('labels.point')} 1`)
    coords.displayMarker(mymap, coord2, `${t('labels.point')} 2`)
    coords.displayMarker(mymap, coord3, `${t('labels.point')} 3`)
    L.polyline([coord1, coord2, coord3, coord1], { color: 'red' }).addTo(mymap)

    // 4. Calculate Properties using triangle.js
    const data = calculateTriangleProperties(
      { x: grid1.lon, y: grid1.lat },
      { x: grid2.lon, y: grid2.lat },
      { x: grid3.lon, y: grid3.lat }
    )

    // 5. Basic Results
    let output = `${t('labels.surface')}: ${data.surface.toFixed(0)}m`
    output += `<br>${t('labels.circumference')}: ${data.circumference.toFixed(0)}m<sup>2</sup>`

    // 6. Center Points: Convert RD back to WGS84
    const centerKeys = ['centroid', 'orthocenter', 'incenter', 'circumcenter', 'ninepointcenter']
    const centerWgsPromises = centerKeys.map(key => 
      coords.convertCoordToWGS({ lat: data[key].y, lon: data[key].x }, "RD")
    )
    const [centroid, orthocenter, incenter, circumcenter, ninepointcenter] = await Promise.all(centerWgsPromises)

    // 7. Center Points: Convert WGS84 back to Input Datum for the text list
    const datumPromises = [centroid, orthocenter, incenter, circumcenter, ninepointcenter].map(p => 
      coords.convertCoordFromWGS(p, selecteddatum1.value)
    )
    const datumPoints = await Promise.all(datumPromises)

    // 8. Generate Output Text and Markers
    const centers = [
      { key: 'centroid', wgs: centroid },
      { key: 'orthocenter', wgs: orthocenter },
      { key: 'incenter', wgs: incenter },
      { key: 'circumcenter', wgs: circumcenter },
      { key: 'ninepoint', wgs: ninepointcenter }
    ]

    centers.forEach((center, idx) => {
      const datumP = datumPoints[idx]
      output += `<br>${t(`triangles.${center.key}`)}: ` 
      output += coords.getTextFromCoord(datumP, selecteddatum1.value, 7, coordinate1.value)
      output += t('triangles.or') + coords.printCoordinateFromDMS(center.wgs, "N12 34.567 E1 23.456")
      
      // Plot centers on map
      coords.displayMarker(mymap, center.wgs, t(`triangles.${center.key}`))
    })

    result.value = output

  } catch (e) {
    console.error('Calculation Error:', e)
    errormsg.value = t('errors.incorrectcoords')
  }
}
</script>