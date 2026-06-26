<template>
  <header class="page-header">
    <h1>{{ t('dnacode.title') }}</h1>
  </header>

  <div class="card-grid mb-2">
    <div class="card-stack">
      <!-- Intro Card -->
      <VCard :title="t('labels.intro')" :initialOpen="startOpen">
        <div v-html="t('dnacode.long')" />
      </VCard>

      <!-- Table Card -->
      <VCard :title="t('dnacode.title')">
        <VTable
          :phsearch="phsearch"
          :defsearch="defsearch"
          :fieldsep="fieldsep"
          :cols="cols"
          :rows="rows"
          @update:results="handleResults"
          @update:error="handleError"
          @reset="handleReset"
        />
      </VCard>
    </div>

    <!-- Results Card (Displays search output emitted from VTable) -->
    <div class="card-stack">
      <VCard  :title="t('labels.result')">
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
  name: 'DNACode'
})

const { t } = useI18n()

// --- Local State for Emitted Data ---
const formattedResult = ref("")
const tableError = ref("")
const startOpen = window.innerWidth > 768;

// Settings
const phsearch = computed(() => t('dnacode.ph'))
const defsearch = 3 // Default to RNA search
const fieldsep = " | "

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

// --- DNA or RNA Codon Columns ---
const cols = computed(() => [
  { 
    field: "letter", 
    label: t('dnacode.letter'), 
    sortable: true, 
    width: "5%",
    parseCol: (s) => s.match(/([A-Za-z]{1})[\s]*/g)
  },
  { 
    field: "abbr", 
    label: t('dnacode.abbr'), 
    sortable: true, 
    width: "10%",
    parseCol: (s) => s.match(/([A-Za-z]{3})[\s]*/g)
  },
  { 
    field: "aminoacid", 
    label: t('dnacode.aminoacid'), 
    sortable: true, 
    width: "20%" 
  },
  { 
    field: "RNA", 
    label: t('dnacode.rna'), 
    sortable: true, 
    width: "35%",
    parseCol: (s) => s.toUpperCase().match(/([A-Z]{3})[\s]*/g),
    matchCol: (c) => rows.findIndex((e) => e.RNA.includes(c.trim().toUpperCase()))
  },
  { 
    field: "DNA", 
    label: t('dnacode.dna'), 
    sortable: true, 
    width: "35%",
    parseCol: (s) => s.toUpperCase().match(/([A-Z]{3})[\s]*/g),
    matchCol: (c) => rows.findIndex((e) => e.DNA.includes(c.trim().toUpperCase()))
  }
])

