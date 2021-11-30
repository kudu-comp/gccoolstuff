<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{$t('coordinates.antipode.title')}}
    </div>
    <div class="mainpage">
      <div class="infoblock" v-html="$t('coordinates.antipode.long')" />
      <v-coord v-model:coord="coordinate" v-model:datum="selecteddatum"></v-coord>
      <input type="button" id="project" :value="$t('buttons.calc')" class="btn btn-primary mb-2 mr-2" v-on:click="doCalc()">
      <div class="errormsg" v-show="errormsg">{{errormsg}}</div>
      <div v-if="result" class="resultbox">{{$t('cdantipode.result')}}{{result}}</div>
      <v-map v-model:mylocation="coordinate"/>
    </div>
  </div>
</template>

<script>

import VCoord from '@/components/inputs/VCoord.vue';
import VMap from '@/components/inputs/VMap.vue'
import * as coords from '@/scripts/coords.js';

export default {
  name: 'CoordAntipode',

  components: {
    VCoord,
    VMap,
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
            anticoord = { lat: -1 * startcoord.lat, lon: -1 * (180 - Math.abs(startcoord.lon)) }
          
            // Display marker
            coords.displayMarker(this.$store.state.L, this.$store.state.mymap, anticoord, "Antipode");

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
