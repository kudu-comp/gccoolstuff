<template>
  <header class="page-header">
    <h1>{{ t('regions.title') }}</h1>
  </header>

  <div class="card-grid mb-2">
    <div class="card-stack">
      <!-- Intro Card -->
      <VCard :title="t('labels.intro')" :initialOpen="startOpen">
        <div v-html="t('regions.long')" />
      </VCard>

      <!-- Settings Card -->
      <VCard :title="t('labels.settings')">
        <div class="form-horizontal">
          <CustomDropdown
            :title="t('regions.list')"
            :options="countries"
            v-model="country"
          />
        </div>
        <!-- Table Component -->
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
      <VCard  :title="t('labels.result')">
        <div v-if="formattedResult"class="resultbox" v-html="formattedResult" />
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import VTable from '@/components/generic/VTable.vue'
import VCard from '@/components/generic/VCard.vue'
import CustomDropdown from '@/components/generic/CustomDropdown.vue'

defineOptions({
  name: 'Regions'
})

const { t } = useI18n()

// --- State ---
const country = ref("nl")
const formattedResult = ref("")
const tableError = ref("")
const defsearch = ref(1)
const startOpen = window.innerWidth > 768;

const countries = [
  { value: "nl", label: t('regions.nl') },
  { value: "be", label: t('regions.be') },
  { value: "de", label: t('regions.de') },
  { value: "fr", label: t('regions.fr') }
]

const phsearch = computed(() => t('regions.ph'))

