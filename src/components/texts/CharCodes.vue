<template>
  <header class="page-header">
    <h1>{{ t('charcodes.title') }}</h1>
  </header>
  
  <div class="card-grid mb-2">
    <VCard :title="t('labels.intro')" :initialOpen="startOpen">
      <div v-html="t('charcodes.long')" />
    </VCard>

    <VCard :title="t('labels.settings')">
      <div class="form-horizontal">
      <label>{{ t('charcodes.input') }}</label>
      <CustomDropdown
        :options="codeOptions"
        v-model="selectedcode"
      />
    </div>
    <div class="form-horizontal">
        <label>{{ t('charcodes.output') }}</label>
        <CustomDropdown
          :options="codeOptions"
          v-model="selectedoutput"
        />
      </div>
    </VCard>
  </div>
  <div class="card-grid mb-2">
    <VCard :title="t('labels.input')">
      <textarea
        ref="messageInput"
        v-model="message"
        :placeholder="t('labels.message')"
        rows="5"
      />
      <p v-show="errormsg" class="errormsg mb-2 mt-2">
        {{ errormsg }}
      </p>          
    </VCard>

    <VCard :title="t('labels.result')"">
      <div
        v-if="result"
        class="resultbox"
      >
        {{ result }}
      </div>
    </VCard>
  </div>
  <div class="card-grid">
    <VCard :title="t('charcodes.someinfo')">
      <div class="card-body">
        <div v-html="t('charcodes.someinfo2')" />
      </div>
    </VCard>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import CustomDropdown from '@/components/generic/CustomDropdown.vue'
import VCard from '@/components/generic/VCard.vue'
import * as baudotcode from '@/scripts/baudotcode.js'
import * as codepages from '@/scripts/codepages.js'
import { codePoints, fromCodePoint } from 'utf16-char-codes'

defineOptions({
  name: 'CharCodes'
})

const { t } = useI18n()

// Reactive State
const message = ref("")
const selectedcode = ref("Decimal")
const selectedoutput = ref("UTF16")
const messageInput = ref(null)
const startOpen = window.innerWidth > 768;

const codeOptions = [
  { label: 'Text (UTF8/UTF16)', value: 'UTF16' },
  { label: '--- Numbers ---', disabled: true },
  { label: 'Binary (0,1)', value: 'Binary' },
  { label: 'Octal (0-7)', value: 'Octal' },
  { label: 'Decimal (0-9)', value: 'Decimal' },
  { label: 'Hexadecimal (0-F)', value: 'Hexadecimal' },
  { label: '--- Older codepages & alt codes ---', disabled: true },
  { label: 'Text Ascii', value: 'ASCII' },
  { label: 'Windows Western European (CP1252)', value: 'CP1252' },
  { label: 'Original IBM Hardware (CP437)', value: 'CP437' },
  { label: 'MS DOS Western European(CP850)', value: 'CP850' },
  { label: 'MS DOS Eastern European (CP852)', value: 'CP852' },
  { label: 'MS DOS Turkish codepage (CP857)', value: 'CP857' },
  { label: 'MS DOS Cyrillic codepage (CP866)', value: 'CP866' },
  { label: 'Atari ASCII variant (ATASCII)', value: 'ATASCII' },
  { label: 'EBCDIC character set', value: 'EBCDIC' },
  { label: '--- Telegraphy & telex ---', disabled: true },
  { label: 'Baudot code (ITA-1)', value: 'Baudotcode' },
  { label: 'Baudot code (ITA-1) - reversed', value: 'BaudotcodeR' },
  { label: 'Murray code (ITA-2)', value: 'Murraycode' },
  { label: 'Murray code (ITA-2) - reversed', value: 'MurraycodeR' },
  { label: 'Murray Cyrillic (MTK-2)', value: 'MurrayMTK2' },
  { label: 'Murray Cyrillic (MTK-2) - reversed', value: 'MurrayMTK2R' }
]

onMounted(() => {
  messageInput.value?.focus()
})

// --- Internal Logic Helpers ---

const getMany = (s) => {
  return [
    "Baudotcode", "BaudotcodeR", "Murraycode", "MurraycodeR",
    "MurrayMTK2", "MurrayMTK2R", "Binary", "Octal", "Decimal", "Hexadecimal"
  ].includes(s)
}

const inputToDecimal = (w) => {
  switch (selectedcode.value) {
    case "Baudotcode": return baudotcode.baudotCodeToASCII(w)
    case "BaudotcodeR": return baudotcode.baudotReversedCodeToASCII(w)
    case "Murraycode": return baudotcode.murrayCodeToASCII(w)
    case "MurraycodeR": return baudotcode.murrayReversedCodeToASCII(w)
    case "MurrayMTK2": return baudotcode.murrayMTK2ToASCII(w)
    case "MurrayMTK2R": return baudotcode.murrayMTK2ReversedCodeToASCII(w)
    case "UTF16": return codePoints(w)[0]
    case "Binary": return parseInt(w, 2)
    case "Octal": return parseInt(w, 8)
    case "Decimal": return parseInt(w)
    case "Hexadecimal": return parseInt(w, 16)
    default: {
      const cp = codepages.findCodepage(selectedcode.value)
      if (cp >= 0) return codepages.charToCode(w, cp)
      throw new Error('generic')
    }
  }
}

