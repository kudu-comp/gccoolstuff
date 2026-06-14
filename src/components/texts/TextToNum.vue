<template>

<header class="page-header">
    <h1>{{ $t('texttonum.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <VCard :title="$t('labels.intro')">
      <div v-html="$t('texttonum.long')" />
    </VCard>
    <VCard :title="$t('labels.settings')">
      <div class="form-group-vertical">
        <v-alphabets v-model:alphabet="selectedalphabet" />
        <label class="checkbox-container">
          <input type="checkbox" v-model="reverse">
          <span class="checkmark"></span>
          {{ $t('wordvalue.reverse') }}
        </label>
        <label class="checkbox-container">
          <input type="checkbox" v-model="startatzero">
          <span class="checkmark"></span>
          {{ $t('wordvalue.startzero') }}
        </label>
        <label class="checkbox-container">
          <input type="checkbox" v-model="leadzero">
          <span class="checkmark"></span>
          {{ $t('texttonum.leadzero') }}
        </label>
        <label class="checkbox-container">
          <input type="checkbox" v-model="replacediac">
          <span class="checkmark"></span>
          {{ $t('wordvalue.replacediac') }}
        </label>
        <div class="button-row">
          <button
            id="texttonumbers"
            class="btn btn-primary"
            @click="textToNumbers"
          >
            {{ $t('texttonum.btnttn') }}
          </button>
          <button
            id="numberstotext"
            class="btn btn-primary"
            @click="numbersToText"
          >
            {{ $t('texttonum.btnntt') }}
          </button>
        </div>
      </div>
    </VCard>
  </div>
  <div class="card-grid mb-2">
    <VCard :title="$t('labels.input')">
      <textarea
        id="message"
        ref="messageInput"
        v-model="message"
        :placeholder="$t('labels.message')"
        rows="5"
        @input="wordValue"
      />
      <p
        v-show="errormsg"
        class="errormsg mb-2"
      >
        {{ errormsg }}.
      </p>          
    </VCard>
    <VCard :title="$t('labels.result')">
      <div
        v-if="result"
        class="card resultbox"
      >
        {{ result }}
      </div>      
    </VCard>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as textHelper from '@/scripts/texthelper.js'
import VAlphabets from '@/components/generic/VAlphabets.vue'
import VCard from '@/components/generic/VCard.vue'

defineOptions({
  name: 'TextToNum'
})

// --- State ---
const message = ref("")
const selectedalphabet = ref("English")
const reverse = ref(false)
const startatzero = ref(false)
const leadzero = ref(false)
const result = ref("")
const replacediac = ref(true)

// --- Template Ref ---
const messageInput = ref(null)

onMounted(() => {
  messageInput.value?.focus()
})

// --- Methods ---

// Convert text to numbers
const textToNumbers = () => {

  result.value = ""
  let hstr = replacediac.value ? textHelper.removeDiacritics(message.value) : message.value
  
  // Get alphabet reverse if necessary
  let alpha = textHelper.getAlphabet(selectedalphabet.value)
  if (reverse.value) alpha = [...alpha].reverse().join("");

  let html = ""
  for (let i = 0; i < hstr.length; i++) {

    let idx = alpha.indexOf(hstr[i].toUpperCase());
    let str = ""
    
    if (idx >= 0) {
      // Logic for reverse and zero-based indexing
      if (!startatzero.value) idx++;
      if (leadzero.value) {
        str = idx.toString().padStart(2, "0");
      } else {
        if (idx <= Math.floor(alpha.length / 10)) {
          str = idx.toString().padStart(2, "0");
        } else {
          str = idx.toString();
        }
      }
      html += str;
    } else {
      html += hstr[i]
    }
  }
  result.value = html
}

// Convert numbers to text
const numbersToText = () => {

  result.value = ""
  let hstr = replacediac.value ? textHelper.removeDiacritics(message.value) : message.value
  
  let alpha = textHelper.getAlphabet(selectedalphabet.value)
  if (reverse.value) alpha = [...alpha].reverse().join("");;

  let html = "";
  
  for (let i = 0; i < hstr.length; i++) {
    
    const char = hstr[i]
    let str = "";
    let idx = 0;
  
    if ("0123456789".indexOf(char) >= 0) {

      let d1 = parseInt(char);
      
      if (d1 <= Math.floor(alpha.length/10)) {
        d1 += hstr[++i];        
      }
      idx = parseInt(d1)
      str += alpha[startatzero.value ? idx : idx - 1];
      html += str
    } else {
      html += char
    }
  }
  result.value = html
}
</script>

<style scoped>
</style>
