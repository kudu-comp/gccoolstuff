<template>

<header class="page-header">
    <h1>{{ t('keyboards.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <VCard :title="t('labels.intro')" :initialOpen="startOpen">
      <div v-html="t('keyboards.long')" />
    </VCard>
    <VCard :title="t('labels.settings')">
      <div class="form-horizontal">
        <label>{{ t('keyboards.inputkb') }}</label>
        <v-keyboards
          v-model:keyboard="fromkeyboard"
          @click="translateKeyboard"
        />
      </div>
      <div class="form-horizontal">
        <label>{{ t('keyboards.outputkb') }}</label>
        <v-keyboards
          v-model:keyboard="tokeyboard"
          @click="translateKeyboard"
        />
      </div>
    </VCard>
  </div>
  <div class="card-grid mb-2">
    <VCard :title="t('labels.input')">
      <textarea
        id="message"
        ref="messageInput"
        v-model="message"
        :placeholder="t('labels.message')"
        rows="5"
        @input="translateKeyboard"
      />
      <p
        v-show="errormsg"
        class="errormsg mb-2"
      >
        {{ errormsg }}.
      </p>          
    </VCard>
    <VCard :title="t('labels.result')">
      <div
        v-if="result"
        class="resultbox"
      >
        {{ result }}
      </div>
    </VCard>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import VKeyboards from '@/components/generic/VKeyboards.vue'
import * as keyboards from '@/scripts/keyboards.js'
import VCard from '@/components/generic/VCard.vue'

// Component Name (useful for devtools)
defineOptions({
  name: 'Keyboards'
})

const { t } = useI18n()

// --- State ---
const message = ref("")
const result = ref("")
const fromkeyboard = ref("QWERTY")
const tokeyboard = ref("DVORAK2")
const errormsg = ref("")

// --- Template Ref ---
const messageInput = ref(null)
const startOpen = window.innerWidth > 768;

onMounted(() => {
  // Automatically focus the input on mount
  messageInput.value?.focus()
})

// --- Methods ---

const translateKeyboard = () => {
  // Reset error flag and result
  errormsg.value = ""
  result.value = ""

  try {
    // Convert the input using the external script
    // Remember to use .value when accessing ref variables
    result.value = keyboards.convertKeyboard(
      message.value, 
      fromkeyboard.value, 
      tokeyboard.value
    )
  } catch (e) {
    errormsg.value = t('keyboards.error')
    console.error(e)
  }
}
</script>

<i18n locale="en">
{
  "keyboards": {
    "inputkb": "Input keyboard",
    "outputkb": "Output keyboard",
    "error": "Keyboard could not be converted, please check"
  }
}
</i18n>

<i18n locale="nl">
{
  "keyboards": {
    "inputkb": "Invoer toetsenbord",
    "outputkb": "Uitvoer toetsenbord",
    "error": "Toetsenbord kan niet worden geconverteerd. Controleer de invoer."
  }
}
</i18n>