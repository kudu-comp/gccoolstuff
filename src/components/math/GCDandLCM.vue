<template>
  <header class="page-header">
    <h1>{{ t('gcdandlcm.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')">
        <div v-html="t('gcdandlcm.long')" />
      </VCard>
      <VCard :title="t('labels.settings')">
        <div class="form-horizontal">
          <label>{{ t('gcdandlcm.num') }}</label>
          <input 
            type="text" 
            v-model="input" 
            ref="inputRef" 
          >
        </div>
        
        <p v-show="errormsg" class="errormsg mt-2">
          {{ errormsg }}.
        </p>
      </VCard>
    </div>

    <div class="card-stack">
      <VCard :title="t('labels.result')">
        <div v-if="gcd" class="resultbox">
          {{ t('gcdandlcm.t1') }} <br>
          {{ t('gcdandlcm.gcd') }} <strong>{{ gcd }}</strong>.<br>
          {{ t('gcdandlcm.lcm') }} <strong>{{ lcm }}</strong>.<br><br>
          <div class="table-responsive">
            <table class="p-table">
              <thead>
                <tr>
                  <th scope="col">{{ t('labels.number') }}</th>
                  <th scope="col">{{ t('gcdandlcm.t2') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(a, idx) in primes" :key="idx">
                  <td>{{ a.n }}</td>
                  <td>{{ a.primes }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>        
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import * as mathtools from '@/scripts/mathtools.js'
import VCard from '@/components/generic/VCard.vue'

defineOptions({ name: 'MathGCDandLCM' })
const { t } = useI18n()

// --- State ---
const input = ref("")
const gcd = ref(0)
const lcm = ref(0)
const primes = ref([])
const errormsg = ref("")
const isValid = ref(false)
const inputRef = ref(null)

onMounted(() => { inputRef.value?.focus() })

// --- Math Helpers ---
const findGCD = (arr) => {
  let res = arr[0]
  for (let i = 1; i < arr.length; i++) {
    res = mathtools.gcd(arr[i], res)
    if (res === 1) return 1
  }
  return res
}

const findLCM = (arr) => {
  let res = arr[0]
  for (let i = 1; i < arr.length; i++) {
    res = mathtools.lcm(arr[i], res)
  }
  return res
}

// --- The Watcher (Replacing the Method/Computed) ---
let debounceTimer = null

watch(input, (newVal) => {
  // 1. Clear any existing timer to prevent multiple simultaneous runs
  clearTimeout(debounceTimer)

  // 2. Wait 350ms after the user stops typing before running the math
  debounceTimer = setTimeout(() => {
    performCalculation(newVal)
  }, 350)
})

const performCalculation = (rawInput) => {
  // Reset outputs
  errormsg.value = ""
  isValid.value = false
  
  const cleanInput = rawInput.trim()
  if (!cleanInput) return

  const matchedNumbers = cleanInput.match(/[0-9]+/g)
  if (!matchedNumbers) {
    errormsg.value = t('errors.noinput')
    return
  }

  const nums = matchedNumbers.map(Number)

  // Safety Guard: Don't process massive numbers that crash the JS engine
  if (nums.some(n => n > 1000000000000)) {
    errormsg.value = t('errors.toobig')
    return
  }

  if (nums.some(n => n === 0)) {
    errormsg.value = t('gcdandlcm.inperror')
    return
  }

  try {
    // Perform Math
    gcd.value = findGCD(nums)
    lcm.value = findLCM(nums)
    primes.value = nums.map(n => ({
      n: n,
      primes: mathtools.primeFactorizationString(n)
    }))
    
    isValid.value = true
  } catch (e) {
    console.error(e)
    errormsg.value = t('errors.generic')
  }
}
</script>