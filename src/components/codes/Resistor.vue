<template>
  <header class="page-header">
    <h1>{{ t('resistor.title') }}</h1>
  </header>

  <div class="card-grid mb-2">
    <div class="card-stack">
      <!-- Intro Card -->
      <VCard :title="t('labels.intro')" :initialOpen="startOpen">
        <div v-html="t('resistor.long')" />
      </VCard>

      <!-- Input Card -->
      <VCard :title="t('labels.input')">
        <div class="form-horizontal">
          <label>{{ t('resistor.band') }} 1 </label>
          <vd-color v-model:color="band1" />
        </div>
        <div class="form-horizontal">
          <label>{{ t('resistor.band') }} 2 </label>
          <vd-color v-model:color="band2" />
        </div>
        <div class="form-horizontal">
          <label>{{ t('resistor.band') }} 3 </label>
          <vd-color v-model:color="band3" />
        </div>
        <div class="form-horizontal">
          <label>{{ t('resistor.mult') }}</label>
          <vd-color v-model:color="mult">
            <template #addcolors>
              <option value="-1" style="background-color: gold; color: black">Gold</option>
              <option value="-2" style="background-color: silver; color: black">Silver</option>
            </template>
          </vd-color>
        </div>        
        <p v-show="errormsg" class="errormsg mt-2">{{ errormsg }}</p>
      </VCard>

      <!-- Result Card -->
      <VCard :title="t('labels.result')">
        <div class="resultbox font-monospace" v-html="resultHtml" />
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import VdColor from '@/components/generic/VdColor.vue';
import VCard from '@/components/generic/VCard.vue';

defineOptions({ name: 'Resistor' });

const { t } = useI18n();

// --- State ---
const band1 = ref(0);
const band2 = ref(0);
const band3 = ref(0);
const mult = ref(0);
const errormsg = ref("");
const startOpen = window.innerWidth > 768;

// --- Computed Result ---
const resultHtml = computed(() => {
  // Ensure we are working with numbers
  const b1 = parseInt(band1.value) || 0;
  const b2 = parseInt(band2.value) || 0;
  const b3 = parseInt(band3.value) || 0;
  const m = parseInt(mult.value) || 0;

  // Calculate Base Value: (100x + 10y + z) * 10^multiplier
  const ohms = (b1 * 100 + b2 * 10 + b3) * Math.pow(10, m);

  // Build the localized string
  let html = `<strong>${t('resistor.res')}</strong><br>`;
  html += `${ohms.toLocaleString()} Ω<br>`;
  html += `${(ohms / 1000).toFixed(4)} kΩ<br>`;
  html += `${(ohms / 1000000).toFixed(4)} MΩ`;

  return html;
});
</script>

<!-- 
All language definitions 
But info and long should be global as they are used in menus and search 
-->
<i18n locale="en">
{
  "resistor": {
    "band": "Band",
    "mult": "Multiplier",
    "res": "The resistance value is:"
  }
}
</i18n>

<i18n locale="nl">
{
  "resistor": {
    "band": "Band",
    "mult": "x Factor",
    "res": "De weerstand bedraagt:"
  }
}
</i18n>