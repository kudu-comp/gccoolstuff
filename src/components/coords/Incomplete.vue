<template>

<header class="page-header">
    <h1>{{ t('incomplete.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')" :initialOpen="startOpen">
        <div v-html="t('incomplete.long')" />
      </VCard>
      <VCard :title="t('labels.input')">
        <div class="form-horizontal">
        <CoordInput
          v-model:coord="coordinate"
          v-model:datum="selecteddatum"
          class="mb-2"
        />
        </div>
        <div class="form-horizontal" v-for="(v, idx) in vars">
          <label>{{ t('labels.variable') }}</label>
          <input
            type="text"
            v-model="vars[idx].var"
          >
          <label>{{ t('labels.option') }}</label>
          <input
            type="text"
            v-model="vars[idx].options"
          >
        </div>
        <p v-show="errormsg" class="errormsg mb-2">
          {{ errormsg }}.
        </p>
        <div class="button-row">
          <ButtonShowOnMap @show="showCoordinates()" />
        </div>
      </VCard>
    </div>
    <div class="card-stack">
      <VCard :title="t('labels.map')">
        <MapView v-model:mylocation="coordinate" />
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
import CoordInput from '@/components/generic/CoordInput.vue'
import MapView from '@/components/generic/MapView.vue'
import VCard from '@/components/generic/VCard.vue'
import ButtonShowOnMap from '@/components/generic/ButtonShowOnMap.vue'

defineOptions({
  name: 'CoordIncomplete'
})

const store = useStore()
const { t } = useI18n()

// --- State ---
const coordinate = ref("")
const selecteddatum = ref("WGS84")
const vars = ref([
  { var: "a", options: "0123456789"},
  { var: "b", options: "0123456789"},
  { var: "c", options: "0123456789"},
  { var: "d", options: "0123456789"}
])
const errormsg = ref("")
const startOpen = window.innerWidth > 768;

// --- Methods ---

const printMarker = (newcoord, vars) => {
  coords.convertCoordFromText(newcoord, selecteddatum.value, "WGS84")
    .then(coord => {
      // Accessing map from Vuex store
      const mymap = store.state.mymap
      if (mymap) {
        const marker = new L.marker(coord).addTo(mymap)
        marker.bindPopup(`${newcoord} ${vars}`).openPopup()
      }
    })
    .catch(e => console.error("Marker error:", e))
}

const showCoordinates = () => {
  // Initialize
  errormsg.value = ""
  console.log(vars)

  try {
    // Check which variables are actually present in the text
    const useVar1 = coordinate.value.indexOf(vars.value[0].var) >= 0
    const useVar2 = coordinate.value.indexOf(vars.value[1].var) >= 0
    const useVar3 = coordinate.value.indexOf(vars.value[2].var) >= 0
    const useVar4 = coordinate.value.indexOf(vars.value[3].var) >= 0

    // Calculate total permutations
    const totaloptions = (useVar1 ? vars.value[0].options.length : 1) *
                         (useVar2 ? vars.value[1].options.length : 1) *
                         (useVar3 ? vars.value[2].options.length : 1) *
                         (useVar4 ? vars.value[3].options.length : 1)

    if (totaloptions > 500) {
      errormsg.value = t('incomplete.error1')
      return
    }

    // Initialize regular expressions for replacement
    const regex1 = new RegExp(vars.value[0].var, "g")
    const regex2 = new RegExp(vars.value[1].var, "g")
    const regex3 = new RegExp(vars.value[2].var, "g")
    const regex4 = new RegExp(vars.value[3].var, "g")

    // Nested loops for permutations
    // (v == 0) check ensures loops run once if variable is not used
    for (let v1 = 0; (useVar1 && v1 < vars.value[0].options.length) || (v1 === 0); v1++) {
      for (let v2 = 0; (useVar2 && v2 < vars.value[1].options.length) || (v2 === 0); v2++) {
        for (let v3 = 0; (useVar3 && v3 < vars.value[2].options.length) || (v3 === 0); v3++) {
          for (let v4 = 0; (useVar4 && v4 < vars.value[3].options.length) || (v4 === 0); v4++) {

            let currentCoord = coordinate.value
            let currentVars = ""

            if (useVar1) {
              currentCoord = currentCoord.replace(regex1, vars.value[0].options[v1])
              currentVars += `${vars.value[0].var}=${vars.value[0].options[v1]} `
            }
            if (useVar2) {
              currentCoord = currentCoord.replace(regex2, vars.value[1].options[v2])
              currentVars += `${vars.value[1].var}=${vars.value[1].options[v2]} `
            }
            if (useVar3) {
              currentCoord = currentCoord.replace(regex3, vars.value[2].options[v3])
              currentVars += `${vars.value[2].var}=${vars.value[2].options[v3]} `
            }
            if (useVar4) {
              currentCoord = currentCoord.replace(regex4, vars.value[3].options[v4])
              currentVars += `${vars.value[3].var}=${vars.value[3].options[v4]} `
            }

            // Async plot marker
            printMarker(currentCoord, currentVars)
          }
        }
      }
    }
  } catch (e) {
    console.error(e)
    errormsg.value = t('errors.incorrectcoords')
  }
}
</script>

<i18n locale="en">
{
  "incomplete": {
    "error1": "Maximum number of coordinates is 500. Reduce the number of options."
  }
}
</i18n>

<i18n locale="nl">
{
  "incomplete": {
    "error1": "Maximaal aantal coördinaten is 500. Reduceer het aantal opties."
  }
}
</i18n>