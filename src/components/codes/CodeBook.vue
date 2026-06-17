<template>
  <header class="page-header">
    <h1>{{ t('codebook.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <VCard :title="t('labels.intro')">
      <div v-html="t('codebook.long')" />
    </VCard>
    <VCard :title="t('labels.settings')">
      <v-search
        id="searchstr"
        v-model:search="searchstr"
        @keyup.enter="goSearch"
      />
      <div class="form-horizontal">
        <CustomDropdown 
          v-model="selectedtag" 
          :options="tags" 
          :title="t('codebook.availtags')"
        />
      </div>
      <p
        v-show="errormsg"
        class="errormsg"
      >
        {{ errormsg }}.
      </p>
      <div class="button-row-icons">
        <button id="btnsearch" class="btn btn-primary"  @click="goSearch" >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>         
        </button>
        <button id="bnreset" class="btn btn-secondary" @click="resetSearch" >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
            <path d="M21 3v5h-5"/>
          </svg>          
        </button>
      </div> 
    </VCard>
  </div>
  <div class="card-grid mb-2">
    <VCard :title="t('codebook.pagesfound') + foundpages.length">
      <div class="button-row-icons mb-2">
        <button id="first" class="btn btn-primary" :disabled="currentpage === 0" @click="currentpage = 0; selectCodepage()" >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFF" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="11 17 6 12 11 7"></polyline>
            <polyline points="18 17 13 12 18 7"></polyline>
          </svg>
        </button>
        <button id="prev" class="btn btn-primary" :disabled="currentpage === 0" @click="currentpage--; selectCodepage()" >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFF" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button id="next" class="btn btn-primary" :disabled="currentpage === foundpages.length-1" @click="currentpage++; selectCodepage()" >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFF" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
        <button id="next" class="btn btn-primary" :disabled="currentpage === foundpages.length-1" @click="currentpage = foundpages.length-1; selectCodepage()" >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFF" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="13 17 18 12 13 7"></polyline>
            <polyline points="6 17 11 12 6 7"></polyline>
          </svg>
        </button>
      </div> 
      <div class="input-box">       
        <div >
          <div style="text-align: center; font-weight: 800;">
              <span style="text-align: right; float: right; right: 10px;">{{ currentpage+1 }} / {{ foundpages.length }}</span>
              {{ codepageheader }}
          </div>
            <div style="text-align: center;">
              {{ codepagedescription }}
            </div>
            <div style="text-align: center;">
              {{ codepagetags }}
            </div>
            <hr>
        </div>
        <div class="imagearea">
          <img
            style="align-items: center;"
            :src="codepageImage"
            :alt="codepageheader"
          >
        </div>
      </div>
    </VCard>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { codepages } from '@/scripts/codebook.js'
import VSearch from '@/components/generic/VSearch.vue'
import VCard from '@/components/generic/VCard.vue'
import CustomDropdown from '@/components/generic/CustomDropdown.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({
  useScope: 'local'
});

const props = defineProps({
  code: {
    type: String,
    required: false,
    default: "atbash"
  }
})

const route = useRoute()

// --- State ---
const searchstr = ref("")
const currentpage = ref(0)
const selectedtag = ref("")
const codepageheader = ref("")
const codepagedescription = ref("")
const codepagetags = ref("")
const codepagefile = ref("")
const foundpages = ref([])
const tags = ref([])
const showitem = ref(true)
const isDropdownOpen = ref(false)

// --- Computed ---
const codepageImage = computed(() => {
  if (!codepagefile.value) return null
  const fileName = codepagefile.value.toLowerCase()
  return new URL(`../../assets/codebook/${fileName}`, import.meta.url).href
})

// --- Methods ---

const selectCodepage = () => {
  if (foundpages.value.length === 0) return

  const pageIndex = foundpages.value[currentpage.value]
  const page = codepages[pageIndex]

  codepageheader.value = page.name
  codepagedescription.value = page.description
  codepagefile.value = page.imagename
  
  const tagList = page.tags.join(", ")
  codepagetags.value = `Tags: ${tagList}`
}

const goSearch = () => {
  const newFoundPages = []

  if (!selectedtag.value && !searchstr.value) {
    for (let i = 0; i < codepages.length; i++) {
      newFoundPages.push(i)
    }
  } else {
    const srex = searchstr.value ? new RegExp(searchstr.value, "i") : null

    for (let i = 0; i < codepages.length; i++) {
      const hasTag = selectedtag.value && codepages[i].tags.includes(selectedtag.value)
      const hasSearchMatch = srex && (
        codepages[i].name.search(srex) >= 0 || 
        codepages[i].description.search(srex) >= 0
      )

      if (hasTag || hasSearchMatch) {
        newFoundPages.push(i)
      }
    }
  }

  foundpages.value = newFoundPages
  currentpage.value = 0
  selectCodepage()
}

const handleTagSelect = (tag) => {
  selectedtag.value = tag
  isDropdownOpen.value = false
  goSearch()
}

const resetSearch = () => {
  selectedtag.value = ""
  searchstr.value = ""
  goSearch()
}

// --- Lifecycle ---
onMounted(() => {
  // Extract unique tags
  const tagSet = new Set()
  codepages.forEach(page => {
    page.tags.forEach(t => tagSet.add(t))
  })
  
  tags.value = ["", ...Array.from(tagSet).sort()].map( t => ({ value: t, label: t}));
  tags.value[0].label = "All tags"
  
  // Default: show all pages
  foundpages.value = codepages.map((_, index) => index)

  // Handle route params
  const routeCode = route.params.code || props.code
  if (routeCode) {
    const index = codepages.findIndex(p => p.imagename.toLowerCase().startsWith(routeCode.toLowerCase()))
    if (index !== -1) {
      currentpage.value = index
    }
  }

  selectCodepage()
})
</script>

<style scoped>

.imagearea img { max-width: 100%; max-height: auto; display: block; margin: 0 auto; }

.btn:disabled {
  opacity: 0.5;
}

</style>
