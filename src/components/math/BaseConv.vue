<template>

  <header class="page-header">
    <h1>{{ $t('baseconv.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="$t('labels.intro')">
        <div v-html="$t('baseconv.long')" />
      </VCard>
      <VCard :title="$t('labels.settings')">
        <div class="form-horizontal">
          <label>{{ $t('baseconv.from') }}</label>
          <input type="number" v-model="from" min="2" max="36">
          <input type="text" v-model="fromstr">
        </div>
        <div class="form-horizontal">
          <label>{{ $t('baseconv.to') }}</label>
          <input type="number" v-model="to" min="2" max="36">
          <input type="text" v-model="tostr">
        </div>
      </VCard>
    </div>
    <div class="card-stack">
      <VCard :title="$t('labels.input')">
        <textarea
          ref="inputRef"
          v-model="input"
          :placeholder="$t('labels.message')"
          rows="5"
        />
        <p
          v-show="errormsg"
          class="errormsg mt-2"
        >
          {{ errormsg }}.
        </p>          
        <div class="button-row mt-2">
          <button id="convert" class="btn btn-primary"  @click="toConvert">
            {{ $t('buttons.convert') }}
          </button>
        </div>
      </VCard>
      <VCard :title="$t('labels.result')">     
        <div class="card resultbox" v-if="result">
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
  name: 'BaseConv'
})

const { t } = useI18n()

// --- Constants ---
const DEF_STR = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

// --- State ---
const input = ref("")
const result = ref("")
const errormsg = ref("")
const fromstr = ref("")
const tostr = ref("")
const from = ref(2)
const to = ref(10)

// --- Template Refs ---
const inputRef = ref(null)

onMounted(() => {
  inputRef.value?.focus()
})

// --- Methods ---

const toConvert = () => {
  // Reset
  result.value = ""
  errormsg.value = ""
  
  const cleanFromStr = fromstr.value.trim()
  const cleanToStr = tostr.value.trim()

  // Validation: Check if custom symbol strings match the selected base lengths
  if (
    (cleanFromStr !== "" && cleanFromStr.length !== from.value) ||
    (cleanToStr !== "" && cleanToStr.length !== to.value)
  ) {
    errormsg.value = t("baseconv.symbolserr")
    return
  }

  if (!input.value) {
    errormsg.value = t("errors.noinput")
    return
  }

  // Parse numbers from input (find chunks of non-whitespace)
  const nums = input.value.matchAll(/(\S+)/gi)
  const mappingFrom = cleanFromStr.length > 0 ? cleanFromStr : DEF_STR
  const mappingTo = cleanToStr.length > 0 ? cleanToStr : DEF_STR

  let outputBuilder = ""

  // Process all extracted number strings
  for (const n of nums) {
    let standardBaseStr = ""
    const currentWord = n[0]

    // 1. Convert input word from custom symbols to standard 0-9A-Z alphabet
    for (const char of currentWord) {
      const idx = mappingFrom.toUpperCase().indexOf(char.toUpperCase())
      if (idx === -1) {
        standardBaseStr = null
        break
      }
      standardBaseStr += DEF_STR[idx]
    }

    if (standardBaseStr === null) {
      errormsg.value = t("errors.unknowninput")
      outputBuilder += " error "
      continue
    }

    // 2. Perform the actual base conversion
    // Parse from 'from' base to decimal, then to 'to' base string
    const converted = parseInt(standardBaseStr, from.value).toString(to.value)

    if (isNaN(parseInt(standardBaseStr, from.value))) {
      errormsg.value = t("errors.unknowninput")
      outputBuilder += " error "
      continue
    }

    // 3. Convert result string from standard alphabet back to custom symbols
    let customBaseResult = ""
    for (const char of converted) {
      const idx = DEF_STR.indexOf(char.toUpperCase())
      if (idx !== -1 && mappingTo[idx]) {
        customBaseResult += mappingTo[idx]
      }
    }

    if (!customBaseResult) {
      errormsg.value = t("errors.unknowninput")
    } else {
      outputBuilder += customBaseResult + " "
    }
  } 

  result.value = outputBuilder.trim()
}
</script>
