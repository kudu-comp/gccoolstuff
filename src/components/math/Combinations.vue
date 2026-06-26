<template>

  <header class="page-header">
    <h1>{{ t('combinations.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')" :initialOpen="startOpen">
        <div v-html="t('combinations.long')" />
      </VCard>
      <VCard :title="t('labels.input')">
        <div class="form-horizontal">
          <label>{{ t('combinations.cnt') }}</label>
          <input type="number" min="0" v-model="cnt" ref="cntInput">
        </div>
        <div class="form-horizontal">
          <label>{{ t('combinations.size') }}</label>
          <input type="number" min="0" v-model="size">
        </div>
        <label class="checkbox-container mb-2">
          <input type="checkbox" v-model="rpt">
          <span class="checkmark"></span>
          {{ t('combinations.rpt') }}
        </label>
        <div class="form-horizontal">
          <CustomDropdown 
            :options="options" 
            v-model="sel"
            :title="t('combinations.sel')"
          />
        </div>
        <div class="form-horizontal">
          <CustomDropdown 
            v-if="sel === '2' || sel === '3'"
            :options="sets" 
            v-model="set"
            :title="t('combinations.set')"
          ></CustomDropdown>
        </div>
        <div class="form-horizontal mt-2" v-if="set === '2' && (sel === '2' || sel === '3')">
          <label >{{ t('combinations.list') }}</label>
          <input type="text" v-model="txt"/>
        </div>
        <p
          v-show="errormsg"
          class="errormsg mt-2"
        >
          {{ errormsg }}
        </p>
        <div class="button-row mt-2">
          <button id="convert" class="btn btn-primary"  @click="doAction">
            {{ t('buttons.show') }}
          </button>
        </div>
      </VCard>
    </div>
    <div class="card-stack">
      <VCard :title="t('labels.result')">     
        <div v-if="result" class="resultbox" v-html="result" />
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import VCard from '@/components/generic/VCard.vue'
import CustomDropdown from '@/components/generic/CustomDropdown.vue'

defineOptions({
  name: "Combinations"
})

const { t } = useI18n()

// --- State ---
const sel = ref("0")
const cnt = ref(2)
const size = ref(4)
const rpt = ref(false)
const set = ref("0")
const txt = ref("Purple,Indigo,Blue,Green,Yellow,Orange,Red")
const result = ref("")
const errormsg = ref("")
const list = ref([])
const startOpen = window.innerWidth > 768;

// Dropdown Options
const options = [
  { value: "0", label: t('combinations.cntcomb') },
  { value: "1", label: t('combinations.cntperm') },
  { value: "2", label: t('combinations.gencomb') },
  { value: "3", label: t('combinations.genperm') },
]

const sets = [
  { value: "0", label: t('combinations.set1') },
  { value: "1", label: t('combinations.set2') },
  { value: "2", label: t('combinations.set3') },
]

// --- Template Refs ---
const cntInput = ref(null)

onMounted(() => {
  cntInput.value?.focus()
})

// --- Math Helpers ---

const fact = (n) => {
  if (n < 0) return NaN
  let val = 1
  for (let i = 2; i <= n; i++) val *= i
  return val
}

/**
 * Recursive generation function
 * @param {Array} a - current working set of elements
 * @param {Boolean} isComb - true for combinations, false for permutations
 */
const nextCombi = (a, isComb) => {
  if (a.length === cnt.value) {
    // Base Case: Enough elements selected
    result.value += "<br>("
    for (let i = 0; i < a.length; i++) {
      switch (set.value) {
        case "0":
          result.value += a[i]
          break
        case "1":
          result.value += "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[a[i] - 1]
          break
        case "2":
          result.value += list.value[a[i] - 1]
          break
        default:
          result.value += "-"
      }
      result.value += ","
    }
    result.value = result.value.slice(0, -1) + ")"
  } else {
    // Recursive Case
    let start = isComb ? a[a.length - 1] : 1
    
    // For combinations without replacements, start at next index
    if (isComb && !rpt.value) start++

    for (let i = start; i <= size.value; i++) {
      // For permutations without replacements, skip if already used
      if (!isComb && !rpt.value && a.indexOf(i) >= 0) continue
      
      a.push(i)
      nextCombi(a, isComb)
      a.pop()
    }
  }
}

// --- Main Action ---

const doAction = () => {
  // Reset
  result.value = ""
  errormsg.value = ""
  let totalCount = 0
  const maxLimit = 10000

  // Prepare custom list if needed
  if (set.value === "2") {
    list.value = txt.value.split(",").map(s => s.trim())
    if (list.value.length < size.value) {
      errormsg.value = t("combinations.notenoughitems")
      return
    }
  }

  const k = cnt.value
  const n = size.value

  // Logic flow
  switch (sel.value) {
    case "0":
    case "2":
      // Combinations (nCr)
      if (rpt.value) {
        totalCount = fact(n - 1 + k) / (fact(k) * fact(n - 1))
      } else {
        if (n < k) {
          totalCount = 0
        } else {
          totalCount = fact(n) / (fact(k) * fact(n - k))
        }
      }

      if (isNaN(totalCount)) {
        errormsg.value = t("combinations.toomany")
        return
      }

      result.value = t("combinations.numcomb") + totalCount.toFixed(0) + "<br>"
      
      if (sel.value === "0") return // Count only
      
      if (totalCount > maxLimit) {
        errormsg.value = t("combinations.max") + maxLimit
        return
      }

      // Generate
      for (let i = 1; i <= n; i++) {
        nextCombi([i], true)
      }
      break

    case "1":
    case "3":
      // Permutations (nPr)
      if (rpt.value) {
        totalCount = Math.pow(n, k)
      } else {
        if (n < k) {
          totalCount = 0
        } else {
          totalCount = fact(n) / fact(n - k)
        }
      }

      if (isNaN(totalCount)) {
        errormsg.value = t("combinations.toomany")
        return
      }

      result.value = t("combinations.numperm") + totalCount.toFixed(0) + "<br>"
      
      if (sel.value === "1") return // Count only
      
      if (totalCount > maxLimit) {
        errormsg.value = t("combinations.max") + maxLimit
        return
      }

      // Generate
      for (let i = 1; i <= n; i++) {
        nextCombi([i], false)
      }
      break
  }
}
</script>

<style scoped>
</style>

<i18n locale="en">
{
  "combinations": {
    "cnt": "Number of items to choose",
    "size": "Number of items to choose from",
    "rpt": "Allow replacements (reuse options)",
    "sel": "Combinations or permutations",
    "set": "Select items from",
    "set1": "Use numbers starting at 1",
    "set2": "Use letters starting at A",
    "set3": "Use list of items",
    "list": "List of items",
    "cntcomb": "Count combinations",
    "cntperm": "Count permutations",
    "gencomb": "Generate combinations",
    "genperm": "Generate permutations",
    "notenoughitems": "Not enough items in list",
    "toomany": "Too many to calculate",
    "numcomb": "The number of combinations is ",
    "numperm": "The number of permutations is ",
    "max": "Maximum number that can be generated is "
  }
}
</i18n>

<i18n locale="nl">
{
  "combinations": {
    "cnt": "Aantal te kiezen items",
    "size": "Aantal items om uit te kiezen",
    "rpt": "Vervanging toegestaan (hergebruik opties)",
    "sel": "Combinaties of permutaties",
    "set": "Selecteer items uit",
    "set1": "Cijfers vanaf 1",
    "set2": "Letters vanaf A",
    "set3": "Lijst van items",
    "list": "Lijst van items",
    "cntcomb": "Aantal combinaties",
    "cntperm": "Aantal permutaties",
    "gencomb": "Genereer combinaties",
    "genperm": "Genereer permutaties",
    "notenoughitems": "Niet genoeg items in de lijst",
    "toomany": "Teveel om te berekenen",
    "numcomb": "Het aantal combinaties is ",
    "numperm": "Het aantal permutaties is ",
    "max": "Maximum aantal dat kan worden gegenereerd is "
  }
}
</i18n>