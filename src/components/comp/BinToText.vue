<template>

  <header class="page-header">
    <h1>{{ $t('bintotext.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="$t('labels.intro')">
        <div v-html="$t('bintotext.long')" />
      </VCard>
      <VCard :title="$t('labels.settings')">
        <CustomDropdown
          :title="$t('bintotext.selfrom')"
          :options="encodings"
          v-model="selfromenc"
          @change="selFromEncoding"
        />
        <CustomDropdown
          v-if="fromtables && fromtables.length > 0"
          :title="$t('bintotext.selfromtable')"
          :options="fromtables"
          v-model="selfromtable"
        />
        <h6>
          Codestring: {{ selfromtable }}
        </h6>
        <CustomDropdown
          :title="$t('bintotext.selfrom')"
          :options="encodings"
          v-model="seltoenc"
          @change="selToEncoding"
        />
        <CustomDropdown
          v-if="totables && totables.length > 0"
          :title="$t('bintotext.seltotable')"
          :options="totables"
          v-model="seltotable"
        />
        <h6>
          Codestring: {{ seltotable }}
        </h6>
      </VCard>
    </div>
    <div class="card-stack">
      <VCard :title="$t('labels.input')">
        <textarea
          ref="messageRef"
          v-model="message"
          :placeholder="$t('labels.message')"
          rows="5"
          @input="doSomething"
        />
        <p
          v-show="errormsg"
          class="errormsg mt-2"
        >
          {{ errormsg }}
        </p>
      </VCard>
      <VCard :title="$t('labels.result')">
        <div
          v-if="result"
          class="card resultbox"
        >
          {{ result }}
        </div>
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import * as bt from '@/scripts/bintotext.js'
import CustomDropdown from '@/components/generic/CustomDropdown.vue'
import VCard from '@/components/generic/VCard.vue'

defineOptions({
  name: 'BinToText'
})

const { t } = useI18n()

// --- State ---
const message = ref("")
const selfromenc = ref("txt")
const fromtables = ref([])
const selfromtable = ref("")

const seltoenc = ref("b64")
const totables = ref([])
const seltotable = ref("")

const messageRef = ref(null)

const encodings = [
  { label: 'Text (ASCII UTF8)', value: 'txt' },
  { label: 'Binary number', value: 'bin' },
  { label: 'Hexadecimal number (a.k.a. Base16)', value: 'hex' },
  { label: 'Decimal number', value: 'dec' },
  { label: 'Base32 (e.g. RFC4648)', value: 'b32' },
  { label: 'Base58 (e.g. Bitcoin)', value: 'b58' },
  { label: 'Base64 (Base64 and uuencode)', value: 'b64' },
  { label: 'Ascii85 (a.k.a. Base85)', value: 'b85' },
  { label: 'Base91', value: 'b91' }
]

// --- Table Management Methods ---
// These remain as methods because they perform "side-effects" (resetting other refs)

const selFromEncoding = () => {
  fromtables.value = null
  switch (selfromenc.value) {
    case "b58": fromtables.value = bt.base58encodings; break
    case "b32": fromtables.value = bt.base32encodings; break
    case "b64": fromtables.value = bt.base64encodings; break
    case "b85": fromtables.value = bt.ascii85encodings; break
    case "b91": fromtables.value = bt.base91encodings; break
  }
  if (fromtables.value && fromtables.value.length > 0) {
    selfromtable.value = fromtables.value[0].value
  } else {
    selfromtable.value = ""
  }
}

const selToEncoding = () => {
  totables.value = null
  switch (seltoenc.value) {
    case "b58": totables.value = bt.base58encodings; break
    case "b32": totables.value = bt.base32encodings; break
    case "b64": totables.value = bt.base64encodings; break
    case "b85": totables.value = bt.ascii85encodings; break
    case "b91": totables.value = bt.base91encodings; break
  }
  if (totables.value && totables.value.length > 0) {
    seltotable.value = totables.value[0].value
  } else {
    seltotable.value = ""
  }
}

// --- Computed Conversion ---

/**
 * We wrap both result and error in one computed object.
 * This prevents the heavy conversion logic from running twice per change.
 */
const conversion = computed(() => {
  const input = message.value
  if (!input) return { result: "", error: "" }

  try {
    let buffer = []

    // 1. Convert source to intermediate buffer
    switch (selfromenc.value) {
      case "bin": buffer = bt.binaryToBuffer(input); break
      case "hex": buffer = bt.hexToBuffer(input); break
      case "dec": buffer = bt.decimalToBuffer(input); break
      case "txt": buffer = bt.textToBuffer(input); break
      case "b32": buffer = bt.base32ToBuffer(input, selfromtable.value); break
      case "b58": buffer = bt.base58ToBuffer(input, selfromtable.value); break
      case "b64": buffer = bt.base64ToBuffer(input, selfromtable.value); break
      case "b85": buffer = bt.ascii85ToBuffer(input, selfromtable.value); break
      case "b91": buffer = bt.base91ToBuffer(input, selfromtable.value); break
    }

    let out = ""
    // 2. Convert buffer to target encoding
    switch (seltoenc.value) {
      case "bin": out = bt.bufferToBinary(buffer); break
      case "hex": out = bt.bufferToHex(buffer); break
      case "dec": out = bt.bufferToDecimal(buffer); break
      case "txt": out = bt.bufferToText(buffer); break
      case "b32": out = bt.bufferToBase32(buffer, seltotable.value); break
      case "b58": out = bt.bufferToBase58(buffer, seltotable.value); break
      case "b64": out = bt.bufferToBase64(buffer, seltotable.value); break
      case "b85": out = bt.bufferToAscii85(buffer, seltotable.value); break
      case "b91": out = bt.bufferToBase91(buffer, seltotable.value); break
    }

    return { result: out, error: "" }
  } catch (e) {
    console.error(e)
    return { result: "", error: t('errors.invalidinput') }
  }
})

// Flatten the computed object for use in the template
const result = computed(() => conversion.value.result)
const errormsg = computed(() => conversion.value.error)

// --- Lifecycle & Watchers ---

// We need to trigger the table updates when the main encoding selection changes
watch(selfromenc, selFromEncoding)
watch(seltoenc, selToEncoding)

onMounted(() => {
  selFromEncoding()
  selToEncoding()
  messageRef.value?.focus()
})
</script>

<style scoped>

.resultbox {
  white-space: pre-wrap;
  word-break: break-all;
}

h6 {
  font-size: 1em;
  color: var(--accent-green);
  font-weight: normal;
  margin-top: 0.5em;
  margin-left: 0.5em;
}
</style>
