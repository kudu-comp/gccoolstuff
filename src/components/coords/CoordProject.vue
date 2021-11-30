<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{$t('coordinates.project.title')}}
    </div>
    <div class="mainpage">
      <div class="infoblock" v-html="$t('coordinates.project.long')" />
      <v-coord v-model:coord="coordinate" v-model:datum="selecteddatum" class="mr-2"></v-coord>
      <v-distance v-model:dist="dist" v-model:unit="unit"></v-distance>
      <v-angle v-model:angle="angle" v-model:unit="angleunit"></v-angle>
      <input type="button" id="project" :value="$t('buttons.calc')" class="btn btn-primary mb-2" v-on:click="doCalc()">
      <div class="errormsg" v-show="errormsg">{{errormsg}}</div>
      <div v-if="result" class="resultbox">{{$t('cdproj.projcoord')}}{{result}}</div>
      <v-map v-model:mylocation="coordinate"/>
    </div>
  </div>
</template>

<script>

import VCoord from '@/components/inputs/VCoord.vue';
import VAngle from '@/components/inputs/VAngle.vue';
import VDistance from '@/components/inputs/VDistance.vue';
import VMap from '@/components/inputs/VMap.vue'
import * as coords from '@/scripts/coords.js';

export default {
  name: 'CoordProject',

  components: {
    VCoord,
    VDistance,
    VAngle,
    VMap,
  },

  data: function () {
    return {
      coordinate: "",
      selecteddatum: "WGS84",
      angle: 0,
      angleunit: "0.0174532925",
      dist: 0,
      unit: 1,
      result: "",
      errormsg: "",
    }
  },

  methods: {

    doCalc: function () {

      // Reset error
      this.errormsg = "";
      this.result = "";

      let startcoord, gridcoord, projcoord;

      try {
        
        // Translate the inputed coordinates to WGS84 for display on map
        coords.convertCoordFromText(this.coordinate, this.selecteddatum, "WGS84")
          .then (data => {

            // Get the coordinate in grid
            startcoord = data;
            return coords.convertCoordFromLatLon (startcoord, "WGS84", "RD");

          })
          .then (data => {
            
            // Project grid coordinate and get coordinate in WGS
            gridcoord = data;
            return coords.convertCoordToWGS(
                      { lat: gridcoord.lat + (this.dist * this.unit) * Math.cos(this.angle * this.angleunit),
                        lon: gridcoord.lon + (this.dist * this.unit) * Math.sin(this.angle * this.angleunit) },
                        "RD");
          })
          .then (data => {
            
            projcoord = data;

            // Set marker for the starting point and the projected coordinate
            coords.displayMarker(this.$store.state.L, this.$store.state.mymap, startcoord, this.$t('cdproj.startpoint'));
            coords.displayMarker(this.$store.state.L, this.$store.state.mymap, projcoord, this.$t('cdproj.projpoint'));
            
            // Draw a line on the map
            this.$store.state.L.polyline([startcoord, projcoord], {color: 'red'}).addTo(this.$store.state.mymap);

            // Get the projected coordinate in the same datum as the input
            return coords.convertCoordFromWGS(projcoord, this.selecteddatum);

          })
          .then( data => {

            // Print the calculated coordinate in the right format
            this.result = coords.getTextFromCoord(data, this.selecteddatum, 7, this.coordinate);
            this.result += " or " + coords.printCoordinateFromDMS(projcoord, "N12 34.567 E1 23.456");

          })
          .catch ( (e) => {
            console.log(e);
            this.errormsg = this.$t('errors.incorrectcoords');
          });

      } catch (e) {

        console.log(e);
        this.errormsg = this.$t('errors.incorrectcoords');
        
      }
    },
  }
}
</script>
