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
      <input type="button" id="project" :value="$t('buttons.calc')" class="btn btn-primary" v-on:click="doCalc()">
      <div class="card mt-2">
        <div class="card-text p-2">{{$t('cdproj.projcoord')}}{{result}}</div>
      </div>
      <div class="errormsg" v-show="error">{{errormsg}}</div>
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
        
        // Getting grid coord using grid based coordinate to calculate projection
        let gridcoord =  coords.convertCoordFromLatLon (startcoord, "WGS84", "RD");
        
        // Make projection and convert back to WGS84 for display
        let projcoord = coords.convertCoordToWGS(
            { lat: gridcoord.lat + (this.dist * this.unit) * Math.cos(this.angle * this.angleunit),
            lon: gridcoord.lon + (this.dist * this.unit) * Math.sin(this.angle * this.angleunit) },
            "RD");
        
        // Set marker for the starting point
        coords.displayMarker(this.$store.state.L, this.$store.state.mymap, startcoord, this.$t('cdproj.startpoint'));
        coords.displayMarker(this.$store.state.L, this.$store.state.mymap, projcoord, this.$t('cdproj.projpoint'));
        
        // Draw a line on the map
        this.$store.state.L.polyline([startcoord, projcoord], {color: 'red'}).addTo(this.$store.state.mymap);

        // Print the calculated coordinate in the right format
        this.result = coords.getTextFromCoord(coords.convertCoordFromWGS(projcoord, this.selecteddatum), this.selecteddatum, 7, this.coordinate);
        this.result += " or " + coords.printCoordinateFromDMS(projcoord, "N12 34.567 E1 23.456");

      } catch (e) {

        console.log(e);
        this.error = true;
        this.errormsg = this.$t('errors.incorrectcoords');
        
      }
    },
  }
}
</script>
