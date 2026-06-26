<template>

  <header class="page-header">
    <h1>{{ t('antipode.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')" :initialOpen="startOpen">
        <div v-html="t('antipode.long')" />
      </VCard>
      <VCard :title="t('labels.input')">
        <div class="form-horizontal">
          <v-coord
            v-model:coord="coordinate"
            v-model:datum="selecteddatum"
          />
        </div>
        <p v-show="errormsg" class="errormsg mb-2">
          {{ errormsg }}.
        </p>
        <div class="button-row">
          <ButtonShowOnMap @Show="doCalc()" />
        </div>
      </VCard>
      <VCard :title="t('labels.result')">
        <div
          v-if="result"
          class="resultbox"
        >
          {{ result }}
        </div>
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
import * as coords from '@/scripts/coords.js'

// Component Imports
import VCoord from '@/components/generic/VCoord.vue'
import VCard from '@/components/generic/VCard.vue'
import VMap from '@/components/generic/VMap.vue'
import ButtonShowOnMap from '@/components/generic/ButtonShowOnMap.vue'

defineOptions({
  name: 'Antipode'
})

const store = useStore()
const { t } = useI18n()

// --- State ---
const coordinate = ref("")
const selecteddatum = ref("WGS84")
const result = ref("")
const errormsg = ref("")
const startOpen = window.innerWidth > 768;

// --- Methods ---
const doCalc = () => {
  // Reset outputs
  errormsg.value = ""
  result.value = ""

  try {
    // 1. Translate input coordinate to WGS84 for math and map display
    coords.convertCoordFromText(coordinate.value, selecteddatum.value, "WGS84")
      .then(startcoord => {

        // 2. Antipode math
        // Flip latitude and shift longitude by 180 degrees
        let anticoord = {
          lon: startcoord.lon - 180,
          lat: -1 * startcoord.lat
        }

        // Normalize longitude
        if (anticoord.lon < -180) {
          anticoord.lon += 360
        }

        // 3. Display marker on the map stored in Vuex
        coords.displayMarker(store.state.mymap, anticoord, "Antipode")

        // 4. Convert the antipode back to the input datum for the text result
        // We chain the next part to keep anticoord in scope for the final print
        return coords.convertCoordFromWGS(anticoord, selecteddatum.value)
          .then(convcoord => ({ convcoord, anticoord }))
      })
      .then(({ convcoord, anticoord }) => {

        // 5. Format and display the results
        let c1 = coords.getTextFromCoord(convcoord, selecteddatum.value, 7, coordinate.value)
        let c2 = coords.printCoordinateFromDMS(anticoord, "N12 34.567 E1 23.456")
        result.value = t('antipode.result', {c1 : c1, c2: c2})
      })
      .catch((e) => {
        errormsg.value = t('errors.incorrectcoords')
        console.error(e.message)
      })

  } catch (e) {
    console.error(e)
    errormsg.value = t('errors.incorrectcoords')
  }
}
</script>

<i18n locale="en">
{
  "antipode": {
    "result": "The antipode coordinate is {c1} or in WGS84 it is {c2}."
  }
}
</i18n>

<i18n locale="nl">
{
  "antipode": {
    "result": "Het antipode coördinaat is {c1} of in WGS84 is het {c2},"
  }
}
</i18n>