const decimalToOutput = (w) => {
  if (w === -1) return ""
  switch (selectedoutput.value) {
    case "Baudotcode": return baudotcode.baudotASCIIToCode(w)
    case "BaudotcodeR": return baudotcode.baudotReversedASCIIToCode(w)
    case "Murraycode": return baudotcode.murrayASCIIToCode(w)
    case "MurraycodeR": return baudotcode.murrayReversedASCIIToCode(w)
    case "MurrayMTK2": return baudotcode.murrayMTK2ASCIIToCode(w)
    case "MurrayMTK2R": return baudotcode.murrayMTK2ReversedASCIIToCode(w)
    case "UTF16": return [fromCodePoint(w)]
    case "Binary": return [w.toString(2)]
    case "Octal": return [w.toString(8)]
    case "Decimal": return [w.toString(10)]
    case "Hexadecimal": return [w.toString(16)]
    default: {
      const cp = codepages.findCodepage(selectedoutput.value)
      if (cp >= 0) return [codepages.codeToChar(parseInt(w), cp)]
      throw new Error('generic')
    }
  }
}

// --- Computed Properties ---

/**
 * We calculate both result and error in one computed object 
 * to ensure they are always in sync and the loop only runs once.
 */
const translationData = computed(() => {
  const inputString = message.value.trim()
  
  // Reset internal library state
  baudotcode.reset()

  try {
    let words
    if (!getMany(selectedcode.value)) {
      words = inputString.match(/./gu) || []
    } else {
      words = inputString.split(/[,.\s]+/g)
    }

    let outputBuilder = ""
    for (const word of words) {
      if (!word) continue
      const decimalValue = inputToDecimal(word)
      const convertedParts = decimalToOutput(decimalValue)
      convertedParts.forEach(part => {
        outputBuilder += part + " "
      })
    }

    return { 
      result: outputBuilder.trim(), 
      error: "" 
    }
  } catch (e) {
    console.error(e)
    return { 
      result: "", 
      error: e.message === 'generic' ? t('errors.generic') : t('errors.invalidinput')
    }
  }
})

// Flattened for use in the template
const result = computed(() => translationData.value.result)
const errormsg = computed(() => translationData.value.error)

</script>

<i18n locale="en">
{
  "charcodes": {
    "input": "Type of input",
    "output": "Requested output",
    "someinfo": "Information on character codes",
    "someinfo2": "<p>Computers are binary, they only know 0 and 1. These can be converted into a decimal numbers of course. This tool also accepts octal, decimal and hexadecimal which are all common among computer programmers. As a bonus the tool converts between these number bases as well. These numbers are used to lookup the right character (glyph in nerd speak) in the so-called codepage.</p><p>The very first computer codepage was ASCII and it has been around ever since. It is a subset of the codepages in MS DOS and Windows and is also a subset of UTF. ASCII only had 7-bits (128 characters) available. The codepages from Microsoft used 8 bits (e.g. CP437, CP850, CP1252), 256 characters. In languages with other characters different codepages had to be used. With the introduction of UTF-8/16 this changed. With only one codepage there is enough room to support all characters on earth, as well as emoji's ;-). <strong>Alt codes</strong>: depending on the version of MS DOS or MS Windows and the installed codepage typing the numbers on the numeric keypad with the Alt-key down produced a special character.</p><p>For a history of all the characters sets used in information systems see <a href='https://en.wikipedia.org/wiki/List_of_information_system_character_sets'>Wikipedia's history of information system character sets</a>. See <a href='https://en.wikipedia.org/wiki/Code_page'>Wikipedia codepages</a> for an overview of all the codepages that ever existed.</p><p>In pre computer days telegraph and telex also used binary representations, which are called the Baudot code (ITA-1) and the Murray code (ITA-2). The bits are in the order 54321 normally and in the order 12345 for the reversed codes. There is also a Russin version known as MTK-2. More info see <a href='https://en.wikipedia.org/wiki/Baudot_code>Wikipedia</a>.</p>"
  }
}
</i18n>

<i18n locale="nl">
{
  "charcodes": {
    "input": "Type invoer",
    "output": "Gewenste uitvoer",
    "someinfo": "Informatie over codepages",
    "someinfo2": "<p>Computers zijn binair, ze gebruiken alleen 0 en 1. Deze getallen kunnen natuurlijk ook worden omgezet naar decimaal, octaal of hexadecimaal. Deze tool accepteert ze allemaal en converteert desgewenst. De nummers worden gebruikt om het juiste karakter (glyph in nerd speak) op te zoeken in een codepage.</p><p>De allereerste codepage was ASCII en deze is nog steeds in gebruik. Het is nu een subset van UTF, en is ook een subset van de codepages die gebruikt werden in MS DOS en MS Windows. ASCII gebruikt slechts 7-bits (128 karakters). De codepages van Microsoft gebruiken 8 bits (zoals CP437, CP850, CP1252), 256 characters. Voor talen met andere karakters (Russich, Chinees, Oost Europese talen) moest een andere codepage gebruikt worden. Met de introductie van UTF kan dezelfde codepage gebruikt worden voor alle talen en ook voor emoji's ;-). <strong>Alt codes</strong>: afhankelijk van de versie van MS DOS of MS Windows en geïnstalleerde codepage kan door het intikken van getallen op het numerieke toetsenbord in combinatie met de Alt-toets en code worden ingevoerd, resulterend in een speciaal karakter.</p><p>Voor een geschiedenis van alle codepages zie <a href='https://en.wikipedia.org/wiki/List_of_information_system_character_sets'>Wikipedia's history of information system character sets</a> en <a href='https://en.wikipedia.org/wiki/Code_page'>Wikipedia codepages</a>.</p><p>In de tijden van telegraaf en telex werden er ook al binaire codes gebruikt zoals de Baudot code (ITA-1) en de Murray code (ITA-2). De tool converteert ook deze codes. De bits zijn normaal in de volgorde 54321, maar de omgekeerde volgorde 12345 komt ook voor. Er is ook een Cyrillische versie van de Murraycode genaamd MTK-2. Voor meer informatie <a href='https://en.wikipedia.org/wiki/Baudot_code>Wikipedia</a>.</p>"
  }
}
</i18n>