<template>

  <header class="page-header">
    <h1>{{ $t('gcdandlcm.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="$t('labels.intro')">
        <div v-html="$t('gcdandlcm.long')" />
      </VCard>
      <VCard :title="$t('labels.input')">
        <div class="form-horizontal">
          <label>{{ $t('gcdandlcm.num') }}</label>
          <input type="text" v-model="input" ref="inputRef" @keyup.enter="getGCDandLCM">
        </div>
        <p
          v-show="errormsg"
          class="errormsg mt-2"
        >
          {{ errormsg }}.
        </p>
        <div class="button-row mt-2">
          <v-calculate @calculate="getGCDandLCM"></v-calculate>
        </div>
      </VCard>
    </div>
    <div class="card-stack">
      <VCard :title="$t('labels.result')">
        <p class="card resultbox">
          {{ $t('gcdandlcm.t1') }} <br>
          {{ $t('gcdandlcm.gcd') }} <strong>{{ gcd }}</strong>.<br>
          {{ $t('gcdandlcm.lcm') }} <strong>{{ lcm }}</strong>.
        </p>
        <table class="p-table">
          <thead>
            <tr><th scope="col">{{ $t('labels.number') }}</th>
            <th scope="col">{{ $t('gcdandlcm.t2') }}</th></tr>
          </thead>
          <tbody>
            <tr
              v-for="a in primes"
              :key="a"
              :value="a.n"
            >
              <td>{{ a.n }}</td><td>{{ a.primes }}</td>
            </tr>
          </tbody>
        </table>
     </VCard>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import * as mathtools from '@/scripts/mathtools.js'
import VCalculate from '@/components/generic/VCalculate.vue'
import VCard from '@/components/generic/VCard.vue'

defineOptions({
  name: 'MathGCDandLCM'
})

const { t } = useI18n()

// --- State ---
const input = ref("")
const errormsg = ref("")
const gcd = ref(0)
const lcm = ref(0)
const primes = ref([])
const showitem = ref(true)
const hidebutton = ref(true)

// --- Template Ref ---
const inputRef = ref(null)

onMounted(() => {
  inputRef.value?.focus()
})

// --- Internal Helper Functions ---

// Function to find gcd of array of numbers
const findGCD = (arr, n) => {
  let result = arr[0]
  for (let i = 1; i < n; i++) {
    result = mathtools.gcd(arr[i], result)
    if (result == 1) return 1
  }
  return result
}

// Find the lowest common multiple
const findLCM = (arr, n) => {
  let result = arr[0]
  for (let i = 1; i < n; i++) {
    result = mathtools.lcm(arr[i], result)
    // Preservation note: if the result is 1, return early 
    // (matches your original component logic)
    if (result == 1) return 1
  }
  return result
}

// --- Primary Action ---

const getGCDandLCM = () => {
  // Reset outputs
  errormsg.value = ""
  gcd.value = 0
  lcm.value = 0
  primes.value = []

  // Convert input string to array of number strings
  const matchedNumbers = input.value.match(/[0-9]+/g)

  if (matchedNumbers === null) {
    errormsg.value = t('errors.noinput')
    return
  }

  // Convert to actual numbers
  const nums = matchedNumbers.map(Number)

  // Check for zeroes (GCD is undefined for zero)
  if (nums.some(n => n === 0)) {
    errormsg.value = t('gcdandlcm.inperror')
    return
  }

  // Calculate results
  gcd.value = findGCD(nums, nums.length)
  lcm.value = findLCM(nums, nums.length)

  // Build prime factorization data
  primes.value = nums.map(n => ({
    n: n,
    primes: mathtools.primeFactorizationString(n)
  }))
}
</script>
