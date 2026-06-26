<template>

  <header class="page-header">
    <h1>{{ t('freqanal.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')" :initialOpen="startOpen">
        <div v-html="t('freqanal.long')" />
      </VCard>
      <VCard :title="t('labels.settings')">
        <div class="form-horizontal">
          <label>{{t('labels.alphabet')}}</label>
          <input
            v-model="alphabet"
            type="text"
          >
        </div>
        <div class="form-horizontal">
          <label>{{t('freqanal.size')}}</label>
          <input type="number" min="1" max="6" v-model="size" id="size"/>
        </div>
        <label class="checkbox-container mb-2">
          <input type="checkbox" v-model="slide">
          <span class="checkmark"></span>
          {{ t('freqanal.slide') }}
        </label>
        <label class="checkbox-container mb-2">
          <input type="checkbox" v-model="bound">
          <span class="checkmark"></span>
          {{ t('freqanal.bound') }}
        </label>
        <label class="checkbox-container mb-2">
          <input type="checkbox" v-model="showmissing">
          <span class="checkmark"></span>
          {{ t('freqanal.showmissing') }}
        </label>
      </VCard>
      <VCard :title="t('labels.input')">
        <!-- Text area input -->
        <textarea
          ref="msgInput"
          v-model="msg"
          class="mb-2"
          :placeholder="t('labels.message')"
          rows="5"
        />
        <p
          v-show="errormsg"
          class="errormsg mb-2"
        >
          {{ errormsg }}
        </p>
        <div class="button-row">
          <CalculateButton class="mb-2" id="calc" @calculate="genStats()" />
        </div>
      </VCard>
    </div>
    <div class="card-stack">
      <VCard :title="t('labels.result')">
        <!-- Result area or use v-html -->
        <div v-if="result" class="resultbox" v-html="result"></div>
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import VCard from '@/components/generic/VCard.vue'
import CalculateButton from '@/components/generic/CalculateButton.vue'

defineOptions({
  name: "FreqAnalysis"
})

const { t } = useI18n()

// --- State ---
const result = ref("")
const errormsg = ref("")
const alphabet = ref("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
const size = ref(2)
const slide = ref(true)
const bound = ref(true)
const showmissing = ref(false)
const msg = ref("")
const startOpen = window.innerWidth > 768;

// --- Template Ref ---
const msgInput = ref(null)

// Internal logic counter
let cntmissing = 0

onMounted(() => {
  msgInput.value?.focus()
})

// --- Logic Helpers ---

const findMissing = (freq, str, n, nSize) => {
  if (cntmissing > 1000) return

  if (n === nSize) {
    const target = str.toUpperCase()
    const idx = freq.findIndex((a) => a.ngram === target)
    if (idx < 0) {
      result.value += str + " "
      cntmissing++
    }
  } else {
    for (let i = 0; i < alphabet.value.length; i++) {
      findMissing(freq, (str + alphabet.value[i]), n + 1, nSize)
    }
  }
}

const genNgrams = (nSize) => {
  let freq = []
  let totalNgrams = 0
  let words = []

  // Extract words or treat whole text as one block
  if (bound.value) {
    words = Array.from(msg.value.matchAll(/[A-Z]+/gi))
  } else {
    // Wrap in nested array to match matchAll structure [ [text] ]
    words.push([msg.value.replace(/[^A-Z]+/gi, "")])
  }

  const shift = slide.value ? 1 : nSize

  for (const w of words) {
    const text = w[0]
    for (let i = 0; i <= text.length - nSize; i += shift) {
      const ngram = text.slice(i, i + nSize).toUpperCase()
      if (ngram.length < nSize) continue

      const existing = freq.find((a) => a.ngram === ngram)
      if (existing) {
        existing.cnt++
      } else {
        freq.push({ ngram: ngram, cnt: 1 })
      }
      totalNgrams++
    }
  }

  // Sort: Count descending, then Alphabetical
  freq.sort((a, b) => b.cnt - a.cnt || a.ngram.localeCompare(b.ngram))

  // Build Output HTML
  let html = `${t('freqanal.numfound')}${freq.length}<br>`
  const totalPossible = Math.pow(alphabet.value.length, nSize)
  html += `${t('freqanal.nummissing')}${totalPossible - freq.length}`
  
  html += `
    <div class='table-responsive mt-2'>
      <table class='p-table-small'>
        <thead>
          <tr>
            <th>N-gram</th>
            <th class="text-end">${t('labels.count')}</th>
            <th class="text-end">${t('labels.perc')}</th>
          </tr>
        </thead>
        <tbody>`

  for (const e of freq) {
    const percentage = ((e.cnt / totalNgrams) * 100).toFixed(2)
    html += `
      <tr>
        <td>${e.ngram}</td>
        <td class="text-end">${e.cnt}</td>
        <td class="text-end">${percentage}%</td>
      </tr>`
  }

  html += "</tbody></table></div>"
  result.value = html

  // Recursively find missing combinations if requested
  if (showmissing.value) {
    result.value += `<div class='mt-2'><b>${t('freqanal.missing')}</b><br>`
    cntmissing = 0
    findMissing(freq, "", 0, nSize)
    result.value += "</div>"
  }
}

// --- Main Action ---
const genStats = () => {
  errormsg.value = ""
  result.value = ""
  
  if (!msg.value.trim()) {
    errormsg.value = t('errors.noinput')
    return
  }

  genNgrams(size.value)
}
</script>

<!-- 
All language definitions 
But info and long should be global as they are used in menus and search 
-->
<i18n locale="en">
{
  "freqanal": {
    "size" : "Size of n-gram",
    "slide" : "Slide (ABCDE => AB, BC, CD, DE)",
    "bound" : "Respect word boundaries",
    "showmissing" : "Show missing n-grams (max 1000)",
    "numfound" : "Number of n-grams found: ",
    "nummissing" : "Number of n-grams missing: ",
    "missing": "Missing n-grams"
  }
}
</i18n>

<i18n locale="nl">
{
  "freqanal": {
    "size" : "Lengte n-gram",
    "slide" : "Verschuif (ABCDE => AB, BC, CD, DE)",
    "bound" : "Analyseer losse woorden",
    "showmissing" : "Toon ontbrekende n-grams (max 1000)",
    "numfound" : "Aantal gevonden n-grams: ",
    "nummissing" : "Aantal ontbrekende n-grams: ",
    "missing": "Ontbrekende n-grammen"
  }
}
</i18n>