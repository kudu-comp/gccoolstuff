<template>

  <header class="page-header">
    <h1>{{ t('project.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')">
        <div v-html="t('project.long')" />
      </VCard>
      <VCard :title="t('labels.input')">
        <div class="form-horizontal">
          <v-coord
            v-model:coord="coordinate"
            v-model:datum="selecteddatum"
          />
        </div>
        <div class="form-horizontal">
          <v-distance
            v-model:dist="dist"
            v-model:unit="unit"
          />
        </div>
        <div class="form-horizontal">
          <v-angle
            v-model:angle="angle"
            v-model:unit="angleunit"
          />
        </div>
        <div class="button-row mb-2">
          <v-show-on-map class="btn btn-primary" @show="doCalc()" />
        </div>
        <p
          v-if="errormsg"
          class="errormsg"
        >
          {{ errormsg }}.
        </p>          
      </VCard>
      <VCard :title="t('labels.result')">
          {{ t('project.projcoord') }}{{ result }}        
      </VCard>
    </div>
    <div class="card-stack">
      <VCard :title="t('labels.map')">
        <v-map v-model:mylocation="coordinate" />     
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import L from 'leaflet'
import * as coords from '@/scripts/coords.js'

// Component Imports
import VCoord from '@/components/generic/VCoord.vue'
import VCard from '@/components/generic/VCard.vue'
import VAngle from '@/components/generic/VAngle.vue'
import VDistance from '@/components/generic/VDistance.vue'
import VMap from '@/components/generic/VMap.vue'
import VShowOnMap from '@/components/generic/VShowOnMap.vue'

defineOptions({
  name: 'Project'
})

const store = useStore()
const { t } = useI18n()

// --- Reactive State ---
const coordinate = ref("")
const selecteddatum = ref("WGS84")
const angle = ref(0)
const angleunit = ref(0.0174532925)
const dist = ref(0)
const unit = ref(1)
const result = ref("")
const errormsg = ref("")

// --- Methods ---

const doCalc = () => {
  // Reset outputs
  errormsg.value = ""
  result.value = ""

  const gridsys = "RD" // Grid system for projection
  const mymap = store.state.mymap

  let startcoord, gridcoord, projcoord

  try {
    // 1. Translate the inputed coordinates to WGS84 for display on map
    coords.convertCoordFromText(coordinate.value, selecteddatum.value, "WGS84")
      .then(data => {
        startcoord = data
        // 2. Get the coordinate in the calculation grid (RD)
        return coords.convertCoordFromLatLon(startcoord, "WGS84", gridsys)
      })
      .then(data => {
        gridcoord = data
        
        // 3. Project grid coordinate using trigonometry
        // New Grid Lat = Old Grid Lat + Distance * cos(Bearing)
        // New Grid Lon = Old Grid Lon + Distance * sin(Bearing)
        const projectedGridPos = {
          lat: gridcoord.lat + (dist.value * unit.value) * Math.cos(angle.value * angleunit.value),
          lon: gridcoord.lon + (dist.value * unit.value) * Math.sin(angle.value * angleunit.value)
        }

        return coords.convertCoordToWGS(projectedGridPos, gridsys)
      })
      .then(data => {
        projcoord = data

        // 4. Update the Map
        coords.displayMarker(mymap, startcoord, t('project.startpoint'))
        coords.displayMarker(mymap, projcoord, t('project.projpoint'))
        
        // Draw a line on the map between points
        L.polyline([startcoord, projcoord], { color: 'red' }).addTo(mymap)

        // 5. Get the projected coordinate in the same datum as the original input
        return coords.convertCoordFromWGS(projcoord, selecteddatum.value)
      })
      .then(data => {
        // 6. Format the output result
        let output = coords.getTextFromCoord(data, selecteddatum.value, 7, coordinate.value)
        output += " or " + coords.printCoordinateFromDMS(projcoord, "N12 34.567 E1 23.456")
        
        result.value = output
      })
      .catch(e => {
        console.error(e)
        errormsg.value = t('errors.incorrectcoords')
      })

  } catch (e) {
    console.error(e)
    errormsg.value = t('errors.incorrectcoords')
  }
}
</script>
