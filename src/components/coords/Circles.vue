<template>

  <header class="page-header">
    <h1>{{ t('circles.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')" :initialOpen="startOpen">
        <div v-html="t('circles.long')" />
      </VCard>
      <VCard :title="t('labels.input')">
        <div class="input-box mb-2">
          <span class="input-box-title">{{t('circles.circle')}} 1</span>
          <div class="form-horizontal">
            <v-coord
              v-model:coord="coordinate1"
              v-model:datum="selecteddatum1"
            >
              <template #label>
                {{ t('labels.center') }} 1
              </template>
              <!-- <template #popup>
                <button
                  class="btn sm-size mb-2 ms-2"
                  @click="modal1 = true"
                >
                  {{ t('circles.from3p') }}
                </button>
              </template>      -->
            </v-coord>
          </div>
          <div class="form-horizontal">
            <v-distance
              v-model:dist="radius1"
              v-model:unit="unit1"
            >
              <template #label>
                {{ t('labels.radius') }}
              </template>
            </v-distance>
          </div>
        </div>
        <div class="input-box mb-2">
          <span class="input-box-title">{{t('circles.circle')}} 2</span>
          <div class="form-horizontal">
            <v-coord
              v-model:coord="coordinate2"
              v-model:datum="selecteddatum2"
            >
                <template #label>
                {{ t('labels.center') }} 2
              </template>
              <!-- <template #popup>
                <button
                  class="btn sm-size mb-2 ms-2"
                  @click="modal2 = true"
                >
                  {{ t('circles.from3p') }}
                </button>
              </template>     -->
            </v-coord>
          </div>
          <div class="form-horizontal">
            <v-distance
              v-model:dist="radius2"
              v-model:unit="unit2"
            >
              <template #label>
                {{ t('labels.radius') }}
              </template>
            </v-distance>
          </div>
          <v-circle3p
              v-if="modal1"
              v-model:lat="lat1"
              v-model:lon="lon1"
              v-model:radius="radius1"
              @close="createCenter(lat1,lon1,1); modal1 = false"
            />
            <v-circle3p
              v-if="modal2"
              v-model:lat="lat2"
              v-model:lon="lon2"
              v-model:radius="radius2"
              @close="createCenter(lat2,lon2,2); modal2 = false"
            />
        </div>
        <div v-show="errormsg" class="errormsg mb-2">
          {{ errormsg }}
        </div>
        <div class="button-row">
          <ButtonShowOnMap @show="getPoints()" />
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
        <v-map v-model:mylocation="coordinate1" />
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import L from "leaflet"

// Logic Imports
import * as coords from '@/scripts/coords.js'
import { calculateCircleProperties } from '@/scripts/circles.js'

// UI Component Imports
import VCoord from '@/components/generic/VCoord.vue'
import VMap from '@/components/generic/VMap.vue'
import VCard from '@/components/generic/VCard.vue'
import VDistance from '@/components/generic/VDistance.vue'
import ButtonShowOnMap from '@/components/generic/ButtonShowOnMap.vue'
import VCircle3p from '@/components/generic/VCircle3p.vue'

defineOptions({ name: 'Circles' })

const store = useStore()
const { t } = useI18n()

// --- State ---
const coordinate1 = ref("")
const coordinate2 = ref("")
const selecteddatum1 = ref("WGS84")
const selecteddatum2 = ref("WGS84")
const radius1 = ref(0)
const unit1 = ref(1)
const radius2 = ref(0)
const unit2 = ref(1)
const result = ref("")
const errormsg = ref("")
const startOpen = window.innerWidth > 768;

/**
 * onMounted Hook:
 * If coordinate1 is provided, move the map to that location.
 */
onMounted(async () => {
  if (coordinate1.value) {
    try {
      const startCoord = await coords.convertCoordFromText(coordinate1.value, selecteddatum1.value, "WGS84");
      const mymap = store.state.mymap;
      if (mymap) {
        mymap.flyTo(startCoord, 13);
      }
    } catch (e) {
      console.warn("Could not pan map to initial coordinate", e);
    }
  }
});

// --- Methods ---

const createCenter = async (lat, lon, h) => {
  const coord = { lat, lon }
  const seldatum = (h === 2) ? selecteddatum2.value : selecteddatum1.value
  const data = await coords.convertCoordFromLatLon(coord, "RD", seldatum)

  if (h === 2) {
    coordinate2.value = coords.getTextFromCoord(data, seldatum, 7)
  } else {
    coordinate1.value = coords.getTextFromCoord(data, seldatum, 7)
  }
}

const getPoints = async () => {
  errormsg.value = ""
  result.value = ""
  const mymap = store.state.mymap

  try {
    const coord1Wgs = await coords.convertCoordFromText(coordinate1.value, selecteddatum1.value, "WGS84")
    const r1 = radius1.value * unit1.value

    // Single Circle Case
    if (coordinate2.value === "") {
      coords.displayMarker(mymap, coord1Wgs, "Center 1")
      L.circle(coord1Wgs, { color: "#E72E1C", fillColor: "#EC7F74", fillOpacity: 0.5, radius: r1 }).addTo(mymap)

      result.value = `${t('circles.surf')} 1: ${(Math.PI * Math.pow(r1, 2)).toFixed(0)} m<br>`
      result.value += `${t('circles.circ')} 1: ${(r1 * 2 * Math.PI).toFixed(0)} m<sup>2</sup><br>`
      errormsg.value = t('circles.nocircle2')
      return
    }

    // Two Circle Case
    const coord2Wgs = await coords.convertCoordFromText(coordinate2.value, selecteddatum2.value, "WGS84")
    const grid1 = await coords.convertCoordFromLatLon(coord1Wgs, "WGS84", "RD")
    const grid2 = await coords.convertCoordFromLatLon(coord2Wgs, "WGS84", "RD")
    const r2 = radius2.value * unit2.value

    coords.displayMarker(mymap, coord1Wgs, "Center 1")
    coords.displayMarker(mymap, coord2Wgs, "Center 2")
    L.circle(coord1Wgs, { color: "#E72E1C", fillColor: "#EC7F74", fillOpacity: 0.5, radius: r1 }).addTo(mymap)
    L.circle(coord2Wgs, { color: "#E72E1C", fillColor: "#EC7F74", fillOpacity: 0.5, radius: r2 }).addTo(mymap)

    // LOCAL CALCULATION (Replaces PHP)
    const data = calculateCircleProperties(
      { x: grid1.lon, y: grid1.lat, rad: r1 },
      { x: grid2.lon, y: grid2.lat, rad: r2 }
    )

    let output = `${t('circles.surf')} 1: ${data.c1.surface.toFixed(0)} m<br>`
    output += `${t('circles.circ')} 1: ${data.c1.circumference.toFixed(0)} m<sup>2</sup><br>`
    output += `${t('circles.surf')} 2: ${data.c2.surface.toFixed(0)} m<br>`
    output += `${t('circles.circ')} 2: ${data.c2.circumference.toFixed(0)} m<sup>2</sup><br>`

    if (data.intersect) {
      const p1Wgs = await coords.convertCoordToWGS({ lat: data.p1.y, lon: data.p1.x }, "RD")
      const p2Wgs = await coords.convertCoordToWGS({ lat: data.p2.y, lon: data.p2.x }, "RD")
      const p1Datum = await coords.convertCoordFromWGS(p1Wgs, selecteddatum1.value)
      const p2Datum = await coords.convertCoordFromWGS(p2Wgs, selecteddatum1.value)

      output += `${t('circles.ip')} 1: ${coords.getTextFromCoord(p1Datum, selecteddatum1.value, 7, coordinate1.value)}`
      output += `${t('circles.or')}${coords.printCoordinateFromDMS(p1Wgs, "N12 34.567 E1 23.456")}<br>`
      output += `${t('circles.ip')} 2: ${coords.getTextFromCoord(p2Datum, selecteddatum1.value, 7, coordinate1.value)}`
      output += `${t('circles.or')}${coords.printCoordinateFromDMS(p2Wgs, "N12 34.567 E1 23.456")}<br>`
      output += `${t('circles.distance')}: ${data.distance.toFixed(0)}m<br>`
      output += `${t('circles.ia')}: ${data.area.toFixed(0)}m<sup>2</sup>`

      coords.displayMarker(mymap, p1Wgs, `${t('circles.ip')} 1`)
      coords.displayMarker(mymap, p2Wgs, `${t('circles.ip')} 2`)
    } else {
      output += t('circles.ni')
      output += `<br>${t('circles.ia')}: ${data.area.toFixed(0)}m<sup>2</sup>`
    }

    result.value = output

  } catch (e) {
    console.error(e)
    errormsg.value = t('errors.incorrectcoords')
  }
}
</script>

<i18n locale="en">
{
  "circles": {
    "circle": "Circle",
    "ip": "Intersection point",
    "ia": "Intersection area",
    "ni": "No intersection",
    "distance": "Distance between intersection points",
    "or": " or ",
    "surf": "Surface of circle ",
    "circ": "Circumference of circle ",
    "from3p": "Use 3 points",
    "nocircle2": "Only one circle given"
  }
}
</i18n>

<i18n locale="nl">
{
  "circles": {
    "circle": "Cirkel",
    "ip": "Snijpunt",
    "ia": "Oppervlakte snijvlak",
    "ni": "Geen snijpunten",
    "distance": "Afstand tussen snijpunten",
    "or": " of ",
    "surf": "Oppervlakte van cirkel ",
    "circ": "Omtrek van cirkel  ",
    "from3p": "Geef 3 punten",
    "nocircle2": "Maar één cirkel ingevoerd"
  }
}
</i18n>