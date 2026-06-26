<template>

  <header class="page-header">
    <h1>{{ t('lines.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')" :initialOpen="startOpen">
        <div v-html="t('lines.long')" />
      </VCard>
      <VCard :title="t('labels.input')">
        <div class="form-horizontal">
          <CoordInput
            v-model:coord="coordinate1"
            v-model:datum="selecteddatum1"
            class="mb-2"
          >
            <template #label>
              {{ t('labels.point') }} 1
            </template>
            <!-- <template #popup>
              <button 
                class="btn btn-primary" 
                @click="modal1 = true"
              >
                {{ t('linepointdir.pdir') }}
              </button>
            </template>    -->
          </CoordInput>
        </div>
        <div class="form-horizontal">
          <CoordInput
            v-model:coord="coordinate2"
            v-model:datum="selecteddatum2"
            class="mb-2"
          >
            <template #label>
              {{ t('labels.point') }} 2
            </template>
          </CoordInput>
        </div>
        <div class="form-horizontal">
          <CoordInput
            v-model:coord="coordinate3"
            v-model:datum="selecteddatum3"
            class="mb-2"
          >
            <template #label>
              {{ t('labels.point') }} 3
            </template>
            <!-- <template #popup>
              <button 
                class="btn btn-primary" 
                @click="modal2 = true"
              >
                {{ t('linepointdir.pdir') }}
              </button>
            </template>         -->
          </CoordInput>
        </div>
        <div class="form-horizontal">
          <CoordInput
            v-model:coord="coordinate4"
            v-model:datum="selecteddatum4"
            class="mb-2"
          >
            <template #label>
              {{ t('labels.point') }} 4
            </template>
          </CoordInput>
          <v-line-point-dir
            v-if="modal1"
            v-model:lat1="lat1"
            v-model:lon1="lon1"
            v-model:lat2="lat2"
            v-model:lon2="lon2"
            @close="createLine(lat1,lon1,lat2,lon2,1); modal1 = false"
          />
          <v-line-point-dir
            v-if="modal2"
            v-model:lat1="lat1"
            v-model:lon1="lon1"
            v-model:lat2="lat2"
            v-model:lon2="lon2"
            @close="createLine(lat1,lon1,lat2,lon2,2); modal2 = false"
          />
        </div>
        <div v-show="errormsg" class="errormsg">
          {{ errormsg }}
        </div>
        <div class="button-row mb-2">
          <label>{{ t('lines.calc1') }}</label>
          <ButtonShowOnMap @show="doLine1()" />
        </div>
        <div class="button-row mb-2">
          <label>{{ t('lines.calc2') }}</label>
          <ButtonShowOnMap @show="doLine2()" />
        </div>
        <div class="button-row">
          <label>{{ t('lines.calc3') }}</label>
          <ButtonShowOnMap @show="doLine3()" />
        </div>
      </VCard>
      <VCard :title="t('labels.result')">
        <div
          v-if="result"
          class="resultbox"
          v-html="result"
        />     
      </VCard>
    </div>
    <div class="card-stack">
      <VCard :title="t('labels.map')">
        <MapView v-model:mylocation="coordinate1" />     
      </VCard>
    </div>
  </div>
</template>

<script setup>

import { ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import L from "leaflet"
import * as coords from '@/scripts/coords.js'

// Component Imports
import CoordInput from '@/components/generic/CoordInput.vue'
import MapView from '@/components/generic/MapView.vue'
import VCard from '@/components/generic/VCard.vue'
import ButtonShowOnMap from '@/components/generic/ButtonShowOnMap.vue'
import VLinePointDir from '@/components/generic/VLinePointDir.vue'

defineOptions({
  name: 'Lines'
})

const store = useStore()
const { t } = useI18n()

// --- State ---
const coordinate1 = ref("")
const coordinate2 = ref("")
const coordinate3 = ref("")
const coordinate4 = ref("")
const selecteddatum1 = ref("WGS84")
const selecteddatum2 = ref("WGS84")
const selecteddatum3 = ref("WGS84")
const selecteddatum4 = ref("WGS84")
const result = ref("")
const errormsg = ref("")
const modal1 = ref(false)
const modal2 = ref(false)
const lat1 = ref(0)
const lon1 = ref(0)
const lat2 = ref(0)
const lon2 = ref(0)
const startOpen = window.innerWidth > 768;

// --- Helper Functions ---

const getLength = (c1, c2) => {
  return Math.sqrt((c1.lat - c2.lat) ** 2 + (c1.lon - c2.lon) ** 2)
}

const getDirection = (c1, c2) => {
  let temp = Math.acos((c2.lat - c1.lat) / getLength(c1, c2)) * 180 / Math.PI
  if (c2.lon < c1.lon) temp = 360 - temp
  return temp
}

const createLine = async (l1, n1, l2, n2, lineNum) => {
  try {
    const coordObj1 = { lat: l1, lon: n1 }
    const coordObj2 = { lat: l2, lon: n2 }

    const seldatum1 = (lineNum === 2) ? selecteddatum3.value : selecteddatum1.value
    const seldatum2 = (lineNum === 2) ? selecteddatum4.value : selecteddatum2.value

    const data1 = await coords.convertCoordFromLatLon(coordObj1, "RD", seldatum1)
    if (lineNum === 1) {
      coordinate1.value = coords.getTextFromCoord(data1, seldatum1, 7)
    } else {
      coordinate3.value = coords.getTextFromCoord(data1, seldatum1, 7)
    }

    const data2 = await coords.convertCoordFromLatLon(coordObj2, "RD", seldatum2)
    if (lineNum === 1) {
      coordinate2.value = coords.getTextFromCoord(data2, seldatum2, 7)
    } else {
      coordinate4.value = coords.getTextFromCoord(data2, seldatum2, 7)
    }
  } catch (e) {
    console.error(e)
  }
}

// --- Main Calculation Methods ---

const doLine1 = async () => {
  errormsg.value = ""
  result.value = ""
  const mymap = store.state.mymap

  try {
    const [coord1, coord2] = await Promise.all([
      coords.convertCoordFromText(coordinate1.value, selecteddatum1.value, "WGS84"),
      coords.convertCoordFromText(coordinate2.value, selecteddatum2.value, "WGS84")
    ])

    const [grid1, grid2] = await Promise.all([
      coords.convertCoordFromLatLon(coord1, "WGS84", "RD"),
      coords.convertCoordFromLatLon(coord2, "WGS84", "RD")
    ])

    const midpointWgs = await coords.convertCoordToWGS({
      lat: (grid1.lat + grid2.lat) / 2,
      lon: (grid1.lon + grid2.lon) / 2
    }, "RD")

    // Markers and UI
    coords.displayMarker(mymap, coord1, `${t('labels.point')} 1`)
    coords.displayMarker(mymap, coord2, `${t('labels.point')} 2`)
    coords.displayMarker(mymap, midpointWgs, t('lines.midpoint'))
    L.polyline([coord1, coord2], { color: 'red' }).addTo(mymap)

    const midpointInDatum = await coords.convertCoordFromWGS(midpointWgs, selecteddatum1.value)

    // Results
    let output = `${t('lines.midpoint')}: ${coords.getTextFromCoord(midpointInDatum, selecteddatum1.value, 7, coordinate1.value)}`
    output += `<br>${t('lines.midpoint')}: ${coords.printCoordinateFromDMS(midpointWgs, "N12 34.567 E1 23.456")}`
    output += `<br>${t('lines.distance')}${getLength(grid1, grid2).toFixed(0)} m.`
    output += `<br>${t('lines.direction')}${getDirection(grid1, grid2).toFixed(2)}°`
    
    result.value = output
  } catch (e) {
    console.error(e)
    errormsg.value = t('errors.incorrectcoords')
  }
}

const doLine2 = async () => {
  errormsg.value = ""
  result.value = ""
  const mymap = store.state.mymap

  try {
    const [coord1, coord2, coord3] = await Promise.all([
      coords.convertCoordFromText(coordinate1.value, selecteddatum1.value, "WGS84"),
      coords.convertCoordFromText(coordinate2.value, selecteddatum2.value, "WGS84"),
      coords.convertCoordFromText(coordinate3.value, selecteddatum3.value, "WGS84")
    ])

    const [grid1, grid2, grid3] = await Promise.all([
      coords.convertCoordFromLatLon(coord1, "WGS84", "RD"),
      coords.convertCoordFromLatLon(coord2, "WGS84", "RD"),
      coords.convertCoordFromLatLon(coord3, "WGS84", "RD")
    ])

    // Geometry math
    const a = (grid1.lat - grid2.lat) / (grid1.lon - grid2.lon)
    const b = grid1.lat - a * grid1.lon
    const a2 = -1 / a
    const b2 = grid3.lat - a2 * grid3.lon

    const pmx = (b2 - b) / (a - a2)
    const pmy = a * pmx + b
    const intersectionWgs = await coords.convertCoordToWGS({ lon: pmx, lat: pmy }, "RD")

    // UI
    coords.displayMarker(mymap, coord1, `${t('labels.point')} 1`)
    coords.displayMarker(mymap, coord2, `${t('labels.point')} 2`)
    coords.displayMarker(mymap, coord3, `${t('labels.point')} 3`)
    coords.displayMarker(mymap, intersectionWgs, t('lines.pointnearest'))
    L.polyline([coord1, coord2], { color: 'red' }).addTo(mymap)
    L.polyline([coord3, intersectionWgs], { color: 'blue' }).addTo(mymap)

    const intersectionInDatum = await coords.convertCoordFromWGS(intersectionWgs, selecteddatum1.value)

    // Results
    let output = `${t('lines.pointnearest')}${coords.getTextFromCoord(intersectionInDatum, selecteddatum1.value, 7, coordinate1.value)}`
    output += `<br>${t('lines.pointnearest')}${coords.printCoordinateFromDMS(intersectionWgs, "N12 34.567 E1 23.456")}`
    output += `<br>${t('lines.distance')}${getLength({ lon: pmx, lat: pmy }, grid3).toFixed(0)} m.`
    output += `<br>${t('lines.direction')}${getDirection({ lon: pmx, lat: pmy }, grid3).toFixed(2)} degrees`
    
    result.value = output
  } catch (e) {
    console.error(e)
    errormsg.value = t('errors.incorrectcoords')
  }
}

const doLine3 = async () => {
  errormsg.value = ""
  result.value = ""
  const mymap = store.state.mymap

  try {
    const wgsCoords = await Promise.all([
      coords.convertCoordFromText(coordinate1.value, selecteddatum1.value, "WGS84"),
      coords.convertCoordFromText(coordinate2.value, selecteddatum2.value, "WGS84"),
      coords.convertCoordFromText(coordinate3.value, selecteddatum3.value, "WGS84"),
      coords.convertCoordFromText(coordinate4.value, selecteddatum4.value, "WGS84")
    ])

    const gridCoords = await Promise.all(
      wgsCoords.map(c => coords.convertCoordFromLatLon(c, "WGS84", "RD"))
    )

    const [g1, g2, g3, g4] = gridCoords

    const a = (g1.lat - g2.lat) / (g1.lon - g2.lon)
    const b = g1.lat - a * g1.lon
    const a2 = (g3.lat - g4.lat) / (g3.lon - g4.lon)
    const b2 = g3.lat - a2 * g3.lon

    const pmx = (b2 - b) / (a - a2)
    const pmy = a * pmx + b
    const intersectionWgs = await coords.convertCoordToWGS({ lon: pmx, lat: pmy }, "RD")

    // UI
    coords.displayMarker(mymap, wgsCoords[0], `${t('labels.point')} 1`)
    coords.displayMarker(mymap, wgsCoords[1], `${t('labels.point')} 2`)
    coords.displayMarker(mymap, wgsCoords[2], `${t('labels.point')} 3`)
    coords.displayMarker(mymap, wgsCoords[3], `${t('labels.point')} 4`)
    coords.displayMarker(mymap, intersectionWgs, t('lines.intersection'))
    L.polyline([wgsCoords[0], wgsCoords[1]], { color: 'red' }).addTo(mymap)
    L.polyline([wgsCoords[2], wgsCoords[3]], { color: 'blue' }).addTo(mymap)

    const intersectionInDatum = await coords.convertCoordFromWGS(intersectionWgs, selecteddatum1.value)

    let output = `${t('lines.intersection')}${coords.getTextFromCoord(intersectionInDatum, selecteddatum1.value, 7, coordinate1.value)}`
    output += `<br>${t('lines.intersection')}${coords.printCoordinateFromDMS(intersectionWgs, "N12 34.567 E1 23.456")}`
    
    result.value = output
  } catch (e) {
    console.error(e)
    errormsg.value = t('errors.incorrectcoords')
  }
}
</script>

<i18n locale="en">
{
  "lines": {
     "calc1": "Calculate distance, direction and midpoint (uses coordinate 1 & 2)",
    "calc2": "Calculate point nearest to Point 3 on line thru Point 1 and Point 2.",
    "calc3": "Get intersection of lines thru Point 1 and 2 and Point 3 and 4",
    "midpoint": "Midpoint",
    "distance": "The distance is: ",
    "direction": "The direction is: ",
    "pointnearest": "Point nearest: ",
    "intersection": "Intersection: "
 }
}
</i18n>

<i18n locale="nl">
{
  "lines": {
    "calc1": "Bereken afstand, richting en middenpunt (gebruikt coördinaten 1 & 2)",
    "calc2": "Bereken punt het dichtste bij punt 3 op de lijn door punt 1 en punt 2.",
    "calc3": "Bereken het snijpunt van de lijn door punt 1 en punt 2 en de lijn door punt 3 en punt 4.",
    "midpoint": "Middenpunt",
    "distance": "De afstand is: ",
    "direction": "De richting is: ",
    "pointnearest": "Dichtstbijzijnde punt: ",
    "intersection": "Snijpunt: "
  }
}
</i18n>