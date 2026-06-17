<template>

   <header class="page-header">
    <h1>{{ t('numberprop.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')">
        <div v-html="t('numberprop.long')" />
      </VCard>
      <VCard :title="t('labels.input')">
        <div class="form-horizontal">
          <label>{{ t('numberprop.num') }}</label>
          <input type="number" v-model="n" ref="nInput" @keyup.enter="getProperties">
        </div>
        <p
          v-show="errormsg"
          class="errormsg mt-2"
        >
          {{ errormsg }}
        </p>
        <div class="button-row mt-2">
          <v-calculate :disabled='working' @calculate = "getProperties"></v-calculate>
        </div>
      </VCard>
    </div>
    <div class="card-stack">
      <VCard :title="t('numberprop.t1')">     
        <table>
          <tr v-for="p in props" :key="p.ref">
            <td v-if="!p.group">
              <div v-show="p.value">
                &#x2713;
              </div><div v-show="!p.value">
                &#x2717;
              </div>
            </td>
            <td v-if="!p.group">{{ t('numberprop.' + p.ref) }}</td>
            <td v-if="p.group" colspan="2"><h4>{{ t('numberprop.' + p.ref) }}</h4></td>
          </tr>          
        </table>
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import VCalculate from '@/components/generic/VCalculate.vue'
import VCard from '@/components/generic/VCard.vue'
import * as mathtools from '../../scripts/mathtools'

defineOptions({
  name: 'MathProperties'
})

const { t } = useI18n()

// --- State ---
const n = ref(0)
const result = ref(0) // Declared in original, though logic uses p.value
const props = ref([])
const errormsg = ref("")
const working = ref(false);

// --- Template Ref ---
const nInput = ref(null)

onMounted(() => {
  // Focus the input field
  nInput.value?.focus()
  
  // Initialize the properties list from mathtools
  // We make a shallow copy to avoid mutating the original script data directly
  props.value = mathtools.numprops.map(p => ({ ...p, value: "" }))
})

// --- Methods ---

const getProperties = () => {
  // Reset
  errormsg.value = ""
  working.value = true
  
  // Validation: check if n is too big
  if (n.value >= 1000000000) {
    errormsg.value = t('numberprop.toobig')
    return
  }

  // Set a tiny timeout to allow the UI to show the 'working' state if needed
  // and process calculations
  setTimeout(() => {try {
    for (let p of props.value) {
      // If it's not a group header, run the associated math function
      if (!p.group && typeof p.func === 'function') {
        p.value = p.func(n.value)
      }
    }
    } catch (e) {
      console.error(e)
      errormsg.value = t('errors.generic')
    } finally {
      working.value = false
    } 
  }, 0)
}
</script>

<style scoped>
h4 {
  overflow-wrap: break-word;
  margin: 0.5em 0 0.25em;
}
</style>

