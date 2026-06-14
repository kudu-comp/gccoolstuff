<template>
  <header class="page-header">
    <h1>{{ $t('htmlparser.title') }}</h1>
  </header>

  <div class="card-grid mb-2">
    <!-- Input Column -->
    <div class="card-stack">
      <VCard :title="$t('labels.intro')">
        <div v-html="$t('htmlparser.long')" />
      </VCard>

      <VCard :title="$t('labels.input')">
        <div class="form-row mb-2">
          <textarea
            ref="gchtmlInput"
            v-model="gchtml"
            :placeholder="$t('htmlparser.ph')"
            rows="5"
          />
        </div>
        <p v-show="errormsg" class="errormsg mt-2">{{ errormsg }}</p>
        <div class="button-row mt-2">
          <button class="btn btn-primary" @click="scanHTML">
            {{ $t('htmlparser.btnscan') }}
          </button>
        </div>
      </VCard>
    </div>

    <!-- Results Column -->
    <div class="card-stack">
      <VCard :title="$t('labels.result')">
        <h4 class="mb-2 mt-2">{{ scanresult }}</h4>

        <!-- Universal Result Loop -->
        <div 
          v-for="section in allSections" 
          :key="section.id" 
          v-show="section.items.length > 0"
          class="result-section mb-4"
        >
          <h6 class="fw-bold border-bottom pb-1 text-uppercase" style="font-size: 0.85rem; color: var(--primary-color);">
            {{ section.title }}
          </h6>
          <ul class="ms-3 mt-2">
            <li v-for="(item, idx) in section.items" :key="idx" class="mb-1">
              <!-- If it's a link-type section (Links or Images) -->
              <span v-if="section.isLink">
                <a :href="item.url" target="_blank" rel="noopener" class="result-link">
                  {{ item.name }} 
                  <span class="url-text">({{ item.url }})</span>
                </a>
              </span>
              <!-- If it's just plain text (Comments, Formats, etc) -->
              <span v-else>{{ item }}</span>
            </li>
          </ul>
        </div>

        <p v-if="scanresult && allSections.every(s => s.items.length === 0)" class="text-muted">
          No interesting elements found.
        </p>
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import VCard from '@/components/generic/VCard.vue'

defineOptions({ name: 'HtmlParser' })
const { t } = useI18n()

// --- State ---
const gchtml = ref("")
const scanresult = ref("")
const errormsg = ref("")
const cacheNode = ref(null)

// Data Containers
const links = ref([])
const images = ref([])
const bgimages = ref([])
const comments = ref([])
const whites = ref([])
const sizes = ref([])
const strongs = ref([])
const bolds = ref([])
const italics = ref([])
const sups = ref([])
const subs = ref([])
const dels = ref([])
const ems = ref([])

const gchtmlInput = ref(null)
onMounted(() => { gchtmlInput.value?.focus() })

// --- Unified Computed Property ---
const allSections = computed(() => [
  // Link types (expect items to be { name, url })
  { id: 'links', title: t('htmlparser.links'), items: links.value, isLink: true },
  { id: 'images', title: t('htmlparser.images'), items: images.value, isLink: true },
  { id: 'bgimages', title: t('htmlparser.bgimages'), items: bgimages.value, isLink: true },
  
  // Text types (expect items to be strings)
  { id: 'comms', title: t('htmlparser.comms'), items: comments.value },
  { id: 'white', title: t('htmlparser.white'), items: whites.value },
  { id: 'size', title: t('htmlparser.size'), items: sizes.value },
  { id: 'strong', title: t('htmlparser.strong'), items: strongs.value },
  { id: 'bold', title: t('htmlparser.bold'), items: bolds.value },
  { id: 'ital', title: t('htmlparser.ital'), items: italics.value },
  { id: 'sup', title: t('htmlparser.sup'), items: sups.value },
  { id: 'sub', title: t('htmlparser.sub'), items: subs.value },
  { id: 'del', title: t('htmlparser.del'), items: dels.value },
  { id: 'em', title: t('htmlparser.em'), items: ems.value },
])

// --- Helper for formatting tags ---
const listTags = (tag) => {
  if (!cacheNode.value) return []
  const nodes = cacheNode.value.getElementsByTagName(tag)
  return Array.from(nodes)
    .map(node => node.textContent.trim())
    .filter(text => text !== "")
}

