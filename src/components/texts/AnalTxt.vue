<template>
  <header class="page-header">
    <h1>{{ t('analtxt.title') }}</h1>
  </header>
  
  <div class="card-grid mb-2">
    <div class="card-stack">      
      <VCard :title="t('labels.intro')" :initialOpen="startOpen">
        <div v-html="t('analtxt.long')" />
      </VCard>

      <VCard :title="t('labels.input')">
        <textarea
          id="message"
          ref="messageInput"
          v-model="message"
          :placeholder="t('labels.message')"
          rows="5"
          class="mb-2"
        />
        <label class="checkbox-container mb-2">
          <input type="checkbox" v-model="replacediac">
          <span class="checkmark"></span>
          {{ t('labels.replacediac') }}
        </label>
        <p v-show="errormsg" class="errormsg">{{ errormsg }}.</p>          
      </VCard>
    </div>

    <!-- Summary Results Card -->
    <VCard :title="t('labels.result')">
      <div class="table-responsive">
        <table class="p-table">
          <tbody>
            <tr><td style="text-align: left;">{{ t('analtxt.nwords') }}</td><td>{{ stats.totalwords }}</td></tr>
            <tr><td style="text-align: left;">{{ t('analtxt.nlines') }}</td><td>{{ stats.totallines }}</td></tr>
            <tr><td style="text-align: left;">{{ t('analtxt.nchar') }}</td><td>{{ stats.totalchar }}</td></tr>
            <tr><td style="text-align: left;">{{ t('analtxt.nalpha') }}</td><td>{{ stats.totalalphabet }}</td></tr>
            <tr><td style="text-align: left;">{{ t('analtxt.ndigit') }}</td><td>{{ stats.totaldigit }}</td></tr>
            <tr><td style="text-align: left;">{{ t('analtxt.nwhite') }}</td><td>{{ stats.totalwhite }}</td></tr>
            <tr><td style="text-align: left;">{{ t('analtxt.nupper') }}</td><td>{{ stats.totaluppercase }}</td></tr>
            <tr><td style="text-align: left;">{{ t('analtxt.nlower') }}</td><td>{{ stats.totallowercase }}</td></tr>
            <tr><td style="text-align: left;">{{ t('analtxt.nnonalpha') }}</td><td>{{ stats.totalnonalphabet }}</td></tr>
            <tr><td style="text-align: left;">{{ t('analtxt.nnonwhite') }}</td><td>{{ stats.totalnonwhite }}</td></tr>
          </tbody>
        </table>      
      </div>
    </VCard>
  </div>

  <!-- Detailed Frequency Tables Card -->
  <div class="card-grid">
    <VCard :title="t('freqanal.title')">
      <div v-if="stats.totalchar > 0" class="resultbox" v-html="frequencyTablesHtml" />
    </VCard>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import * as textHelper from '@/scripts/texthelper.js'
import VCard from '@/components/generic/VCard.vue'

defineOptions({ name: 'AnalTxt' })

const { t } = useI18n()

// --- State ---
const message = ref("")
const replacediac = ref(true)
const errormsg = ref("")
const messageInput = ref(null)
const startOpen = window.innerWidth > 768;

onMounted(() => {
  messageInput.value?.focus()
})

// --- Analysis Logic (The "Listener") ---

const stats = computed(() => {
  const UpperCaseAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const LowerCaseAlphabet = "abcdefghijklmnopqrstuvwxyz"
  const DigitAlphabet = "0123456789"

  // Start with empty stats object
  const s = {
    totalchar: 0, totalwords: 0, totallines: 0, totalwhite: 0,
    totalnonwhite: 0, totalalphabet: 0, totaluppercase: 0,
    totallowercase: 0, totalnonalphabet: 0, totaldigit: 0,
    upperchararr: new Array(26).fill(0),
    lowerchararr: new Array(26).fill(0),
    digitarr: new Array(10).fill(0),
    freqarr: []
  }

  let input = message.value
  if (!input || !input.trim()) return s

  // Clean diacritics if needed
  if (replacediac.value) {
    input = textHelper.removeDiacritics(input)
  }

  // Basic counts
  s.totalwords = (input.trim().match(/[^\s]+/g) || []).length
  s.totallines = (input.match(/[^\r\n.]+/g) || []).length

  // Process String
  for (let i = 0; i < input.length; i++) {
    const char = input[i]
    s.totalchar++

    let idx = UpperCaseAlphabet.indexOf(char)
    if (idx >= 0) {
      s.upperchararr[idx]++
      s.totalalphabet++
      s.totaluppercase++
    } 
    else if (" \n\r\t".indexOf(char) >= 0) {
      s.totalwhite++
    } 
    else if ((idx = LowerCaseAlphabet.indexOf(char)) >= 0) {
      s.lowerchararr[idx]++
      s.totalalphabet++
    } 
    else if ((idx = DigitAlphabet.indexOf(char)) >= 0) {
      s.digitarr[idx]++
      s.totaldigit++
    } 
    else {
      // Other symbols
      const fIdx = s.freqarr.findIndex((el) => el.char === char)
      if (fIdx >= 0) {
        s.freqarr[fIdx].count++
      } else {
        s.freqarr.push({ char: char, count: 1 })
      }
    }
  }

  // Final cross-calculations
  s.totalnonalphabet = s.totalchar - s.totalalphabet - s.totalwhite
  s.totallowercase = s.totalalphabet - s.totaluppercase
  s.totalnonwhite = s.totalchar - s.totalwhite

  return s
})

