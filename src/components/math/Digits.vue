<template>

   <header class="page-header">
    <h1>{{ $t('digits.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="$t('labels.intro')">
        <div v-html="$t('digits.long')" />
      </VCard>
      <VCard :title="$t('labels.settings')">
        <div class="radio-group">
          <label>{{ $t('digits.sel') }}</label>
          <div class="radio-options-vertical">
            <label class="radio-item" v-for="dec in decOptions" :key="dec.id">
              <input type="radio" :value="dec.id" v-model="number">
              <span class="radio-mark"></span> {{ dec.label }}
            </label>
          </div>
        </div>
      </VCard>
    </div>
    <div class="card-stack">
      <VCard :title="$t('labels.input')">
        <div class="form-horizontal">
          <label>{{ $t('digits.from') }}</label>
          <input type="number" v-model="start" ref="startInput" min="0" max="1000000">
        </div>
        <div class="form-horizontal">
          <label>{{ $t('digits.to') }}</label>
          <input type="number" v-model="end" min="0" max="1000000">
        </div>
        <p
          v-show="errormsg"
          class="errormsg mt-2"
        >
          {{ errormsg }}.
        </p>          
        <div class="button-row mt-2">
          <VCalculate @calculate="getDigits" />
        </div>
      </VCard>
      <VCard :title="$t('labels.result')">     
        <div
          v-if="result"
          class="card resultbox"
        >
          {{ $t('digits.res1') }} {{ start }} {{ $t('digits.res2') }} {{ end }} {{ $t('digits.res3') }} {{ result }}.
        </div>
      </VCard>
    </div>
  </div>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import VCard from '@/components/generic/VCard.vue' 
import VCalculate from '@/components/generic/VCalculate.vue' 

defineOptions({
  name: 'MathDigits'
})

const { t } = useI18n()

// --- State ---
const number = ref("pi")
const start = ref(1)
const end = ref(1)
const errormsg = ref("")
const result = ref("")
// Note: 'n' was used in your original fetch payload but not defined in data. 
// I've added a ref for it here to prevent errors.
const n = ref(0) 

const phpurl = `${window.location.protocol}//${window.location.hostname}/math/getdigits.php`

// Options for the dropdown
const decOptions = [
  { id: 'pi', label: t('digits.pi') },
  { id: 'e', label: t('digits.e') },
  { id: 'tau', label: t('digits.tau') },  
  { id: 'phi', label: t('digits.phi') },
  { id: 'euler', label: t('digits.euler') },
  { id: 'sqrt2', label: t('digits.sq2') },
  { id: 'sqrt3', label: t('digits.sq3') },
  { id: 'zeta3', label: t('digits.zeta3') },
  { id: 'gauss', label: t('digits.gauss') },
  { id: 'lemni', label: t('digits.lemni') },
  { id: 'cat', label: t('digits.cat') },
  { id: 'champ', label: t('digits.champ') },
]

// --- Template Refs ---
const startInput = ref(null)

onMounted(() => {
  startInput.value?.focus()
})

// --- Methods ---

const getDigits = async () => {
  errormsg.value = ""
  
  const payload = {
    number: number.value,
    start: start.value,
    end: end.value,
    n: n.value,
  }

  try {
    const response = await fetch(phpurl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!response.ok) throw new Error('Network response was not ok')

    const data = await response.json()
    result.value = data.result
  } catch (error) {
    console.error('Error ', error)
    errormsg.value = t('errors.generic')
  }
}
</script>
