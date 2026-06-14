<template>
  <header class="page-header">
    <h1>{{ $t('charcodes.title') }}</h1>
  </header>
  
  <div class="card-grid mb-2">
    <VCard :title="$t('labels.intro')">
      <div v-html="$t('charcodes.long')" />
    </VCard>

    <VCard :title="$t('labels.settings')">
      <div class="form-horizontal">
      <label>{{ $t('charcodes.input') }}</label>
      <v-code
        id="codes-in"
        v-model:code="selectedcode"
      />
    </div>
    <div class="form-horizontal">
        <label>{{ $t('charcodes.output') }}</label>
        <v-code
          id="codes-out"
          v-model:code="selectedoutput"
        />
      </div>
    </VCard>
  </div>
  <div class="card-grid mb-2">
    <VCard :title="$t('labels.input')">
      <textarea
        id="message"
        ref="messageInput"
        v-model="message"
        :placeholder="$t('labels.message')"
        rows="5"
      />
      <p
        v-show="errormsg"
        class="errormsg mb-2 mt-2"
      >
        {{ errormsg }}
      </p>          
    </VCard>

    <VCard :title="$t('labels.result')"">
      <div
        v-if="result"
        class="card resultbox"
      >
        {{ result }}
      </div>
    </VCard>
  </div>
  <div class="card-grid">
    <VCard :title="$t('charcodes.someinfo')">
      <div class="card-body">
        <div v-html="$t('charcodes.someinfo2')" />
      </div>
    </VCard>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import VCode from '@/components/generic/VCode.vue'
import VCard from '@/components/generic/VCard.vue'
import * as baudotcode from '@/scripts/baudotcode.js'
import * as codepages from '@/scripts/codepages.js'
import { codePoints, fromCodePoint } from 'utf16-char-codes'

defineOptions({
  name: 'CharCodes'
})

const { t } = useI18n()

// Reactive State
const message = ref("")
const selectedcode = ref("Decimal")
const selectedoutput = ref("UTF16")
const messageInput = ref(null)

onMounted(() => {
  messageInput.value?.focus()
})

// --- Internal Logic Helpers ---

const getMany = (s) => {
  return [
    "Baudotcode", "BaudotcodeR", "Murraycode", "MurraycodeR",
    "MurrayMTK2", "MurrayMTK2R", "Binary", "Octal", "Decimal", "Hexadecimal"
  ].includes(s)
}

const inputToDecimal = (w) => {
  switch (selectedcode.value) {
    case "Baudotcode": return baudotcode.baudotCodeToASCII(w)
    case "BaudotcodeR": return baudotcode.baudotReversedCodeToASCII(w)
    case "Murraycode": return baudotcode.murrayCodeToASCII(w)
    case "MurraycodeR": return baudotcode.murrayReversedCodeToASCII(w)
    case "MurrayMTK2": return baudotcode.murrayMTK2ToASCII(w)
    case "MurrayMTK2R": return baudotcode.murrayMTK2ReversedCodeToASCII(w)
    case "UTF16": return codePoints(w)[0]
    case "Binary": return parseInt(w, 2)
    case "Octal": return parseInt(w, 8)
    case "Decimal": return parseInt(w)
    case "Hexadecimal": return parseInt(w, 16)
    default: {
      const cp = codepages.findCodepage(selectedcode.value)
      if (cp >= 0) return codepages.charToCode(w, cp)
      throw new Error('generic')
    }
  }
}

const decimalToOutput = (w) => {
  if (w === -1) return ""
  switch (selectedoutput.value) {
    case "Baudotcode": return baudotcode.baudotASCIIToCode(w)
    case "BaudotcodeR": return baudotcode.baudotReversedASCIIToCode(w)
    case "Murraycode": return baudotcode.murrayASCIIToCode(w)
    case "MurraycodeR": return baudotcode.murrayReversedASCIIToCode(w)
    case "MurrayMTK2": return baudotcode.murrayMTK2ASCIIToCode(w)
    case "MurrayMTK2R": return baudotcode.murrayMTK2ReversedASCIIToCode(w)
    case "UTF16": return [fromCodePoint(w)]
    case "Binary": return [w.toString(2)]
    case "Octal": return [w.toString(8)]
    case "Decimal": return [w.toString(10)]
    case "Hexadecimal": return [w.toString(16)]
    default: {
      const cp = codepages.findCodepage(selectedoutput.value)
      if (cp >= 0) return [codepages.codeToChar(parseInt(w), cp)]
      throw new Error('generic')
    }
  }
}

// --- Computed Properties ---

/**
 * We calculate both result and error in one computed object 
 * to ensure they are always in sync and the loop only runs once.
 */
const translationData = computed(() => {
  const inputString = message.value.trim()
  
  // Reset internal library state
  baudotcode.reset()

  try {
    let words
    if (!getMany(selectedcode.value)) {
      words = inputString.match(/./gu) || []
    } else {
      words = inputString.split(/[,.\s]+/g)
    }

    let outputBuilder = ""
    for (const word of words) {
      if (!word) continue
      const decimalValue = inputToDecimal(word)
      const convertedParts = decimalToOutput(decimalValue)
      convertedParts.forEach(part => {
        outputBuilder += part + " "
      })
    }

    return { 
      result: outputBuilder.trim(), 
      error: "" 
    }
  } catch (e) {
    console.error(e)
    return { 
      result: "", 
      error: e.message === 'generic' ? t('errors.generic') : t('errors.invalidinput')
    }
  }
})

// Flattened for use in the template
const result = computed(() => translationData.value.result)
const errormsg = computed(() => translationData.value.error)

</script>

