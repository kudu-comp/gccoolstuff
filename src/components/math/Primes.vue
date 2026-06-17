<template>

   <header class="page-header">
    <h1>{{ t('primes.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')">
        <div v-html="t('primes.long')" />
      </VCard>
      <VCard :title="t('labels.input')">
        <div class="form-horizontal">
          <label>{{ t('primes.check') }}</label>
          <input type="number" v-model="checkprime">
          <v-calculate @calculate="checkPrime"></v-calculate>
        </div>
        <div class="form-horizontal">
          <label>{{ t('primes.pos') }}</label>
          <input type="number" v-model="pos">
          <v-calculate @calculate="getPrime"></v-calculate>
        </div>
        <div class="form-horizontal">
          <label>{{ t('primes.primefact') }}</label>
          <input type="number" v-model="primefact">
          <v-calculate @calculate="primeFactors"></v-calculate>
        </div>
        <p
          v-show="errormsg"
          class="errormsg mt-2"
        >
          {{ errormsg }}.
        </p>
      </VCard>
    </div>
    <div class="card-stack">
      <VCard :title="t('labels.result')">
        <div
          v-if="result"
          class="resultbox"
        >
          {{ result }}
        </div>
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
  name: 'MathPrimes'
})

const { t } = useI18n()

// --- State ---
const errormsg = ref("")
const pos = ref(1)
const primepos = ref(1)
const checkprime = ref(1)
const primefact = ref(1)
const result = ref(t('labels.result'))

const phpurl = `${window.location.protocol}//${window.location.hostname}/math/primes.php`

// --- Template Ref ---
const checkprimeInput = ref(null)

onMounted(() => {
  checkprimeInput.value?.focus()
})

// --- Logic Methods ---

const primeFactors = () => {
  result.value = ""
  errormsg.value = ""

  if (primefact.value > Number.MAX_SAFE_INTEGER) {
    errormsg.value = t('errors.toobig')
  } else {
    const factors = mathtools.primeFactorization(primefact.value)
    result.value =  t('gcdandlcm.t2') + " " + primefact.value + ": "+ factors.join(" - ")
  }
}

const checkPrime = () => {
  result.value = t('labels.result')
  errormsg.value = ""

  if (checkprime.value > Number.MAX_SAFE_INTEGER) {
    errormsg.value = t('errors.toobig')
  } else {
    const isPrime = mathtools.checkprime(checkprime.value)
    result.value = `${checkprime.value} ${isPrime ? t('primes.isprime') : t('primes.isnotprime')}`
  }
}

const getPrime = async () => {
  result.value = t('labels.result')
  errormsg.value = ""

  const payload = {
    action: "get",
    pos: pos.value
  }

  try {
    const response = await fetch(phpurl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const data = await response.json()

    if (data.prime > 0) {
      result.value = `${t('primes.primeatpos')} ${pos.value} ${t('primes.primeis')} ${data.prime}`
    } else {
      result.value = t('primes.primenotfound')
    }
  } catch (error) {
    console.error('Error ', error)
    errormsg.value = t('errors.generic')
  }
}

const getPos = async () => {
  result.value = t('labels.result')
  errormsg.value = ""

  const payload = {
    action: "pos",
    prime: primepos.value
  }

  try {
    const response = await fetch(phpurl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const data = await response.json()

    if (data.pos > 0) {
      result.value = `${t('primes.posofprime')} ${primepos.value} ${t('primes.primeis')} ${data.pos}`
    } else {
      result.value = `${primepos.value} ${t('primes.isnotprime')}`
    }
  } catch (error) {
    console.error('Error ', error)
    errormsg.value = t('errors.generic')
  }
}
</script>
