<template>

  <header class="page-header">
    <h1>{{ $t('passwordgen.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="$t('labels.intro')">
        <div v-html="$t('passwordgen.long')" />
      </VCard>
      <VCard :title="$t('labels.input')">
        <div class="form-horizontal">
          <label>{{ $t('passwordgen.len') }}</label>
          <input type="number" v-model="len" min="4" ref="lenInput">
        </div>
        <label class="checkbox-container mb-2">
          <input type="checkbox" v-model="uppcase">
          <span class="checkmark"></span>
          {{ $t('passwordgen.uppcase') }}
        </label>
        <label class="checkbox-container mb-2">
          <input type="checkbox" v-model="lowcase">
          <span class="checkmark"></span>
          {{ $t('passwordgen.lowcase') }}
        </label>
        <label class="checkbox-container mb-2">
          <input type="checkbox" v-model="numbers">
          <span class="checkmark"></span>
          {{ $t('passwordgen.numbers') }}
        </label>
        <label class="checkbox-container mb-2">
          <input type="checkbox" v-model="symbols">
          <span class="checkmark"></span>
          {{ $t('passwordgen.symbols') }}
        </label>
        <p
          v-show="errormsg"
          class="errormsg mt-2"
        >
          {{ errormsg }}
        </p>
        <div class="button-row mt-2">
          <button class="btn btn-primary"  @click="generate">
            {{ $t('buttons.generate') }}
          </button>
        </div>
      </VCard>
    </div>
    <div class="card-stack">
      <VCard :title="$t('labels.result')">
        <div
          v-if="result"
          class="card resultbox"
        >
          {{ $t('passwordgen.result') }}<br><br>
          <span class="monospace">{{ result }}</span>
        </div>
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import VCard from '@/components/generic/VCard.vue'

defineOptions({
  name: 'PasswordGen'
})

const { t } = useI18n()

// --- State ---
const result = ref("")
const errormsg = ref("")
const len = ref(12)
const uppcase = ref(true)
const lowcase = ref(true)
const numbers = ref(true)
const symbols = ref(true)

// --- Template Ref ---
const lenInput = ref(null)

onMounted(() => {
  // Focus the length input on mount
  lenInput.value?.focus()
})

// --- Methods ---

const generate = () => {
  // Reset
  result.value = ""
  errormsg.value = ""

  const strup = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const strlow = "abcdefghijklmnopqrstuvwxyz"
  const strnum = "0123456789"
  const strsym = "!@#$%^&*()_+-={}[]:<,>.?/~|"
  // Note: strdia was defined in your original script but not used in the logic. 
  // I've left it out, but you can add a 'diacritics' toggle if needed.

  // Compose the character pool based on toggles
  let pool = ""
  if (uppcase.value) pool += strup
  if (lowcase.value) pool += strlow
  if (numbers.value) pool += strnum
  if (symbols.value) pool += strsym

  // Safety check: pool cannot be empty
  if (pool.length === 0) {
    errormsg.value = t('passwordgen.errnosel');
    return
  }

  // Generate password
  let pw = ""
  for (let i = 0; i < len.value; i++) {
    const randomIndex = Math.floor(Math.random() * pool.length)
    pw += pool[randomIndex]
  }

  result.value = pw;
}
</script>

<style scoped>
.resultbox {
  word-break: break-all;
}

.monospace {
  font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
</style>