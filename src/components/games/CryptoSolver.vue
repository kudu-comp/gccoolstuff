<template>

  <header class="page-header">
    <h1>{{ t('cryptosolver.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')" :initialOpen="startOpen">
        <div v-html="t('cryptosolver.long')" />
      </VCard>
      <VCard :title="t('labels.input')">
        <div class="form-horizontal">
          <label>{{ t('cryptosolver.nums') }}</label>
          <input type="text" v-model="nums" ref="numsRef">
        </div>
        <div class="form-horizontal">
          <label>{{ t('cryptosolver.outcome') }}</label>
          <input type="number" v-model="outcome">
        </div>
        <label class="checkbox-container mb-2">
          <input type="checkbox" v-model="useall">
          <span class="checkmark"></span>
          {{ t('cryptosolver.useall') }}
        </label>
        <label class="checkbox-container mb-2">
          <input type="checkbox" v-model="allowneg">
          <span class="checkmark"></span>
          {{ t('cryptosolver.allowneg') }}
        </label>
        <label class="checkbox-container mb-2">
          <input type="checkbox" v-model="allowdec">
          <span class="checkmark"></span>
          {{ t('cryptosolver.allowdec') }}
        </label>
        <label class="checkbox-container mb-2">
          <input type="checkbox" v-model="allowadd">
          <span class="checkmark"></span>
          {{ t('cryptosolver.allowadd') }}
        </label>
        <label class="checkbox-container mb-2">
          <input type="checkbox" v-model="allowsub">
          <span class="checkmark"></span>
          {{ t('cryptosolver.allowsub') }}
        </label>
        <label class="checkbox-container mb-2">
          <input type="checkbox" v-model="allowmult">
          <span class="checkmark"></span>
          {{ t('cryptosolver.allowmult') }}
        </label>
        <label class="checkbox-container mb-2">
          <input type="checkbox" v-model="allowdiv">
          <span class="checkmark"></span>
          {{ t('cryptosolver.allowdiv') }}
        </label>
        <label class="checkbox-container mb-2">
          <input type="checkbox" v-model="allowmod">
          <span class="checkmark"></span>
          {{ t('cryptosolver.allowmod') }}
        </label>
        <label class="checkbox-container mb-2">
          <input type="checkbox" v-model="allowpow">
          <span class="checkmark"></span>
          {{ t('cryptosolver.allowpow') }}
        </label>
        <p
          v-show="errormsg"
          class="errormsg mt-2"
        >
          {{ errormsg }}
        </p>
        <div class="button-row mt-2">
          <CalculateButton @calculate="findCalculation()" />
        </div>
      </VCard>
    </div>
    <div class="card-stack">
      <VCard :title="t('labels.result')">
        <div class="button-row mb-2">
          <CopyButton 
            :content="resultsContainer"
            :is-html="true"
          />
        </div>
        <div v-if="result" class="resultbox" v-html="result" ref="resultsContainer"></div>
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import CopyButton from '@/components/generic/CopyButton.vue';
import CalculateButton from '@/components/generic/CalculateButton.vue'
import VCard from '@/components/generic/VCard.vue'

defineOptions({
  name: "CryptoSolver"
})

const { t } = useI18n()

// --- State ---
const useall = ref(true)
const outcome = ref(null)
const nums = ref("")
const result = ref("")
const errormsg = ref("")
const found = ref(false)

const allowneg = ref(false)
const allowdec = ref(false)
const allowadd = ref(true)
const allowsub = ref(true)
const allowmult = ref(true)
const allowdiv = ref(true)
const allowmod = ref(false)
const allowpow = ref(false)
const numsRef=ref(null)
const resultsContainer=ref(null)
const startOpen = window.innerWidth > 768;

onMounted(() => {
  numsRef.value?.focus()
})
// --- Internal Recursive Logic ---

const nextTry = (a, calc) => {
  // If we found a solution in another branch, stop everything
  if (found.value) return

  // Base Case: Only one number left in the array
  if (a.length === 1) {
    if (a[0] === outcome.value) {
      result.value = `${t('cryptosolver.found')} ${outcome.value}<br><br>${calc}`
      found.value = true
    }
    return
  }

  for (let i = 0; i < a.length; i++) {
    // If "Must use all numbers" is OFF, check if any intermediate number matches the target
    if (!useall.value && a[i] === outcome.value) {
      result.value = `Found ${outcome.value}<br>${calc}`
      found.value = true
      return
    }

    for (let j = i + 1; j < a.length; j++) {
      // Build a new array 'h' containing all numbers except the two being operated on
      let h = []
      for (let k = 0; k < a.length; k++) {
        if (k !== i && k !== j) h.push(a[k])
      }

      const n1 = a[i]
      const n2 = a[j]

      // --- Try Allowed Operations ---

      // Addition
      if (allowadd.value) {
        h.push(n1 + n2)
        nextTry(h, calc + `${n1} + ${n2} = ${n1 + n2}<br>`)
        h.pop()
      }

      // Multiplication
      if (allowmult.value) {
        h.push(n1 * n2)
        nextTry(h, calc + `${n1} × ${n2} = ${n1 * n2}<br>`)
        h.pop()
      }

      // Subtraction (n1 - n2 and n2 - n1)
      if (allowsub.value) {
        // n1 - n2
        if (allowneg.value || n1 > n2) {
          h.push(n1 - n2)
          nextTry(h, calc + `${n1} - ${n2} = ${n1 - n2}<br>`)
          h.pop()
        }
        // n2 - n1
        if (!found.value && (allowneg.value || n2 > n1)) {
          h.push(n2 - n1)
          nextTry(h, calc + `${n2} - ${n1} = ${n2 - n1}<br>`)
          h.pop()
        }
      }

      // Division
      if (allowdiv.value) {
        // n1 / n2
        if (n2 !== 0 && (allowdec.value || n1 % n2 === 0)) {
          h.push(n1 / n2)
          nextTry(h, calc + `${n1} ÷ ${n2} = ${n1 / n2}<br>`)
          h.pop()
        }
        // n2 / n1
        if (!found.value && n1 !== 0 && (allowdec.value || n2 % n1 === 0)) {
          h.push(n2 / n1)
          nextTry(h, calc + `${n2} ÷ ${n1} = ${n2 / n1}<br>`)
          h.pop()
        }
      }

      // Modulo
      if (allowmod.value) {
        if (n2 !== 0) {
          h.push(n1 % n2)
          nextTry(h, calc + `${n1} % ${n2} = ${n1 % n2}<br>`)
          h.pop()
        }
        if (!found.value && n1 !== 0) {
          h.push(n2 % n1)
          nextTry(h, calc + `${n2} % ${n1} = ${n2 % n1}<br>`)
          h.pop()
        }
      }

      // Power
      if (allowpow.value) {
        const p1 = Math.pow(n1, n2)
        if (isFinite(p1)) {
          h.push(p1)
          nextTry(h, calc + `${n1} ^ ${n2} = ${p1}<br>`)
          h.pop()
        }
        const p2 = Math.pow(n2, n1)
        if (!found.value && isFinite(p2)) {
          h.push(p2)
          nextTry(h, calc + `${n2} ^ ${n1} = ${p2}<br>`)
          h.pop()
        }
      }
    }
  }
}

// --- Main Action ---

const findCalculation = () => {
  result.value = ""
  errormsg.value = ""
  found.value = false

  if (outcome.value === null || outcome.value === undefined || outcome.value === "") {
    errormsg.value = t('cryptosolver.nooutcome')
    return
  }

  // Parse numbers from the input string
  const matches = nums.value.match(/([0-9]+)/g)
  if (!matches) {
    errormsg.value = t('cryptosolver.nonums')
    return
  }

  const numberList = matches.map(e => parseInt(e, 10))
  if (numberList.length === 0) {
    errormsg.value = t('cryptosolver.nonums')
    return
  }

  // Start the recursive search
  nextTry(numberList, "")

  if (!found.value) {
    result.value = t('cryptosolver.nosolution')
  }
}
</script>

<i18n locale="en">
{
  "cryptosolver": {
    "useall": "Use all numbers",
    "nums": "Numbers to use",
    "outcome": "Required outcome",
    "allowneg": "Allow negative numbers",
    "allowdec": "Allow decimals",
    "allowadd": "Allow addition",
    "allowsub": "Allow subtraction",
    "allowmult": "Allow multiplication",
    "allowdiv": "Allow division",
    "allowmod": "Modulus, e.g. 11 % 3 = 2",
    "allowpow": "Power, e.g. 2 ^ 3 = 8",
    "nosolution": "No solution found",
    "nooutcome": "No outcome provided",
    "nonums": "Please input some numbers to use",
    "found": "Solution found for "
  }
}
</i18n>

<i18n locale="nl">
{
  "cryptosolver": {
    "useall": "Gebruik alle getallen",
    "nums": "Getallen om te gebruiken",
    "outcome": "Gewenste uitkomst",
    "allowneg": "Negatieve getallen zijn toegestaan",
    "allowdec": "Breuken zijn toegestaan",
    "allowadd": "Optellen",
    "allowsub": "Aftrekken",
    "allowmult": "Vermenigvuldigen",
    "allowmod": "Modulo, bijv. 11 % 3 = 2",
    "allowpow": "Machtsverheffen, bijv 2 ^ 3 = 8",
    "allowdiv": "Delen",
    "nosolution": "Geen oplossing gevonden.",
    "nooutcome": "Geen gewenste uitkomst ingevoerd.",
    "nonums": "Geen getallen ingevoerd.",
    "found": "Oplossing gevonden voor "
  }
}
</i18n>