<template>

 <header class="page-header">
    <h1>{{ t('rotciphers.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')" :initialOpen="startOpen">
        <div v-html="t('rotciphers.long')" />
      </VCard>
      <VCard :title="t('labels.settings')">
        <div class="input-wrapper">
          <div class="radio-group">
          <label>{{t('rotciphers.selmethod')}}</label>
          <div class="radio-options-vertical">
            <label class="radio-item">
              <input type="radio" value="0" v-model="selalph">
              <span class="radio-mark"></span> {{t('rotciphers.rot13')}}
            </label>
            <label class="radio-item">
              <input type="radio" value="1" v-model="selalph">
              <span class="radio-mark"></span> {{t('rotciphers.rot5')}}
            </label>
            <label class="radio-item">
              <input type="radio" value="2" v-model="selalph">
              <span class="radio-mark"></span> {{t('rotciphers.rot47')}}
            </label>
            <label class="radio-item">
              <input type="radio" value="3" v-model="selalph">
              <span class="radio-mark"></span> {{t('rotciphers.hexa')}}
            </label>
            <label class="radio-item">
              <input type="radio" value="4" v-model="selalph">
              <span class="radio-mark"></span> {{t('rotciphers.custom')}}
            </label>
            <div v-show='selalph === "4"'>
              <label>{{t('rotciphers.other')}}</label>
              <input
                v-model="other"
                type="text"
              >
            </div>
          </div>
        </div>
      </div>
      </VCard>
      <VCard :title="t('labels.input')">
        <textarea class="form-control mb-2" lines="5" v-model="txt" id="txt" ref="txtInput"></textarea>
        <p
          v-show="errormsg"
          class="errormsg"
        >
          {{ errormsg }}
        </p>
      </VCard>
    </div>
    <div class="card-stack">
      <VCard :title="t('labels.result')">
        <div v-if="resultHtml" class="table-responsive">
          <div          
            class="resultbox"
            v-html="resultHtml"
            style="overflow-wrap: break-word"
        />
        </div>
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import VCard from '@/components/generic/VCard.vue';
import { useI18n } from 'vue-i18n'

const { t } = useI18n();

defineOptions({
  name: 'RotCiphers'
});

// --- State ---
const txt = ref("");
const selalph = ref("0");
const other = ref("");
const errormsg = ref("");
const txtInput = ref(null);
const startOpen = window.innerWidth > 768;

const ALF_PRESETS = [
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  "0123456789",
  "!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~",
  "0123456789ABCDEF"
];

// --- Lifecycle ---
onMounted(() => {
  txtInput.value?.focus();
});

// --- Logic Helpers ---

/**
 * Core rotation logic
 */
const rotateText = (alphabet, text, rot) => {
  let res = "";
  for (let c of text) {
    const idx = alphabet.indexOf(c);
    if (idx >= 0) {
      res += alphabet[(idx + rot) % alphabet.length];
    } else {
      res += c;
    }
  }
  return res;
};

// --- Computed Result ---

/**
 * This computed property generates the entire HTML table string
 * whenever txt, selalph, or other changes.
 */
const resultHtml = computed(() => {
  if (!txt.value) return "";

  // 1. Determine which alphabet to use
  let alphabet = selalph.value !== "4" 
    ? ALF_PRESETS[parseInt(selalph.value)] 
    : other.value.trim();

  if (!alphabet) return "";

  // 2. Normalize input text
  // Only keep case as-is for ASCII Printable (mode 2), otherwise uppercase it
  let processedTxt = selalph.value !== "2" ? txt.value.toUpperCase() : txt.value;

  // 3. Build HTML Table
  let html = "<table class='p-table'>";
  
  // Highlight the "Default" rotation (halfway point)
  const half = Math.floor(alphabet.length / 2);
  html += `
    <tr>
      <td style="text-align: left; width: 100px; font-weight: 800;">Default ${half}</td>
      <td style="text-align: left; font-weight:800;">${rotateText(alphabet, processedTxt, half)}</td>
    </tr>
  `;

  // 4. Generate all other rotations
  for (let i = 1; i < alphabet.length; i++) {
    // Skip if it's the one we already showed as default
    if (i === half) continue;

    html += `
      <tr>
        <td style="text-align: left;">ROT ${i}</td>
        <td style="text-align: left;">${rotateText(alphabet, processedTxt, i)}</td>
      </tr>
    `;
  }

  html += "</table>";
  return html;
});
</script>

<!-- 
All language definitions 
But info and long should be global as they are used in menus and search 
-->
<i18n locale="en">
{
  "rotciphers": {
    "selmethod": "Select rotation",
    "rot5" : "Numbers (ROT5)",
    "rot13": "Latin (ROT13)",
    "rot47": "Printable ASCII (ROT47)",
    "hexa": "Hexadecimal (ROT8)",
    "custom": "Specify your own rotation",
    "other": "Specify the alphabet to use (use CAPS)"
  }
}
</i18n>

<i18n locale="nl">
{
  "rotciphers": {
    "selmethod": "Selecteer rotatie",
    "rot5" : "Getallen (ROT5)",
    "rot13": "Standaard (ROT13)",
    "rot47": "Printbare ASCII (ROT47)",
    "hexa": "Hexadecimaal (ROT8)",
    "custom": "Aangepaste verschuiving",
    "other": "Te gebruiken aangepaste alfabet (gebruik hoofdletters)"
  }
}
</i18n>