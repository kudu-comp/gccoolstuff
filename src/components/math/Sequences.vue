<template>

  <header class="page-header">
    <h1>{{ t('sequences.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')">
        <div v-html="t('sequences.long')" />
      </VCard>
      <VCard :title="t('labels.input')">
        <h4>{{ t('sequences.sel') }}</h4>
        <div class="radio-group mb-2">
          <div class="radio-options-vertical">
            <label class="radio-item" v-for="s in seqs" :key="s.ref">
              <input type="radio" :value="s.ref" v-model="number">
              <span class="radio-mark"></span> {{ t('sequences.'+s.ref) }}
            </label>
          </div>
        </div>  
        <div class="radio-group mb-2">
          <h4>{{ t('sequences.stop') }}</h4>
          <div class="radio-options-vertical">
            <label class="radio-item">
              <input type="radio" value="stopiter" v-model="stop">
              <span class="radio-mark"></span> {{ t('sequences.stopiter') }}
            </label>
            <label class="radio-item">
              <input type="radio" value="stopat" v-model="stop" >
              <span class="radio-mark"></span> {{ t('sequences.stopat') }}
            </label>
            <label class="radio-item">
              <input type="radio" value="stopend" v-model="stop" :disabled="['hailstone','kaprekar','palindrome'].indexOf(number) < 0">
              <span class="radio-mark"></span> {{ t('sequences.stopend') }}
            </label>
          </div>
        </div>
        <div 
          class="form-horizontal"
          v-show="['hailstone', 'conway', 'revconway','kaprekar', 'palindrome'].indexOf(number) >= 0"
        >
          <label>{{ t('sequences.start') }}</label>
          <input type="number" v-model="start" min="0" max="1000000">
        </div>
        <div class="form-horizontal" v-show="stop === 'stopiter'">
          <label>{{ t('sequences.niter') }}</label>
          <input type="number" ref="niterInput" v-model="niter" min="0" max="1000000">
        </div>
        <div class="form-horizontal" v-show="stop === 'stopat'">
          <label>{{ t('sequences.endat') }}</label>
          <input type="number" v-model="endat" min="0" max="1000000">
        </div>
        <p
          v-show="errormsg"
          class="errormsg mb-2"
        >
          {{ errormsg }}.
        </p>
        <div class="button-row mt-2">
          <v-calculate @calculate="sequence"/>
        </div>
      </VCard>
    </div>
    <div class="card-stack">
      <VCard :title="t('labels.result')">     
        <div
          v-if="result"
          class="card resultbox monospace"
        >
          <p>{{ t('sequences.res1') }} {{ count }}: {{ result }}.</p>
          <p>{{ t('sequences.res2') }}: </p>
          <div v-html="seq"></div>
        </div>
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import * as mathtools from '@/scripts/mathtools.js'
import VCalculate from '@/components/generic/VCalculate.vue'
import VCard from '@/components/generic/VCard.vue'

defineOptions({
  name: 'Sequences'
})

const route = useRoute()
const { t } = useI18n()

// --- State ---
const number = ref('hailstone')
const niter = ref(1)
const start = ref(1)
const result = ref("")
const count = ref(0)
const seq = ref("")
const errormsg = ref("")
const stop = ref("stopiter")
const endat = ref(0)
const seqs = ref([])

// --- Template Ref ---
const niterInput = ref(null)

onMounted(() => {
  // Focus logic
  niterInput.value?.focus()
  
  // Load sequence metadata
  seqs.value = mathtools.sequences

  // Handle route params
  if (route.params.seq) {
    number.value = route.params.seq
  }
})

// --- Methods ---

const sequence = () => {
  let calculatedSeq = null
  errormsg.value = ""
  result.value = ""

  // Adjust input parameters based on stop mode
  if (stop.value === "stopat") niter.value = 0
  if (stop.value === "stopiter") endat.value = 0
  if (stop.value === "stopend") {
    niter.value = 0
    endat.value = 0
  }

  try {
    switch (number.value) {
      case 'hailstone':
        calculatedSeq = mathtools.hailstone(start.value, niter.value, endat.value, stop.value === "stopend")
        break
      case "golomb":
        calculatedSeq = mathtools.golomb(niter.value, endat.value)
        break
      case "abundant":
        calculatedSeq = mathtools.abundant(niter.value, endat.value)
        break
      case "deficient":
        calculatedSeq = mathtools.deficient(niter.value, endat.value)
        break
      case "conway":
        if (niter.value > 50) {
          errormsg.value = t('sequences.maxconway')
          return
        }
        calculatedSeq = mathtools.conway(start.value, niter.value, endat.value)
        break
      case "revconway":
        if (niter.value > 50) {
          errormsg.value = t('sequences.maxconway')
          return
        }
        calculatedSeq = mathtools.revconway(start.value, niter.value, endat.value)
        break
      case "niven":
        calculatedSeq = mathtools.niven(niter.value, endat.value)
        break
      case "kaprekar":
        calculatedSeq = mathtools.kaprekar(start.value, niter.value, endat.value, stop.value === "stopend")
        break
      case "palindrome":
        calculatedSeq = mathtools.palindrome(start.value, niter.value, endat.value, stop.value === "stopend")
        break
    }

    if (calculatedSeq) {
      count.value = calculatedSeq.cnt
      result.value = calculatedSeq.n
      seq.value = calculatedSeq.seq
    }

  } catch (error) {
    console.error('Sequence Calculation Error: ', error)
    errormsg.value = t('errors.generic')
  }
}
</script>

<style scoped>

.monospace {
  font-family: "Lucida Console", Courier, monospace;
  overflow-wrap: break-word;
}

h4 {
  margin-bottom: 0.5em;
  margin-top: 0.2em;
  font-size: 1.1em;
  color: var(--accent-green)
}

</style>