// --- Table Data & Definitions ---
const COUNTRY_DEFS = {
  be: {
    cols: [
      { field: "flag", label: t('regions.flag'), sortable: false, width: "7%",
        image: {
          src: (r) => new URL(`../../assets/regions/be-${r.code.toLowerCase()}.png`, import.meta.url).href,
          width: "30", height: "20"
        }
      },
      { field: "code", label: t('regions.code'), sortable: true, width: "7%", parseCol: (s) => s.match(/([A-Za-z]{3}[\s]*)/g) },
      { field: "name", label: t('regions.name'), sortable: true, width: "30%", link: { href: (r) => `https://nl.wikipedia.org/wiki/${r.url}` } },
      { field: "cat", label: t('regions.cat'), sortable: true, width: "20%" },
      { field: "cap", label: t('regions.cap'), sortable: true, width: "25%" },
      { field: "mun", label: t('regions.mun'), sortable: { numsort: true }, width: "7%" }
    ],
    rows: [
      { code: "BRU", name: "Brussels Hoofdstedelijk Gewest", cat: "Gewest", cap: "Brussel", url: "Brussels_Hoofdstedelijk_Gewest", mun: 19 },
      { code: "VLG", name: "Vlaams Gewest", cat: "Gewest", cap: "Brussel", url: "Vlaanderen", mun: 0 },
      { code: "VAN", name: "Antwerpen", cat: "Provincie", cap: "Antwerpen", url: "Antwerpen_(provincie)", mun: 70 },
      { code: "VBR", name: "Vlaams-Brabant", cat: "Provincie", cap: "Leuven", url: "Vlaams-Brabant", mun: 65 },
      { code: "VLI", name: "Limburg", cat: "Provincie", cap: "Hasselt", url: "Limburg_(Belgische_provincie)", mun: 44 },
      { code: "VOV", name: "Oost-Vlaanderen", cat: "Provincie", cap: "Gent", url: "Oost-Vlaanderen", mun: 65 },
      { code: "VWV", name: "West-Vlaanderen", cat: "Provincie", cap: "Brugge", url: "West-Vlaanderen", mun: 64 },
      { code: "WAL", name: "Waals Gewest", cat: "Gewest", cap: "Namen", url: "Wallonië", mun: 64 },
      { code: "WBR", name: "Waals Brabant", cat: "Provincie", cap: "Waver", url: "Wallonië", mun: 27 },
      { code: "WHT", name: "Henegouwen", cat: "Provincie", cap: "Bergen", url: "Henegouwen", mun: 69 },
      { code: "WLG", name: "Luik", cat: "Provincie", cap: "Luik", url: "Luik_(provincie)", mun: 84 },
      { code: "WLX", name: "Luxemburg", cat: "Provincie", cap: "Aarlen", url: "Luxemburg_(provincie)", mun: 44 },
      { code: "WNA", name: "Namen", cat: "Provincie", cap: "Namen", url: "Namen_(provincie)", mun: 38 }
    ]
  },
  de: {
    cols: [
      { field: "flag", label: t('regions.flag'), sortable: false, width: "7%",
        image: {
          src: (r) => new URL(`../../assets/regions/de-${r.code.toLowerCase()}.png`, import.meta.url).href,
          width: "30", height: "20"
        }
      },
      { field: "code", label: t('regions.code'), sortable: true, width: "7%", parseCol: (s) => s.match(/([A-Za-z]{2}[\s]*)/g) },
      { field: "name", label: t('regions.name'), sortable: true, width: "30%", link: { href: (r) => `https://de.wikipedia.org/wiki/${r.url}` } },
      { field: "cap", label: t('regions.cap'), sortable: true, width: "25%" },
      { field: "bundesrat", label: t('regions.bundesrat'), sortable: { numsort: true }, width: "5%" },
      { field: "landkreise", label: t('regions.landkreise'), sortable: { numsort: true }, width: "5%" },
      { field: "stadtkreise", label: t('regions.stadtkreise'), sortable: { numsort: true }, width: "5%" }
    ],
    rows: [
      { code: "BW", name: "Baden-Württemberg", cap: "Stuttgart", bundesrat: 6, landkreise: 35, stadtkreise: 9, url: "Baden-Württemberg"},
      { code: "BY", name: "Bayern", cap: "München", bundesrat: 6, landkreise: 71, stadtkreise: 26, url: "Bayern"},
      { code: "BE", name: "Berlin", cap: "Berlin", bundesrat: 4, landkreise: 0, stadtkreise: 0, url: "Berlin"},
      { code: "BB", name: "Brandenburg", cap: "Potsdam", bundesrat: 4, landkreise: 14, stadtkreise: 4, url: "Brandenburg"},
      { code: "HB", name: "Bremen", cap: "Bremen", bundesrat: 3, landkreise: 0, stadtkreise: 0, url: "Freie_Hansestadt_Bremen"},
      { code: "HH", name: "Hamburg", cap: "Hamburg", bundesrat: 3, landkreise: 0, stadtkreise: 0, url: "Hamburg"},
      { code: "HE", name: "Hessen", cap: "Wiesbaden", bundesrat: 5, landkreise: 21, stadtkreise: 5, url: "Hessen"},
      { code: "MV", name: "Mecklenburg-Vorpommern", cap: "Schwerin", bundesrat: 3, landkreise: 12, stadtkreise: 5, url: "Mecklenburg-Vorpommern"},
      { code: "NI", name: "Niedersachsen", cap: "Hannover", bundesrat: 6, landkreise: 38, stadtkreise: 8, url: "Niedersachsen"},
      { code: "NW", name: "Nordrhein-Westfalen", cap: "Düsseldorf", bundesrat: 6, landkreise: 32, stadtkreise: 23, url: "Nordrhein-Westfalen"},
      { code: "RP", name: "Rheinland-Pfalz", cap: "Mainz", bundesrat: 4, landkreise: 24, stadtkreise: 12, url: "Rheinland-Pfalz"},
      { code: "SL", name: "Saarland", cap: "Saarbrücken", bundesrat: 3, landkreise: 6, stadtkreise: 0, url: "Saarland"},
      { code: "SN", name: "Sachsen", cap: "Dresden", bundesrat: 4, landkreise: 10, stadtkreise: 3, url: "Sachsen"},
      { code: "ST", name: "Sachsen-Anhalt", cap: "Magdeburg", bundesrat: 4, landkreise: 11, stadtkreise: 3, url: "Sachsen-Anhalt"},
      { code: "SH", name: "Schleswig-Holstein", cap: "Kiel", bundesrat: 4, landkreise: 11, stadtkreise: 4, url: "Schleswig-Holstein"},
      { code: "TH", name: "Thüringen", cap: "Erfurt", bundesrat: 4, landkreise: 17, stadtkreise: 6, url: "Thüringen"}
    ]
  },
  nl: {
    cols: [
      { field: "flag", label: t('regions.flag'), sortable: false, width: "7%",
        image: {
          src: (r) => new URL(`../../assets/regions/nl-${r.code.toLowerCase()}.png`, import.meta.url).href,
          width: "30", height: "20"
        }
      },
      { field: "code", label: t('regions.code'), sortable: true, width: "7%", parseCol: (s) => s.match(/([A-Za-z]{2}[\s]*)/g) },
      { field: "name", label: t('regions.name'), sortable: true, width: "30%", link: { href: (r) => `https://nl.wikipedia.org/wiki/${r.url}` } },
      { field: "cap", label: t('regions.cap'), sortable: true, width: "30%" },
      { field: "mun", label: t('regions.mun'), sortable: { numsort: true }, width: "7%" },
      { field: "area", label: t('regions.area'), sortable: { numsort: true }, width: "7%" }
    ],
    rows: [
      { code: "DR", name: "Drenthe", mun: "12", flag: "Flag", area: "9", cap: "Assen", url: "Drenthe" },
      { code: "FL", name: "Flevoland", mun: "6", flag: "Flag", area: "10", cap: "Lelystad", url: "Flevoland" },
      { code: "FR", name: "Friesland", mun: "18", flag: "Flag", area: "1", cap: "Leeuwarden", url: "Friesland" },
      { code: "GE", name: "Gelderland", mun: "51", flag: "Flag", area: "2", cap: "Arnhem", url: "Gelderland" },
      { code: "GR", name: "Groningen", mun: "10", flag: "Flag", area: "7", cap: "Groningen", url: "Groningen_(provincie)" },
      { code: "LI", name: "Limburg", mun: "31", flag: "Flag", area: "11", cap: "Maastricht", url: "Limburg_(Nederlandse_provincie)" },
      { code: "NB", name: "Noord-Brabant", mun: "61", flag: "Flag", area: "3", cap: "'s-Hertogenbosch", url: "Noord-Brabant" },
      { code: "NH", name: "Noord-Holland", mun: "47", flag: "Flag", area: "4", cap: "Haarlem", url: "Noord-Holland" },
      { code: "OV", name: "Overijssel", mun: "25", flag: "Flag", area: "5", cap: "Zwolle", url: "Overijssel" },
      { code: "UT", name: "Utrecht", mun: "26", flag: "Flag", area: "12", cap: "Utrecht", url: "Utrecht_(provincie)" },
      { code: "ZE", name: "Zeeland", mun: "13", flag: "Flag", area: "8", cap: "Middelburg", url: "Zeeland_(provincie)" },
      { code: "ZH", name: "Zuid-Holland", mun: "52", flag: "Flag", area: "6", cap: "Den Haag", url: "Zuid-Holland" }
    ]
  },
  fr: {
    cols: [
      { field: "flag", label: t('regions.flag'), sortable: false, width: "7%",
        image: {
          src: (r) => new URL(`../../assets/regions/fr-${r.code.toLowerCase()}.png`, import.meta.url).href,
          width: "30", height: "20"
        }
      },
      { field: "cat", label: t('regions.cat'), sortable: true, width: "15%" },
      { field: "code", label: t('regions.code'), sortable: true, width: "5%", parseCol: (s) => s.match(/([A-Za-z]{3}[\s]*)/g) },
      { field: "name", label: t('regions.name'), sortable: true, width: "30%", link: { href: (r) => `https://fr.wikipedia.org/wiki/${r.url}` } },
      { field: "cap", label: t('regions.cap'), sortable: true, width: "25%" },
      { field: "dep", label: t('regions.dep'), sortable: { numsort: true }, width: "5%" },
      { field: "arr", label: t('regions.arr'), sortable: { numsort: true }, width: "5%" },
      { field: "canton", label: t('regions.canton'), sortable: { numsort: true }, width: "5%" },
      { field: "commune", label: t('regions.mun'), sortable: { numsort: true }, width: "5%" },
      { field: "area", label: t('regions.area'), sortable: { numsort: true }, width: "5%" }
    ],
    rows: [
      { code: "ARA", cat: "Région", name: "Auvergne-Rhône-Alpes", cap: "Lyon", dep: 12, arr: 39, canton: 242, commune: 4030, area: 4, url: "Auvergne-Rhône-Alpes"},
      { code: "BFC", cat: "Région", name: "Bourgogne-Franche-Comté", cap: "Dijon", dep: 8, arr: 24, canton: 152, commune: 3702, area: 6, url: "Bourgogne-Franche-Comté"},
      { code: "BRE", cat: "Région", name: "Bretagne", cap: "Rennes", dep: 4, arr: 15, canton: 102, commune: 1208, area: 12, url: "Région_Bretagne"},
      { code: "CVL", cat: "Région", name: "Centre-Val de Loire", cap: "Orléans", dep: 6, arr: 20, canton: 102, commune: 1757, area: 7, url: "Centre-Val de Loire"},
      { code: "COR", cat: "Collectivité territoriale", name: "Corse", cap: "Ajaccio", dep: 2, arr: 5, canton: 26, commune: 360, area: 14, url: "Corse"},
      { code: "GES", cat: "Région", name: "Grand Est", cap: "Strasbourg", dep: 10, arr: 38, canton: 200, commune: 5121, area: 5, url: "Grand_Est"},
      { code: "HDF", cat: "Région", name: "Hauts-de-France", cap: "Lille", dep: 5, arr: 26, canton: 145, commune: 3789, area: 9, url: "Hauts-de-France"},
      { code: "IDF", cat: "Région", name: "Île-de-France", cap: "Paris", dep: 8, arr: 25, canton: 155, commune: 1268, area: 13, url: "Île-de-France"},
      { code: "NOR", cat: "Région", name: "Normandie", cap: "Rouen", dep: 5, arr: 17, canton: 131, commune: 2652, area: 11, url: "Normandie_(région_administrative)"},
      { code: "NAQ", cat: "Région", name: "Nouvelle-Aquitaine", cap: "Bordeaux", dep: 12, arr: 41, canton: 258, commune: 4313, area: 1, url: "Nouvelle-Aquitaine"},
      { code: "OCC", cat: "Région", name: "Occitanie", cap: "Toulouse", dep: 13, arr: 36, canton: 249, commune: 4454, area: 3, url: "Occitanie_(région_administrative)"},
      { code: "PDL", cat: "Région", name: "Pays de la Loire", cap: "Nantes", dep: 5, arr: 16, canton: 107, commune: 1237, area: 8, url: "Pays_de_la_Loire"},
      { code: "PAC", cat: "Région", name: "Provence-Alpes-Côte d'Azur", cap: "Marseille", dep: 6, arr: 18, canton: 126, commune: 946, area: 10, url: "Provence-Alpes-Côte d'Azur"},
      { code: "GUA", cat: "Région", name: "Guadeloupe", cap: "Basse-Terre", dep: 1, arr: 2, canton: 21, commune: 31, area: 16, url: "Guadeloupe"},
      { code: "GUF", cat: "Région", name: "Guyane", cap: "Cayenne", dep: 1, arr: 2, canton: 0, commune: 22, area: 2, url: "Guyane"},
      { code: "MTQ", cat: "Région", name: "Martinique", cap: "Basse-Terre", dep: 1, arr: 2, canton: 0, commune: 31, area: 17, url: "Martinique"},
      { code: "MAY", cat: "Région", name: "Mayotte", cap: "Mamoudzou", dep: 1, arr: 0, canton: 13, commune: 17, area: 18, url: "Mayotte"},
      { code: "LRE", cat: "Région", name: "La Réunion", cap: "Saint-Denis", dep: 1, arr: 4, canton: 25, commune: 24, area: 15, url: "La_Réunion"}
    ]
  }
}

