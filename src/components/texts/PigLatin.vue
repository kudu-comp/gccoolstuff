<template>

  <header class="page-header">
    <h1>{{ t('piglatin.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <VCard :title="t('labels.intro')" :initialOpen="startOpen">
      <div v-html="t('piglatin.long')" />
      <h4>{{argots[sel].name}}</h4>
      <p style="margin-top: 0px; opacity:0.65;">{{ argots[sel].descr }}</p>
    </VCard>
    <VCard :title="t('labels.settings')">
      <v-language v-model:dict="dict" v-model:dictloading="dictloading" />
      <div class="radio-group mt-2">
        <label>{{t('piglatin.sel')}}</label>
        <div class="radio-options-vertical">
          <label class="radio-item" v-for="(a, index) in argots" :key="index">
            <input type="radio" :value="index" v-model="sel">
            <span class="radio-mark"></span> {{ a.name }}
          </label>
        </div>
      </div>
    </VCard>
  </div>
  <div class="card-grid mb-2">
    <VCard :title="t('labels.input')">
      <textarea
        ref="messageInput"
        v-model="msg"
        :placeholder="t('labels.message')"
        rows="5"
        class="mb-2"
      />
      <p
        v-show="errormsg"
        class="errormsg mb-2"
      >
        {{ errormsg }}.
      </p>          
      <div class="button-row">
        <button :disabled="dictloading" class="btn btn-primary" @click="encode()">{{t('buttons.encode')}}</button>
        <button :disabled="dictloading" class="btn btn-primary" @click="decode()">{{t('buttons.decode')}}</button>
      </div>
    </VCard>
    <VCard :title="t('labels.result')">
      <div v-if="result" class="resultbox" >
        {{ result }} 
      </div>
    </VCard>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import VLanguage from "@/components/generic/VLanguage.vue"
import VCard from "@/components/generic/VCard.vue"
import { piglatin } from "@/scripts/piglatin.js"
import { useI18n } from 'vue-i18n'

const { t } = useI18n();

defineOptions({
  name: "PigLatin"
})

const route = useRoute()

// --- State ---
const result = ref("")
const errormsg = ref("")
const dict = ref({})
const dictloading = ref(true)
const sel = ref(0)
const msg = ref("")

// Static reference to the piglatin logic
const argots = piglatin

// --- Template Ref ---
const msgInput = ref(null)
const startOpen = window.innerWidth > 768;

onMounted(() => {
  // Focus the input
  msgInput.value?.focus()

  // Handle route params
  const pigParam = route.params.pig
  if (pigParam !== undefined) {
    const val = parseInt(pigParam)
    if (val >= 0 && val <= 7) {
      sel.value = val
    }
  }
})

// --- Methods ---

const decode = () => {
  // Reset
  result.value = ""
  errormsg.value = ""
  
  const trimmedMsg = msg.value.trim()
  const words = trimmedMsg.match(/[^\s.,:;?!]+|[\s.,:;?!]+/gi)

  if (!words) {
    errormsg.value = "No input"
    return
  }

  // Decode all the words
  let builder = ""
  for (let w of words) {
    builder += argots[sel.value].decodeWord(dict.value, w)
  }
  result.value = builder
}

const encode = () => {
  // Reset
  result.value = ""
  errormsg.value = ""

  const trimmedMsg = msg.value.trim()
  const words = trimmedMsg.match(/[^\s.,:;?!]+|[\s.,:;?!]+/gi)
  
  if (!words) {
    errormsg.value = "No input"
    return
  }

  // Start generating
  let builder = ""
  for (let w of words) {
    builder += argots[sel.value].encodeWord(dict.value, w)
  }
  result.value = builder
}
</script>

<i18n locale="en">
{
  "piglatin": {
    "sel" : "What kind of pig latin do you want to speak?"
  }
}
</i18n>

<i18n locale="nl">
{
  "piglatin": {
    "sel" : "Wat voor soort varkenslatijn wil je spreken?"
  }
}
</i18n>