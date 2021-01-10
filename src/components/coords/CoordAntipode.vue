<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{$t('coordinates.antipode.title')}}
    </div>
    <div class="mainpage">
      <div class="infoblock">
        {{$t('dialogantipode.info')}}
      </div>
      <v-coord v-model:coord="coordinate" v-model:datum="selecteddatum"></v-coord>
      <input type="button" id="project" :value="$t('buttons.calc')" class="btn btn-primary mb-2 mr-2" v-on:click="doCalc()">
      <div class="card">
        <div class="card-text p-2">{{$t('dialogantipode.result')}}{{result}}</div>
      </div>
      <div class="errormsg" v-show="error">{{errormsg}}</div>
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
      error: false,
      errormsg: "",
    }
  },

  methods: {

    doCalc: function () {

      // Reset error
      this.error = false;

      try {
        // Translate the inputed coordinates to WGS84 for display on map
        var startcoord = coords.convertCoordFromText(this.coordinate, this.selecteddatum, "WGS84");
        console.log(startcoord);

        // Set marker for the starting point
        // var marker1 = this.L.marker([startcoord.lat, startcoord.lon]).addTo(this.mymap);
        // marker1.bindPopup("Starting point").openPopup();

        // Getting grid coord using Google pseudomap mercator to calculate projection
        var anticoord =  { lat: -1 * startcoord.lat, lon: -1 * (180 - Math.abs(startcoord.lon)) }
        console.log(anticoord);

        // Display marker
        coords.displayMarker(this.$store.state.L, this.$store.state.mymap, anticoord, "Antipode");

        // Print the calculated coordinate in the right format
        this.result = coords.getTextFromCoord(coords.convertCoordFromWGS(anticoord, this.selecteddatum), this.selecteddatum, 7, this.coordinate);
        this.result += this.$t('dialogantipode.or') + coords.printCoordinateFromDMS(anticoord, "N12 34.567 E1 23.456");

      } catch (e) {
        this.error = true;
        console.log(e);
        this.errormsg = this.$t('errors.incorrectcoords');
      }
    }
  }
}
</script>
