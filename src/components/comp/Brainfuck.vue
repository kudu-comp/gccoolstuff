<template>

   <header class="page-header">
    <h1>{{ t('brainfuck.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')">
        <div v-html="t('brainfuck.long')" />
      </VCard>
      <VCard :title="t('labels.settings')">
        <div class="form-horizontal">
          <CustomDropdown
            :options="bfvars"
            v-model="selBF"
            :title="t('brainfuck.vars')"
          />
        </div>
      </VCard>
      <VCard :title="t('labels.input')">
        <div class="form-horizontal">
          <label>{{ t('brainfuck.input') }}</label>
          <input type="text" v-model="input">
        </div>
        <label class="checkbox-container mb-2">
          <input type="checkbox" v-model="shorthand">
          <span class="checkmark"></span>
          {{ t('brainfuck.shorthand') }}
        </label>
        <textarea
          ref="codeInput"
          class="mb-2"
          v-model="message"
          :placeholder="t('labels.message')"
          rows="5"
          @input="doSomething"
        />
        <p
          v-show="errormsg"
          class="errormsg mt-2"
        >
          {{ errormsg }}
        </p>
        <div class="button-row mt-2">
          <button class="btn btn-primary"  @click="runBrainfuck">
            {{ t('brainfuck.run') }}
          </button>
          <button class="btn btn-primary"  @click="writeBrainfuck">
            {{ t('brainfuck.create') }}
          </button>
        </div>
      </VCard>
    </div>
    <div class="card-stack">
      <VCard :title="t('labels.result')">
        <div v-if="result" class="button-row mb-2">
          <button @click="copyToClipboard" class="btn btn-small btn-primary" :class="{ copied: copiedStatus }">
            {{ copiedStatus ? '✓' : t('buttons.copy') }}
          </button>
        </div>
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
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import * as bf from '@/scripts/brainfuck.js'
import VCard from '@/components/generic/VCard.vue';
import CustomDropdown from '@/components/generic/CustomDropdown.vue'

defineOptions({
  name: 'Brainfuck'
})

const route = useRoute()
const { t } = useI18n()

// --- State ---
const message = ref("")
const result = ref("")
const selBF = ref(0)
const input = ref("")
const shorthand = ref(false)
const bfvars = ref([])
const errormsg = ref("")
const copiedStatus = ref(false);

// --- Template Ref ---
const codeInput = ref(null)

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(result.value);
    copiedStatus.value = true;
    setTimeout(() => copiedStatus.value = false, 2000);
  } catch (err) {
    console.error('Failed to copy!', err);
  }
};

// --- Lifecycle ---
onMounted(() => {
  // Focus the code textarea
  codeInput.value?.focus()
  
  // Load Brainfuck variants from script
  bfvars.value = bf.vars.map((v, index) => ({ label: v, value: index }))

  // Handle route parameters (e.g., /brainfuck/cow)
  if (route.params.bf) {
    const param = route.params.bf.toLowerCase()
    const foundIndex = bfvars.value.findIndex(v => v.toLowerCase() === param)
    if (foundIndex !== -1) {
      selBF.value = foundIndex
    }
  }
})

// --- Methods ---
const writeBrainfuck = () => {
  errormsg.value = ""
  if (shorthand.value) {
    result.value = bf.textToBrainfuckShorthand(message.value);
  } else {
    result.value = bf.textToBrainfuck(message.value);
  }
}

const runBrainfuck = () => {
  // Reset error flag and result
  errormsg.value = ""
  result.value = ""	
  let bfcode = ""

  try {
    // 1. Run preprocessor 
    // Translates Trivial Brainfuck Substitutes (like 'moo') to standard '+-><'
    bfcode = bf.preprocess(message.value, selBF.value)
    
    // 2. Expand shorthand if enabled (e.g., 10+ becomes ++++++++++)
    if (shorthand.value) {
      bfcode = bf.extendshorthand(bfcode)
    }
    
    // 3. Run the interpreter
    result.value = bf.run(bfcode, input.value)

  } catch (e) {
    errormsg.value = t('errors.generic')
    console.error(e)
  }
}
</script>

<i18n locale="en">
{
  "brainfuck": {
    "vars" : "Select programming language",
    "shorthand" : "Shorthand notation",
    "debug": "Debug to console",
    "code": "Program code",
    "input": "Input variables",
    "run": "Run code",
    "create": "Text to Brainfuck"
  }
}
</i18n>

<i18n locale="nl">
{
  "brainfuck": {
    "vars" : "Selecteer programmeertaal",
    "shorthand" : "Verkorte notatie",
    "code": "Programmacode",
    "debug": "Debug info naar console",
    "input": "Input variabelen",
    "run": "Run code",
    "create": "Tekst naar Brainfuck"
  }
}
</i18n>