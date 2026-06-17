<template>

  <header class="page-header">
    <h1>{{ t('revwherigo.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')">
        <div v-html="t('revwherigo.long')" />
      </VCard>
      <VCard :title="t('labels.input')">
        <div class="form-horizontal mb-2">
          <label>{{ t('labels.input') }}</label>
          <input type="text" ref="messageInput" v-model="message">
        </div>
        <div
          v-show="errormsg"
          class="errormsg"
        >
          {{ errormsg }}
        </div>
        <div class="button-row">
          <v-show-on-map id="go" class="btn btn-primary" @Show="solveReverse()" />
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
        <v-map v-model:mylocation="message" />     
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import * as coords from '@/scripts/coords.js'

// Component Imports
import VMap from '@/components/generic/VMap.vue'
import VCard from '@/components/generic/VCard.vue'
import VShowOnMap from '@/components/generic/VShowOnMap.vue'

defineOptions({
  name: 'ReverseWherigo'
})

const store = useStore()
const { t } = useI18n()

// --- State ---
const message = ref("")
const result = ref("")
const errormsg = ref("")
const format = ref(0)
const coordinate1 = ref(null)

// --- Template Ref ---
const messageInput = ref(null)

onMounted(() => {
  messageInput.value?.focus()
})

// --- Logic Helpers ---

/**
 * Core Algorithm for Reverse Wherigo codes
 */
const reverseWherigo2Coord = (d1Raw, d2Raw, d3Raw) => {
  let latSign, lonSign, latValue, lonValue

  // Convert to 6-digit padded strings
  const d1 = String(d1Raw).padStart(6, '0')
  const d2 = String(d2Raw).padStart(6, '0')
  const d3 = String(d3Raw).padStart(6, '0')

  if (d1.length !== 6 || d2.length !== 6 || d3.length !== 6) {
    throw t('errors.invalidinput')
  }

  // Determine signs based on d1[3]
  switch (d1[3]) {
    case "1": latSign = 1; lonSign = 1; break
    case "2": latSign = -1; lonSign = 1; break
    case "3": latSign = 1; lonSign = -1; break
    case "4": latSign = -1; lonSign = -1; break
    default: throw t('errors.invalidinput')
  }

  // Reorder digits based on checksum of d3
  const isEven = (parseInt(d3[1]) + parseInt(d3[4])) % 2 === 0
  
  if (isEven) {
    latValue = d1[2] + d2[4] + d2[1] + d3[3] + d1[0] + d3[4] + d1[5]
    lonValue = d1[1] + d3[0] + d3[5] + d2[3] + d2[0] + d1[4] + d3[1] + d2[5]
  } else {
    latValue = d2[0] + d1[5] + d1[2] + d3[0] + d3[3] + d3[4] + d1[0]
    lonValue = d2[4] + d3[5] + d1[4] + d1[1] + d2[3] + d2[5] + d3[1] + d2[1]
  }

  // Checksum validation
  let c1, c2
  if (isEven) {
    c1 = 11 - ((2 * d1[3] + 4 * d1[2] + 7 * d2[1] + 8 * d1[0] + 5 * d1[5] + 6 * d1[1] + 9 * d2[0] + 3 * d1[4]) % 11)
    c2 = 11 - ((6 * d2[4] + 5 * d3[3] + 9 * d3[4] + 2 * d3[0] + 7 * d3[5] + 8 * d2[3] + 3 * d3[1] + 4 * d2[5]) % 11)
  } else {
    c1 = 11 - ((2 * d1[3] + 9 * d2[0] + 5 * d1[5] + 4 * d1[2] + 8 * d1[0] + 3 * d1[4] + 6 * d1[1] + 7 * d2[1]) % 11)
    c2 = 11 - ((2 * d3[0] + 5 * d3[3] + 9 * d3[4] + 6 * d2[4] + 7 * d3[5] + 8 * d2[3] + 4 * d2[5] + 3 * d3[1]) % 11)
  }

  const finalizeChecksum = (c) => (c === 10 ? 0 : c === 11 ? 5 : c)
  c1 = finalizeChecksum(c1)
  c2 = finalizeChecksum(c2)

  if (c1 !== parseInt(d2[2]) || c2 !== parseInt(d3[2])) {
    throw t('errors.invalidchecksum')
  }

  return {
    lat: (latSign * parseInt(latValue)) / 100000,
    lon: (lonSign * parseInt(lonValue)) / 100000
  }
}

// --- Primary Action ---

const solveReverse = () => {
  errormsg.value = ""
  result.value = ""

  try {
    // Split input by whitespace, dashes, commas, or dots
    const parts = message.value.split(/[-\s,.]+/g).filter(x => x !== "")

    if (!parts || parts.length !== 3) {
      throw t('errors.invalidinput')
    }

    const c = reverseWherigo2Coord(parts[0], parts[1], parts[2])

    // Generate result strings in various formats
    let output = coords.printCoordinateFromDMS(c, "N12.12345 E123.12345") + "<br>"
    output += coords.printCoordinateFromDMS(c, "N12 34.567 E123 45.678") + "<br>"
    output += coords.printCoordinateFromDMS(c, "N12 34 56.789 E123 45 67.678")

    result.value = output

    // Update Map
    coords.displayMarker(store.state.mymap, c, t('labels.point'))

  } catch (e) {
    console.error(e)
    errormsg.value = e
  }
}
</script>
