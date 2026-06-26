<template>
  <header class="page-header">
    <h1>{{ t('usastates.title') }}</h1>
  </header>

  <div class="card-grid mb-2">
    <div class="card-stack">
      <!-- Intro Card -->
      <VCard :title="t('labels.intro')" :initialOpen="startOpen">
        <div v-html="t('usastates.long')" />
      </VCard>

      <!-- Table Card -->
      <VCard :title="t('usastates.title')">
        <VTable
          :phsearch="phsearch"
          :defsearch="defsearch"
          :cols="cols"
          :rows="rows"
          @update:results="handleResults"
          @update:error="handleError"
          @reset="handleReset"
        />
      </VCard>
      <VCard :title="t('labels.result')">
        <div v-if="formattedResult" class="resultbox" v-html="formattedResult" />
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import VTable from '@/components/generic/VTable.vue'
import VCard from '@/components/generic/VCard.vue'

defineOptions({
  name: 'UsaStates'
})

const { t } = useI18n()

// --- Local State for Emitted Data ---
const formattedResult = ref("")
const tableError = ref("")
const defsearch = 1 // Default to 'Code' column
const startOpen = window.innerWidth > 768;

// Placeholder for the search box
const phsearch = computed(() => t('usastates.ph'))

// --- Event Handlers for VTable ---
const handleResults = (data) => {
  formattedResult.value = data.html
  tableError.value = ""
}

const handleError = (msg) => {
  tableError.value = msg
  formattedResult.value = ""
}

const handleReset = () => {
  formattedResult.value = ""
  tableError.value = ""
}

// --- USA States Column Definition ---
const cols = computed(() => [
  { 
    field: "flag", 
    label: t('usastates.flag'), 
    sortable: false, 
    width: "7%",
    image: {
      src: (row) => {
        const fileName = row.code.toLowerCase() + '.png'
        return new URL(`../../assets/usflags/${fileName}`, import.meta.url).href
      },
      width: "30",
      height: "20"
    }
  },
  { 
    field: "code", 
    label: t('usastates.code'), 
    sortable: true, 
    width: "7%",
    parseCol: (s) => s.match(/([A-Za-z]{2}[\s]*)/g)
  },
  { 
    field: "name", 
    label: t('usastates.name'), 
    sortable: true, 
    width: "30%",
    link: {
      href: (r) => {
        // Wikipedia specialized naming logic
        switch (r.name) {
          case "Georgia":
            return "https://en.wikipedia.org/wiki/Georgia_(U.S._state)"
          case "New York":
            return "https://en.wikipedia.org/wiki/New_York_(state)"
          case "Washington":
            return "https://en.wikipedia.org/wiki/Washington_(state)"
          default:
            return "https://en.wikipedia.org/wiki/" + r.name.replace(/\s+/g, '_')
        }
      }
    }
  },
  { 
    field: "num", 
    label: t('usastates.num'),
    sortable: { numsort: true },
    width: "7%"
  },
  { 
    field: "reps", 
    label: t('usastates.reps'),
    sortable: { numsort: true },
    width: "7%"
  },
  { 
    field: "area", 
    label: t('usastates.area'),
    sortable: { numsort: true },
    width: "7%"
  },
  { field: "cap", label: t('usastates.cap'), sortable: true, width: "30%" },
])

