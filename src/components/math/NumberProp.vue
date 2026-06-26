<template>

   <header class="page-header">
    <h1>{{ t('numberprop.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')" :initialOpen="startOpen">
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
          <CalculateButton :disabled='working' @calculate = "getProperties" />
        </div>
      </VCard>
    </div>
    <div class="card-stack">
      <VCard :title="t('numberprop.t1')">
        <div class="table-responsive" style="border-style: none;">
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
        </div>
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import CalculateButton from '@/components/generic/CalculateButton.vue'
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
const startOpen = window.innerWidth > 768;
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

<i18n locale="en">
{
  "numberprop": {
    "num": "Number to check",
    "t1": "Properties",
    "oddoreven": "Odd or even",
    "even": "Even - numbers divisable by 2",
    "odd": "Odd - numbers not divisable by 2",
    "primerel": "Primes and related",
    "prime": "Prime - a number greater than 1 that is not a product of two smaller natural numbers",
    "comp": "Composite - not a prime",
    "bi": "Biprime - a number which is the product of exactly two primes",
    "divrel": "Divisors and related",
    "abun": "Abundant - Sigma(n) > 2n, where sigma(n) is the sum of the divisors of n",
    "perfect": "Perfect - Sigma(n) = 2n, where sigma(n) is the sum of the divisors of n",
    "defi": "Deficient - Sigma(n) < 2n, where sigma(n) is the sum of the divisors of n",
    "sqfree": "Squarefree - a number not divisable for square > 1",
    "pow": "Powerful - for every prime p dividing n, p**2 also divides n",
    "polygonal": "Polygonal or 2D figurate numbers",
    "tri": "Triagonal",
    "squa": "Square",
    "penta": "Pentagonal",
    "hexa": "Hexagonal",
    "hepta": "Heptagonal",
    "octa": "Octagonal",
    "nona": "Nonagonal",
    "deca": "Decagonal",
    "star": "Star or dodecagonal",
    "binrel": "Binary properties",
    "odious": "Odious - Binary representation has odd number of ones",
    "evil": "Evil - Binary representation has even number of ones",
    "polyhedral": "Polyhedral or 3D figurate numbers",
    "tethed": "Tetrahedral - a pyramid with a triangular base",
    "sqpyr": "Square pyramid",
    "cube": "Cube",
    "others": "Other properties",
    "niven": "Niven or Harshad - Numbers which are divisable by the sum of their digits",
    "narc": "Narcistic - Sum of digits ** (#digits) equals n",
    "kap": "Kaprekar - sort the number, reverse it, subtract the reversed from the original, it should be the same",
    "pal": "Palindrome - add the number is the same when reversed",
    "lucky": "Lucky - see https://en.wikipedia.org/wiki/Lucky_number for an explanation",
    "happ": "Happy - see https://en.wikipedia.org/wiki/Happy_number for an explanation",
    "asp": "Aspiring - see https://oeis.org/A063769 Online Encyclopedia of Integer Sequences for an explanation",
    "fib": "Fibonacci - sequence, each number is the sum of the previous two. It starts with 1, 1, 2, 3, ...",
    "toobig": "Number must be smaller than 1,000,000,000"
  }
}
</i18n>

<i18n locale="nl">
{
  "numberprop": {
    "num": "Nummer",
    "t1": "Eigenschappen",
    "oddoreven": "Oneven of even",
    "even": "Even - nummers deelbaar door 2",
    "odd": "Oneven - nummers niet deelbaar door 2",
    "primerel": "Priemgetallen en dergelijke",
    "prime": "Priem - een  getal groter dan 1 dat niet het product is van twee andere natuurlijke getallen",
    "comp": "Composiet - niet priem getallen",
    "bi": "Bipriem - nummers die het product zijn van exact twee priemgetallen",
    "divrel": "Delers en dergelijke",
    "perfect": "Perfect - Sigma(n) = 2n, met sigma(n) is de som van de delers van n",
    "defi": "Deficient - Sigma(n) < 2n, met sigma(n) is de som van de delers van n",
    "abun": "Abundant - Sigma(n) > 2n, met sigma(n) is de som van de delers van n",
    "pow": "Powerful - Voor elk priemgetallen p dat een deler is van n geldt dat p**2 ook een deler is van n",
    "sqfree": "Squarefree - Nummers niet deelbaar door een kwadraat > 1",
    "polygonal": "Veelhoeksgetal - nummers die een 2D figuur kunnen vormen met n zijden",
    "tri": "Driehoeksgetal",
    "squa": "Kwadraatgetal",
    "penta": "Vijfhoeksgetal",
    "hexa": "Zeshoeksgetal",
    "hepta": "Zevenhoeksgetal",
    "octa": "Achthoeksgetal",
    "nona": "Negenhoeksgetal",
    "deca": "Tienhoeksgetal",
    "star": "Ster of dodecagonaal (12-hoekig)",
    "binrel": "Binair en dergelijke",
    "evil": "Evil - binaire getal heeft een even aantal enen.",
    "odious": "Odious - binaire getal heeft een oneven aantal enen",
    "polyhedral": "Polyhedraal - nummers die een 3D figuur kunnen vormen met n zijden",
    "tethed": "Tetraëdrisch - een pyramide met een driehoekige basis",
    "cube": "Kubusgetal",
    "sqpyr": "Vierkante piramide",
    "other": "Andere eigenschappen",
    "kap": "Kaprekar - sorteer het getal, draai het om en trek beiden van elkaar af tot beiden hetzelfde zijn",
    "pal": "Palindroom - getal is hetzelfde als omgekeerd",
    "niven": "Niven of Harshad - nummers deelbaar door de som van de cijfers",
    "narc": "Narcistic - som van de cijfers ** (aantal cijfers) is gelijk aan n",
    "fib": "Fibonacci - elk nummer is de som van de voorgaande twee nummers. De reeks begint met 1, 1, 2, 3, ...",
    "lucky": "Lucky - zie https://en.wikipedia.org/wiki/Lucky_number voor uitleg",
    "happy": "Happy - zie https://en.wikipedia.org/wiki/Happy_number voor uitleg",
    "asp": "Aspiring - zie https://oeis.org/A063769 Online Encyclopedia of Integer Sequences voor uitleg",
    "toobig": "Nummer moet kleiner zijn dan 1,000,000,000"
  }
}
</i18n>