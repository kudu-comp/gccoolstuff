<template>


  <header class="page-header">
    <h1>{{ t('textextractor.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')" :initialOpen="startOpen">
        <div v-html="t('textextractor.long')" />
      </VCard>
      <VCard :title="t('labels.input')">
        <div class="form-horizontal">
          <label>{{ t('labels.selectfile') }}</label>
          <input
            type="file"
            ref="fileInputRef"
            class="form-control"
            @change="selectFile"
          >
        </div>
        <p
          v-show="errormsg"
          class="card errormsg"
        >
          {{ errormsg }}
        </p>
      </VCard>
      <VCard :title="t('labels.settings')">
        <div class="form-horizontal">
          <label
          >{{ t('textextractor.length') }}</label>
          <input
            v-model="length"
            type="number"
          >
        </div>
        <div class="form-horizontal">
          <label
          >{{ t('textextractor.max') }}</label>
          <input
            v-model="max"
            type="number"
          >
        </div>
        <div class="form-horizontal">
          <label
          >{{ t('textextractor.start') }}</label>
          <input
            v-model="start"
            type="number"
          >
        </div>
        <div class="button-row">
          <button :disabled="!loaded" class="btn btn-primary" @click="scanFile()">
            {{ t('buttons.search') }}        
          </button>
        </div>
      </VCard>
    </div>
    <div class="card-stack">
      <VCard :title="t('labels.result')">
        <div class="resultbox table-responsive">
          <table class="p-table">
            <thead>
              <tr>
                <th>{{ t('textextractor.match') }}</th>
                <th>{{ t('textextractor.pos') }}</th>
                <th>{{ t('textextractor.text') }}</th>
              </tr>
            </thead>
            <tr class="flex-row d-flex" v-for="r in results" :key="r.id">
              <td>{{ r.id }}</td>
              <td>{{ r.at }}</td>
              <td>{{ r.text }}</td>
            </tr>
          </table>      
        </div>
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import VCard from '@/components/generic/VCard.vue'

defineOptions({
  name: 'TextExtractor'
})

const { t } = useI18n()

// --- Template Refs ---
const fileInput = ref(null)
const startOpen = window.innerWidth > 768;

// --- State ---
const result = ref(t('labels.result'))
const errormsg = ref("")
const loaded = ref(false)
const length = ref(8)
const max = ref(999)
const start = ref(0)
const results = ref([])
const a = ref(null) // Uint8Array buffer

onMounted(() => {
  fileInput.value?.focus()
})

// --- Methods ---

const scanFile = () => {
  errormsg.value = ""
  result.value = ""
  results.value = [] // Reset results list

  if (!a.value) {
    errormsg.value = t('textextractor.fileerror')
    return
  }

  try {
    let s = ""
    let cnt = 0
    const buffer = a.value

    for (let i = start.value; i < buffer.length; i++) {
      let c = buffer[i]
      
      // Check if character is in printable ASCII range (32 - 126)
      if (c >= 32 && c <= 126) {
        s += String.fromCharCode(c)
      } else {
        // If non-printable, check if we just finished a string of minimum length
        if (s.length >= length.value) {
          results.value.push({
            id: cnt.toString().padStart(3, "0"),
            at: (i - s.length).toString().padStart(6, "0"),
            text: s
          })
          cnt++
        }

        if (cnt > max.value) {
          errormsg.value = t('textextractor.maxexceeded')
          break
        }
        s = ""
      }
    }

    // Check if the last part of the file was a valid string
    if (s.length >= length.value && cnt <= max.value) {
      results.value.push({
        id: cnt.toString().padStart(3, "0"),
        at: (buffer.length - s.length).toString().padStart(6, "0"),
        text: s
      })
      cnt++
    }

    if (cnt === 0) {
      result.value = t('errors.noresult')
    }

  } catch (err) {
    console.error(err)
    errormsg.value = t('textextractor.fileerror')
  }
}

const selectFile = (event) => {
  errormsg.value = ""
  const input = event.target

  if (input.files && input.files[0]) {
    const reader = new FileReader()

    reader.onerror = () => {
      errormsg.value = t('errors.loadingfile')
    }

    reader.onloadend = (e) => {
      try {
        // Convert the ArrayBuffer to Uint8Array for byte-by-byte scanning
        a.value = new Uint8Array(e.target.result)
        loaded.value = true
        scanFile()
      } catch (err) {
        console.error(err)
        errormsg.value = t('textextractor.error')
      }
    }

    reader.readAsArrayBuffer(input.files[0])
  }
}
</script>
<style scoped>
td {
  overflow-wrap: break-word;
}</style>

<i18n locale="en">
{
  "textextractor": {
    "match": "Match",
    "pos": "Position",
    "text": "Text",
    "length": "Minimum string length",
    "max": "Maximum number of results",
    "start": "Start at position",
    "maxexceeded": "Maximum number of results found. Use start position to continue search.",
    "fileerror": "Error loading file."
  }
}
</i18n>

<i18n locale="nl">
{
  "textextractor": {
    "match": "Match",
    "pos": "Positie",
    "text": "Tekst",
    "length": "Minimale lengte",
    "max": "Maximaal aantal resultaten",
    "start": "Start op positie",
    "maxexceeded": "Maximaal aantal zoekresultaten bereikt. Om verder te zoeken gebruik startpositie.",
    "fileerror": "Fout tijdens het laden van de file"
  }
}
</i18n>