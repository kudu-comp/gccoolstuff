<template>

  <header class="page-header">
    <h1>{{ t('revwherigo.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')" :initialOpen="startOpen">
        <div v-html="t('revwherigo.long')" />
      </VCard>
      <VCard :title="t('labels.input')">
        <div class="form-horizontal mb-2">
          <label>{{ t('labels.input') }}</label>
          <input type="text" ref="messageInput" v-model="message">
        </div>
        <div v-show="errormsg" class="errormsg mb-2">
          {{ errormsg }}
        </div>
        <div class="button-row">
          <button class="btn btn-primary" @click="solveReverse()">{{ t('revwherigo.solve') }}</button>
          <button class="btn btn-primary" @click="getReverse()">{{ t('revwherigo.get') }}</button>
        </div>
      </VCard>
      <VCard :title="t('labels.result')">
        <div v-if="result" class="resultbox" v-html="result"></div>
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

defineOptions({
  name: 'ReverseWherigo'
})

const store = useStore()
const { t } = useI18n();

// --- State ---
const message = ref("")
const result = ref("")
const errormsg = ref("")
const format = ref(0)
const coordinate1 = ref(null)

// --- Template Ref ---
const messageInput = ref(null)
const startOpen = window.innerWidth > 768;

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
    throw t('revwherigo.invalidchecksum')
  }

  return {
    lat: (latSign * parseInt(latValue)) / 100000,
    lon: (lonSign * parseInt(lonValue)) / 100000
  }
}

// --- Primary Action ---

const forwardWherigo2Coord = (lat, lon) => {
  const latSign = lat >= 0 ? 1 : -1;
  const lonSign = lon >= 0 ? 1 : -1;

  // Convert to absolute integer values scaled by 10^5
  // latValue is 7 digits, lonValue is 8 digits
  const latValue = Math.round(Math.abs(lat) * 100000).toString().padStart(7, '0');
  const lonValue = Math.round(Math.abs(lon) * 100000).toString().padStart(8, '0');

  let d1 = new Array(6);
  let d2 = new Array(6);
  let d3 = new Array(6);

  // Determine d1[3] based on signs
  if (latSign === 1 && lonSign === 1) d1[3] = "1";
  else if (latSign === -1 && lonSign === 1) d1[3] = "2";
  else if (latSign === 1 && lonSign === -1) d1[3] = "3";
  else if (latSign === -1 && lonSign === -1) d1[3] = "4";

  // Determine parity based on the digits that will become d3[1] and d3[4]
  // Based on the original mapping, d3[1] is always lonValue[6] and d3[4] is latValue[5]
  const d3_1 = lonValue[6];
  const d3_4 = latValue[5];
  const isEven = (parseInt(d3_1) + parseInt(d3_4)) % 2 === 0;

  if (isEven) {
    // latValue = d1[2] + d2[4] + d2[1] + d3[3] + d1[0] + d3[4] + d1[5]
    d1[2] = latValue[0]; d2[4] = latValue[1]; d2[1] = latValue[2]; d3[3] = latValue[3];
    d1[0] = latValue[4]; d3[4] = latValue[5]; d1[5] = latValue[6];
    // lonValue = d1[1] + d3[0] + d3[5] + d2[3] + d2[0] + d1[4] + d3[1] + d2[5]
    d1[1] = lonValue[0]; d3[0] = lonValue[1]; d3[5] = lonValue[2]; d2[3] = lonValue[3];
    d2[0] = lonValue[4]; d1[4] = lonValue[5]; d3[1] = lonValue[6]; d2[5] = lonValue[7];
  } else {
    // latValue = d2[0] + d1[5] + d1[2] + d3[0] + d3[3] + d3[4] + d1[0]
    d2[0] = latValue[0]; d1[5] = latValue[1]; d1[2] = latValue[2]; d3[0] = latValue[3];
    d3[3] = latValue[4]; d3[4] = latValue[5]; d1[0] = latValue[6];
    // lonValue = d2[4] + d3[5] + d1[4] + d1[1] + d2[3] + d2[5] + d3[1] + d2[1]
    d2[4] = lonValue[0]; d3[5] = lonValue[1]; d1[4] = lonValue[2]; d1[1] = lonValue[3];
    d2[3] = lonValue[4]; d2[5] = lonValue[5]; d3[1] = lonValue[6]; d2[1] = lonValue[7];
  }

  // Calculate Checksums
  const finalizeChecksum = (c) => (c === 10 ? 0 : c === 11 ? 5 : c);
  let c1, c2;

  const d1_3 = parseInt(d1[3]);
  if (isEven) {
    c1 = 11 - ((2 * d1_3 + 4 * d1[2] + 7 * d2[1] + 8 * d1[0] + 5 * d1[5] + 6 * d1[1] + 9 * d2[0] + 3 * d1[4]) % 11);
    c2 = 11 - ((6 * d2[4] + 5 * d3[3] + 9 * d3[4] + 2 * d3[0] + 7 * d3[5] + 8 * d2[3] + 3 * d3[1] + 4 * d2[5]) % 11);
  } else {
    c1 = 11 - ((2 * d1_3 + 9 * d2[0] + 5 * d1[5] + 4 * d1[2] + 8 * d1[0] + 3 * d1[4] + 6 * d1[1] + 7 * d2[1]) % 11);
    c2 = 11 - ((2 * d3[0] + 5 * d3[3] + 9 * d3[4] + 6 * d2[4] + 7 * d3[5] + 8 * d2[3] + 4 * d2[5] + 3 * d3[1]) % 11);
  }

  d2[2] = finalizeChecksum(c1);
  d3[2] = finalizeChecksum(c2);

  return {
    d1: d1.join(''),
    d2: d2.join(''),
    d3: d3.join('')
  };
};

const getReverse = () => {

  errormsg.value = ""
  // Translate input to lat lon first
  let w = message.value.split(" ")
  console.log(w);
  //
  let h = forwardWherigo2Coord(w[0], w[1])
  result.value = h.d1 + " " + h.d2 + " " + h.d3;

}

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

<i18n locale="en">
{
  "revwherigo": {
    "get": "Coordinate to reverse",
    "solve": "Reverse to coordinate",
    "invalidchecksum": "Warning: Invalid checksum"
  }
}
</i18n>

<i18n locale="nl">
{
  "revwherigo": {
    "get": "Coördinaat naar reverse",
    "invalidchecksum": "Let op: Checksum klopt niet",
    "solve": "Reverse naar coördinaat"
  }
}
</i18n>