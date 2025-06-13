<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('project.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('project.long')"
      />
      <v-coord
        v-model:coord="coordinate"
        v-model:datum="selecteddatum"
        class="row me-2"
      />
      <v-distance
        v-model:dist="dist"
        v-model:unit="unit"
      />
      <v-angle
        v-model:angle="angle"
        v-model:unit="angleunit"
      />
      <v-show-on-map id="project" class="btn mb-2" @show="doCalc()" />
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
        {{ $t('project.projcoord') }}{{ result }}
      </div>
      <v-map v-model:mylocation="coordinate" />
    </div>
  </div>
</template>

<script>

import VCoord from '@/components/inputs/VCoord.vue';
import VAngle from '@/components/inputs/VAngle.vue';
import VDistance from '@/components/inputs/VDistance.vue';
import VMap from '@/components/inputs/VMap.vue';
import VShowOnMap from '@/components/inputs/VShowOnMap.vue';
import * as coords from '@/scripts/coords.js';

export default {
  name: 'Project',

  components: {
    VCoord,
    VDistance,
    VAngle,
    VMap,
    VShowOnMap
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

      // let gridsys = "EPSG:3857"; Google Mercator this doesn't work
      let gridsys = "RD";

      let startcoord, gridcoord, projcoord;

      try {
        
        // Translate the inputed coordinates to WGS84 for display on map
        coords.convertCoordFromText(this.coordinate, this.selecteddatum, "WGS84")
          .then (data => {

            // Get the coordinate in grid
            startcoord = data;
            return coords.convertCoordFromLatLon (startcoord, "WGS84", gridsys);

          })
          .then (data => {
            
            // Project grid coordinate and get coordinate in WGS
            gridcoord = data;
            return coords.convertCoordToWGS(
                      { lat: gridcoord.lat + (this.dist * this.unit) * Math.cos(this.angle * this.angleunit),
                        lon: gridcoord.lon + (this.dist * this.unit) * Math.sin(this.angle * this.angleunit) },
                        gridsys);
          })
          .then (data => {
            
            projcoord = data;

            // Set marker for the starting point and the projected coordinate
            coords.displayMarker(this.$store.state.mymap, startcoord, this.$t('project.startpoint'));
            coords.displayMarker(this.$store.state.mymap, projcoord, this.$t('project.projpoint'));
            
            // Draw a line on the map
            L.polyline([startcoord, projcoord], {color: 'red'}).addTo(this.$store.state.mymap);

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
