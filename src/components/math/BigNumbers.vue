<template>

  <header class="page-header">
    <h1>{{ t('bignumbers.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')" :initialOpen="startOpen">
        <div v-html="t('bignumbers.long')" />
      </VCard>
      <VCard :title="t('labels.settings')">
        <div class="form-horizontal">
        <CustomDropdown 
            v-model="base" 
            :options="BASE_OPTIONS" 
            :title="t('bignumbers.selnum')"
          />
        </div>
      </VCard>
      <VCard :title="t('labels.input')">
        <div class="form-horizontal">
          <label>{{ t('bignumbers.num1') }}</label>
          <input type="text" v-model="n1" ref="n1Input">
        </div>
        <div class="form-horizontal">
          <label>{{ t('bignumbers.num2') }}</label>
          <input type="text" v-model="n2">
        </div>
        <h4>{{ t('bignumbers.arithmetic') }}</h4>
        <div class="button-row mt-2">
          <button class="btn btn-primary" @click="calcBig('ADD')">A + B</button>
          <button class="btn btn-primary" @click="calcBig('SUB')">A - B</button>
          <button class="btn btn-primary" @click="calcBig('MUL')">A * B</button>
          <button class="btn btn-primary" @click="calcBig('DIV')">A \ B</button>
          <button class="btn btn-primary" @click="calcBig('MOD')">A % B</button>
          <!-- <input type="button" id="pow" value="A ** B" class="btn mb-2" v-on:click="calcBig('POW')"> -->
        </div>
        <h4>{{ t('bignumbers.logical') }}</h4>
        <div class="button-row mt-2">
          <button class="btn btn-primary" @click="calcBig('AND')">A and B</button>
          <button class="btn btn-primary" @click="calcBig('OR')">A or B</button>
          <button class="btn btn-primary" @click="calcBig('XOR')">A xor B</button>
          <button class="btn btn-primary" @click="calcBig('NOT')">not A</button>
        </div>
        <p
          v-show="errormsg"
          class="errormsg mb-2"
        >
          {{ errormsg }}
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
import VCard from '@/components/generic/VCard.vue'
import CustomDropdown from '@/components/generic/CustomDropdown.vue'

defineOptions({
  name: 'BigNumbers'
})

const { t } = useI18n()
const startOpen = window.innerWidth > 768;

// --- Static Data ---
const BASE_OPTIONS = [
  { value: 10, label: "Decimal" },
  { value: 2, label: "Binary" },
  { value: 8, label: "Octal" },
  { value: 16, label: "Hexadecimal" }
]

// --- State ---
const errormsg = ref("")
const n1 = ref("0")
const n2 = ref("0")
const result = ref("")
const base = ref(10)

// --- Template Refs ---
const n1Input = ref(null)

onMounted(() => {
  n1Input.value?.focus()
})

// --- Methods ---

const calcBig = (oper) => {
  // Reset
  errormsg.value = ""
  
  let prefix = ""
  // Note: Cast to string for switch safety in case dropdown returns number
  switch (String(base.value)) {
    case "2":  prefix = "0b"; break
    case "8":  prefix = "0o"; break
    case "16": prefix = "0x"; break
  }

  try {
    const val1 = BigInt(prefix + n1.value)
    const val2 = BigInt(prefix + n2.value)

    switch (oper) {
      case "ADD":
        result.value = (val1 + val2).toString(base.value)
        break
      case "SUB":
        result.value = (val1 - val2).toString(base.value)
        break
      case "MUL":
        result.value = (val1 * val2).toString(base.value)
        break
      case "DIV":
        result.value = (val1 / val2).toString(base.value)
        break
      case "MOD":
        result.value = (val1 % val2).toString(base.value)
        break
      case "POW":
        result.value = (val1 ** val2).toString(base.value)
        break
      case "AND":
        result.value = (val1 & val2).toString(base.value)
        break
      case "OR":
        result.value = (val1 | val2).toString(base.value)
        break
      case "XOR":
        result.value = (val1 ^ val2).toString(base.value)
        break
      case "NOT": {
        const s1 = val1.toString(2)
        let flipped = ""
        for (let i = 0; i < s1.length; i++) {
          flipped += (s1[i] === "1") ? "0" : "1"
        }
        result.value = BigInt("0b" + flipped).toString(base.value)
        break
      }
    }
    
    // Ensure result is converted to uppercase if it's Hex
    if (base.value === 16) {
      result.value = result.value.toUpperCase()
    }

  } catch (e) {
    errormsg.value = t('errors.generic')
    console.error("BigInt Calculation Error:", e)
  }
}
</script>

<style scoped>

h4 {
	text-align: right;
  font-size: 0.9rem;
  margin-top: 0.75rem;
  margin-bottom: 0.5rem;
}

</style>

<i18n locale="en">
{
  "bignumbers": {
    "selnum": "Number base",
    "num1": "Number A",
    "num2": "Number B",
    "decimal": "Decimal",
    "binary": "Binary",
    "octal": "Octal",
    "hexadecimal": "Hexadecimal",
    "arithmetic": "Arithmetic operations",
    "logical": "Logical operations"
  }
}
</i18n>

<i18n locale="nl">
{
  "bignumbers": {
    "selnum": "Rekenstelsel",
    "num1": "Getal A",
    "num2": "Getal B",
    "decimal": "Decimaal",
    "binary": "Binair",
    "octal": "Octaal",
    "hexadecimal": "Hexadecimaal",
    "arithmetic": "Rekenkundige bewerkingen",
    "logical": "Logische bewerkingen"
  }
}
</i18n>