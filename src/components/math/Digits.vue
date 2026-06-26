<template>

   <header class="page-header">
    <h1>{{ t('digits.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')" :initialOpen="startOpen">
        <div v-html="t('digits.long')" />
      </VCard>
      <VCard :title="t('labels.settings')">
        <div class="radio-group">
          <label>{{ t('digits.sel') }}</label>
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
      <VCard :title="t('labels.input')">
        <div class="form-horizontal">
          <label>{{ t('digits.from') }}</label>
          <input type="number" v-model="start" ref="startInput" min="0" max="1000000">
        </div>
        <div class="form-horizontal">
          <label>{{ t('digits.to') }}</label>
          <input type="number" v-model="end" min="0" max="1000000">
        </div>
        <p
          v-show="errormsg"
          class="errormsg mt-2"
        >
          {{ errormsg }}.
        </p>
        <div class="button-row mt-2">
          <CalculateButton @calculate="getDigits" />
        </div>
      </VCard>
      <VCard :title="t('labels.result')">
        <div v-if="result" class="resultbox">
          {{ t('digits.res', { start: start, end: end, result: result}) }}
        </div>
      </VCard>
    </div>
  </div>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import VCard from '@/components/generic/VCard.vue'
import CalculateButton from '@/components/generic/CalculateButton.vue'

defineOptions({
  name: 'MathDigits'
})

const { t } = useI18n()

// --- State ---
const number = ref("pi")
const start = ref(1)
const end = ref(1)
const startOpen = window.innerWidth > 768;
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

<i18n locale="en">
{
  "digits": {
    "sel": "Select a number",
    "pi": "π or pi, starts with 3.141592653589...",
  	"e": "e, starts with 2.718281828459...",
    "tau": "𝜏, tau or 2*π, starts with 6.2831853071...",
    "phi": "φ or phi or the golden ratio, starts with 1.61803398874989...",
    "euler": "γ or the Euler–Mascheroni constant, starts with 0.577215664901...",
    "sq2": "√2 or Pythagoras' constant, starts with 1.414213562373095...",
    "sq3": "√3 or Theodorus' constant, starts with 1.7320508075...",
    "zeta3": "ζ(3) or zeta(3) or Apéry's constant, starts with 1.202056903...",
    "gauss": "Gauss's constant, starts with 0.8346268416...",
    "lemni": "Lemniscate constant, starts with 5.2441151085...",
    "cat": "Catalan's constant, starts with 0.915965594... ",
    "champ": "Champernowne constant, starts with 0.12345678910111213...",
    "from": "From digit",
    "to": "to digit",
    "get": "Get digits",
    "res": "The digits from {start} tot {end} are {result}."
  }
}
</i18n>

<i18n locale="nl">
{
  "digits": {
    "sel": "Selecteer een nummer",
    "pi": "π of pi, begint met 3.141592653589...",
  	"e": "e, begint met 2.718281828459...",
    "tau": "𝜏, tau of 2*π, begint met 6.2831853071...",
    "phi": "φ of phi of de gulden ratio, begint met 1.61803398874989...",
    "euler": "γ of de Euler–Mascheroni constante, begint met 0.577215664901...",
    "sq2": "√2 of constante van Pythagoras, begint met 1.414213562373095...",
    "sq3": "√3 of constante van Theodorus, begint met 1.7320508075...",
    "zeta3": "ζ(3) of zeta(3) of Constante van Apéry, begint met 1.202056903...",
    "gauss": "Constante van Gauss, begint met 0.8346268416...",
    "lemni": "Lemniscate constante, begint met 5.2441151085...",
    "cat": "Catalan constante, begint met 0.915965594...",
    "champ": "Champernowne constante, begint met 0.12345678910111213...",
    "from": "Vanaf decimaal",
    "to": "tot decimaal",
    "get": "Haal op",
    "res": "De decimalen vanaf {start} tot {end} zijn {result}."
  }
}
</i18n>