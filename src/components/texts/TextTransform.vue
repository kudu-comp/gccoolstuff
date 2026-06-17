<template>
  <header class="page-header">
    <h1>{{ t('texttransform.title') }}</h1>
  </header>

  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')" :initialOpen="startOpen">
        <div v-html="t('texttransform.long')" />
      </VCard>

      <VCard :title="t('labels.settings')">
        <div class="button-row mb-2">
            <button @click="resetOptions" class="btn btn-secondary">
                {{ t('buttons.reset') || 'Reset Options' }}
            </button>
        </div>

        <div class="settings-inner-grid">
          
          <!-- Logic-driven groups -->
          <div v-for="(group, index) in groups" :key="index" class="input-box">
            <h3>{{ t('texttransform.' + group.key) }}</h3>
            <label v-for="opt in group.options" :key="opt.id" class="checkbox-container mb-2">
                <input type="checkbox" v-model="selectedOptions" :value="opt.id" />
                <span class="checkmark"></span>{{ t('texttransform.' + opt.id) }}
            </label>
          </div>

          <!-- Grid Layout group -->
          <div class="input-box">
            <h3>{{ t('texttransform.gridLayout') }}</h3>

            <div class="radio-group mb-2">
              <div class="radio-options-vertical">
                <label class="radio-item">
                    <input type="radio" value="none" v-model="gridType">
                    <span class="radio-mark"></span> {{ t('texttransform.nogrid')}}
                </label>
                <label class="radio-item">
                    <input type="radio" value="rows" v-model="gridType">
                    <span class="radio-mark"></span> {{ t('texttransform.rows')}}
                </label>
                <label class="radio-item">
                    <input type="radio" value="cols" v-model="gridType">
                    <span class="radio-mark"></span> {{ t('texttransform.cols')}}
                </label>
              </div>
            </div>

            <div class="form-horizontal" v-if="gridType !== 'none'">
                <label style="flex: 0 0 100px;">
                  {{ gridType === 'rows' ? t('texttransform.rowsLabel') : t('texttransform.colsLabel') }}
                </label>
                <input type="number" v-model.number="gridSize" min="1" max="200" class="form-control form-control-sm d-inline-block w-auto" />
            </div>
          </div>

        </div>
      </VCard>
    </div>

    <div class="card-stack">
      <VCard :title="t('labels.input')">
          <textarea 
            v-model="inputText" 
            :placeholder="t('labels.message')"
            rows="4"
          ></textarea>
      </VCard>
      
      <VCard :title="t('labels.result')">
        <div class="button-row mb-2">
          <button @click="copyToClipboard" class="btn btn-primary" :class="{ copied: copiedStatus }">
            {{ copiedStatus ? '✓' : t('buttons.copy') }}
          </button>
        </div>

        <textarea 
          :value="transformedText" 
          readonly 
          rows="10"
          class="resultbox font-monospace"
        ></textarea>
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import VCard from '@/components/generic/VCard.vue';

const { t } = useI18n({
  useScope: 'local'
});
const startOpen = window.innerWidth > 768;

const inputText = ref('');
const selectedOptions = ref([]);
const gridType = ref('none');
const gridSize = ref(5);
const copiedStatus = ref(false);

const resetOptions = () => {
  selectedOptions.value = [];
  gridType.value = 'none';
  gridSize.value = 5;
};

// Refactored to use keys that match the JSON structure
const groups = [
  { key: 'groupCleanUp', options: [
    { id: 'removeDigits' },
    { id: 'removeVowels' },
    { id: 'removeConsonants' },
    { id: 'removeWhitespace' },
    { id: 'removeNewLines' },
    { id: 'removeSymbols' },
    { id: 'removeDiacritics' },
  ]},
  { key: 'groupCase', options: [
    { id: 'uppercase' },
    { id: 'lowercase' },
    { id: 'titleCase' },
    { id: 'lastLetterUpper' },
    { id: 'removeUpper' },
    { id: 'removeLower' },
  ]},
  { key: 'groupReverse', options: [
    { id: 'reverseText' },
    { id: 'reverseWordOrder' },
    { id: 'reverseEachWord' },
  ]},
  { key: 'groupFunZone', options: [
    { id: 'upsideDown' },
    { id: 'bubbleText' },
    { id: 'slugify' },
    { id: 'zalgo' },
  ]}
];

const getGraphemes = (str) => {
  const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
  return Array.from(segmenter.segment(str), (s) => s.segment);
};

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(transformedText.value);
    copiedStatus.value = true;
    setTimeout(() => copiedStatus.value = false, 2000);
  } catch (err) {
    console.error('Failed to copy!', err);
  }
};

