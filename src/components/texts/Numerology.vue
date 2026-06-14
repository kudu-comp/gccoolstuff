<template>

  <header class="page-header">
    <h1>{{ $t('numerology.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <VCard :title="$t('labels.intro')">
      <div v-html="$t('numerology.long')" />
    </VCard>
    <VCard :title="$t('labels.settings')">
      <div class="radio-group">
        <label>{{$t('numerology.selmethod')}}</label>
        <div class="radio-options-vertical">
          <label class="radio-item">
            <input type="radio" value="0" v-model="selmode">
            <span class="radio-mark"></span> Agrippan (based on Classic latin alphabet)
          </label>
          <label class="radio-item">
            <input type="radio" value="1" v-model="selmode">
            <span class="radio-mark"></span> Pythagorean
          </label>
          <label class="radio-item">
            <input type="radio" value="2" v-model="selmode">
            <span class="radio-mark"></span> Chaldean
          </label>
          <label class="radio-item">
            <input type="radio" value="3" v-model="selmode">
            <span class="radio-mark"></span> Gematria (Latin input)
          </label>
          <label class="radio-item">
            <input type="radio" value="4" v-model="selmode">
            <span class="radio-mark"></span> GGematria (Hebrew input)
          </label>
          <label class="radio-item">
            <input type="radio" value="5" v-model="selmode">
            <span class="radio-mark"></span> Isopsephy (Latin input)
          </label>
          <label class="radio-item">
            <input type="radio" value="6" v-model="selmode">
            <span class="radio-mark"></span> Isopsephy (Greek input)
          </label>
          <label class="radio-item">
            <input type="radio" value="7" v-model="selmode">
            <span class="radio-mark"></span> English Qabbala
          </label>
        </div>
      </div>
    </VCard>
  </div>
  <div class="card-grid mb-2">
    <VCard :title="$t('labels.input')">
      <textarea
        ref="messageInput"
        v-model="txt"
        :placeholder="$t('labels.message')"
        rows="5"
      />
      <p
        v-show="errormsg"
        class="errormsg mb-2"
      >
        {{ errormsg }}.
      </p>          
    </VCard>
    <VCard :title="$t('labels.result')">
      <div
        v-if="result"
        class="card resultbox"
      >
        {{ result }}<br>
        {{ result2 }}
      </div>
    </VCard>
  </div>
  <div class="card-grid">
    <VCard :title="$t('numerology.valtab')">
      <table class="p-table">
          <tr>
            <td class="sm-size"
              v-for="a in alphabet"
            >
              {{ a }}
            </td>
          </tr>
          <tr>
            <td
              v-for="s in SYSTEM_VALUES[selmode]"
            >
              {{ s }}
            </td>
          </tr>
        </table>
    </VCard>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import VCard from '@/components/generic/VCard.vue'

defineOptions({
  name: "Numerology"
})

const route = useRoute()
const { t } = useI18n()

// --- Constants ---
const SYSTEM_VALUES = [
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 600, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 700, 900, 300, 400, 500], // Agrippan
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8], // Pythagorean
  [1, 2, 3, 4, 5, 8, 3, 5, 1, 1, 2, 3, 4, 5, 7, 8, 1, 2, 3, 4, 6, 6, 6, 5, 1, 7], // Chaldean
  [1, 2, 3, 4, 5, 6, 3, 8, 10, 10, 20, 30, 40, 50, 70, 80, 100, 200, 300, 400, 6, 6, 6, 400, 6, 7], // Gematria
  [900, 800, 700, 600, 500, 400, 300, 200, 100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], // Gematria Hebrew
  [1, 2, 3, 4, 5, 6, 3, 8, 10, 10, 20, 30, 40, 50, 70, 80, 90, 100, 200, 300, 400, 400, 6, 600, 400, 7], // Isopsephy
  [1, 2, 3, 4, 5, 6, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400, 500, 600, 700, 800, 900], // Isopsephy Greek
  [1, 20, 13, 6, 25, 18, 11, 4, 23, 16, 9, 2, 21, 14, 7, 26, 19, 12, 5, 24, 17, 10, 3, 22, 15, 8] // English Qabbala
]

// --- Reactive State ---
const txt = ref("")
const result = ref("")
const result2 = ref("")
const selmode = ref("0")
const errormsg = ref("")
const alphabet = ref("ABCDEFGHIJKLMNOPQRSTUVWXYZ")

// --- Template Ref ---
const messageInput = ref(null)

watch([txt, selmode], () => {
  calculateValue()
})


onMounted(() => {
  // Focus the input
  messageInput.value?.focus()

  // Handle route params
  const numParam = route.params.num
  if (numParam !== undefined) {
    const num = String(numParam)
    if (num >= "0" && num <= "7") {
      selmode.value = num
    }
  }
})

// --- Methods ---
const calculateValue = () => {
  result.value = ""
  result2.value = ""
  errormsg.value = ""
  
  let sum = 0
  let calculationStr = ""
  let currentAlphabet = ""

  // Determine alphabet based on mode
  switch (selmode.value) {
    case "4":
      currentAlphabet = "ץףןםךתשרקצפעסנמלכיטחזוהדגבא"
      break
    case "6":
      currentAlphabet = "ΑΒΓΔΕϜϚΖΗΘΙΚΛΜΝΞΟΠϘΡΣΤΥΦΧΨΩϠ"
      break
    default:
      currentAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  }
  
  alphabet.value = currentAlphabet

  // Calculate
  const inputChars = txt.value.trim()
  for (let c of inputChars) {
    const charIndex = currentAlphabet.indexOf(c.toUpperCase())
    
    if (charIndex >= 0) {
      const val = SYSTEM_VALUES[selmode.value][charIndex]
      sum += val
      calculationStr += val.toString() + " + "
    } else {
      if (c !== " ") errormsg.value = t('numerology.err1')
    }
  }

  // Set results
  if (inputChars.length > 0) {
    result.value = t('numerology.res1') + sum.toString()
    result2.value = t('numerology.res2') + calculationStr.slice(0, -2) + " = " + sum.toString()
  }
}
</script>