// --- USA States Data ---
const rows = [
  { code: "AL", name: "Alabama", reps: "7", num: "22", flag: "Flag", area: "30", cap: "Montgomery" },
  { code: "AK", name: "Alaska", reps: "1", num: "49", flag: "Flag", area: "1", cap: "Juneau" },
  { code: "AZ", name: "Arizona", reps: "9", num: "48", flag: "Flag", area: "6", cap: "Phoenix" },
  { code: "AR", name: "Arkansas", reps: "4", num: "25", flag: "Flag", area: "29", cap: "Little Rock" },
  { code: "CA", name: "California", reps: "53", num: "31", flag: "Flag", area: "3", cap: "Sacramento" },
  { code: "CO", name: "Colorado", reps: "7", num: "38", flag: "Flag", area: "8", cap: "Denver" },
  { code: "CT", name: "Connecticut", reps: "5", num: "5", flag: "Flag", area: "48", cap: "Hartford" },
  { code: "DE", name: "Delaware", reps: "1", num: "1", flag: "Flag", area: "49", cap: "Dover" },
  { code: "FL", name: "Florida", reps: "27", num: "27", flag: "Flag", area: "22", cap: "Tallahassee" },
  { code: "GA", name: "Georgia", reps: "14", num: "4", flag: "Flag", area: "24", cap: "Atlanta" },
  { code: "HI", name: "Hawaii", reps: "2", num: "50", flag: "Flag", area: "43", cap: "Honolulu" },
  { code: "ID", name: "Idaho", reps: "2", num: "43", flag: "Flag", area: "14", cap: "Boise" },
  { code: "IL", name: "Illinois", reps: "18", num: "21", flag: "Flag", area: "25", cap: "Springfield" },
  { code: "IN", name: "Indiana", reps: "9", num: "19", flag: "Flag", area: "38", cap: "Indianapolis" },
  { code: "IA", name: "Iowa", reps: "4", num: "29", flag: "Flag", area: "26", cap: "Des Moines" },
  { code: "KS", name: "Kansas", reps: "4", num: "34", flag: "Flag", area: "15", cap: "Topeka" },
  { code: "KY", name: "Kentucky", reps: "6", num: "15", flag: "Flag", area: "37", cap: "Frankfort" },
  { code: "LA", name: "Louisiana", reps: "6", num: "18", flag: "Flag", area: "31", cap: "Baton Rouge" },
  { code: "ME", name: "Maine", reps: "2", num: "23", flag: "Flag", area: "39", cap: "Augusta" },
  { code: "MD", name: "Maryland", reps: "8", num: "7", flag: "Flag", area: "42", cap: "Annapolis" },
  { code: "MA", name: "Massachusetts", reps: "9", num: "6", flag: "Flag", area: "44", cap: "Boston" },
  { code: "MI", name: "Michigan", reps: "14", num: "26", flag: "Flag", area: "11", cap: "Lansing" },
  { code: "MN", name: "Minnesota", reps: "8", num: "32", flag: "Flag", area: "12", cap: "Saint Paul" },
  { code: "MS", name: "Mississippi", reps: "4", num: "20", flag: "Flag", area: "32", cap: "Jackson" },
  { code: "MO", name: "Missouri", reps: "8", num: "24", flag: "Flag", area: "21", cap: "Jefferson City" },
  { code: "MT", name: "Montana", reps: "1", num: "41", flag: "Flag", area: "4", cap: "Helena" },
  { code: "NE", name: "Nebraska", reps: "3", num: "37", flag: "Flag", area: "16", cap: "Lincoln" },
  { code: "NV", name: "Nevada", reps: "4", num: "36", flag: "Flag", area: "7", cap: "Carson City" },
  { code: "NH", name: "New Hampshire", reps: "2", num: "9", flag: "Flag", area: "46", cap: "Concord" },
  { code: "NJ", name: "New Jersey", reps: "12", num: "3", flag: "Flag", area: "47", cap: "Trenton" },
  { code: "NM", name: "New Mexico", reps: "3", num: "47", flag: "Flag", area: "5", cap: "Santa Fe" },
  { code: "NY", name: "New York", reps: "27", num: "11", flag: "Flag", area: "27", cap: "Albany" },
  { code: "NC", name: "North Carolina", reps: "13", num: "12", flag: "Flag", area: "28", cap: "Raleigh" },
  { code: "ND", name: "North Dakota", reps: "1", num: "39", flag: "Flag", area: "19", cap: "Bismarck" },
  { code: "OH", name: "Ohio", reps: "16", num: "17", flag: "Flag", area: "34", cap: "Columbus" },
  { code: "OK", name: "Oklahoma", reps: "5", num: "46", flag: "Flag", area: "20", cap: "Oklahoma City" },
  { code: "OR", name: "Oregon", reps: "5", num: "33", flag: "Flag", area: "9", cap: "Salem" },
  { code: "PA", name: "Pennsylvania", reps: "18", num: "2", flag: "Flag", area: "33", cap: "Harrisburg" },
  { code: "RI", name: "Rhode Island", reps: "2", num: "13", flag: "Flag", area: "50", cap: "Providence" },
  { code: "SC", name: "South Carolina", reps: "7", num: "8", flag: "Flag", area: "40", cap: "Columbia" },
  { code: "SD", name: "South Dakota", reps: "1", num: "40", flag: "Flag", area: "17", cap: "Pierre" },
  { code: "TN", name: "Tennessee", reps: "9", num: "16", flag: "Flag", area: "36", cap: "Nashville" },
  { code: "TX", name: "Texas", reps: "36", num: "28", flag: "Flag", area: "2", cap: "Austin" },
  { code: "UT", name: "Utah", reps: "4", num: "45", flag: "Flag", area: "13", cap: "Salt Lake City" },
  { code: "VT", name: "Vermont", reps: "1", num: "14", flag: "Flag", area: "45", cap: "Montpelier" },
  { code: "VA", name: "Virginia", reps: "11", num: "10", flag: "Flag", area: "35", cap: "Richmond" },
  { code: "WA", name: "Washington", reps: "10", num: "42", flag: "Flag", area: "18", cap: "Olympia" },
  { code: "WV", name: "West Virginia", reps: "3", num: "35", flag: "Flag", area: "41", cap: "Charleston" },
  { code: "WI", name: "Wisconsin", reps: "8", num: "30", flag: "Flag", area: "23", cap: "Madison" },
  { code: "WY", name: "Wyoming", reps: "1", num: "44", flag: "Flag", area: "10", cap: "Cheyenne" }
]
</script>

<i18n locale="en">
{
  "usastates": {
    "ph": "Type searches divided by spaces, for state codes the spaces can be omitted",
    "flag": "Flag",
    "code": "ISO3166:2 code",
    "name": "State",
    "num": "Joined as",
    "reps": "US House reps",
    "area": "Area ranking",
    "cap": "Capital"
  }
}
</i18n>

<i18n locale="nl">
{
  "usastates": {
    "ph": "Voer zoektermen in gescheiden door spaties, voor ISO3166 codes kan de spatie achterwege blijven",
    "flag": "Vlag",
    "code": "ISO3166:2 code",
    "name": "Staat",
    "num": "Toetreding",
    "reps": "Huis reps",
    "area": "Opp. ranking",
    "cap": "Hoofdstad"
  }
}
</i18n>