const scanHTML = () => {
  // Reset all
  errormsg.value = ""
  scanresult.value = ""
  links.value = []
  images.value = []
  bgimages.value = []
  comments.value = []
  whites.value = []
  sizes.value = []
  
  try {
    const parser = new DOMParser()
    const xmlTree = parser.parseFromString(gchtml.value, "text/html")
    const targetNode = xmlTree.getElementById("ctl00_ContentBody_LongDescription")
    cacheNode.value = targetNode

    if (!targetNode) {
      errormsg.value = t("htmlparser.nocache")
      return
    }

    // 1. Links
    const aNodes = targetNode.getElementsByTagName("a")
    for (const node of aNodes) {
      links.value.push({ name: node.textContent.trim() || "Link", url: node.getAttribute("href") })
    }
    const areaNodes = targetNode.getElementsByTagName("area")
    for (const node of areaNodes) {
      links.value.push({ name: "Image Map Link", url: node.getAttribute("href") })
    }

    // 2. Images
    const imgNodes = targetNode.getElementsByTagName("img")
    for (const node of imgNodes) {
      images.value.push({
        name: (node.getAttribute("alt") || "No Alt Text"),
        url: node.getAttribute("src")
      })
    }

    // 3. Background images
    const bodyNodes = xmlTree.getElementsByTagName("body")
    for (const node of bodyNodes) {
      const url = node.getAttribute('background')
      if (url) bgimages.value.push({ name: "Body Background Attribute", url })
    }

    const bgXPath = xmlTree.evaluate(
      "//span[@id='ctl00_ContentBody_LongDescription']//*[contains(@style,'background-image')]",
      xmlTree, null, XPathResult.ANY_TYPE, null
    )
    let bgimageNode = bgXPath.iterateNext()
    while (bgimageNode) {
      const style = bgimageNode.getAttribute('style')
      const urlMatch = style.match(/background-image[:\s]*url\s*\(\s*['|"]*(\S*)['|"]\s*\)/)
      if (urlMatch) {
        bgimages.value.push({ name: "CSS Style Background", url: urlMatch[1] })
      }
      bgimageNode = bgXPath.iterateNext()
    }

    // 4. Comments, White Text, Size Text (Strings)
    const commentXPath = xmlTree.evaluate("//span[@id='ctl00_ContentBody_LongDescription']//comment()", xmlTree, null, XPathResult.ANY_TYPE, null)
    let cNode = commentXPath.iterateNext();
    while (cNode) { if(cNode.textContent.trim()) comments.value.push(cNode.textContent.trim()); cNode = commentXPath.iterateNext(); }

    const whiteXPath = xmlTree.evaluate("//span[@id='ctl00_ContentBody_LongDescription']//font[@color='white'] | //span[@id='ctl00_ContentBody_LongDescription']//*[contains(@style,'color:white') or contains(@style,'color:#ffffff')]", xmlTree, null, XPathResult.ANY_TYPE, null)
    let wNode = whiteXPath.iterateNext();
    while (wNode) { if(wNode.textContent.trim()) whites.value.push(wNode.textContent.trim()); wNode = whiteXPath.iterateNext(); }

    const sizeXPath = xmlTree.evaluate("//span[@id='ctl00_ContentBody_LongDescription']//*[contains(@style,'font-size')]", xmlTree, null, XPathResult.ANY_TYPE, null)
    let sNode = sizeXPath.iterateNext();
    while (sNode) { if(sNode.textContent.trim()) sizes.value.push(sNode.textContent.trim()); sNode = sizeXPath.iterateNext(); }

    // 5. Formatting tags
    strongs.value = listTags("strong")
    bolds.value = listTags("b")
    italics.value = listTags("i")
    sups.value = listTags("sup")
    subs.value = listTags("sub")
    dels.value = listTags("del")
    ems.value = listTags("em")

    scanresult.value = t('htmlparser.complete')
  } catch (e) {
    errormsg.value = t('htmlparser.error')
    console.error(e)
  }
}
</script>

<style scoped>

h6 {
  margin-bottom: 0.2rem;
}

.result-section ul {
  list-style-type: square;
  word-break: break-all;
  margin-top: 0.5rem;
}
.result-link {
  text-decoration: none;
  font-weight: 500;
}
.result-link:hover {
  text-decoration: underline;
}
.url-text {
  font-size: 0.8rem;
  color: #6c757d;
  font-weight: normal;
  margin-left: 4px;
}
</style>