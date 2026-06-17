<template>

  <header class="page-header">
    <h1>{{ t('textchunks.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <VCard :title="t('labels.intro')">
      <div v-html="t('textchunks.long')" />
    </VCard>
    <VCard :title="t('labels.settings')">
      <div class="form-horizontal">
        <label>{{t('textchunks.dir')}}</label>
        <div class="radio-options">
          <label class="radio-item">
            <input type="radio" value="H" v-model="dir">
            <span class="radio-mark"></span> {{ t('dialogpb.d.hor')}}
          </label>
          <label class="radio-item">
            <input type="radio" value="V" v-model="dir">
            <span class="radio-mark"></span> {{ t('dialogpb.d.ver')}}
          </label>
        </div>
      </div>
      <div class="form-horizontal">
        <label>{{t('textchunks.size')}}</label>
        <input type="number" min="0" v-model="size">
      </div>
      <label class="checkbox-container mb-2">
        <input type="checkbox" v-model="ignore">
        <span class="checkmark"></span>
        {{ t('textchunks.ignore') }}
      </label>
      <label class="checkbox-container">
        <input type="checkbox" v-model="upper">
        <span class="checkmark"></span>
        {{ t('textchunks.upper') }}
      </label>
    </VCard>
  </div>
  <div class="card-grid mb-2">
    <VCard :title="t('labels.input')">
      <textarea
        ref="txtInput"
        v-model="txt"
        :placeholder="t('labels.message')"
        rows="5"
        @input="wordValue"
      />
      <p
        v-show="errormsg"
        class="errormsg mb-2"
      >
        {{ errormsg }}.
      </p>          
    </VCard>
    <VCard :title="t('labels.result')">
      <div v-if="result" style="font-family: Courier" class="card resultbox" v-html="result" />     
    </VCard>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import VCard from '@/components/generic/VCard.vue'

defineOptions({
  name: "ComponentName"
})

const { t } = useI18n()

// --- State ---
const result = ref("")
const errormsg = ref("")
const txt = ref("")
const size = ref(5)
const dir = ref("H")
const ignore = ref(false)
const upper = ref(false)

// --- Template Ref ---
const txtInput = ref(null)

onMounted(() => {
  // Focus the input on mount
  txtInput.value?.focus()
})

watch([txt, size, dir, ignore, upper], () => {
  chunk()
})

// --- Methods ---

const chunk = () => {
  // Reset
  result.value = ""
  errormsg.value = ""

  // Check input
  if (!txt.value) {
    errormsg.value = t('errors.noinput')
    return
  }

  // Process text based on settings
  let cleantxt = txt.value
  if (ignore.value) {
    cleantxt = cleantxt.replace(/\s/g, "")
  }
  if (upper.value) {
    cleantxt = cleantxt.toUpperCase()
  }

  let outputBuilder = ""

  // Chunk txt
  let h = cleantxt
  
  if (dir.value === "H") {
    // Horizontal direction
    while (h.length > 0) {
      outputBuilder += h.slice(0, size.value) + "<BR>"
      h = h.slice(size.value)
    }
  } else {
    // Vertical direction
    let a = new Array(size.value).fill("")
    for (let j = 0; j < h.length; j++) {
      a[j % size.value] += h[j]
    }
    for (let j = 0; j < size.value; j++) {
      outputBuilder += a[j] + "<BR>"
    }
  }

  result.value = outputBuilder
}
</script>
