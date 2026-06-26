<template>

   <header class="page-header">
    <h1>{{ t('segment.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <VCard :title="t('labels.intro')" :initialOpen="startOpen">
      <div v-html="t('segment.long')" />
      <img width="400px" max-width="100%"src="~@\assets\images\segment2.png">
    </VCard>
    <VCard :title="t('labels.settings')">
      <div class="radio-group mb-2">
        <label>{{ t('segment.segsize') }}</label>
        <div class="radio-options-vertical">
          <label class="radio-item">
            <input type="radio" value="0" v-model="seg">
            <span class="radio-mark"></span> 7 Segment display
          </label>
          <label class="radio-item">
            <input type="radio" value="1" v-model="seg">
            <span class="radio-mark"></span> 14 Segment display
          </label>
          <label class="radio-item">
            <input type="radio" value="2" v-model="seg">
            <span class="radio-mark"></span> 16 Segment display
          </label>
        </div>
      </div>
      <div class="radio-group mb-2">
        <label>{{ t('segment.input') }}</label>
        <div class="radio-options-vertical">
          <label class="radio-item">
            <input type="radio" value="1" v-model="inp">
            <span class="radio-mark"></span> {{ t('segment.letters') }}
          </label>
          <label class="radio-item">
            <input type="radio" value="3" v-model="inp">
            <span class="radio-mark"></span> {{ t('segment.binary') }}
          </label>
          <label class="radio-item">
            <input type="radio" value="2" v-model="inp">
            <span class="radio-mark"></span> {{ t('segment.numeric') }}
          </label>
          <label class="radio-item">
            <input type="radio" value="4" v-model="inp">
            <span class="radio-mark"></span> {{ t('segment.octal') }}
          </label>
          <label class="radio-item">
            <input type="radio" value="5" v-model="inp">
            <span class="radio-mark"></span> {{ t('segment.hexa') }}
        </label>
        </div>
      </div>
      <label class="checkbox-container">
        <input type="checkbox" v-model="space">
        <span class="checkmark"></span>{{ t('segment.space') }}
      </label>
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
        @input="wordValue"
      />
      <p
        v-show="errormsg"
        class="errormsg mb-2"
      >
        {{ errormsg }}.
      </p>
      <div class="button-row">
        <button id="enc" class="btn btn-primary" @click="encodeSeg">
          {{ t('buttons.encode') }}
        </button>
        <button id="dec" class="btn btn-primary" @click="decodeSeg">
          {{t('buttons.decode')}}
        </button>
      </div>
    </VCard>
    <VCard :title="t('labels.result')">
        <div v-if="result" v-html="result" />
    </VCard>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import VCard from '@/components/generic/VCard.vue'

defineOptions({
  name: 'SegmentCode'
})

const { t } = useI18n()

// --- Static Data (Non-reactive) ---
const SEG_DEF = [
  {
    letters: ["A", "B", "C", "D", "E", "F", "G"],
    regex: "(A|B|C|D|E|F|G)",
    len: 7
  },
  {
    letters: ["A", "B", "C", "D", "E", "F", "G1", "G2", "H", "I", "J", "K", "L", "M"],
    regex: "(A|B|C|D|E|F|G1|G2|H|I|J|K|L|M)",
    len: 14
  },
  {
    letters: ["A1", "A2", "B", "C", "D1", "D2", "E", "F", "G1", "G2", "H", "I", "J", "K", "L", "M"],
    regex: "(A1|A2|B|C|D1|D2|E|F|G1|G2|H|I|J|K|L|M)",
    len: 16
  }
]

const MAP_SEG = [
  ["ABCDEF", "ABCDEFJM", "A1A2BCD1D2EFJM", "0"],
  ["BC", "BC", "BC", "1"],
  ["ABDEG", "ABDEG1G2", "A1A2BD1D2EG1G2", "2"],
  ["ABCDG", "ABCDG1G2", "A1A2BCD1D2G1G2", "3"],
  ["BCFG", "BCFG1G2", "BCFG1G2", "4"],
  ["ACDFG", "ACDFG1G2", "A1A2CD1D2FG1G2", "5"],
  ["ACDEFG", "ACDEFG1G2", "A1A2CD1D2EFG1G2", "6"],
  ["ABCF", "ABCF", "A1A2BCF", "7"],
  ["ABCDEFG", "ABCDEFG1G2", "A1A2BCD1D2EFG1G2", "8"],
  ["ABCDFG", "ABCDFG1G2", "A1A2BCD1D2FG1G2", "9"],
  ["ABCEFG", "ABCEFG1G2", "A1A2BCFG1G2", "A"],
  ["CDEFG", "ABCDG2IL", "A1A2BCD1D2G2IL", "B"],
  ["DEG", "ADEF", "A1A2D1D2EF", "C"],
  ["BCDEG", "ABCDIL", "A1A2BCD1D2IL", "D"],
  ["ADEFG", "ADEFG1G2", "A1A2D1D2EFG1G2", "E"],
  ["AEFG", "AEFG1G2", "A1A2EFG1G2", "F"],
  ["ACDEF", "ACDEFG2", "A1A2CD1EFG2", "G"],
  ["CEFG", "BCEFG1G2", "BCEFG1G2", "H"],
  ["C", "ADIL", "A1A2D1D2IL", "I"],
  ["BCDE", "BCDE", "BCD1D2E", "J"],
  ["ACEFG", "EFG1JK", "EFG1JK", "K"],
  ["DEF", "DEF", "D1D2EF", "L"],
  ["ABCEF", "BCEFHJL", "BCEFHJL", "M"],
  ["CEG", "BCEFHK", "BCEFHK", "N"],
  ["CDEG", "ABCDEF", "A1A2BCD1D2EF", "O"],
  ["ABEFG", "ABEFG1G2", "A1A2BEFG1G2", "P"],
  ["ABCFG", "ABCDEFK", "A1A2BCD1D2EFK", "Q"],
  ["EG", "ABEFG1G2K", "A1A2BEFG1G2K", "R"],
  ["CDFG", "ACDFG1G2HK", "A1A2CD1D2FG1G2HK", "S"],
  ["DEFG", "AIL", "A1A2IL", "T"],
  ["CDE", "BCDEF", "BCD1D2EF", "U"],
  ["BCDEF", "EFJM", "EFJM", "V"],
  ["BCDEFG", "BCEFIKM", "BCEFIKM", "W"],
  ["BCEFG", "HJKM", "HJKM", "X"],
  ["BCDFG", "HJL", "HJL", "Y"],
  ["ABDE", "ADJM", "A1A2D1D2JM", "Z"],
  ["ABFG", "ABFG1G2", "A1A2BFG1G2", "°"],
  ["BC", "BCJ", "BCJ", "1"],
  ["ABCDG", "ABCDG2", "A1A2BCD1D2G2", "3"],
  ["ABC", "ABC", "A1A2BC", "7"],
  ["ABC", "AJM", "A1A2JM", "7"],
  ["ABC", "AJL", "A1A2JL", "7"]
]

// --- Reactive State ---
const message = ref("")
const result = ref("")
const errormsg = ref("")
const space = ref(true)
const seg = ref(0)
const inp = ref(1)
const startOpen = window.innerWidth > 768;

// --- Template Ref ---
const messageInput = ref(null)

onMounted(() => {
  messageInput.value?.focus()
})

// --- Helper Logic ---

const bin2Letters = (msg) => {
  let input = ""
  let bins = []
  const inputFormat = Number(inp.value)
  const segIndex = seg.value

  // Parse input into single codes
  switch (inputFormat) {
    case 2: bins = msg.match(/[0-9]+/g) || []; break
    case 3:
      const length = SEG_DEF[segIndex].len
      const binRegex = new RegExp(`[01]{${length}}`, 'g')
      bins = msg.match(binRegex) || []
      break
    case 4: bins = msg.match(/[0-7]+/g) || []; break
    case 5: bins = msg.match(/[0-9A-F]+/ig) || []; break
  }

  for (let s of bins) {
    const padLen = SEG_DEF[segIndex].len
    switch (inputFormat) {
      case 2: s = parseInt(s, 10).toString(2).padStart(padLen, '0'); break
      case 4: s = parseInt(s, 8).toString(2).padStart(padLen, '0'); break
      case 5: s = parseInt(s, 16).toString(2).padStart(padLen, '0'); break
    }

    let tmp = ""
    for (let c = 0; c < s.length; c++) {
      if (s[c] === '1') tmp += SEG_DEF[segIndex].letters[c]
    }

    if (tmp === "" && space.value && inputFormat !== 1) {
      input += "SPACE "
    } else {
      input += tmp + " "
    }
  }

  return input.slice(0, -1)
}

const letters2Bin = (msg) => {
  let input = ""
  const segIndex = seg.value
  const inputFormat = Number(inp.value)
  const regex = new RegExp(SEG_DEF[segIndex].regex, "g")

  const bins = msg.split(/\s+/g)

  for (let b of bins) {
    let ltrs = (b === "SPACE") ? [] : (b.match(regex) || [])
    let tmp = ""

    for (let l of SEG_DEF[segIndex].letters) {
      tmp += ltrs.includes(l) ? "1" : "0"
    }

    switch (inputFormat) {
      case 2: input += parseInt(tmp, 2).toString(10) + " "; break
      case 3: input += tmp + " "; break
      case 4: input += parseInt(tmp, 2).toString(8) + " "; break
      case 5: input += parseInt(tmp, 2).toString(16).padStart(2, "0") + " "; break
    }
  }

  return input.slice(0, -1)
}

// --- Main Actions ---

const decodeSeg = () => {
  errormsg.value = ""
  result.value = ""

  const msg = Number(inp.value) === 1 ? message.value : bin2Letters(message.value)
  const regex = new RegExp(SEG_DEF[seg.value].regex, "g")

  try {
    let words = msg.toUpperCase().match(/([A-M12]+)|(SPACE)/g)
    if (!words) {
      errormsg.value = t('errors.cannotparse')
      return
    }

    let decodedResult = ""
    for (let w of words) {
      if (w === "SPACE") {
        decodedResult += " "
        continue
      }

      let segments = w.match(regex)
      if (!segments) {
        errormsg.value += w + " "
        continue
      }

      const sortedSegments = segments.sort().join("")
      const found = MAP_SEG.find(s => s[seg.value] === sortedSegments)

      if (!found) {
        errormsg.value += w + " "
      } else {
        decodedResult += found[3]
      }
    }

    result.value = decodedResult
    if (errormsg.value) {
      errormsg.value = `${t('errors.unknowninput')}: ${errormsg.value}`
    }
  } catch (e) {
    console.error(e)
    errormsg.value = e.message || e
  }
}

const encodeSeg = () => {
  errormsg.value = ""
  result.value = ""
  let tempstr = ""
  const inputFormat = Number(inp.value)

  try {
    for (let i = 0; i < message.value.length; i++) {
      const char = message.value[i]

      if (char === " ") {
        if (space.value && inputFormat > 1) tempstr += "SPACE "
        continue
      }

      const found = MAP_SEG.find(a => a[3] === char.toUpperCase())
      if (found) tempstr += found[seg.value] + " "
    }

    tempstr = tempstr.slice(0, -1)
    if (inputFormat > 1) {
      result.value = letters2Bin(tempstr)
    } else {
      result.value = tempstr
    }
  } catch (e) {
    console.error(e)
    errormsg.value = t('errors.generic')
  }
}
</script>

<style scoped>
img { max-width: 100%; max-height: 200px; display: block; margin: 0 auto; }
</style>

<!-- 
All language definitions 
But info and long should be global as they are used in menus and search 
-->
<i18n locale="en">
{
  "segment": {
    "segsize": "Number of segments",
    "input": "Segments as letters or as binary",
    "letters": "Letter notation",
    "binary": "Binary notation",
    "numeric": "Numeric notation (0-9)",
    "octal": "Octal notation (0-7)",
    "hexa": "Hexadecimal notation (0-9A-F)",
    "space": "Space is all segments off"
  }
}
</i18n>

<i18n locale="nl">
{
  "segment": {
    "segsize": "Aantal segmenten",
    "input": "Segmenten notatie letters of binair",
    "letters": "Letternotatie",
    "binary": "Binaire notatie",
    "numeric": "Numerieke notatie (0-9)",
    "octal": "Octale notatie (0-7)",
    "hexa": "Hexadecimale notatie (0-9A-F)",
    "space": "Spatie is alle segmenten uit"
  }
}
</i18n>