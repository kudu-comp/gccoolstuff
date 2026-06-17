<template>

  <header class="page-header">
    <h1>{{ t('alltools.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')">
        <div v-html="t('alltools.long')" />
      </VCard>
      <VCard :title="t('labels.search')">
        <v-search
          id="searchstr"
          v-model:search="searchstr"
          @keyup.enter="goSearch"
        />
        <div class="button-row">
          <button class="btn btn-primary" @click="goSearch" :title="t('buttons.search')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
          <button class="btn btn-primary" :title="t('buttons.reset')" @click="reset" >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/>
            </svg>
          </button>
          <button class="btn btn-primary" :title="t('buttons.collall')" @click="collapseList">
            {{ t('buttons.collall') }}
          </button>
          <button class="btn btn-primary" :title="t('buttons.expall')" @click="expandList">
            {{ t('buttons.expall') }}
          </button>
        </div>
        <!-- Error message -->
        <p
          v-if="errormsg"
          class="errormsg"
        >
          {{ errormsg }}
        </p>
      </VCard>
    </div>
    <div class="card-stack">
      <VCard :title="t('labels.result')">
        <!-- isVisible tools -->
         <TreeList 
          ref="listComponent" 
          :items="alltools" 
        />
      </VCard>
    </div>
  </div>
</template>

<script setup>

import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import VSearch from '@/components/generic/VSearch.vue'
import VCard from '@/components/generic/VCard.vue'
import TreeList from '@/components/generic/TreeList.vue';

// Script imports
import { codepages } from '@/scripts/codebook.js'
import { fontdefs } from '@/scripts/fontspecials.js'
import { ciphers as cipherData } from '@/scripts/ciphers.js'
import * as bf from '@/scripts/brainfuck.js'
import { sequences, numprops as numPropsData } from '@/scripts/mathtools.js'
import { piglatin } from "@/scripts/piglatin.js"

defineOptions({
  name: "AllTools"
})

const props = defineProps({
  s: {
    type: String,
    required: false,
    default: "code"
  }
})

const { t } = useI18n()
const route = useRoute()
const listComponent = ref(null);

// --- State ---
const errormsg = ref("")
const searchstr = ref("")
const codes = ref(null)
const fonts = ref(null)
const ciphers = ref(null)
const bfvars = ref(null)
const numprops = ref(null)
const seqs = ref(null)
const pigs = ref(null)

const alltools = ref([
  {
    link: "/helpcoord", name: t('menu.coordinates'), isVisible: true, expand: false,
    children : [
      { link: "/convert", name: "", isVisible: true },
      { link: "/project", name: "", isVisible: true },
      { link: "/mapmaker", name: "", isVisible: true },
      { link: "/incomplete", name: "", isVisible: true },
      { link: "/lines", name: "", isVisible: true },
      { link: "/triangles", name: "", isVisible: true },
      { link: "/circles", name: "", isVisible: true },
      { link: "/antipode", name: "", isVisible: true },
      { link: "/plotcoord", name: "", isVisible: true },
      { link: "/triangulation", name: "", isVisible: true },
      { link: "/revwherigo", name: "", isVisible: true }
    ],
  },
  {
    link: "/helptext", name: t('menu.texttools'), isVisible: true, expand: false,
    children: [
      { link: "/tryanswers", name: "", isVisible: true },
      { link: "/wordvalue", name: "", isVisible: true },
      { link: "/charcodes", name: "", isVisible: true },
      { link: "/analtxt", name: "", isVisible: true },
      { link: "/texttransform", name: "", isVisible: true },
      { link: "/texttonum", name: "", isVisible: true },
      { link: "/keyboards", name: "", isVisible: true },
      { link: "/texttoss", name: "", isVisible: true },
      { link: "/piglatin", name: "", isVisible: true, children: [] },
      { link: "/numerology", name: "", isVisible: true, children: [] },
      { link: "/textchunks", name: "", isVisible: true }
    ]
  },
  {
    link: "/helpcodes", name: t('menu.codes'), isVisible: true, expand: false,
    children: [
      { link: "/ciphers", name: "", isVisible: true, expand: false, children: [] },
      { link: "/rotciphers", name: "", isVisible: true },
      { link: "/substcipher", name: "", isVisible: true },
      { link: "/freqanal", name: "", isVisible: true },
      { link: "/codebook", name: "", isVisible: true, expand: false, children: [] },
      { link: "/segment", name: "", isVisible: true },
      { link: "/morsecode", name: "", isVisible: true },
      { link: "/resistor", name: "", isVisible: true },
      { link: "/vanitycode", name: "", isVisible: true },
      { link: "/fonts", name: "", isVisible: true, expand: false, children: [] },
      { link: "/decabit", name: "", isVisible: true },
    ],
  },
  {
    link: "/helpimage", name: t('menu.imagetools'), isVisible: true, expand: false,
    children: [
      { link: "/exifscanner", name: "", isVisible: true },
      { link: "/colorpicker", name: "", isVisible: true },
      { link: "/filltool", name: "", isVisible: true },
      { link: "/pixeldata", name: "", isVisible: true },
      { link: "/pixelbuild", name: "", isVisible: true },
      { link: "/imagetransform", name: "", isVisible: true },
      { link: "/textextractor", name: "", isVisible: true },
      { link: "/bitplane", name: "", isVisible: true },
      { link: "/dataappended", name: "", isVisible: true },
      { link: "/pngchunk", name: "", isVisible: true },
      { link: "/barcode", name: "", isVisible: true }
    ]
  },
  {
    link: "/helpmath", name: t('menu.mathtools'), isVisible: true, expand: false,
    children: [
      { link: "/baseconv", name: "", isVisible: true },
      { link: "/digits", name: "", isVisible: true },
      { link: "/primes", name: "", isVisible: true },
      { link: "/romans", name: "", isVisible: true },
      { link: "/fibonacci", name: "", isVisible: true },
      { link: "/gcdandlcm", name: "", isVisible: true },
      { link: "/formulasolver", name: "", isVisible: true },
      { link: "/numberprop", name: "", isVisible: true, children: [] },
      { link: "/bignumbers", name: "", isVisible: true },
      { link: "/sequences", name: "", isVisible: true, children: [] },
      { link: "/combinations", name: "", isVisible: true },
      { link: "/equations", name: "", isVisible: true },
      { link: "/nimbers", name: "", isVisible: true }
    ]
  },
  {
    link: "/helpcomp", name: t('menu.comptools'), isVisible: true, expand: false,
    children: [
      { link: "/bintotext", name: "", isVisible: true },
      { link: "/bcd", name: "", isVisible: true },
      { link: "/encryption", name: "", isVisible: true },
      { link: "/hashes", name: "", isVisible: true },
      { link: "/brainfuck", name: "", isVisible: true, children: [] },
      { link: "/cow", name: "", isVisible: true },
      { link: "/beatnik", name: "", isVisible: true },
      { link: "/deadfish", name: "", isVisible: true },
      { link: "/duckspeak", name: "", isVisible: true },
      { link: "/checksum", name: "", isVisible: true },
      { link: "/truthtable", name: "", isVisible: true },
      { link: "/passwordgen", name: "", isVisible: true }
    ]
  },
  {
    link: "/helpgames", name: t('menu.games'), isVisible: true, expand: false,
    children: [
      { link: "/sudokusolv", name: "", isVisible: true },
      { link: "/mmsolver", name: "", isVisible: true },
      { link: "/dictsearch", name: "", isVisible: true },
      { link: "/anagrams", name: "", isVisible: true },
      { link: "/wordle", name: "", isVisible: true },
      { link: "/wordsearch", name: "", isVisible: true },
      { link: "/cryptosolver", name: "", isVisible: true },
      { link: "/gameoflife", name: "", isVisible: true },
    ]
  },
  {
    link: "/helpother", name: t('menu.other'), isVisible: true, expand: false,
    children: [
      { link: "/printlog", name: "", isVisible: true },
      { link: "/genlog", name: "", isVisible: true },
      { link: "/htmlparser", name: "", isVisible: true },
      { link: "/unitconvertor", name: "", isVisible: true },
      { link: "/datecalc", name: "", isVisible: true },
      { link: "/randomizer", name: "", isVisible: true },
      { link: "/periodictable", name: "", isVisible: true },
      { link: "/countries", name: "", isVisible: true },
      { link: "/usastates", name: "", isVisible: true },
      { link: "/regions", name: "", isVisible: true },
      { link: "/dnacode", name: "", isVisible: true },
      { link: "/booksearch", name: "", isVisible: true }
    ]
  }
])

// --- Methods ---
const collapseList = () => {
  if (listComponent.value) {
    listComponent.value.collapseAll();
  }
};

const expandList = () => {
  if (listComponent.value) {
    listComponent.value.expandAll();
  }
};

const reset = () => {
  if (listComponent.value) {
    listComponent.value.resetVisibility();
  }
};

const goSearch = () => {
  errormsg.value = "";
  const s = searchstr.value.toLowerCase()
  if (s === "") {
    isVisibleAll()
    return
  }

  alltools.value.forEach(l1 => {
    l1.isVisible = false
    if (l1.children) {
      l1.children.forEach(l2 => {
        l2.isVisible = false
        if (l2.children) {
          l2.children.forEach(l3 => {
            l3.isVisible = false
            switch (l2.link) {
              case "/ciphers":
                if (t(`ciphers.${ciphers.value[l3.idx].ref}.info`).toLowerCase().includes(s)) l3.isVisible = true
                if (ciphers.value[l3.idx].name.toLowerCase().includes(s)) l3.isVisible = true
                break
              case "/codebook":
                if (codes.value[l3.idx].name.toLowerCase().includes(s)) l3.isVisible = true
                if (codes.value[l3.idx].description.toLowerCase().includes(s)) l3.isVisible = true
                if (codes.value[l3.idx].tags.some(tag => tag.toLowerCase() === s)) l3.isVisible = true
                break
              case "/fonts":
                l3.isVisible = fonts.value[l3.idx].font.toLowerCase().includes(s)
                break
              case "/brainfuck":
                l3.isVisible = bfvars.value[l3.idx].toLowerCase().includes(s)
                break
              case "/piglatin":
                l3.isVisible = l3.name.toLowerCase().includes(s) || pigs.value[l3.idx].descr.toLowerCase().includes(s)
                break
              case "/numerology":
                l3.isVisible = l3.name.toLowerCase().includes(s)
                break
              case "/sequences":
                l3.isVisible = l3.name.toLowerCase().includes(s)
                const lookup = (l3.name === "Reverse Conway") ? "revconway" : l3.name.toLowerCase()
                if (t(`sequences.${lookup}`).toLowerCase().includes(s)) l3.isVisible = true
                break
              case "/numberprop":
                l3.isVisible = l3.name.toLowerCase().includes(s)
                if (t(`numberprop.${l3.name}`).toLowerCase().includes(s)) l3.isVisible = true
                break
              default:
                l3.isVisible = false
            }
            if (l3.isVisible) {
              l2.isVisible = true; l2.isExpanded = true
              l1.isVisible = true; l1.isExpanded = true
            }
          })
        } else {
          const longInfo = t(`${l2.link.slice(1)}.long`).toLowerCase()
          const titleInfo = t(`${l2.link.slice(1)}.title`).toLowerCase()
          if (longInfo.includes(s) || titleInfo.includes(s)) {
            l2.isVisible = true
            l1.isVisible = true
            l1.isExpanded = true
          }
        }
      })
    }
  })
}

// --- Initialization ---

onMounted(() => {
  codes.value = codepages
  fonts.value = fontdefs
  ciphers.value = cipherData
  bfvars.value = bf.vars
  seqs.value = sequences
  numprops.value = numPropsData
  pigs.value = piglatin

  alltools.value.forEach(i => {
    i.isVisible = true
    i.isExpanded = false
    if (i.children) {
      i.children.forEach(j => {
        j.name = t(`${j.link.slice(1)}.title`)
        j.isVisible = true
        
        // Populate L3 dynamic contents
        if (j.link === "/ciphers") {
          j.isExpanded = false
          ciphers.value.forEach((c, idx) => {
            j.children.push({ name: c.name, link: `${j.link}/${c.ref}`, isVisible: true, idx })
          })
        }
        if (j.link === "/fonts") {
          j.isExpanded = false
          fonts.value.forEach((c, idx) => {
            j.children.push({ name: c.id, link: `${j.link}/${c.id}`, isVisible: true, idx })
          })
        }
        if (j.link === "/codebook") {
          j.isExpanded = false
          codes.value.forEach((c, idx) => {
            j.children.push({ name: c.name, link: `${j.link}/${c.imagename.slice(0, -4)}`, isVisible: true, idx })
          })
        }
        if (j.link === "/brainfuck") {
          j.isExpanded = false
          bfvars.value.forEach((name, idx) => {
            j.children.push({ name, link: `${j.link}/${name}`, isVisible: true, idx })
          })
        }
        if (j.link === "/numerology") {
          j.isExpanded = false
          const variants = ["Agrippan", "Pythagorean", "Chaldean", "Gematria", "Isopsephy", "Qabbala"]
          const ids = [0, 1, 2, 3, 5, 7]
          variants.forEach((name, idx) => {
            j.children.push({ name, link: `${j.link}/${ids[idx]}`, isVisible: true, idx })
          })
        }
        if (j.link === "/piglatin") {
          j.isExpanded = false
          pigs.value.forEach((p, idx) => {
            j.children.push({ name: p.name, link: `${j.link}/${idx}`, isVisible: true, idx })
          })
        }
        if (j.link === "/sequences") {
          j.expand = false
          seqs.value.forEach((s, idx) => {
            j.children.push({ name: s.name, link: `${j.link}/${s.ref}`, isVisible: true, idx })
          })
        }
        if (j.link === "/numberprop") {
          j.expand = false
          numprops.value.forEach((n, idx) => {
            j.children.push({ name: n.name, link: j.link, ref: n.ref, isVisible: true, idx })
          })
        }
      })
    }
  })

  if (route.query.s) {
    searchstr.value = route.query.s
    goSearch()
  }
})
</script>
