<template>
  <header class="page-header">
    <h1>{{ t('baseconv.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')" :initialOpen="startOpen">
        <div v-html="t('baseconv.long')" />
      </VCard>
      <VCard :title="t('labels.settings')">
        <div class="form-horizontal">
          <label>{{ t('baseconv.from') }}</label>
          <!-- Using .number modifier to ensure numeric values -->
          <input type="number" v-model.number="from" min="2" max="36">
          <input type="text" v-model="fromstr" :placeholder="t('baseconv.custsym')">
        </div>
        <div class="form-horizontal">
          <label>{{ t('baseconv.to') }}</label>
          <input type="number" v-model.number="to" min="2" max="36">
          <input type="text" v-model="tostr" :placeholder="t('baseconv.custsym')">
        </div>
      </VCard>
    </div>
    <div class="card-stack">
      <VCard :title="t('labels.input')">
        <textarea
          ref="inputRef"
          class="mb-2"
          v-model="input"
          :placeholder="t('labels.message')"
          rows="5"
        />
        <!-- Error message now comes from computed property -->
        <p v-show="errormsg" class="errormsg">
          {{ errormsg }}.
        </p>          
        <!-- Convert button removed: logic is now automatic -->
      </VCard>
      
      <VCard :title="t('labels.result')">     
        <div class="resultbox font-monospace" v-if="result">
          {{ result }}      
        </div>
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import VCard from '@/components/generic/VCard.vue'

defineOptions({
  name: 'BaseConv'
})

const { t } = useI18n()

// --- Constants ---
const DEF_STR = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

// --- State ---
const input = ref("")
const fromstr = ref("")
const tostr = ref("")
const from = ref(2)
const to = ref(10)
const inputRef = ref(null)
const startOpen = window.innerWidth > 768;

onMounted(() => {
  inputRef.value?.focus()
})

// --- Computed Logic ---

const conversion = computed(() => {
  const text = input.value.trim()
  const cleanFromStr = fromstr.value.trim()
  const cleanToStr = tostr.value.trim()

  // 1. Initial State / Validation
  if (!text) return { result: "", error: "" }

  if (
    (cleanFromStr !== "" && cleanFromStr.length !== from.value) ||
    (cleanToStr !== "" && cleanToStr.length !== to.value)
  ) {
    return { result: "", error: t("baseconv.symbolserr") }
  }

  // 2. Setup Mappings
  const mappingFrom = cleanFromStr.length > 0 ? cleanFromStr : DEF_STR
  const mappingTo = cleanToStr.length > 0 ? cleanToStr : DEF_STR

  let outputBuilder = ""
  let currentError = ""

  // 3. Process Input Chunks
  const nums = text.matchAll(/(\S+)/gi)

  for (const n of nums) {
    let standardBaseStr = ""
    const currentWord = n[0]

    // Step A: Map custom symbols to standard 0-9A-Z alphabet
    for (const char of currentWord) {
      const idx = mappingFrom.toUpperCase().indexOf(char.toUpperCase())
      if (idx === -1 || idx >= from.value) {
        standardBaseStr = null
        break
      }
      standardBaseStr += DEF_STR[idx]
    }

    if (standardBaseStr === null) {
      currentError = t("errors.unknowninput")
      outputBuilder += " ? "
      continue
    }

    // Step B: Convert standard string to Target Base
    const parsed = parseInt(standardBaseStr, from.value)
    if (isNaN(parsed)) {
      currentError = t("errors.unknowninput")
      outputBuilder += " ? "
      continue
    }
    const converted = parsed.toString(to.value)

    // Step C: Map standard characters back to target custom symbols
    let customBaseResult = ""
    for (const char of converted) {
      const idx = DEF_STR.indexOf(char.toUpperCase())
      if (idx !== -1 && mappingTo[idx]) {
        customBaseResult += mappingTo[idx]
      }
    }

    outputBuilder += customBaseResult + " "
  }

  return {
    result: outputBuilder.trim(),
    error: currentError
  }
})

// Helpers to expose specific parts of the computed object to the template
const result = computed(() => conversion.value.result)
const errormsg = computed(() => conversion.value.error)
</script>

<style scoped>
.resultbox {
  white-space: pre-wrap;
  overflow-wrap: break-word;
}
</style>

<i18n locale="en">
{
  "baseconv": {
    "from": "Radix from",
    "to": "Radix to",
    "custsym": "Custom symbols (optional)",
    "symbolserr": "Number of symbols should match radix or symbols should be empty."
  }
}
</i18n>

<i18n locale="nl">
{
  "baseconv": {
    "from": "Van",
    "to": "Naar",
    "custsym": "Aangepaste symbolen (optioneel)",
    "symbolserr": "Aantal symbolen moet overeenkomen met grondtal of leeg zijn."
  }
}
</i18n>