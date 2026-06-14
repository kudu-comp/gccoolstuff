<template>

  <header class="page-header">
    <h1>{{ $t('analtxt.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">      
      <VCard :title="$t('labels.intro')">
        <div v-html="$t('analtxt.long')" />
      </VCard>
      <VCard :title="$t('labels.input')">
        <div class="form-group-vertical">
          <textarea
            id="message"
            ref="messageInput"
            v-model="message"
            :placeholder="$t('labels.message')"
            rows="5"
            @input="wordValue"
          />
          <label class="checkbox-container">
            <input type="checkbox" v-model="replacediac" @change="wordValue">
            <span class="checkmark"></span>
            {{ $t('wordvalue.replacediac') }}
          </label>
          <div class="button-row">
            <button
              id="analyze"
              class="btn btn-primary"
              @click="analyzeText"
            > {{ $t('analtxt.analyze') }} 
            </button>          
          </div>
        </div>
        <p
          v-show="errormsg"
          class="errormsg mb-2"
        >
          {{ errormsg }}.
        </p>          
      </VCard>
    </div>
    <VCard :title="$t('labels.result')">
      <div class="table-responsive">
        <table class="p-table-small">
          <tbody>
            <tr><td style="text-align: left;">{{ $t('analtxt.nwords') }}</td><td>{{ totalwords }}</td></tr>
            <tr><td style="text-align: left;">{{ $t('analtxt.nlines') }}</td><td>{{ totallines }}</td></tr>
            <tr><td style="text-align: left;">{{ $t('analtxt.nchar') }}</td><td>{{ totalchar }}</td></tr>
            <tr><td style="text-align: left;">{{ $t('analtxt.nalpha') }}</td><td>{{ totalalphabet }}</td></tr>
            <tr><td style="text-align: left;">{{ $t('analtxt.ndigit') }}</td><td>{{ totaldigit }}</td></tr>
            <tr><td style="text-align: left;">{{ $t('analtxt.nwhite') }}</td><td>{{ totalwhite }}</td></tr>
            <tr><td style="text-align: left;">{{ $t('analtxt.nupper') }}</td><td>{{ totaluppercase }}</td></tr>
            <tr><td style="text-align: left;">{{ $t('analtxt.nlower') }}</td><td>{{ totallowercase }}</td></tr>
            <tr><td style="text-align: left;">{{ $t('analtxt.nnonalpha') }}</td><td>{{ totalnonalphabet }}</td></tr>
            <tr><td style="text-align: left;">{{ $t('analtxt.nnonwhite') }}</td><td>{{ totalnonwhite }}</td></tr>
          </tbody>
        </table>      
      </div>
    </VCard>
  </div>
  <div class="card-grid">
    <VCard :title="$t('labels.result')">
      <div
        v-if="result"
        class="resultbox"
        v-html="result"
      />
    </VCard>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import * as textHelper from '@/scripts/texthelper.js'
import VCard from '@/components/generic/VCard.vue'

defineOptions({
  name: 'AnalTxt'
})

const { t } = useI18n()

// --- State ---
const message = ref("")
const result = ref("")
const replacediac = ref(true)
const totalchar = ref(0)
const totalwords = ref(0)
const totallines = ref(0)
const totalwhite = ref(0)
const totalnonwhite = ref(0)
const totalalphabet = ref(0)
const totaluppercase = ref(0)
const totallowercase = ref(0)
const totalnonalphabet = ref(0)
const totaldigit = ref(0)

// --- Template Ref ---
const messageInput = ref(null)

onMounted(() => {
  messageInput.value?.focus()
})

// --- Methods ---

const analyzeText = () => {
  // Definition of uppercase, lowercase and digits
  const UpperCaseAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const LowerCaseAlphabet = "abcdefghijklmnopqrstuvwxyz"
  const DigitAlphabet = "0123456789"

  // Reset local arrays with counters
  let lowerchararr = new Array(LowerCaseAlphabet.length).fill(0)
  let upperchararr = new Array(UpperCaseAlphabet.length).fill(0)
  let digitarr = new Array(DigitAlphabet.length).fill(0)
  let freqarr = []

  // Reset all reactive counters
  totalchar.value = 0
  totalwhite.value = 0
  totalnonwhite.value = 0
  totalalphabet.value = 0
  totaluppercase.value = 0
  totallowercase.value = 0
  totalnonalphabet.value = 0
  totaldigit.value = 0

  // Remove diacritics if setting is enabled
  if (replacediac.value) {
    message.value = textHelper.removeDiacritics(message.value)
  }

  // Handle empty message to prevent regex errors
  if (!message.value.trim()) {
    totalwords.value = 0
    totallines.value = 0
    result.value = ""
    return
  }

  // Use regex to count words and lines
  totalwords.value = (message.value.trim().match(/[^\s]+/g) || []).length
  totallines.value = (message.value.match(/[^\r\n.]+/g) || []).length

  // Start scanning the message
  for (let i = 0; i < message.value.length; i++) {
    const char = message.value[i]
    totalchar.value++

    let idx = UpperCaseAlphabet.indexOf(char)
    if (idx >= 0) {
      upperchararr[idx]++
      totalalphabet.value++
      totaluppercase.value++
    } 
    else if (" \n\r\t".indexOf(char) >= 0) {
      totalwhite.value++
    } 
    else if ((idx = LowerCaseAlphabet.indexOf(char)) >= 0) {
      lowerchararr[idx]++
      totalalphabet.value++
    } 
    else if ((idx = DigitAlphabet.indexOf(char)) >= 0) {
      digitarr[idx]++
      totaldigit.value++
    } 
    else {
      // Other characters
      idx = freqarr.findIndex((element) => element.char === char)
      if (idx >= 0) {
        freqarr[idx].count++
      } else {
        freqarr.push({ char: char, count: 1, perc: 0.0 })
      }
    }
  }

  // Calculate final totals
  totalnonalphabet.value = totalchar.value - totalalphabet.value - totalwhite.value
  totallowercase.value = totalalphabet.value - totaluppercase.value
  totalnonwhite.value = totalchar.value - totalwhite.value

  // --- Generate HTML Tables ---

  // Alphabet Table
  let html = `<div class="table-responsive"><table class='p-table-small mb-2'><thead><tr><th scope='col'>${t('analtxt.letter')}</th>`
  for (let i = 0; i < UpperCaseAlphabet.length; i++) html += `<th scope='col'>${UpperCaseAlphabet[i]}</th>`
  
  html += `</tr></thead><tbody><tr><td>${t('analtxt.count')}</td>`
  for (let i = 0; i < lowerchararr.length; i++) html += `<td>${lowerchararr[i] + upperchararr[i]}</td>`
  
  html += `</tr><tr><td># ${t('analtxt.upper')}</td>`
  for (let i = 0; i < upperchararr.length; i++) html += `<td>${upperchararr[i]}</td>`
  
  html += `</tr><tr><td># ${t('analtxt.lower')}</td>`
  for (let i = 0; i < lowerchararr.length; i++) html += `<td>${lowerchararr[i]}</td>`
  
  html += `</tr><tr><td>${t('analtxt.perc')}</td>`
  for (let i = 0; i < upperchararr.length; i++) {
    const perc = ((lowerchararr[i] + upperchararr[i]) * 100 / totalchar.value).toFixed(1)
    html += `<td>${perc}%</td>`
  }
  html += "</tbody></table>"

  // Digits Table
  html += `<table class='p-table-small mb-2'><thead><tr><th scope='col'>${t('analtxt.digit')}</th>`
  for (let i = 0; i < DigitAlphabet.length; i++) html += `<th scope='col'>${DigitAlphabet[i]}</th>`
  
  html += `</tr></thead><tbody><tr><td>${t('analtxt.count')}</td>`
  for (let i = 0; i < digitarr.length; i++) html += `<td>${digitarr[i]}</td>`
  
  html += `</tr><tr><td>${t('analtxt.perc')}</td>`
  for (let i = 0; i < digitarr.length; i++) {
    const perc = (digitarr[i] * 100 / totalchar.value).toFixed(1)
    html += `<td>${perc}%</td>`
  }
  html += "</tbody></table>"

  // Symbols Table
  freqarr.sort((a, b) => (a.char > b.char ? 1 : a.char < b.char ? -1 : 0))
  
  html += `<table class='p-table-small'><thead><tr><th scope='col'>${t('analtxt.symbol')}</th>`
  for (let i = 0; i < freqarr.length; i++) html += `<th scope='col'>${freqarr[i].char}</th>`
  
  html += `</tr></thead><tr><td>${t('analtxt.count')}</td>`
  for (let i = 0; i < freqarr.length; i++) html += `<td>${freqarr[i].count}</td>`
  
  html += `</tr><tr><td>${t('analtxt.perc')}</td>`
  for (let i = 0; i < freqarr.length; i++) {
    const perc = (freqarr[i].count * 100 / totalchar.value).toFixed(1)
    html += `<td>${perc}%</td>`
  }
  html += "</table></div>"

  result.value = html
}
</script>

<style scoped>

th {
  text-align: left;
}

.p-table-small th:first-child,
.p-table-small td:first-child {
  width: 400px;        /* Set your preferred width */
  min-width: 80px;
  max-width: 400px;
  text-align: left;    /* Labels often look better left-aligned */
  padding-left: 0.5rem;
}

</style>

