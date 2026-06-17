<template>
  <header class="page-header">
    <h1>{{ t('triangulation.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')">
        <div v-html="t('triangulation.long')" />
      </VCard>
      <VCard :title="t('labels.settings')">
        <div class="toggle-group">
          <button :class="{ active: mode === 'intersection' }" @click="mode = 'intersection'; result = null">Intersection<br><small>2 Observers → Target</small></button>
          <button :class="{ active: mode === 'resection' }" @click="mode = 'resection'; result = null">Resection<br><small>3 Landmarks → Me</small></button>
        </div>
      </VCard>
      <VCard :title="t('labels.input')">
        <div v-for="(item, idx) in (mode === 'intersection' ? observers : landmarks)" :key="idx" class="input-box mb-2">
          <label class="input-box-title">{{ item.name || 'Obs ' + item.id }}</label>
          <div class="form-horizontal">
            <v-coord
              v-model:coord="item.coordinate"
              v-model:datum="item.selecteddatum"
            />
          </div>
          <div class="form-horizontal">
            <v-angle
              v-model:angle="item.angle"
              v-model:unit="item.angleunit"
            />
          </div>
        </div>
        <div class="button-row">
          <v-show-on-map id="go" class="btn btn-primary" @Show="calculatePosition()" />
        </div>
        <p
          v-show="errormsg"
          class="errormsg mb-2"
        >
          {{ errormsg }}.
        </p>  
      </VCard>
      <VCard :title="t('labels.result')">
        <span v-if="result?.x !== undefined"><strong>{{ t('triangulation.result') + result.text }}</strong></span>
        <span v-else-if="result?.error" class="err">{{ result.error }}</span>
      </VCard>
    </div>
    <div class="card-stack">
      <VCard :title="t('labels.map')">
        <v-map v-model:mylocation="observers[0].coordinate" />     
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import VMap from '@/components/generic/VMap.vue';
import VCard from '@/components/generic/VCard.vue';
import VCoord from '@/components/generic/VCoord.vue';
import VAngle from '@/components/generic/VAngle.vue';
import VShowOnMap from '@/components/generic/VShowOnMap.vue';
import * as coords from '@/scripts/coords.js';
import L from 'leaflet';
import { useI18n } from 'vue-i18n'

const { t } = useI18n({
  useScope: 'local'
});

const mode = ref('intersection'); 
const result = ref(null); 
const store = useStore();
const mymap = computed(() => store.state.mymap);
const gridsys = "RD";

const toRad = (deg) => deg * (Math.PI / 180);
const cot = (rad) => 1 / Math.tan(rad);

const observers = ref([
  { id: 1, x: 0, y: 0, bearing: 0, coordinate: '', selecteddatum: 'WGS84', angle: 0, angleunit: '0.0174532925', lat: 0, lon: 0 },
  { id: 2, x: 0, y: 0, bearing: 0, coordinate: '', selecteddatum: 'WGS84', angle: 0, angleunit: '0.0174532925', lat: 0, lon: 0 }
]);

const landmarks = ref([
  { name: 'Alpha', x: 0, y: 0, bearing: 0, coordinate: '', selecteddatum: 'WGS84', angle: 0, angleunit: '0.0174532925', lat: 0, lon: 0 },
  { name: 'Bravo', x: 0, y: 0, bearing: 0, coordinate: '', selecteddatum: 'WGS84', angle: 0, angleunit: '0.0174532925', lat: 0, lon: 0 },
  { name: 'Charlie', x: 0,  y: 0,   bearing: 0, coordinate: '', selecteddatum: 'WGS84', angle: 0, angleunit: '0.0174532925', lat: 0, lon: 0  }
]);

const calculateIntersection = () => {

  // Convert OBS1 to WGS84 (lat, lon) for map
  coords.convertCoordFromText(observers.value[0].coordinate, observers.value[0].selecteddatum, "WGS84")
    .then (data => {
      observers.value[0].bearing = observers.value[0].angle * observers.value[0].angleunit * 180 / Math.PI; // Convert to degrees for easier handling
      observers.value[0].lat = data.lat; observers.value[0].lon = data.lon;
      coords.displayMarker(mymap.value, { lat: observers.value[0].lat, lon: observers.value[0].lon }, "OBS 1");
      // Convert OBS1 to grid (x, y) for math
      return coords.convertCoordFromWGS (data, gridsys);
    })
    .then (data => { 
      observers.value[0].x = data.lon; observers.value[0].y = data.lat;
      // Convert OBS2 to WGS84 (lat, lon) for map
      return coords.convertCoordFromText(observers.value[1].coordinate, observers.value[1].selecteddatum, "WGS84")
    })
    .then (data => {
      observers.value[1].bearing = observers.value[1].angle * observers.value[1].angleunit * 180 / Math.PI; // Convert to degrees for easier handling
      observers.value[1].lat = data.lat; observers.value[1].lon = data.lon;
      coords.displayMarker(mymap.value, { lat: observers.value[1].lat, lon: observers.value[1].lon }, "OBS 2");
      // Convert OBS2 to grid (x, y) for math
      return coords.convertCoordFromWGS (data, gridsys);
    })
    .then (data => {
      observers.value[1].x = data.lon; observers.value[1].y = data.lat;
      // Do math
      const [p1, p2] = observers.value;
      const r1 = (90 - p1.bearing) * (Math.PI / 180);
      const r2 = (90 - p2.bearing) * (Math.PI / 180);
      const v1x = Math.cos(r1), v1y = Math.sin(r1);
      const v2x = Math.cos(r2), v2y = Math.sin(r2);
      const det = v2x * v1y - v2y * v1x;
      if (Math.abs(det) < 1e-10) { result.value = { error: 'Parallel' }; return; }
      const t1 = (v2x * (p2.y - p1.y) - v2y * (p2.x - p1.x)) / det;
      result.value = { x: p1.x + t1 * v1x, y: p1.y + t1 * v1y };
      // Convert result back to WGS84 for display
      return coords.convertCoordToWGS({ lat: result.value.y, lon: result.value.x }, gridsys);
    })
    .then (data => {
      result.value.lat = data.lat; result.value.lon = data.lon;
      // Show result on map and draw line from observers to result
      coords.displayMarker(mymap.value, { lat: result.value.lat, lon: result.value.lon }, "Result");
      L.polyline([[observers.value[0].lat, observers.value[0].lon], [result.value.lat, result.value.lon], [observers.value[1].lat, observers.value[1].lon]], { color: 'blue', dashArray: '5,10' }).addTo(mymap.value);
      // Convert result back to selected datum
      return coords.convertCoordFromWGS (data, observers.value[0].selecteddatum);
    })
    .then (data => {
      result.value.lat = data.lat; result.value.lon = data.lon;
      result.value.text = coords.getTextFromCoord(data, observers.value[0].selecteddatum);
    })
    .catch (err => { 
      console.error(err); result.value = { error: 'Invalid' }; 
    });
};

const calculateResection = () => {

   // Convert OBS1 to WGS84 (lat, lon) for map
  coords.convertCoordFromText(landmarks.value[0].coordinate, landmarks.value[0].selecteddatum, "WGS84")
    .then (data => {
      landmarks.value[0].bearing = landmarks.value[0].angle * landmarks.value[0].angleunit * 180 / Math.PI; // Convert to degrees for easier handling
      landmarks.value[0].lat = data.lat; landmarks.value[0].lon = data.lon;
      coords.displayMarker(mymap.value, { lat: landmarks.value[0].lat, lon: landmarks.value[0].lon }, "Alfa");
      // Convert OBS1 to grid (x, y) for math
      return coords.convertCoordFromWGS (data, gridsys);
    })
    .then (data => { 
      landmarks.value[0].x = data.lon; landmarks.value[0].y = data.lat;
      // Convert OBS2 to WGS84 (lat, lon) for map
      return coords.convertCoordFromText(landmarks.value[1].coordinate, landmarks.value[1].selecteddatum, "WGS84")
    })
    .then (data => {
      landmarks.value[1].bearing = landmarks.value[1].angle * landmarks.value[1].angleunit * 180 / Math.PI; // Convert to degrees for easier handling
      landmarks.value[1].lat = data.lat; landmarks.value[1].lon = data.lon;
      coords.displayMarker(mymap.value, { lat: landmarks.value[1].lat, lon: landmarks.value[1].lon }, "Bravo");
      // Convert OBS2 to grid (x, y) for math
      return coords.convertCoordFromWGS (data, gridsys);
    })
    .then (data => {
      landmarks.value[1].x = data.lon; landmarks.value[1].y = data.lat;
      // Convert OBS3 to WGS84 (lat, lon) for map
      return coords.convertCoordFromText(landmarks.value[2].coordinate, landmarks.value[2].selecteddatum, "WGS84")
    })
    .then (data => {
      landmarks.value[2].bearing = landmarks.value[2].angle * landmarks.value[2].angleunit * 180 / Math.PI; // Convert to degrees for easier handling
      landmarks.value[2].lat = data.lat; landmarks.value[2].lon = data.lon;
      coords.displayMarker(mymap.value, { lat: landmarks.value[2].lat, lon: landmarks.value[2].lon }, "Charlie");
      // Convert OBS3 to grid (x, y) for math
      return coords.convertCoordFromWGS (data, gridsys);
    })
    .then (data => {
      landmarks.value[2].x = data.lon; landmarks.value[2].y = data.lat;
      // Do math
      const p = landmarks.value.map(l => ({ x: Number(l.x), y: Number(l.y), b: Number(l.bearing) }));
      const a = Math.sqrt((p[1].x - p[2].x)**2 + (p[1].y - p[2].y)**2);
      const b = Math.sqrt((p[0].x - p[2].x)**2 + (p[0].y - p[2].y)**2);
      const c = Math.sqrt((p[0].x - p[1].x)**2 + (p[0].y - p[1].y)**2);
      const A = Math.acos((b*b + c*c - a*a) / (2 * b * c));
      const B = Math.acos((a*a + c*c - b*b) / (2 * a * c));
      const C = Math.acos((a*a + b*b - c*c) / (2 * a * b));
      const getAngle = (b1, b2) => { let d = b2 - b1; while (d < 0) d += 360; return toRad(d); };
      const o1 = getAngle(p[1].b, p[2].b); 
      const o2 = getAngle(p[2].b, p[0].b);
      const o3 = getAngle(p[0].b, p[1].b);
      const w1 = 1 / (cot(A) - cot(o1)), w2 = 1 / (cot(B) - cot(o2)), w3 = 1 / (cot(C) - cot(o3));
      const sumW = w1 + w2 + w3;
      if (isNaN(sumW) || Math.abs(sumW) < 1e-5) { result.value = { error: 'Danger Circle' }; return; }
      result.value = { x: (w1 * p[0].x + w2 * p[1].x + w3 * p[2].x) / sumW, y: (w1 * p[0].y + w2 * p[1].y + w3 * p[2].y) / sumW };
      // Convert result back to WGS84 for display
      return coords.convertCoordToWGS({ lat: result.value.y, lon: result.value.x }, gridsys);
    })
    .then (data => {
      result.value.lat = data.lat; result.value.lon = data.lon;
      // Show result on map and draw line from observers to result
      coords.displayMarker(mymap.value, { lat: result.value.lat, lon: result.value.lon }, "Result");
      L.polyline([[landmarks.value[0].lat, landmarks.value[0].lon], [result.value.lat, result.value.lon]], { color: 'blue', dashArray: '5,10' }).addTo(mymap.value);
      L.polyline([[landmarks.value[1].lat, landmarks.value[1].lon], [result.value.lat, result.value.lon]], { color: 'blue', dashArray: '5,10' }).addTo(mymap.value);
      L.polyline([[landmarks.value[2].lat, landmarks.value[2].lon], [result.value.lat, result.value.lon]], { color: 'blue', dashArray: '5,10' }).addTo(mymap.value);
      // Convert result back to selected datum
      return coords.convertCoordFromWGS (data, landmarks.value[0].selecteddatum);
    })
    .then (data => {
      result.value.lat = data.lat; result.value.lon = data.lon;
      result.value.text = coords.getTextFromCoord(data, landmarks.value[0].selecteddatum);
    })
    .catch (err => { 
      console.error(err); result.value = { error: 'Invalid' }; 
    });
  
};

const calculatePosition = () => {

  if (mode.value === 'intersection') {
    calculateIntersection();        
  } else {
    calculateResection();   
  }
};

</script>

<style scoped>

/* Toggle Styles */
.toggle-group {
  display: flex;
  background: #e9ecef;
  padding: 4px;
  border-radius: 8px;
}
.toggle-group button {
  flex: 1; border: none; padding: 10px; border-radius: 6px; cursor: pointer;
  font-weight: 600; color: #495057; background: none; transition: 0.2s;
}
.toggle-group button.active {
  background: white; color: #09776E; box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
</style>