// --- HTML Generation for Tables ---

const frequencyTablesHtml = computed(() => {
  const s = stats.value
  if (s.totalchar === 0) return ""

  const UpperCaseAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const DigitAlphabet = "0123456789"

  // 1. Alphabet Table
  let html = `<div class="table-responsive"><table class='p-table-small mb-4'><thead><tr><th scope='col'>${t('analtxt.letter')}</th>`
  for (let i = 0; i < 26; i++) html += `<th scope='col'>${UpperCaseAlphabet[i]}</th>`
  html += `</tr></thead><tbody><tr><td>${t('analtxt.count')}</td>`
  for (let i = 0; i < 26; i++) html += `<td>${s.lowerchararr[i] + s.upperchararr[i]}</td>`
  html += `</tr><tr><td># ${t('analtxt.upper')}</td>`
  for (let i = 0; i < 26; i++) html += `<td>${s.upperchararr[i]}</td>`
  html += `</tr><tr><td># ${t('analtxt.lower')}</td>`
  for (let i = 0; i < 26; i++) html += `<td>${s.lowerchararr[i]}</td>`
  html += `</tr><tr><td>${t('analtxt.perc')}</td>`
  for (let i = 0; i < 26; i++) {
    const perc = ((s.lowerchararr[i] + s.upperchararr[i]) * 100 / s.totalchar).toFixed(1)
    html += `<td>${perc}%</td>`
  }
  html += "</tbody></table>"

  // 2. Digits Table
  html += `<table class='p-table-small mb-4'><thead><tr><th scope='col'>${t('analtxt.digit')}</th>`
  for (let i = 0; i < 10; i++) html += `<th scope='col'>${DigitAlphabet[i]}</th>`
  html += `</tr></thead><tbody><tr><td>${t('analtxt.count')}</td>`
  for (let i = 0; i < 10; i++) html += `<td>${s.digitarr[i]}</td>`
  html += `</tr><tr><td>${t('analtxt.perc')}</td>`
  for (let i = 0; i < 10; i++) {
    const perc = (s.digitarr[i] * 100 / s.totalchar).toFixed(1)
    html += `<td>${perc}%</td>`
  }
  html += "</tbody></table>"

  // 3. Symbols Table
  const sortedFreq = [...s.freqarr].sort((a, b) => a.char.localeCompare(b.char))
  html += `<table class='p-table-small'><thead><tr><th scope='col'>${t('analtxt.symbol')}</th>`
  for (let item of sortedFreq) html += `<th scope='col'>${item.char}</th>`
  html += `</tr></thead><tbody><tr><td>${t('analtxt.count')}</td>`
  for (let item of sortedFreq) html += `<td>${item.count}</td>`
  html += `</tr><tr><td>${t('analtxt.perc')}</td>`
  for (let item of sortedFreq) {
    const perc = (item.count * 100 / s.totalchar).toFixed(1)
    html += `<td>${perc}%</td>`
  }
  html += "</tbody></table></div>"

  return html
})
</script>

<style scoped>
th {
  text-align: left;
}

.p-table-small th:first-child,
.p-table-small td:first-child {
  width: 150px;
  min-width: 120px;
  text-align: left;
  padding-left: 0.5rem;
  font-weight: bold;
}
</style>

<i18n locale="en">
{
  "analtxt": {
    "analyze": "Analyze text",
    "result": "Table with counts and percentages comes here",
    "nwords": "Number of words",
    "nlines": "Number of lines",
    "nchar": "Number of characters",
    "nalpha": "Number of alphabetic characters (A to Z, a to z)",
    "ndigit": "Number of digits (0 to 9)",
    "nwhite": "Number of white space characters (spaces, tabs and linefeeds)",
    "nupper": "Number of uppercase characters (A to Z)",
    "nlower": "Number of lowercase characters (a to z)",
    "nnonalpha": "Number of non alphabetic characters",
    "nnonwhite": "Number of non white space",
    "letter": "Letter",
    "digit": "Digit",
    "symbol": "Symbol",
    "count": "Count",
    "perc": "Percentage",
    "upper": "upper",
    "lower": "lower"
  }
}
</i18n>

<i18n locale="nl">
{
  "analtxt": {
    "analyze": "Analiseer tekst",
    "result": "Tabel met aantallen en percentages komt hier",
    "nwords": "Aantal woorden",
    "nlines": "Aantal regels",
    "nchar": "Aantal karakters",
    "nalpha": "Aantal letters (A to Z, a to z)",
    "ndigit": "Aantal cijfers (0 to 9)",
    "nwhite": "Aantal witgebruik (spaties, tabs, regeleinde)",
    "nupper": "Aantal hoofdletters (A to Z)",
    "nlower": "Aantal kleine letters (a to z)",
    "nnonalpha": "Aantal niet-letters",
    "nnonwhite": "Aantal niet-witgebruik",
    "letter": "Letter",
    "digit": "Cijfer",
    "symbol": "Symbool",
    "count": "Aantal",
    "perc": "Percentage",
    "upper": "hoofd",
    "lower": "kleine"
  }
}
</i18n>