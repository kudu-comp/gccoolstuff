<template>
  <header class="page-header">
    <h1>{{ t('wordvalue.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <VCard :title="t('labels.intro')" :initialOpen="startOpen">
      <div v-html="t('wordvalue.long')" />
    </VCard>
    <VCard :title="t('labels.settings')">
      <v-alphabets-ext
        id="listofalpha"
        v-model:alphabet="selectedalphabet"
        @click="wordValue"
      />
      <label class="checkbox-container mt-2 mb-2">
        <input type="checkbox" v-model="reverse" @change="wordValue">
        <span class="checkmark"></span>
        {{ t('labels.reverse') }}
      </label>
      <label class="checkbox-container mb-2">
        <input type="checkbox" v-model="startatzero" @change="wordValue">
        <span class="checkmark"></span>
        {{ t('labels.startzero') }}
      </label>
      <label class="checkbox-container mb-2">
        <input type="checkbox" v-model="replacediac" @change="wordValue">
        <span class="checkmark"></span>
        {{ t('labels.replacediac') }}
      </label>
      <label class="checkbox-container">
        <input type="checkbox" v-model="showvalues" @change="showTable">
        <span class="checkmark"></span>
        {{ t('wordvalue.showhide') }}
      </label>        
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
        @input="wordValue"
      />
      <p
        v-show="errormsg"
        class="errormsg mb-2"
      >
        {{ errormsg }}.
      </p>
    </VCard>
    <VCard :title="t('labels.result')">
      <div v-if="result" class="button-row mb-2">
        <CopyButton 
          :content="resultsContainer"
          :is-html="true"
        />
      </div>
      <div v-if="result" class="resultbox" ref="resultsContainer">
        <div class="table-responsive" v-html="result">
        </div>
      </div>
    </VCard>
  </div>
  <div v-show="showvalues" class="card-grid mb-2">
    <VCard :title="t('labels.alphabet')">
      <div class="table-responsive" >
        <table class="p-table">
          <thead>
            <tr>
              <th
                v-for="s in values"
                :key="s"
              >
                {{ s[0] }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                v-for="s in values"
                :key="s"
              >
                {{ s[1] }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </VCard>
  </div>
  <div class="card-grid mb-2">
    <VCard :title="t('labels.addinfo')">
      <div v-html="t('wordvalue.someinfo2')" />
    </VCard>
  </div>  
</template>

<script setup>

import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import * as textHelper from '@/scripts/texthelper.js'
import VAlphabetsExt from '@/components/generic/VAlphabetsExt.vue'
import VCard from '@/components/generic/VCard.vue'
import CopyButton from '@/components/generic/CopyButton.vue';

// Define the name of the component
defineOptions({
  name: 'WordValue'
})

const { t } = useI18n();
const startOpen = window.innerWidth > 768;

// State (formerly data)
const showvalues = ref(false)
const values = ref(null)
const message = ref("")
const alphabets = ref("")
const selectedalphabet = ref("English")
const reverse = ref(false)
const startatzero = ref(false)
const replacediac = ref(true)
const result = ref("")
const showinfo = ref(true)
const errormsg = ref("")

// Template Ref for focusing the textarea
const messageInput = ref(null)
const resultsContainer = ref(null);

onMounted(() => {
  if (messageInput.value) {
    messageInput.value.focus()
  }
})

// Methods

// Load the table with row 0 the letters and row 1 the values
const showTable = () => {
  values.value = textHelper.getTable(
    selectedalphabet.value, 
    reverse.value, 
    startatzero.value
  )
}

// Calculate the word values and square root
const wordValue = () => {
  errormsg.value = ""
  result.value = ""

  try {

    // Update table
    showTable();

    //Check is we need to remove diacretics
    let h = "";
    if (replacediac.value) {
      h = textHelper.removeDiacritics(message.value)
    } else {
      h = message.value;    
    }

    // Do nothing if message is empty
    if (h.length === 0) return

    // Calculate value of the entire text
    let totalVal = textHelper.wordValue(
      h, 
      reverse.value, 
      startatzero.value, 
      selectedalphabet.value
    )
    
    let wordvalues = [
      { 
        name: "All text", 
        value: totalVal, 
        squareroot: textHelper.squareRoot(totalVal) 
      }
    ]

    // Split message in words
    let words = h.match(/([^\s.,:;]+)/ug) || [];

    // Calculate values for each word, skip values of 0
    words.forEach(word => {
      const val = textHelper.wordValue(
        word, 
        reverse.value, 
        startatzero.value, 
        selectedalphabet.value
      )
      if (val > 0) {
        wordvalues.push({ 
          name: word, 
          value: val, 
          squareroot: textHelper.squareRoot(val) 
        })
      }
    })

    // Display table with all values
    let html = "<table class='p-table'><thead><tr><th style='text-align:left' scope='col'>Word(s)</th><th>Value</th><th>Square root</th></tr></thead>"
    
    wordvalues.forEach((item, index) => {
      html += "<tr"
      if (index === 0) html += " style='color:#6b8e23;'"
      html += "><th>" + item.name + "</th><td>" + item.value + "</td><td>" + item.squareroot + "</td></tr>"
    })
    
    html += "</table>"
    result.value = html

  } catch (e) {
    console.error(e)
    errormsg.value = t('errors.generic')
  }
}
</script>

<i18n locale="en">
{
  "wordvalue": {
    "showhide": "Show/hide alphabet",
    "someinfo": "Some information on alphabets",
    "someinfo2": "<p>The calculator uses the official alphabets. So in some languages diacritics are separate letters in the alphabet (e.g. Ä in German or Å in Swedish) and in some languages they represent the original letter (e.g. é or ô in French). The <b>remove diacritics</b> however is merciless and replaces all diacritics, which is okay in most cases. But for languages were diacritics are separate letters (like German or Swedish) you better not use Remove Diacritics.</p><p>The Greek and Cyrillic (such as Russian) alphabets have characters that look exactly like their Western versions, such as A or B. But they are different, they have different character codes. When typed with a Western keyboard they will still resolve to a value of zero. If you would copy for example place names from Wikipedia (e.g. Амстердам) the right symbols are used and the values are calculated correctly.</p><p>The Scrabble values used are those of the latest known version. There are quite a few other versions out there. If you want the values of one those, you can find them on <a href='https://en.wikipedia.org/wiki/Scrabble_letter_distributions'>Wikipedia</a>, but you have to do the hard work yourself.</p>",
    "words": "Word",
    "value": "Word value",
    "root": "Swaure root"
  }
}
</i18n>

<i18n locale="nl">
{
  "wordvalue": {
    "showhide": "Toon/verberg alfabet",
    "someinfo": "Informatie over alfabetten",
    "someinfo2": "<p>Er wordt gerekend met de officiële alfabetten. In sommige talen zijn diakrieten aparte letters (zoals Ä in het Duits of Å in het Zweeds) en in sommige talen komen zij overeen met de originele letter (zoals é of ô in het Frans). <b>Vervang diakrieten</b> is echter genadeloos en vervangt alle diakrieten. Dat werkt goed in de meeste gevallen, maar niet voor talen waarbij deze letters deel zijn van het alfabet</p><p>De Griekse en Cyrillische alfabetten hebben letters die grote gelijkenis vertonen met de Westerse versies, zoals A of B. Maar ze zijn wel degelijk verschillend. Indien ingevoerd met een Westers toetsenbord komen ze niet overeen en krijgen een waarde 0. Indien je een Russische/Griekse tekst zou kopieren, bijvoorbeeld plaatsnamen van Wikipedia (zoals Амстердам) dan worden de juiste letters gebruikt en de berekening correct uitgevoerd.</p><p>De Scrabble waardes zijn die van de laatst bekende versies. Er zijn nog veel meer versies in omloop. Een goed overzicht is te vinden op <a href='https://en.wikipedia.org/wiki/Scrabble_letter_distributions'>Wikipedia</a>, maar je moet dan zelf de berekening uitvoeren.</p>",
    "words": "Woorde",
    "value": "Woordwaarde",
    "root": "Stapeltellen"
  }
}
</i18n>

