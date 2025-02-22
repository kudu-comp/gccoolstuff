<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('mapmaker.title') }}
    </div>
    <div class="mainpage">
      <div>
        <div
          class="infoblock"
          v-html="$t('mapmaker.long')"
        />
        <div class="row mb-2">
          <label
            class="form-label sm-size mb-2"
            for="from"
          >{{ $t('labels.coordformat') }}</label>
          <v-datums
            id="from"
            v-model:datum="from"
            class="md-size mb-2"
          />
        </div>
        <v-show-on-map id="go" class="btn mb-2 me-2" @Show="makeMap()" />
        <div class="form-check custom-checkbox mb-2 me-2">
          <input
            id="showmarkers"
            v-model="showmarkers"
            type="checkbox"
            class="form-check-input"
          >
          <label
            for="showmarkers"
            class="form-check-label"
          >{{ $t('mapmaker.showmark') }}</label>
        </div>
        <div class="form-check mb-2 me-2">
          <input
            id="showlabels"
            v-model="showlabels"
            type="checkbox"
            class="form-check-input"
          >
          <label
            for="showlabels"
            class="form-check-label"
          >{{ $t('mapmaker.showlabel') }}</label>
        </div>
        <div class="form-check mb-2 me-2">
          <input
            id="drawcircles"
            v-model="drawcircles"
            type="checkbox"
            class="form-check-input"
          >
          <label
            for="drawcircles"
            class="form-check-label"
          >{{ $t('mapmaker.drawcircle') }}</label>
        </div>
        <div class="mb-2">
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
      </div>
      <div class="row mb-2">
        <div class="col-6">
          <textarea
            id="coordfrom"
            v-model="coordfrom"
            class="form-control mt-2"
            :placeholder="$t('mapmaker.phcoord')"
            rows="5"
          />
        </div>
        <div class="col-6">
          <textarea
            id="labels"
            v-model="labels"
            class="form-control mt-2"
            :placeholder="$t('mapmaker.phlabel')"
            rows="5"
          />
        </div>
      </div>
      <div
        v-show="errormsg"
        class="errormsg"
      >
        {{ errormsg }}
      </div>
      <v-map v-model:mylocation="coordfrom" />
    </div>
  </div>
</template>

<script>
import * as coords from '@/scripts/coords.js';
import VMap from '@/components/inputs/VMap.vue'
import VDatums from '@/components/inputs/VDatums.vue';
import VDistance from '@/components/inputs/VDistance.vue';
import VShowOnMap from '@/components/inputs/VShowOnMap.vue';
import L from 'leaflet';

export default {
  name: 'MapMaker',

  components: {
    VDatums,
    VDistance,
    VMap,
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

  methods: {

    // Convert the coordinates
    makeMap: function() {

      // Reset error flag
      this.errormsg = "" ;
      this.result = "";

      // No input
      if (!this.coordfrom) {
        this.errormsg = this.$t('errors.nocoords');
        this.error = true;
        return;
      }

      // If there are no labels default to coordinates
      if (!this.labels) {
        this.labels = this.coordfrom;
      }

      // Get all the lines form input and convert them one by one
      let input = this.coordfrom.match(/[^\r\n]+/g);
      let markertext = this.labels.match(/[^\r\n]+/g);

      // Check if there are enough Labels
      if (input.length != markertext.length) {
        this.errormsg = this.$t('mapmaker.error1');
        this.error = true;
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