// --- Data Rows ---
const rows = [
  { letter: "A", abbr: "Ala", aminoacid: "Alanine", RNA: "GCU, GCC, GCA, GCG, GCN", DNA: "GCT, GCC, GCA, GCG, GCN"},
  { letter: "R", abbr: "Arg", aminoacid: "Arginine", RNA: "CGU, CGC, CGA, CGG, AGA, AGG, CGN, AGR, CGY, MGR", DNA: "CGT, CGC, CGA, CGG, AGA, AGG, CGN, AGR, CGY, MGR"},
  { letter: "N", abbr: "Asn", aminoacid: "Asparagine", RNA: "AAU, AAC, AAY", DNA: "AAT, AAC, AAY"},
  { letter: "D", abbr: "Asp", aminoacid: "Aspartic acid", RNA: "GAU, GAC, GAY", DNA: "GAT, GAC, GAY"},
  { letter: "B", abbr: "Asn or Asp", aminoacid: "Asn or Asp", RNA: "AAU, AAC, GAU, GAC, RAY", DNA: "AAT, AAC, GAT, GAC, RAY"},
  { letter: "C", abbr: "Cys", aminoacid: "Cysteine", RNA: "UGU, UGC, UGY", DNA: "TGT, TGC, TGY"},
  { letter: "Q", abbr: "Gln", aminoacid: "Glutamine", RNA: "CAA, CAG, CAR", DNA: "CAA, CAG, CAR"},
  { letter: "E", abbr: "Glu", aminoacid: "Glutamic acid", RNA: "GAA, GAG, GAR", DNA: "GAA, GAG, GAR"},
  { letter: "Z", abbr: "Gln or Glu", aminoacid: "Gln or Glu", RNA: "CAA, CAG, GAA, GAG, SAR", DNA: "CAA, CAG, GAA, GAG, SAR"},
  { letter: "G", abbr: "Gly", aminoacid: "Glycine", RNA: "GGU, GGC, GGA, GGG, GGN", DNA: "GGT, GGC, GGA, GGG, GGN"},
  { letter: "H", abbr: "His", aminoacid: "Histidine", RNA: "CAU, CAC, CAY", DNA: "CAT, CAC, CAY"},
  { letter: "-", abbr: "Start", aminoacid: "Start", RNA: "AUG", DNA: "ATG"},
  { letter: "I", abbr: "Ile", aminoacid: "Isoleucine", RNA: "AUU, AUC, AUA, AUH", DNA: "ATT, ATC, ATA, ATH"},
  { letter: "L", abbr: "Leu", aminoacid: "Leucine", RNA: "CUU, CUC, CUA, CUG, UUA, UUG, CUN, UUR, CUY, YUR", DNA: "CTT, CTC, CTA, CTG, TTA, TTG, CTN, TTR, CTY, YTR"},
  { letter: "K", abbr: "Lys", aminoacid: "Lysine", RNA: "AAA, AAG, AAR", DNA: "AAA, AAG, AAR"},
  { letter: "M", abbr: "Met", aminoacid: "Methionine", RNA: "AUG", DNA: "ATG"},
  { letter: "F", abbr: "Phe", aminoacid: "Phenylalanine", RNA: "UUU, UUC, UUY", DNA: "TTT, TTC, TTY"},
  { letter: "P", abbr: "Pro", aminoacid: "Proline", RNA: "CCU, CCC, CCA, CCG, CCN", DNA: "CCT, CCC, CCA, CCG, CCN"},
  { letter: "S", abbr: "Ser", aminoacid: "Serine", RNA: "UCU, UCC, UCA, UCG, AGU, AGC, UCN, AGY", DNA: "TCT, TCC, TCA, TCG, AGT, AGC, TCN, AGY"},
  { letter: "T", abbr: "Thr", aminoacid: "Threonine", RNA: "ACU, ACC, ACA, ACG, ACN", DNA: "ACT, ACC, ACA, ACG, ACN"},
  { letter: "W", abbr: "Trp", aminoacid: "Thryptophan", RNA: "UGG", DNA: "TGG"},
  { letter: "Y", abbr: "Tyr", aminoacid: "Tyrosine", RNA: "TAT, TAC, TAY", DNA: "TAT, TAC, TAY"},
  { letter: "V", abbr: "Val", aminoacid: "Valine", RNA: "GUU, GUC, GUA, GUG, GUN", DNA: "GTT, GTC, GTA, GTG, GTN"},
  { letter: "-", abbr: "Stop", aminoacid: "Stop", RNA: "UAA, UGA, UAG, URA, UAR", DNA: "TAA, TGA, TAG, TRA, TAR"},
]
</script>

<i18n locale="en">
{
  "dnacode": {
    "ph": "Type searches, e.g. three letter RNA codes",
    "letter": "Letter",
    "abbr": "Abbr.",
    "aminoacid": "Amino acid",
    "rna": "RNA codons",
    "dna": "DNA codons"
  }
}
</i18n>

<i18n locale="nl">
{
  "dnacode": {
    "ph": "Type zoektermen, bijvoorbeeld 3-letter RNA codons",
    "letter": "Letter",
    "abbr": "Afk.",
    "aminoacid": "Aminozuur",
    "rna": "RNA codons",
    "dna": "DNA codons"
  }
}
</i18n>