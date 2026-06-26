<template>

<header class="page-header">
    <h1>{{ t('mapmaker.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')" :initialOpen="startOpen">
        <div v-html="t('mapmaker.long')" />
      </VCard>
      <VCard :title="t('labels.settings')">
        <div class="form-horizontal">
          <label
          >{{ t('labels.from') }}</label>
          <DatumSelect
            id="from"
            v-model:datum="from"
          />
        </div>
        <label class="checkbox-container mb-2">
          <input type="checkbox" v-model="showmarkers">
          <span class="checkmark"></span>
          {{ t('mapmaker.showmark') }}
        </label>
        <label class="checkbox-container mb-2">
          <input type="checkbox" v-model="showlabels">
          <span class="checkmark"></span>
          {{ t('mapmaker.showlabel') }}
        </label>
        <label class="checkbox-container">
          <input type="checkbox" v-model="drawcircles">
          <span class="checkmark"></span>
          {{ t('mapmaker.drawcircle') }}
        </label>
        <div class="form-horizontal" v-if="drawcircles">
          <v-distance
            v-model:dist="dist"
            v-model:unit="unit"
          >
            <template #label>
              <label
                class="form-label"
                for="distance"
              >{{ t('labels.radius') }}</label>
            </template>
          </v-distance>
        </div>  
      </VCard>
      <VCard :title="t('labels.input')">
        <textarea
          ref="coordFromRef"
          v-model="coordfrom"
          class="mb-2"
          :placeholder="t('mapmaker.phcoord')"
          rows="5"
        />
        <textarea
          v-model="labels"
          class="mb-2"
          :placeholder="t('mapmaker.phlabel')"
          rows="5"
        />
        <div v-show="errormsg" class="errormsg mb-2">
          {{ errormsg }}
        </div>
        <div class="button-row">
          <ButtonShowOnMap @Show="makeMap()" />
        </div>
      </VCard>
    </div>
    <div class="card-stack">
      <VCard :title="t('labels.map')">
        <v-map v-model:mylocation="coordfrom" />
      </VCard>
      </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import L from 'leaflet';
import * as coords from '@/scripts/coords.js';

// Component Imports
import DatumSelect from '@/components/generic/DatumSelect.vue';
import VDistance from '@/components/generic/VDistance.vue';
import VMap from '@/components/generic/VMap.vue';
import VCard from '@/components/generic/VCard.vue';
import ButtonShowOnMap from '@/components/generic/ButtonShowOnMap.vue';

defineOptions({
  name: 'MapMaker'
});

const store = useStore();
const { t } = useI18n();

// --- State ---
const errormsg = ref("");
const from = ref("WGS84");
const coordfrom = ref("");
const labels = ref("");
const drawcircles = ref(false);
const showlabels = ref(true);
const showmarkers = ref(true);
const unit = ref(1);
const dist = ref(165);

// --- Template Refs ---
const coordFromRef = ref(null);
const startOpen = window.innerWidth > 768;

// --- Lifecycle ---
onMounted(() => {
  // Focus the coordinate input on load
  if (coordFromRef.value) {
    coordFromRef.value.focus();
  }
});

// --- Methods ---

const makeMap = () => {
  // Reset error flag
  errormsg.value = "";
  let markertext = [];

  // 1. Validation: Check if input exists
  if (!coordfrom.value) {
    errormsg.value = t('errors.nocoords');
    return;
  }

  // 2. Parse labels: If empty, use coordinates as labels
  const inputLines = coordfrom.value.match(/[^\r\n]+/g) || [];
  if (!labels.value) {
    markertext = inputLines;
  } else {
    markertext = labels.value.match(/[^\r\n]+/g) || [];
  }

  // 3. Validation: Check if label count matches coordinate count
  if (inputLines.length !== markertext.length) {
    errormsg.value = t('mapmaker.error1');
    return;
  }

  // 4. Process each line
  inputLines.forEach((line, i) => {
    try {
      coords.convertCoordFromText(line, from.value, 'WGS84')
        .then((mapcoord) => {
          const mymap = store.state.mymap;

          // Add a marker to the map
          if (showmarkers.value) {
            const marker = new L.marker(mapcoord).addTo(mymap);

            // Create a popup that doesn't close
            if (showlabels.value) {
              const p = new L.Popup({ autoClose: false, closeOnClick: false })
                .setContent(markertext[i])
                .setLatLng(mapcoord);
              marker.bindPopup(p).openPopup();
            }
          }

          // Draw circles if requested
          if (drawcircles.value) {
            L.circle(mapcoord, {
              color: "#E72E1C",
              fillColor: "#EC7F74",
              fillOpacity: 0.5,
              radius: dist.value * unit.value
            }).addTo(mymap);
          }
        })
        .catch((e) => {
          errormsg.value = t('errors.incorrectcoords');
          console.error(e);
        });
    } catch (e) {
      errormsg.value = t('errors.incorrectcoords');
      console.error(e);
    }
  });
};
</script>

<i18n locale="en">
{
  "mapmaker": {
    "phcoord": "Coordinates go here",
    "phlabel": "Labels go here (optional)",
    "showmark": "Show markers",
    "showlabel": "Show marker labels",
    "drawcircle": "Draw circles",
    "makemap": "Make map",
    "error1": "Number of coordinates and labels must match"
  }
}
</i18n>

<i18n locale="nl">
{
  "mapmaker": {
    "phcoord": "Coördinaten hier invoeren",
    "phlabel": "Labels hier invoeren (optioneel)",
    "showmark": "Toon markers",
    "showlabel": "Toon marker labels",
    "drawcircle": "Teken cirkels",
    "makemap": "Maak kaart",
    "error1": "Aantal coördinaten en labels moet gelijk zijn"
  }
}
</i18n>