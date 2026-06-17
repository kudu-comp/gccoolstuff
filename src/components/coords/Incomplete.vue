<template>

<header class="page-header">
    <h1>{{ t('incomplete.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')">
        <div v-html="t('incomplete.long')" />
      </VCard>
      <VCard :title="t('labels.input')">
        <div class="form-horizontal">
        <v-coord
          v-model:coord="coordinate"
          v-model:datum="selecteddatum"
          class="mb-2"
        />
        </div>
        <div class="form-horizontal">
        <v-variable
          v-model:variable="var1"
          v-model:varoptions="var1options"
        />
        </div>
        <div class="form-horizontal">
        <v-variable
          v-model:variable="var2"
          v-model:varoptions="var2options"
        />
        </div>
        <div class="form-horizontal">
        <v-variable
          v-model:variable="var3"
          v-model:varoptions="var3options"
        />
        </div>
        <div class="form-horizontal">
        <v-variable
          v-model:variable="var4"
          v-model:varoptions="var4options"
        />
        </div>
        <div class="button-row">
          <v-show-on-map id="project" class="btn btn-primary" @show="showCoordinates()" />
        </div>
        <p
          v-show="errormsg"
          class="errormsg mb-2"
        >
          {{ errormsg }}.
        </p>          
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
import VMap from '@/components/generic/VMap.vue'
import VCard from '@/components/generic/VCard.vue'
import VVariable from '@/components/generic/VVariable.vue'
import VShowOnMap from '@/components/generic/VShowOnMap.vue'

defineOptions({
  name: 'CoordIncomplete'
})

const store = useStore()
const { t } = useI18n()

// --- State ---
const coordinate = ref("")
const selecteddatum = ref("WGS84")
const var1 = ref("a")
const var1options = ref("0123456789")
const var2 = ref("b")
const var2options = ref("0123456789")
const var3 = ref("c")
const var3options = ref("0123456789")
const var4 = ref("d")
const var4options = ref("0123456789")
const errormsg = ref("")

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

  try {
    // Check which variables are actually present in the text
    const useVar1 = coordinate.value.indexOf(var1.value) >= 0
    const useVar2 = coordinate.value.indexOf(var2.value) >= 0
    const useVar3 = coordinate.value.indexOf(var3.value) >= 0
    const useVar4 = coordinate.value.indexOf(var4.value) >= 0

    // Calculate total permutations
    const totaloptions = (useVar1 ? var1options.value.length : 1) *
                         (useVar2 ? var2options.value.length : 1) *
                         (useVar3 ? var3options.value.length : 1) *
                         (useVar4 ? var4options.value.length : 1)

    if (totaloptions > 500) {
      errormsg.value = t('incomplete.error1')
      return
    }

    // Initialize regular expressions for replacement
    const regex1 = new RegExp(var1.value, "g")
    const regex2 = new RegExp(var2.value, "g")
    const regex3 = new RegExp(var3.value, "g")
    const regex4 = new RegExp(var4.value, "g")

    // Nested loops for permutations
    // (v == 0) check ensures loops run once if variable is not used
    for (let v1 = 0; (useVar1 && v1 < var1options.value.length) || (v1 === 0); v1++) {
      for (let v2 = 0; (useVar2 && v2 < var2options.value.length) || (v2 === 0); v2++) {
        for (let v3 = 0; (useVar3 && v3 < var3options.value.length) || (v3 === 0); v3++) {
          for (let v4 = 0; (useVar4 && v4 < var4options.value.length) || (v4 === 0); v4++) {
            
            let currentCoord = coordinate.value
            let currentVars = ""

            if (useVar1) {
              currentCoord = currentCoord.replace(regex1, var1options.value[v1])
              currentVars += `${var1.value}=${var1options.value[v1]} `
            }
            if (useVar2) {
              currentCoord = currentCoord.replace(regex2, var2options.value[v2])
              currentVars += `${var2.value}=${var2options.value[v2]} `
            }
            if (useVar3) {
              currentCoord = currentCoord.replace(regex3, var3options.value[v3])
              currentVars += `${var3.value}=${var3options.value[v3]} `
            }
            if (useVar4) {
              currentCoord = currentCoord.replace(regex4, var4options.value[v4])
              currentVars += `${var4.value}=${var4options.value[v4]} `
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