// Computed Table logic
const cols = computed(() => COUNTRY_DEFS[country.value].cols)
const rows = computed(() => COUNTRY_DEFS[country.value].rows)

// --- Event Handlers ---
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
</script>

<i18n locale="en">
{
  "regions": {
    "ph": "Type searches divided by spaces, for codes the spaces can be omitted",
    "list": "Countries",
    "nl": "Netherlands",
    "be": "Belgium",
    "de": "Germany",
    "fr": "France",
    "flag": "Flag",
    "code": "ISO3166:2 code",
    "name": "Province",
    "mun": "#Municipalities",
    "area": "Area ranking",
    "cap": "Capital",
    "cat": "Type of region",
    "dep": "#Departments",
    "arr": "#Arrondisements",
    "canton": "#Cantons",
    "bundesrat": "Bundesrat reps",
    "landkreise": "#Landkreise",
    "stadtkreise": "#Kreisefreie stadt"
  }
}
</i18n>

<i18n locale="nl">
{
  "regions": {
    "ph": "Voer zoektermen in gescheiden door spaties, voor ISO3166 codes kan de spatie achterwege blijven",
    "list": "Landen",
    "nl": "Nederland",
    "be": "België",
    "de": "Duitsland",
    "fr": "Frankrijk",
    "flag": "Vlag",
    "code": "ISO3166:2 code",
    "name": "Provincie",
    "mun": "#Gemeentes",
    "area": "Opp. ranking",
    "cap": "Hoofdstad",
    "cat": "Type regio",
    "dep": "#Departmenten",
    "arr": "#Arrondisementem",
    "canton": "#Cantons",
    "bundesrat": "Bundesrat reps",
    "landkreise": "#Landkreise",
    "stadtkreise": "#Kreisefreie stadt"
  }
}
</i18n>