const transformedText = computed(() => {
  let result = inputText.value;
  if (!result) return "";

  // Transformations...
  if (selectedOptions.value.includes('removeDiacritics')) result = result.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  const vowelList = 'aeiouAEIOUáéíóúÁÉÍÓÚàèìòùÀÈÌÒÙâêîôûÂÊÎÔÛäëïöüÄËÏÖÜãõÃÕ';
  if (selectedOptions.value.includes('removeVowels')) result = result.replace(new RegExp(`[${vowelList}]`, 'g'), '');
  if (selectedOptions.value.includes('removeConsonants')) result = result.replace(new RegExp(`(?![${vowelList}])\\p{L}`, 'gu'), '');
  if (selectedOptions.value.includes('removeDigits')) result = result.replace(/\p{Nd}/gu, '');
  if (selectedOptions.value.includes('removeNewLines')) result = result.replace(/\r?\n|\r/g, ' ');
  if (selectedOptions.value.includes('removeWhitespace')) result = result.replace(/\s+/g, '');
  if (selectedOptions.value.includes('removeSymbols')) result = result.replace(/[^\p{L}\p{N}\s]/gu, '');

  if (selectedOptions.value.includes('uppercase')) result = result.toUpperCase();
  if (selectedOptions.value.includes('lowercase')) result = result.toLowerCase();
  if (selectedOptions.value.includes('titleCase')) result = result.replace(/(^|\s+)(\p{L})/gu, (m, p1, p2) => p1 + p2.toUpperCase());
  if (selectedOptions.value.includes('lastLetterUpper')) result = result.replace(/\p{L}(?=[^\p{L}]|$)/gu, (c) => c.toUpperCase());
  if (selectedOptions.value.includes('removeUpper')) result = result.replace(/\p{Lu}/gu, '');
  if (selectedOptions.value.includes('removeLower')) result = result.replace(/\p{Ll}/gu, '');

  if (selectedOptions.value.includes('reverseText')) result = getGraphemes(result).reverse().join('');
  if (selectedOptions.value.includes('reverseWordOrder')) result = result.split(/(\s+)/).reverse().join('');
  if (selectedOptions.value.includes('reverseEachWord')) result = result.split(/(\s+)/).map(s => getGraphemes(s).reverse().join('')).join('');

  if (selectedOptions.value.includes('slugify')) {
    result = result.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
  }
  if (selectedOptions.value.includes('upsideDown')) {
    const map = {"a":"ɐ","b":"q","c":"ɔ","d":"p","e":"ǝ","f":"ɟ","g":"ƃ","h":"ɥ","i":"ᴉ","j":"ɾ","k":"ʞ","l":"l","m":"ɯ","n":"u","o":"o","p":"d","q":"b","r":"ɹ","s":"s","t":"ʇ","u":"n","v":"ʌ","w":"ʍ","x":"x","y":"ʎ","z":"z","A":"∀","B":"ᗺ","C":"Ɔ","D":"◩","E":"Ǝ","F":"Ⅎ","G":"⅁","H":"H","I":"I","J":"Ր","K":"K","L":"˥","M":"W","N":"N","O":"O","P":"Ԁ","Q":"Ό","R":"ᴚ","S":"S","T":"⊥","U":"∩","V":"Λ","W":"M","X":"X","Y":"⅄","Z":"Z","1":"Ɩ","2":"ᄅ","3":"Ɛ","4":"ㄣ","5":"ϛ","6":"9","7":"ㄥ","8":"8","9":"6","0":"0",".":"˙",",":"'","'":",","\"":"„","?":"¿","!":"¡","(":")",")":"(","[":"]","]":"[","{":"}","}":"{","<":">",">":"<","_":"‾"};
    result = getGraphemes(result).reverse().map(c => map[c] || c).join('');
  }
  if (selectedOptions.value.includes('bubbleText')) {
    const bubbles = {"a":"ⓐ","b":"ⓑ","c":"ⓒ","d":"ⓓ","e":"ⓔ","f":"ⓕ","g":"ⓖ","h":"ⓗ","i":"ⓘ","j":"ⓙ","k":"ⓚ","l":"ⓛ","m":"ⓜ","n":"ⓝ","o":"ⓞ","p":"ⓟ","q":"ⓠ","r":"ⓡ","s":"ⓢ","t":"ⓣ","u":"ⓤ","v":"ⓥ","w":"ⓦ","x":"ⓧ","y":"ⓨ","z":"ⓩ","A":"Ⓐ","B":"Ⓑ","C":"Ⓒ","D":"Ⓓ","E":"Ⓔ","F":"ℱ","G":"Ⓖ","H":"Ⓗ","I":"Ⓘ","J":"Ⓙ","K":"Ⓚ","L":"Ⓛ","M":"Ⓜ","N":"Ⓝ","O":"Ⓞ","P":"Ⓟ","Q":"Ⓠ","R":"Ⓡ","S":"Ⓢ","T":"Ⓣ","U":"Ⓤ","V":"Ⓥ","W":"Ⓦ","X":"Ⓧ","Y":"Ⓨ","Z":"Ⓩ","0":"⓪","1":"①","2":"②","3":"③","4":"④","5":"⑤","6":"⑥","7":"⑦","8":"⑧","9":"⑨"};
    result = getGraphemes(result).map(c => bubbles[c] || c).join('');
  }
  if (selectedOptions.value.includes('zalgo')) {
    const marks = ["\u0300","\u0301","\u0302","\u0303","\u0304","\u0305","\u0306","\u0307","\u0308","\u0309","\u030a","\u030b","\u030c","\u030d","\u030e","\u030f","\u0310","\u0311","\u0312","\u0313","\u0314","\u0315","\u0316","\u0317","\u0318","\u0319","\u031a","\u031b","\u031c","\u031d","\u031e","\u031f"];
    result = getGraphemes(result).map(c => {
      if (/\s/.test(c)) return c;
      let noise = "";
      for (let i = 0; i < 3; i++) noise += marks[Math.floor(Math.random() * marks.length)];
      return c + noise;
    }).join('');
  }

  // --- Grid Layout ---
  if (gridType.value !== 'none') {
    const chars = getGraphemes(result);
    const requested = Math.max(1, gridSize.value);
    if (chars.length > 0) {
      let lines = [];
      if (gridType.value === 'rows') {
        const perRow = Math.ceil(chars.length / requested);
        for (let i = 0; i < chars.length; i += perRow) lines.push(chars.slice(i, i + perRow).join(''));
      } else {
        const rows = Math.ceil(chars.length / requested);
        for (let r = 0; r < rows; r++) {
          let line = '';
          for (let c = 0; c < requested; c++) {
            const idx = c * rows + r;
            if (idx < chars.length) line += chars[idx];
          }
          lines.push(line);
        }
      }
      result = lines.join('\n');
    }
  }

  return result;
});
</script>

