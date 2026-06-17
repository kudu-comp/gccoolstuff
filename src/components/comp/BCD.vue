<template>

  <header class="page-header">
    <h1>{{ t('bcd.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')">
        <div v-html="t('bcd.long')" />
      </VCard>
      <VCard :title="t('labels.settings')">
        <CustomDropdown
          :options="bcdformats"
          v-model="selBCD"
          :title="t('bcd.seltype')"
        />
        <CustomDropdown v-if="!packed"
          :options="[
            { label: 'No fill', value: '' },
            { label: '0000', value: '0000' },
            { label: '1111', value: '1111' }
          ]"
          v-model="fill"
          :title="t('bcd.fill')"
        />
        <label class="checkbox-container mt-2 mb-2">
          <input type="checkbox" v-model="packed">
          <span class="checkmark"></span>
          {{ t('bcd.packed') }}
        </label> 
      </VCard>
    </div>
    <div class="card-stack">
      <VCard :title="t('labels.input')">
        <div class="radio-group mb-2">
          <div class="radio-options">
            <label class="radio-item">
              <input type="radio" value="from" v-model="mode">
              <span class="radio-mark"></span> {{ t('bcd.bcdfrom') }}
            </label>
            <label class="radio-item">
              <input type="radio" value="to" v-model="mode">
              <span class="radio-mark"></span> {{ t('bcd.bcdto') }}
            </label>
          </div>
        </div>        
        <textarea
          ref="messageInput"
          class="mb-2"
          v-model="message"
          :placeholder="t('labels.message')"
          rows="5"
          @input="doSomething"
        />
        <p
          v-show="errormsg"
          class="errormsg"
        >
          {{ errormsg }}.
        </p>
      </VCard>
      <VCard :title="t('labels.result')">
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
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import * as bcd from '@/scripts/bcd.js'
import VCard from '@/components/generic/VCard.vue'
import CustomDropdown from '@/components/generic/CustomDropdown.vue'

defineOptions({
  name: 'CompBCD'
})

const { t } = useI18n()

// --- State ---
const message = ref("")
const selBCD = ref(0)
const packed = ref(false)
const fill = ref("")
const mode = ref("to") // 'to' for code->BCD, 'from' for BCD->code
const bcdformats = ref([])
const showinfo = ref(true)

// --- Template Ref ---
const messageRef = ref(null)

// --- Lifecycle ---
onMounted(() => {
  if (messageRef.value) {
    messageRef.value.focus()
  }

  // Map the BCD formats with localized labels
  // Using .vars as per your snippet
  bcdformats.value = bcd.formats.vars.map((e, idx) => ({
    label: t(e.name),
    value: idx
  }))
})

// --- Computed Conversion Logic ---

/**
 * translationData handles the logic for both the result and the error message.
 * It updates automatically whenever message, selBCD, packed, fill, or mode changes.
 */
const translationData = computed(() => {
  const input = message.value.trim()
  
  if (!input) {
    return { result: "", error: "" }
  }

  try {
    let output = ""
    if (mode.value === "from") {
      output = bcd.BCD2Code(input, selBCD.value, packed.value, fill.value)
    } else {
      output = bcd.code2BCD(input, selBCD.value, packed.value, fill.value)
    }
    
    return { result: output, error: "" }
  } catch (e) {
    console.error(e)
    return { result: "", error: t('errors.invalidinput') }
  }
})

// Helper computed properties for cleaner template usage
const result = computed(() => translationData.value.result)
const errormsg = computed(() => translationData.value.error)

</script>




<style scoped>
</style>
