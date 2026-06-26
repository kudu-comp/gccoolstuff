<template>
  <div id="mapid" />
</template>

<script setup>
import { onMounted, onUnmounted, markRaw, shallowRef } from 'vue';
import { useStore } from 'vuex';
import L from "leaflet";
import * as coords from '@/scripts/coords.js';

// CSS and Plugin Imports
import "leaflet/dist/leaflet.css";
import "leaflet.fullscreen";
import "leaflet.fullscreen/Control.FullScreen.css";

// Fix broken icons when running build
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
});

// Props & Emits
const props = defineProps({
  mylocation: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:mylocation']);

// State
const store = useStore();
const mymap = shallowRef(null);
const baseMaps = shallowRef(null);

// Location icon
const locationIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"></circle>
  <line x1="22" y1="12" x2="18" y2="12"></line>
  <line x1="6" y1="12" x2="2" y2="12"></line>
  <line x1="12" y1="6" x2="12" y2="2"></line>
  <line x1="12" y1="22" x2="12" y2="18"></line>
  <circle cx="12" cy="12" r="3"></circle>
</svg>`;


onUnmounted(() => {
    if (mymap.value) {
        mymap.value.remove();
    }
});

onMounted(() => {
    // Access state from store
    const mapboxToken = store.state.accessToken;
    const thunderforestToken = store.state.apikeyThunderforest;

    // Create the tile layers base map object
    baseMaps.value = {
      "OpenStreetMap" : L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }),
      "Streets" : L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${mapboxToken}`, {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: mapboxToken
      }),
      "Satellite": L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${mapboxToken}`, {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/satellite-v9',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: mapboxToken
      }),
      "Cyclemap" : L.tileLayer(`https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=${thunderforestToken}`, {
        attribution: 'Maps &copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, Data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
        tileSize: 512,
        zoomOffset: -1,
        accessToken: thunderforestToken
      }),
      "Transport" : L.tileLayer(`https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=${thunderforestToken}`, {
        attribution: 'Maps &copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, Data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
        tileSize: 512,
        zoomOffset: -1,
        accessToken: thunderforestToken
      }),
      "Satellite/Streets": L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${mapboxToken}`, {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/satellite-streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: mapboxToken
      }),
      "Landscape" : L.tileLayer(`https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=${thunderforestToken}`, {
        attribution: 'Maps &copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, Data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
        tileSize: 512,
        zoomOffset: -1,
        accessToken: thunderforestToken
      }),
      "Outdoors": L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${mapboxToken}`, {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/outdoors-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: mapboxToken
      })
    };
    
    // Create the map and add the default layer
    const mapInstance = new L.map('mapid', {
      fullscreenControl: true,
      center : [52.40983, 4.72280],
      zoom: 13,
      layers: [baseMaps.value["OpenStreetMap"]]
    });

    mymap.value = markRaw(mapInstance);

    // 3. Create Custom Location Control
    const LocationControl = L.Control.extend({
    options: { position: 'topleft' },
    onAdd: function() {
      // Create a container with Leaflet's built-in button classes
      const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
      const button = L.DomUtil.create('a', '', container);
      
      button.innerHTML = locationIconSvg; // Add our SVG
      button.style.cursor = 'pointer';
      button.style.display = 'flex';
      button.style.alignItems = 'center';
      button.style.justifyContent = 'center';
      button.title = "Get my location";

      // Prevent map clicks when clicking the button
      L.DomEvent.disableClickPropagation(button);

      button.onclick = () => {
        coords.geoFindMe()
          .then((position) => {
            const { latitude, longitude } = position.coords;
            const locString = latitude.toFixed(5) + " " + longitude.toFixed(5);
            emit('update:mylocation', locString);
            coords.displayMarker(mapInstance, [latitude, longitude], "Your Location");
            mapInstance.flyTo([latitude, longitude], 15);
          })
          .catch(e => console.error(e));
      };

      return container;
    }
  });

    // Add layer control
    mapInstance.addControl(new LocationControl());
    L.control.layers(baseMaps.value, null).addTo(mapInstance);
    L.control.scale().addTo(mapInstance);

    // Update global map vars for use in other places
    store.commit('initMap', { mymap: mapInstance });

    // Add event listener for click on map
    mapInstance.on('click', (e) => {
      emit('update:mylocation', e.latlng.lat.toFixed(5) + " " + e.latlng.lng.toFixed(5));
    });

});

</script>

<style scoped>
#mapid {
  height: 800px;
  z-index: 0;
}

/* Lower the Leaflet control containers so they sit below menus */
:deep(.leaflet-top),
:deep(.leaflet-bottom) {
    z-index: 500 !important;
}

.leaflet-grab {
  cursor: crosshair;
}

.leaflet-dragging .leaflet-grab {
  cursor: move;
}

/* .mapbtn {
  background-color: white !important;
  color: black !important;
  font-size: 20px !important;
  width: 50px !important;
  height: 50px !important;
  line-height: 50px !important;
  border-width: 2px;
  border-style: solid;
  border-radius: 5px;
} */

</style>