<style scoped>

/* Internal adaptive grid for settings */
.settings-inner-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.input-box h3 {
  font-size: 1rem;
  color: var(--primary-green);
}

</style>

<i18n locale="en">
{
  "texttransform": {
    "title": "Text Transformer",
    "gridLayout": "Grid Layout",
    "nogrid": "No grid",
    "rows": "By Rows",
    "cols": "By Columns",
    "rowsLabel": "Rows:",
    "colsLabel": "Cols:",
    "groupCleanUp": "Clean Up",
    "groupCase": "Case",
    "groupReverse": "Reverse",
    "groupFunZone": "Fun Zone",
    "removeDigits": "Remove digits",
    "removeVowels": "Remove vowels",
    "removeConsonants": "Remove consonants",
    "removeWhitespace": "Remove whitespace",
    "removeNewLines": "Remove end of lines",
    "removeSymbols": "Remove symbols",
    "removeDiacritics": "Remove diacritics",
    "uppercase": "All uppercase",
    "lowercase": "All lowercase",
    "titleCase": "First letters uppercase",
    "lastLetterUpper": "Last letter uppercase",
    "removeUpper": "Remove uppercase",
    "removeLower": "Remove lowercase",
    "reverseText": "Reverse text",
    "reverseWordOrder": "Reverse word order",
    "reverseEachWord": "Reverse each word",
    "upsideDown": "Upside down",
    "bubbleText": "Bubble text",
    "slugify": "Slugify (URL-style)",
    "zalgo": "Zalgo / Glitch"
  }
}
</i18n>

<i18n locale="nl">
{
  "texttransform": {
    "title": "Tekstverwerker",
    "gridLayout": "Grid-lay-out",
    "nogrid": "Geen grid",
    "rows": "Per rij",
    "cols": "Per kolom",
    "rowsLabel": "Rijen:",
    "colsLabel": "Kolommen:",
    "groupCleanUp": "Opschonen",
    "groupCase": "Hoofdletters",
    "groupReverse": "Omdraaien",
    "groupFunZone": "Fun Zone",
    "removeDigits": "Cijfers verwijderen",
    "removeVowels": "Klinkers verwijderen",
    "removeConsonants": "Medeklinkers verwijderen",
    "removeWhitespace": "Witruimte verwijderen",
    "removeNewLines": "Regeleinden verwijderen",
    "removeSymbols": "Symbolen verwijderen",
    "removeDiacritics": "Diakritische tekens verwijderen",
    "uppercase": "Alles hoofdletters",
    "lowercase": "Alles kleine letters",
    "titleCase": "Eerste letters hoofdletter",
    "lastLetterUpper": "Laatste letter hoofdletter",
    "removeUpper": "Hoofdletters verwijderen",
    "removeLower": "Kleine letters verwijderen",
    "reverseText": "Tekst omdraaien",
    "reverseWordOrder": "Woordvolgorde omdraaien",
    "reverseEachWord": "Elk woord omdraaien",
    "upsideDown": "Ondersteboven",
    "bubbleText": "Bubbelschrift",
    "slugify": "Slugify (URL-stijl)",
    "zalgo": "Zalgo / Glitch"
  }
}
</i18n>