<template>

<header class="page-header">
    <h1>{{ $t('mapmaker.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="$t('labels.intro')">
        <div v-html="$t('mapmaker.long')" />
      </VCard>
      <VCard :title="$t('labels.settings')">
        <div class="form-horizontal">
          <label
          >{{ $t('labels.from') }}</label>
          <v-datums
            id="from"
            v-model:datum="from"
          />
        </div>
        <div class="form-group-vertical mb-2">
          <label class="checkbox-container">
            <input type="checkbox" v-model="showmarkers">
            <span class="checkmark"></span>
            {{ $t('mapmaker.showmark') }}
          </label>
          <label class="checkbox-container">
            <input type="checkbox" v-model="showlabels">
            <span class="checkmark"></span>
            {{ $t('mapmaker.showlabel') }}
          </label>
          <label class="checkbox-container">
            <input type="checkbox" v-model="drawcircles">
            <span class="checkmark"></span>
            {{ $t('mapmaker.drawcircle') }}
          </label>
        </div>
        <div class="form-horizontal" v-if="drawcircles">
          <v-distance
            v-model:dist="dist"
            v-model:unit="unit"
          >
            <template #label>
              <label
                class="form-label"
                for="distance"
              >{{ $t('labels.radius') }}</label>
            </template>
          </v-distance>
        </div>  
        <div class="button-row">
          <v-show-on-map id="go" class="btn btn-primary" @Show="makeMap()" />
        </div>
      </VCard>
      <VCard :title="$t('labels.input')">
        <textarea
          id="coordfrom"
          ref="coordfrom"
          v-model="coordfrom"
          class="form-control mt-2"
          :placeholder="$t('mapmaker.phcoord')"
          rows="5"
        />
        <textarea
          id="labels"
          v-model="labels"
          class="form-control mt-2 mb-2"
          :placeholder="$t('mapmaker.phlabel')"
          rows="5"
        />
        <div
          v-show="errormsg"
          class="errormsg"
        >
          {{ errormsg }}
      </div>
      </VCard>
    </div>
    <div class="card-stack">
      <VCard :title="$t('labels.map')">
        <v-map v-model:mylocation="coordfrom" />
      </VCard>
      </div>
  </div>
</template>

<script>
import * as coords from '@/scripts/coords.js';
import VMap from '@/components/generic/VMap.vue'
import VCard from '@/components/generic/VCard.vue'
import VDatums from '@/components/generic/VDatums.vue';
import VDistance from '@/components/generic/VDistance.vue';
import VShowOnMap from '@/components/generic/VShowOnMap.vue';
import L from 'leaflet';

export default {
  name: 'MapMaker',

  components: {
    VDatums,
    VDistance,
    VMap,
    VCard,
    VShowOnMap
  },

  data: function() {
    return {
      errormsg: "",
      from: "WGS84",
      coordfrom : "",
      labels: "",
      drawcircles: false,
      showlabels: true,
      showmarkers: true,
      unit: 1,
      dist: 165,
    }
  },

  mounted: function() {
    this.$refs.coordfrom.focus();
  },

  methods: {

    // Convert the coordinates
    makeMap: function() {

      // Reset error flag
      this.errormsg = "" ;
      this.result = "";
      let markertext = [];

      // No input
      if (!this.coordfrom) {
        this.errormsg = this.$t('errors.nocoords');
        return;
      }

      // If there are no labels default to coordinates
            if (!this.labels) {
        markertext = this.coordfrom.match(/[^\r\n]+/g);
      } else {
        markertext = this.labels.match(/[^\r\n]+/g);
      }

      // Get all the lines form input and convert them one by one
      let input = this.coordfrom.match(/[^\r\n]+/g);

      // Check if there are enough Labels
      if (input.length != markertext.length) {
        this.errormsg = this.$t('mapmaker.error1');
        return;
      }

      // Parse input line by line
      for (let i = 0; i < input.length; i++) {

        try {

          // Get the coordinates
          coords.convertCoordFromText(input[i], this.from, 'WGS84')
            .then ( mapcoord => {

              // Add a marker to the map for each coordinate
              if (this.showmarkers) {
                let marker = new L.marker(mapcoord).addTo(this.$store.state.mymap);

                // Create a popup that doesn't close and bind it to the marker
                if (this.showlabels) {
                  let p = new L.Popup({ autoClose: false, closeOnClick: false })
                        .setContent(markertext[i])
                        .setLatLng(mapcoord);
                  marker.bindPopup(p).openPopup();
                }
              }

              // Draw circles if requested
              if (this.drawcircles) {
                L.circle(mapcoord, {
                  color: "#E72E1C",
                  fillColor: "#EC7F74",
                  fillOpacity: 0.5,
                  radius: this.dist * this.unit
                }).addTo(this.$store.state.mymap);
                
              }

            })
            .catch ( (e) => {
              this.errormsg = this.$t('errors.incorrectcoords')
              console.log(e);
            });

        } catch(e) {

          this.errormsg = this.$t('errors.incorrectcoords')
          console.log(e);
          
        }
      }
    },
  },
}
</script>
