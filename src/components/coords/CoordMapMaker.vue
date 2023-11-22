<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('coordinates.mapmaker.title') }}
    </div>
    <div class="mainpage">
      <div>
        <div
          class="infoblock"
          v-html="$t('coordinates.mapmaker.long')"
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
        <v-show-on-map id="go" class="btn me-2" @Show="makeMap()" />
        <div class="mb-2">
          <div class="form-check custom-checkbox me-2">
            <input
              id="showmarkers"
              v-model="showmarkers"
              type="checkbox"
              name="showmarkers"
              class="form-check-input"
            >
            <label
              for="showmarkers"
              class="form-check-label"
            >{{ $t('cdmapmaker.showmark') }}</label>
          </div>
          <div class="form-check  me-2">
            <input
              id="showlabels"
              v-model="showlabels"
              type="checkbox"
              name="showlabels"
              class="form-check-input"
            >
            <label
              for="showlabels"
              class="form-check-label"
            >{{ $t('cdmapmaker.showlabel') }}</label>
          </div>
          <div class="form-check me-2">
            <input
              id="drawcircles"
              v-model="drawcircles"
              type="checkbox"
              name="drawcircles"
              class="form-check-input"
            >
            <label
              for="drawcircles"
              class="form-check-label"
            >{{ $t('cdmapmaker.drawcircle') }}</label>
          </div>
          <div>
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
      </div>
      <div class="row mb-2">
        <div class="col-6">
          <textarea
            id="coordfrom"
            ref="x"
            v-model="coordfrom"
            name="coordfrom"
            class="form-control mt-2"
            :placeholder="$t('cdmapmaker.phcoord')"
            rows="5"
          />
        </div>
        <div class="col-6">
          <textarea
            id="labels"
            ref="x"
            v-model="labels"
            name="labels"
            class="form-control mt-2"
            :placeholder="$t('cdmapmaker.phlabel')"
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

export default {
  name: 'CoordConvert',

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
        this.errormsg = this.$t('cdmapmaker.error1');
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
                let marker = this.$store.state.L.marker(mapcoord).addTo(this.$store.state.mymap);

                // Create a popup that doesn't close and bind it to the marker
                if (this.showlabels) {
                  let p = new this.$store.state.L.Popup({ autoClose: false, closeOnClick: false })
                        .setContent(markertext[i])
                        .setLatLng(mapcoord);
                  marker.bindPopup(p).openPopup();
                }
              }

              // Draw circles if requested
              if (this.drawcircles) {
                this.$store.state.L.circle(mapcoord, {
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
