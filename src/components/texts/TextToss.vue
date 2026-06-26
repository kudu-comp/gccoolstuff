<template>

  <header class="page-header">
    <h1>{{ t('texttoss.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <VCard :title="t('labels.intro')" :initialOpen="startOpen">
      <div v-html="t('texttoss.long')" />
    </VCard>
    <VCard :title="t('labels.settings')">
      <div class="radio-group">
        <label>{{ t('texttoss.mode') }}</label>
        <div class="radio-options-vertical">
          <label class="radio-item">
            <input type="radio" value="3" v-model="mode">
            <span class="radio-mark"></span> {{ t('texttoss.mode3') }}
          </label>
          <label class="radio-item">
            <input type="radio" value="2" v-model="mode">
            <span class="radio-mark"></span> {{ t('texttoss.mode2') }}
          </label>
          <label class="radio-item">
            <input type="radio" value="1" v-model="mode">
            <span class="radio-mark"></span> {{ t('texttoss.mode1') }}
          </label>
        </div>
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
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import VCard from '@/components/generic/VCard.vue'

defineOptions({ name: 'TextToss' })

const { t } = useI18n()

const message = ref("")
const result = ref("")
const mode = ref(3) // 3: Keep 1st & Last, 2: Keep 1st, 1: Keep none
const errormsg = ref("")
const messageInput = ref(null)
const startOpen = window.innerWidth > 768;

onMounted(() => messageInput.value?.focus())

watch([message, mode], () => {
  tossWords()
})

/**
 * Helper to shuffle an array of characters (Fisher-Yates algorithm)
 */
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }
  return array.join('')
}

const tossWords = () => {
  errormsg.value = ""
  result.value = ""

  try {
    // Regex: Group 1 is the word, Group 2 is the following punctuation/whitespace
    const regex = /([^\s;:.,?!'`"]+)([\s;:.,?!'`"]*)/gm
    let builder = ""
    
    const matches = message.value.matchAll(regex)

    for (const m of matches) {
      let word = m[1]
      const punctuation = m[2]
      
      // Determine how many characters to keep fixed at the start and end
      let fixedStart = 0
      let fixedEnd = 0

      if (mode.value === 3) {
        fixedStart = 1
        fixedEnd = 1
      } else if (mode.value === 2) {
        fixedStart = 1
        fixedEnd = 0
      }

      // Only shuffle if the word is long enough to have "middle" letters
      if (word.length > (fixedStart + fixedEnd)) {
        const start = word.slice(0, fixedStart)
        const end = fixedEnd > 0 ? word.slice(-fixedEnd) : ""
        
        // Extract the middle part, turn to array, shuffle, then join back
        const middle = word.slice(fixedStart, word.length - fixedEnd)
        const shuffledMiddle = shuffleArray(middle.split(''))
        
        word = start + shuffledMiddle + end
      }

      builder += word + punctuation
    }

    result.value = builder
  } catch (e) {
    errormsg.value = t('errors.generic')
    console.error(e)
  }
}
</script>

<i18n locale="en">
{
  "texttoss": {
    "mode": "Select how to toss words",
    "mode3": "Keep first and last letter (typoglycemia)",
    "mode2": "Keep first letter",
    "mode1": "Keep none of the letters"
  }
}
</i18n>

<i18n locale="nl">
{
  "texttoss": {
    "mode": "Selecteer wijze van woorden husselen",
    "mode3": "Behoud de eerste en de laatste letter (typoglycemia)",
    "mode2": "Behoud alleen de eerste letter",
    "mode1": "Hussel alle letters"
  }
}
</i18n>