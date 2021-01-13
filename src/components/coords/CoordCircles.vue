<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{$t('coordinates.circles.title')}}
    </div>
    <div class="mainpage">
      <div class="infoblock">
        {{$t('dialogcircles.info')}}
      </div>
      <v-coord v-model:coord="coordinate1" v-model:datum="selecteddatum1">
        <template v-slot:label>{{$t('labels.center')}} 1</template>
      </v-coord>
      <v-distance v-model:dist="radius1" v-model:unit="unit1">
        <template v-slot:label>{{$t('labels.radius')}}</template>
      </v-distance>
      <v-coord v-model:coord="coordinate2" v-model:datum="selecteddatum2">
        <template v-slot:label>{{$t('labels.center')}} 2</template>
      </v-coord>
      <v-distance v-model:dist="radius2" v-model:unit="unit2">
        <template v-slot:label>{{$t('labels.radius')}}</template>
      </v-distance>
      <input type="button" id="go" :value="$t('buttons.calc')" class="btn btn-primary mb-2 mr-2" v-on:click="getPoints()">
      <div class="card card-text p-2">
        <div v-html="result"></div>
      </div>
      <div class="errormsg" v-show="error">{{errormsg}}</div>
      <v-map v-model:mylocation="coordinate1"/>
    </div>
  </div>
</template>

<script>

import VCoord from '@/components/inputs/VCoord.vue';
import VMap from '@/components/inputs/VMap.vue'
import VDistance from '@/components/inputs/VDistance.vue'
import * as coords from '@/scripts/coords.js';

export default {
  name: 'CoordProject',

  components: {
    VCoord,
    VMap,
    VDistance,
  },

  data: function () {
    return {
      coordinate1: "",
      coordinate2: "",
      selecteddatum1: "WGS84",
      selecteddatum2: "WGS84",
      radius1: 0,
      unit1: 1,
      radius2: 0,
      unit2: 1,
      result: this.$t('labels.result'),
      error: false,
      errormsg: "",
      phpurl: window.location.protocol + "//"  + window.location.hostname + "/coordcalc/coordcalc.php",
    }
  },

  methods: {

    getPoints: function () {

      // Reset error
      this.error = false;
      this.result = "Result";

      try {

        // Translate the inputed coordinates to WGS84 for display on map
        let coord1 = coords.convertCoordFromText(this.coordinate1, this.selecteddatum1, "WGS84");
        let coord2 = coords.convertCoordFromText(this.coordinate2, this.selecteddatum2, "WGS84");

        // Getting grid coord using grid based coordinate to calculate projection
        let gridcoord1 =  coords.convertCoordFromLatLon (coord1, "WGS84", "RD");
        let gridcoord2 =  coords.convertCoordFromLatLon (coord2, "WGS84", "RD");
        let r1 = this.radius1 * this.unit1;
        let r2 = this.radius2 * this.unit2;

        this.error = false;
        let data = {
          calc: 'circle',
          c1: {x : gridcoord1.lon, y: gridcoord1.lat, rad: r1},
          c2: {x : gridcoord2.lon, y: gridcoord2.lat, rad: r2 },
        };

        // Set markers
        coords.displayMarker(this.$store.state.L, this.$store.state.mymap, coord1, "Center 1");
        coords.displayMarker(this.$store.state.L, this.$store.state.mymap, coord2, "Center 2");

        // Draw circles
        this.$store.state.L.circle(coord1, {
          color: "#E72E1C",
          fillColor: "#EC7F74",
          fillOpacity: 0.5,
          radius: r1
        }).addTo(this.$store.state.mymap);
        this.$store.state.L.circle(coord2, {
          color: "#E72E1C",
          fillColor: "#EC7F74",
          fillOpacity: 0.5,
          radius: r2
        }).addTo(this.$store.state.mymap);

        // Call PHP script on server
        fetch(this.phpurl, {
            method: 'POST',
            body: JSON.stringify(data)
          })
          .then(response => response.json())
          .then(data => {

              if (data.intersect) {

                // Intersection

                // Convert points to WGS84
                let p1 = coords.convertCoordToWGS( {lat: data.p1.y, lon: data.p1.x}, "RD");
                let p2 = coords.convertCoordToWGS( {lat: data.p2.y, lon: data.p2.x}, "RD");

                this.result = "<br>" + this.$t('dialogcircles.ip') + " 1: " + coords.getTextFromCoord(coords.convertCoordFromWGS(p1, this.selecteddatum1), this.selecteddatum1, 7, this.coordinate1);
                this.result += this.$t('dialogcircles.or') + coords.printCoordinateFromDMS(p1, "N12 34.567 E1 23.456");
                this.result += "<br>" + this.$t('dialogcircles.ip') + " 2: " + coords.getTextFromCoord(coords.convertCoordFromWGS(p2, this.selecteddatum1), this.selecteddatum1, 7, this.coordinate1);
                this.result += this.$t('dialogcircles.or') + coords.printCoordinateFromDMS(p2, "N12 34.567 E1 23.456");
                this.result += "<br>" + this.$t('labels.distance') + ": " + data.distance.toFixed(0) + "m";
                this.result += "<br>" + this.$t('dialogcircles.ia') + ": " + data.area.toFixed(0) + "m<sup>2</sup>";

                // Display markers
                coords.displayMarker(this.$store.state.L, this.$store.state.mymap, p1, this.$t('dialogcircles.ip') + " 1");
                coords.displayMarker(this.$store.state.L, this.$store.state.mymap, p2, this.$t('dialogcircles.ip') + " 2");

              } else {

                // No intersection one circle is inside the other or they don't overlap at all
                this.result = this.$t('dialogcircles.ni');
                this.result += "<br>" + this.$t('dialogcircles.ia') + ": " + data.area.toFixed(0) + "m<sup>2</sup>";

              }

          })
          .catch((error) => {

              console.error('Error ', error);
              this.errormsg = this.$t('errors.incorrectcoords');
              this.error = true;
              
          });

        } catch (e) {

          console.log(e);
          this.error = true;
          this.errormsg =  this.$t('errors.incorrectcoords');
          
        }

    },

  }
}
</script>
