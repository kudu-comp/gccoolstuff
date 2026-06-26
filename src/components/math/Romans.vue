<template>

  <header class="page-header">
    <h1>{{ t('romans.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')" :initialOpen="startOpen">
        <div v-html="t('romans.long')" />
      </VCard>
      <VCard :title="t('labels.input')">
        <textarea
          ref="inputRef"
          v-model="input"
          :placeholder="t('labels.number')"
          class="mb-2"
        />
        <p v-if="errormsg" class="errormsg mt-2">
          {{ errormsg }}.
        </p>
        <div class="button-row mt-2">
          <button id="convert" class="btn btn-primary"  @click="romanToDec">
            {{ t('romans.btnrtd') }}
          </button>
          <button id="convert" class="btn btn-primary"  @click="decToRoman">
            {{ t('romans.btndtr') }}
          </button>
        </div>
      </VCard>
    </div>
    <div class="card-stack">
      <VCard :title="t('labels.result')">
        <div
          v-if="result"
          class="resultbox"
        >
          {{ result }}
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
  name: 'MathRomans'
})

const { t } = useI18n()

// --- Constants ---
const INTS = [1000, 500, 100, 50, 10, 5, 1]
const ROMANS = ["M", "D", "C", "L", "X", "V", "I"]

// --- State ---
const input = ref("")
const result = ref("")
const errormsg = ref("")

// --- Template Ref ---
const inputRef = ref(null)
const startOpen = window.innerWidth > 768;

onMounted(() => {
  inputRef.value?.focus()
})

// --- Methods ---

// Convert text to numbers
const romanToDec = () => {
  errormsg.value = ""
  result.value = ""

  // Find all strings that look like Roman numerals
  const matches = input.value.match(/[MDCLXVI]+/ig)

  if (!matches) {
    errormsg.value = t('romans.notroman')
    return
  }

  let finalResult = ""

  for (const romanStr of matches) {
    let decimalValue = 0
    const upperStr = romanStr.toUpperCase()

    for (let i = 0; i < upperStr.length; i++) {
      const char = upperStr[i]
      const currentIdx = ROMANS.indexOf(char)
      const prevIdx = i > 0 ? ROMANS.indexOf(upperStr[i - 1]) : -1

      // If a previous numeral is smaller than the current one (e.g., IV)
      // Subtract twice the previous value (because it was added once in the previous loop)
      if (prevIdx > currentIdx) {
        decimalValue += INTS[currentIdx] - 2 * INTS[prevIdx]
      } else {
        decimalValue += INTS[currentIdx]
      }
    }
    finalResult += decimalValue + " "
  }
  
  result.value = finalResult.trim()
}

// Convert numbers to text
const decToRoman = () => {
  result.value = ""
  errormsg.value = ""

  const matches = input.value.match(/[0-9]+/g)

  if (!matches) {
    errormsg.value = t('romans.invalidint')
    return
  }

  let finalResult = ""

  for (const numStr of matches) {
    let val = parseInt(numStr)

    // Standard Roman numerals only support 1-3999
    if (val > 3999 || val < 1) {
      errormsg.value = t('romans.invalidint')
      continue
    }

    let romanBuilder = ""

    // Iterate through units: 1000, 100, 10, 1 (indices 0, 2, 4, 6)
    for (let i = 0; i < INTS.length; i += 2) {
      let digitCount = Math.trunc(val / INTS[i])
      
      if (digitCount === 0) continue

      if (digitCount === 9) {
        // Special case for 9 (e.g., IX, CM)
        romanBuilder += ROMANS[i] + ROMANS[i - 2]
      } else if (digitCount === 4) {
        // Special case for 4 (e.g., IV, CD)
        romanBuilder += ROMANS[i] + ROMANS[i - 1]
      } else {
        // Standard addition (e.g., VII, LXXX)
        if (digitCount >= 5) {
          romanBuilder += ROMANS[i - 1]
          digitCount -= 5
        }
        for (let j = 0; j < digitCount; j++) {
          romanBuilder += ROMANS[i]
        }
      }
      val %= INTS[i]
    }
    finalResult += romanBuilder + " "
  }

  result.value = finalResult.trim()
}
</script>

<i18n locale="en">
{
  "romans": {
    "btndtr": "Decimal to Roman",
    "btnrtd": "Roman To Decimal",
    "notroman": "Invalid roman number, only MDCLXVI are allowed",
    "invalidint": "Invalid number, the maximum roman number is 3999"
  }
}
</i18n>

<i18n locale="nl">
{
  "romans": {
    "btndtr": "Decimaal naar Romeins",
    "btnrtd": "Romeins naar Decimaal",
    "notroman": "Ongeldig Romeins getal, alleen MDCLXVI zijn toegestaan",
    "invalidint": "Ongeldig getal, het maximale Romeinse getal is 3999"
  }
}
</i18n>