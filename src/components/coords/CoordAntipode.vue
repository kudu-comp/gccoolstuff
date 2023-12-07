<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('coordinates.antipode.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('coordinates.antipode.long')"
      />
      <v-coord
        v-model:coord="coordinate"
        v-model:datum="selecteddatum"
      />
      <v-show-on-map id="go" class="btn mr-2" @Show="doCalc()" />
      <div
        v-show="errormsg"
        class="errormsg"
      >
        {{ errormsg }}
      </div>
      <div
        v-if="result"
        class="resultbox"
      >
        {{ $t('cdantipode.result') }}{{ result }}
      </div>
      <v-map v-model:mylocation="coordinate" />
    </div>
  </div>
</template>

<script>

import VCoord from '@/components/inputs/VCoord.vue';
import VMap from '@/components/inputs/VMap.vue'
import * as coords from '@/scripts/coords.js';
import VShowOnMap from '@/components/inputs/VShowOnMap.vue';

export default {
  name: 'CoordAntipode',

  components: {
    VCoord,
    VMap,
    VShowOnMap
  },

  data: function () {
    return {
      coordinate: "",
      selecteddatum: "WGS84",
      result: "",
      errormsg: "",
    }
  },

  methods: {

    doCalc: function () {

      // Reset error
      this.errormsg = "";
      let anticoord;

      try {
        // Translate the inputed coordinates to WGS84 for display on map
        
        coords.convertCoordFromText(this.coordinate, this.selecteddatum, "WGS84")
          .then (startcoord => {

            // Getting anitpode coordinate with some basic math
            console.log(startcoord);
            anticoord = { lon: startcoord.lon-180, lat: -1 * startcoord.lat }
            if (anticoord.lon < -180) {
              anticoord.lon += 360;
            }
            console.log(anticoord);
            // Display marker
            coords.displayMarker(this.$store.state.mymap, anticoord, "Antipode");

            // Convert antipode coordinate to input datum
            return coords.convertCoordFromWGS(anticoord, this.selecteddatum);
          })
          .then (convcoord => {

            // Print the antipode coordinate in the right format
            this.result = coords.getTextFromCoord(convcoord, this.selecteddatum, 7, this.coordinate)
            this.result += this.$t('cdantipode.or') + coords.printCoordinateFromDMS(anticoord, "N12 34.567 E1 23.456");

          })
          .catch ( (e) => {

            this.errormsg = this.$t('errors.incorrectcoords');
            console.log(e.message);

          });
          
      } catch (e) {

        console.log(e);
        this.errormsg = this.$t('errors.incorrectcoords');
        
      }
    }
  }
}
</script>
