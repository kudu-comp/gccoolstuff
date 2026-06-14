<template>

  <header class="page-header">
    <h1>{{ $t('checksum.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="$t('labels.intro')">
        <div v-html="$t('checksum.long')" />
      </VCard>
      <VCard :title="$t('labels.input')">
        <div class="form-horizontal">
          <CustomDropdown
            :title="$t('checksum.checkmethod')"
            :options="checks"
            v-model="checksel"
          />
        </div>
        <div class="form-horizontal">
          <label>{{ $t('labels.number') }}</label>
          <input type="text" v-model="txt" ref="inputRef">
        </div>
        <p
          v-show="errormsg"
          class="errormsg mt-2"
        >
          {{ errormsg }}
        </p>
        <div class="button-row mt-2">
          <v-calculate id="run" @calculate="runChecksum" />
        </div>  
      </VCard>
    </div>
    <div class="card-stack">
      <VCard :title="$t('labels.result')">
        <div
          v-if="result"
          class="card resultbox"
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
import VCalculate from '@/components/generic/VCalculate.vue'
import CustomDropdown from '@/components/generic/CustomDropdown.vue'
import VCard from '@/components/generic/VCard.vue'

defineOptions({
  name: 'CompChecksum'
})

const { t } = useI18n()

// --- State ---
const checksel = ref("0")
const result = ref("")
const txt = ref("")
const errormsg = ref("")

const checks = [
  { value: "0", label: "Modulo 10" },
  { value: "2", label: "GS1 standard (EAN, GLN, GTIN, UCC, GSIN, SSCC)" },
  { value: "3", label: "Elfproef / Modulo 11" },
  { value: "4", label: "Dutch BSN" },
  { value: "5", label: "ISBN-10 (old), use GS1 for ISBN-13" },
  { value: "6", label: "Luhn (credit card, IMEI and many others)" },
  { value: "7", label: "IBAN (International Bank Account Number)" },
  { value: "1", label: "Universal Product Code (UPC)" },
  { value: "8", label: "Parity bit (only works on 0s and 1s)" }
]

// --- Template Ref ---
const inputRef = ref(null)

onMounted(() => {
  inputRef.value?.focus()
})

// --- Logic ---

const runChecksum = () => {
  // Init
  result.value = ""
  errormsg.value = ""
  let nums = []
  let h = 0
  const charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"

  try {
    // IBAN checksum logic
    if (checksel.value === "7") {
      let s = ""
      // Move first 4 chars to end is handled here by starting loop at index 4
      for (let i = 4; i < txt.value.length; i++) {
        s += charset.indexOf(txt.value[i].toUpperCase()).toString()
      }

      // Append the first two positions (country code)
      s += charset.indexOf(txt.value[0]?.toUpperCase()).toString()
      s += charset.indexOf(txt.value[1]?.toUpperCase()).toString()

      // Multiply by 100 (append 00)
      s += "00"

      let b = BigInt(s)
      let checksum = (BigInt(98) - (b % BigInt(97))).toString().padStart(2, "0")

      result.value = t('checksum.checkres') + checksum
      return
    }

    // Standard check digit logic
    for (let c of txt.value) {
      if (c === "?") continue
      let i = parseInt(c, 10)
      if (isNaN(i)) {
        errormsg.value = t('errors.notanumber')
        return
      }
      nums.push(i)
    }

    // Swap array if checksum is calculated right to left
    // Note: checksel is used here as it contains the logic type
    if ("23456".indexOf(checksel.value) >= 0) {
      nums.reverse()
    }

    let sum = 0
    // Step 1: Run over all the digits
    for (let i = 0; i < nums.length; i++) {
      switch (checksel.value) {
        case "0":
        case "8":
          sum += nums[i]
          break
        case "1":
        case "2":
          // Alternating weights 3 and 1
          sum += i % 2 === 0 ? nums[i] * 3 : nums[i]
          break
        case "3":
        case "4":
        case "5":
          // Weights i + 2 (Modulo 11 style)
          sum += nums[i] * (i + 2)
          break
        case "6":
          // Luhn Logic
          h = i % 2 === 0 ? nums[i] * 2 : nums[i]
          sum += h > 9 ? (h % 10) + 1 : h
          break
      }
    }

    let finalRes = t('checksum.checkres')

    // Step 2: Finalize checksum based on sum
    switch (checksel.value) {
      case "0":
        finalRes += (sum % 10).toString()
        break
      case "1":
      case "2":
      case "6":
        finalRes += (sum % 10 === 0 ? 0 : 10 - (sum % 10)).toString()
        break
      case "3":
      case "5":
        h = 11 - (sum % 11)
        if (h < 10) finalRes += h
        if (h === 10) finalRes += "0 or 10"
        if (h === 11) finalRes += "X or 11"
        break
      case "4":
        h = sum % 11
        if (h < 10) finalRes += h
        if (h === 10) finalRes += "0 or 10"
        if (h === 11) finalRes += "X or 11"
        break
      case "8":
        if (sum % 2 === 0) {
          finalRes += t('checksum.checkpar1') // Even parity
        } else {
          finalRes += t('checksum.checkpar2') // Odd parity
        }
        break
    }

    result.value = finalRes

  } catch (e) {
    errormsg.value = t('errors.generic')
    console.error(e)
  }
}
</script>

