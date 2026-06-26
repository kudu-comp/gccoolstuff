<template>

   <header class="page-header">
    <h1>{{ t('primes.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')" :initialOpen="startOpen">
        <div v-html="t('primes.long')" />
      </VCard>
      <VCard :title="t('labels.input')">
        <div class="form-horizontal">
          <label>{{ t('primes.check') }}</label>
          <input type="number" v-model="checkprime">
          <CalculateButton @calculate="checkPrime" />
        </div>
        <div class="form-horizontal">
          <label>{{ t('primes.pos') }}</label>
          <input type="number" v-model="pos">
          <CalculateButton @calculate="getPrime" />
        </div>
        <div class="form-horizontal">
          <label>{{ t('primes.primefact') }}</label>
          <input type="number" v-model="primefact">
          <CalculateButton @calculate="primeFactors" />
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
import CalculateButton from '@/components/generic/CalculateButton.vue'
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
const startOpen = window.innerWidth > 768;

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
    result.value =  t('primes.fact', {num : primefact.value, result: factors.join(" - ")})
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

<i18n locale="en">
{
  "primes": {
    "check": "Check if this is a prime",
    "pos": "Get prime at position",
    "primepos": "Get position of prime",
    "primefact": "Prime factors of",
    "toobig": "Number is too big",
    "isprime": "is a prime number",
    "isnotprime": "is not a prime number",
    "primeatpos": "The prime number at position",
    "primeis": "is",
    "primenotfound": "Prime number not found",
    "fact": "The prime factors of {num} are {result}.",
    "posofprime": "The position of prime"
  }
}
</i18n>

<i18n locale="nl">
{
  "primes": {
    "check": "Check priem of niet",
    "pos": "Priemgetal op positie",
    "primepos": "Positie van priemgetal",
    "primefact": "Priemfactoren van",
    "toobig": "Nummer is te hoog",
    "isprime": "is een priemgetal",
    "isnotprime": "is geen priemgetal",
    "primeatpos": "Het priemgetal op positie",
    "primeis": "is",
    "primenotfound": "Priemgetal is niet gevonden",
    "fact": "De priemfactoren van {num} zijn {result}.",
    "posofprime": "De positie van priemgetal"
  }
}
</i18n>