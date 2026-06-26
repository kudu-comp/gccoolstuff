<template>

  <header class="page-header">
    <h1>{{ t('mmsolver.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')" :initialOpen="startOpen">
        <div v-html="t('mmsolver.long')" />
      </VCard>
      <VCard :title="t('labels.settings')">
        <div class="form-horizontal">
          <label>{{ t('mmsolver.npin') }}</label>
          <input type="number" v-model="npin" min="3" max="6" ref="npinInput">
        </div>
        <div class="form-horizontal">
          <label>{{ t('mmsolver.ncolor') }}</label>
          <input type="number" v-model="ncolor" min="3" max="9">
        </div>
        <label class="checkbox-container mb-2">
          <input type="checkbox" v-model="unique">
          <span class="checkmark"></span>
          {{ t('mmsolver.unique') }}
        </label>
      </VCard>
      <VCard :title="t('labels.input')">
       <div class="table-responsive">
        <table class="p-table-small">
          <thead>
            <tr>
              <th scope="col"> {{ t('mmsolver.pins') }} </th>
              <th scope="col"> {{ t('mmsolver.pos') }} </th>
              <th scope="col"> {{ t('mmsolver.col') }} </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in maxhints" :key="i">
              <td>
                <input v-model="pinsArr[i-1]" type="text" placeholder="Pins" style="width: 150px;">
              </td>
              <td>
                <input v-model.number="posArr[i-1]" type="number" style="width: 60px;">
              </td>
              <td>
                <input v-model.number="colArr[i-1]" type="number" style="width: 60px;">
              </td>
            </tr>
          </tbody>
        </table>
        </div>
        <p
          v-show="errormsg"
          class="errormsg"
        >
          {{ errormsg }}
        </p>
        <div class="button-row mt-2">
          <button  class="btn btn-primary" @click="solveMM">
            {{ t('buttons.solve') }}
          </button>
          <button class="btn btn-secondary" @click="resetMM">
            {{ t('buttons.reset') }}
          </button>
        </div>
      </VCard>
    </div>
    <div class="card-stack">
      <VCard :title="t('labels.result')">
        <div
          v-show="solved"
          class="resultbox"
        >
          <h4>
            {{ t('mmsolver.sols', results.length) }}
          </h4>
          <template v-for="r in results">
              {{ r }}<br>          
          </template>
        </div>
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import VCard from '@/components/generic/VCard.vue'

defineOptions({
  name: 'MastermindSolver'
})

const { t } = useI18n()

// --- State ---
const maxhints = 12
const npin = ref(4)
const ncolor = ref(6)
const unique = ref(false)

const pinsArr = ref([])
const posArr = ref([])
const colArr = ref([])
const nhints = ref(0)

const errormsg = ref("")
const results = ref([])
const solved = ref(false)

// --- Template Ref ---
const npinInput = ref(null)
const startOpen = window.innerWidth > 768;

// --- Methods ---

const resetMM = () => {
  pinsArr.value = Array(maxhints).fill("")
  posArr.value = Array(maxhints).fill(0)
  colArr.value = Array(maxhints).fill(0)
  results.value = []
  solved.value = false
  errormsg.value = ""
}

/**
 * Validates a candidate solution against the hints provided by user
 */
const checkCandidate = (candidate) => {
  for (let i = 0; i < nhints.value; i++) {
    // Make a mutable copy of the hint pins for color matching
    let tempHint = pinsArr.value[i].split("")
    let candidateArr = candidate.split("")

    let blackMatches = 0
    let whiteMatches = 0

    // 1. Check for Black Matches (Position and Color)
    for (let j = 0; j < npin.value; j++) {
      if (tempHint[j] === candidateArr[j]) {
        blackMatches++
        tempHint[j] = "x" // Mark as used
        candidateArr[j] = "z" // Mark as used
      }
    }
    if (blackMatches !== posArr.value[i]) return false

    // 2. Check for White Matches (Color only)
    for (let j = 0; j < npin.value; j++) {
      if (candidateArr[j] === "z") continue
      
      let foundIdx = tempHint.indexOf(candidateArr[j])
      if (foundIdx >= 0) {
        whiteMatches++
        tempHint[foundIdx] = "y" // Mark as used
      }
    }
    if (whiteMatches !== colArr.value[i]) return false
  }

  return true
}

/**
 * Brute force recursive generator
 */
const generatePins = (currentString) => {
  // If result set gets too large, stop to prevent crash
  if (results.value.length > 5000) return

  if (currentString.length < npin.value) {
    for (let c = 1; c <= ncolor.value; c++) {
      const char = c.toString()
      // If unique is required, check if color is already used in this string
      if (unique.value && currentString.indexOf(char) >= 0) continue
      
      generatePins(currentString + char)
    }
  } else {
    if (checkCandidate(currentString)) {
      results.value.push(currentString)
    }
  }
}

/**
 * Main Solve Action
 */
const solveMM = () => {
  // Reset outputs
  errormsg.value = ""
  results.value = []
  solved.value = false
  nhints.value = 0

  // 1. Validate the hints table
  for (let i = 0; i < maxhints; i++) {
    const currentGuess = pinsArr.value[i].trim()

    // Stop at the first empty row
    if (currentGuess.length === 0) {
      nhints.value = i
      break
    }
    // Final row reached
    if (i === maxhints - 1) nhints.value = maxhints

    // Check guess length
    if (currentGuess.length !== npin.value) {
      errormsg.value = t('mmsolver.invalidhint1')
      return
    }

    // Check color range
    for (let char of currentGuess) {
      const val = parseInt(char)
      if (isNaN(val) || val < 1 || val > ncolor.value) {
        errormsg.value = t('mmsolver.invalidhint2')
        return
      }
    }

    // Check if black + white matches exceed pin count
    if (posArr.value[i] + colArr.value[i] > npin.value) {
      errormsg.value = t('mmsolver.invalidhint3')
      return
    }
  }

  if (nhints.value === 0) {
    errormsg.value = "Please enter at least one hint."
    return
  }

  // 2. Run solver
  generatePins("")
  solved.value = true
}

// --- Lifecycle ---
onMounted(() => {
  resetMM()
  npinInput.value?.focus()
})
</script>

<style scoped>
.p-table-small input {
  padding: 0.4rem;
  font-size: 0.9rem;
}
</style>

<i18n locale="en">
{
  "mmsolver": {
    "npin": "Number of pins",
    "ncolor": "Number of colors",
    "unique": "Colors must be unique",
    "pins": "Tries",
    "pos": "Match location and color",
    "col": "Match color only",
    "invalidhint1": "Try must have the correct number of pins",
    "invalidhint2": "Try has invalid color",
    "invalidhint3": "Number of matches must be less or equal to number of pins",
    "sols": "There is no solution.|There is one solution.|There are {n} solutions."
  }
}
</i18n>

<i18n locale="nl">
{
  "mmsolver": {
    "npin": "Aantal pins",
    "ncolor": "Aantal kleuren",
    "unique": "Kleuren zijn uniek",
    "pins": "Pogingen",
    "pos": "Kleur & positie",
    "col": "Alleen kleur",
    "invalidhint1": "Poging heeft onjuist aantal pins",
    "invalidhint2": "Poging heeft een ongeldige kleur",
    "invalidhint3": "Aantal matches moet kleiner of gelijk zijn aan het aantal pins",
    "sols": "Er is geen oplossing.|Er is één oplossing|Er zijn {n} oplossingen."
  }
}
</i18n>