<template>

 <header class="page-header">
    <h1>{{ t('decabit.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <VCard :title="t('labels.intro')">
      <div v-html="t('decabit.long')" />
    </VCard>
    <VCard :title="t('labels.settings')">
      <div class="radio-group mb-2">
        <label>{{ t('decabit.selenc') }}</label>
        <div class="radio-options-vertical">
          <label class="radio-item">
            <input type="radio" value="0" v-model="format">
            <span class="radio-mark"></span>  {{ t('decabit.selnum') }}
          </label>
          <label class="radio-item">
            <input type="radio" value="1" v-model="format">
            <span class="radio-mark"></span>  {{ t('decabit.selascii') }}
          </label>
          <label class="radio-item">
            <input type="radio" value="2" v-model="format">
            <span class="radio-mark"></span>  {{ t('decabit.selalpha') }}
          </label>
        </div>
      </div>
      <div class="radio-group">
        <label>{{ t('labels.selaction') }}</label>
        <div class="radio-options">
          <label class="radio-item">
            <input type="radio" value="encode" v-model="mode">
            <span class="radio-mark"></span>  {{ t('buttons.encode') }}
          </label>
          <label class="radio-item">
            <input type="radio" value="decode" v-model="mode">
            <span class="radio-mark"></span>  {{ t('buttons.decode') }}
          </label>
        </div>
      </div>
    </VCard>
  </div>
  <div class="card-grid mb-2">
    <VCard :title="t('labels.input')">
      <textarea
        class="mb-2"
        ref="messageInput"
        v-model="message"
        :placeholder="t('labels.message')"
        rows="5"
      />
      <p
        v-show="errormsg"
        class="errormsg mt-2"
      >
        {{ errormsg }}
      </p>
    </VCard>
    <VCard :title="t('labels.result')">
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
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import VCard from '@/components/generic/VCard.vue'

defineOptions({
  name: 'DecaBit'
})

const { t } = useI18n()

// --- Static Data ---
const DECABIT_TABLE = [
  "--+-+++-+-", "+--+++--+-", "+--++-+-+-", "+--+-++-+-", "----+++-++", "++--+++---", "++--++--+-", "++--+-+-+-",
  "++---++-+-", "---++++-+-", "+-+-+++---", "+-+-+-+-+-", "+-+--++-+-", "+---++-++-", "+---++--++", "--+++-++--",
  "---++-+++-", "+---+-++-+", "+--++--+-+", "+--++-+--+", "+-+++--+--", "+--+++-+--", "++--+-++--", "-+-++-++--",
  "+--++--++-", "+-+++-+---", "++-+--++--", "+-+-+-++--", "+--+-+++--", "+--+--++-+", "+-++-++---", "+-++-+-+--",
  "-+-+-++-+--", "+---++++--", "+-+--+-++-", "+++--++---", "+++--+-+--", "+++---++--", "++---+++--", "--+-++++--",
  "++--++-+--", "-+-+-+-++-", "++----+++-", "+----+-+++", "++---+-+-+", "++-+-+-+--", "++-+-+--+-", "+++----++-",
  "++--+--++-", "+--+-+-++-", "++++----+-", "++-++---+-", "+-+++---+-", "-++++---+-", "+-+-+---++", "+++-++----",
  "+++-+-+---", "+-+-+--++-", "-++-+--++-", "+++-+----+", "++++-+----", "-+++-++---", "-+-+-++-+-", "++---++--+",
  "++-+--+--+", "++-+++----", "++++--+---", "+--++++---", "-+-++++---", "++-+--+-+-", "-++---+++-", "+---+-+++-",
  "--+-+-+++-", "+----++++-", "--+--++++-", "+++---+-+-", "+-++---++-", "+--+--+++-", "--++--+++-", "+-+---+-++",
  "-+++--+-+-", "-+-++-+-+-", "-+++---++-", "-+-++--++-", "-+---++++-", "-++++--+--", "-++-++-+--", "--++++-+--",
  "--++-+++--", "--++-+-++-", "+-++++----", "--++++--+-", "--++-++-+-", "+--+-+--++", "+-++----++", "-+-+++--+-",
  "-++-+-+-+-", "-+--++-++-", "---+++-++-", "-+--+-+++-", "+---+++-+-", "-+--+++-+-", "+-+-++--+-", "+--++-++--",
  "++-++--+--", "+-++--++--", "+-+--+++--", "-++--+++--", "++---+-++-", "++-+---++-", "+++-+---+-", "+++-+--+--",
  "++-+-++---", "++-++-+---", "+-+---+++-", "+-++--+-+-", "-+-+--+++-", "-+++-+-+--", "+-++-+--+-", "-++-+++---",
  "+++--+--+-", "+++++-----", "-+++++----", "--+++++---", "---+++++--", "----+++++-", "++++++++++"
]

// --- State ---
const message = ref("")
const format = ref(0)
const mode = ref("encode") // 'encode' or 'decode'
const messageInput = ref(null)

onMounted(() => {
  messageInput.value?.focus()
})

// --- Computed Logic ---

const translation = computed(() => {
  let outputText = ""
  let errorMsg = ""
  const input = message.value

  if (!input) return { text: "", error: "" }

  try {
    if (mode.value === 'encode') {
      // ENCODING
      const words = format.value === 0 ? input.match(/[0-9]+/g) : input.match(/./g)

      if (!words) {
        return { text: "", error: t('errors.cannotparse') }
      }

      for (let w of words) {
        let idx = -1
        if (format.value === 0) {
          idx = parseInt(w)
        } else if (format.value === 1) {
          idx = w.charCodeAt(0)
        } else {
          idx = w.toUpperCase().charCodeAt(0) - "A".charCodeAt(0)
        }

        if (idx >= 0 && idx < DECABIT_TABLE.length) {
          outputText += DECABIT_TABLE[idx] + " "
        } else {
          errorMsg += t('errors.unknowninput') + w + " "
        }
      }
    } else {
      // DECODING
      const words = input.match(/[-+]{10}/g)

      if (!words) {
        return { text: "", error: t('errors.cannotparse') }
      }

      for (let w of words) {
        const idx = DECABIT_TABLE.indexOf(w)

        if (idx < 0) {
          errorMsg += t('errors.unknowninput') + w + " "
        } else {
          if (format.value === 0) {
            outputText += idx + " "
          } else if (format.value === 1) {
            outputText += String.fromCharCode(idx)
          } else {
            outputText += String.fromCharCode("A".charCodeAt(0) + idx)
          }
        }
      }
    }
  } catch (e) {
    console.error(e)
    errorMsg = t('error.generic')
  }

  return {
    text: outputText.trim(),
    error: errorMsg.trim()
  }
})

// Flattened for template
const result = computed(() => translation.value.text)
const errormsg = computed(() => translation.value.error)
</script>