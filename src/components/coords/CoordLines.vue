<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{$t('coordinates.lines.title')}}
    </div>
    <div class="mainpage">
      <div class="infoblock" v-html="$t('coordinates.lines.long')"/>
      <v-coord v-model:coord="coordinate1" v-model:datum="selecteddatum1" class="mb-2"><template v-slot:label>{{$t('labels.point')}} 1</template></v-coord>
      <v-coord v-model:coord="coordinate2" v-model:datum="selecteddatum2" class="mb-2"><template v-slot:label>{{$t('labels.point')}} 2</template></v-coord>
      <v-coord v-model:coord="coordinate3" v-model:datum="selecteddatum3" class="mb-2"><template v-slot:label>{{$t('labels.point')}} 3</template></v-coord>
      <v-coord v-model:coord="coordinate4" v-model:datum="selecteddatum4" class="mb-2"><template v-slot:label>{{$t('labels.point')}} 4</template></v-coord>
      <div>
        <label for="line1" class="col-10 col-md-8 col-lg-6">{{$t('cdlines.calc1')}}</label>
        <input type="button" id="line1" :value="$t('buttons.calc')" class="btn btn-primary mb-2 mr-2" v-on:click="doLine1()">
      </div>
      <div>
        <label for="line1" class="col-10 col-md-8 col-lg-6">{{$t('cdlines.calc2')}}</label>
        <input type="button" id="line1" :value="$t('buttons.calc')" class="btn btn-primary mb-2 mr-2" v-on:click="doLine2()">
      </div>
      <div>
        <label for="line1" class="col-10 col-md-8 col-lg-6">{{$t('cdlines.calc3')}}</label>
        <input type="button" id="line1" :value="$t('buttons.calc')" class="btn btn-primary mb-2 mr-2" v-on:click="doLine3()">
      </div>
      <div class="card card-text p-2">
        <div v-html="result"></div>
      </div>
      <div class="errormsg" v-show="error">{{errormsg}}</div>
      <v-map v-model:mylocation="coordinate1" />
    </div>
  </div>
</template>

<script>

import VCoord from '@/components/inputs/VCoord.vue';
import VMap from '@/components/inputs/VMap.vue'
import * as coords from '@/scripts/coords.js';

export default {
  name: 'CoordProject',

  components: {
    VCoord,
    VMap,
  },

  data: function () {
    return {
      coordinate1: "",
      coordinate2: "",
      coordinate3: "",
      coordinate4: "",
      selecteddatum1: "WGS84",
      selecteddatum2: "WGS84",
      selecteddatum3: "WGS84",
      selecteddatum4: "WGS84",
      result: this.result = this.$t('labels.result'),
      error: false,
      errormsg: "",
    }
  },

  methods: {

    // Returns the length between two coordinates (in grid)
    getLength: function (c1, c2) {
      return Math.sqrt((c1.lat - c2.lat)**2 + (c1.lon - c2.lon)**2);
    },

    // Get the direction btween two points (in grid), in degrees
    getDirection: function (c1, c2) {

      // Use inverse cosine
      let temp = Math.acos( (c2.lat - c1.lat) / this.getLength(c1,c2)) * 180 / Math.PI;
      //3e en 4e kwadrant
      if (c2.lon < c1.lon) temp = 360 - temp;
      return temp;

    },

    doLine1: function () {

      // Reset error
      this.error = false;
      this.result = this.$t('labels.result');
      let coord1, coord2, gridcoord1, gridcoord2, midpoint;

      try {

        // Translate the inputed coordinates to WGS84
        let promises = [
          coords.convertCoordFromText(this.coordinate1, this.selecteddatum1, "WGS84"),
          coords.convertCoordFromText(this.coordinate2, this.selecteddatum2, "WGS84")
        ];

        Promise.all(promises)
          .then ( data => {
            
            coord1 = data[0]
            coord2 = data[1];

            // Convert all coordinates to RD
            let promises = [
              coords.convertCoordFromLatLon (coord1, "WGS84", "RD"),
              coords.convertCoordFromLatLon (coord2, "WGS84", "RD")
            ]

            return Promise.all(promises);

          })
          .then (data => {

            gridcoord1 = data[0];
            gridcoord2 = data[1];

            return coords.convertCoordToWGS(
              { lat: (gridcoord1.lat + gridcoord2.lat)/2,
               lon: (gridcoord1.lon + gridcoord2.lon)/2 },"RD");
          })
          .then (data => {

            midpoint = data;

            // Set markers
            coords.displayMarker(this.$store.state.L, this.$store.state.mymap, coord1, this.$t('labels.point')+ " 1");
            coords.displayMarker(this.$store.state.L, this.$store.state.mymap, coord2, this.$t('labels.point')+ " 2");
            coords.displayMarker(this.$store.state.L, this.$store.state.mymap, midpoint, this.$t('cdlines.midpoint'));

            // Draw a line on the map
            this.$store.state.L.polyline([coord1, coord2], {color: 'red'}).addTo(this.$store.state.mymap);

            // Convert midpoint to input datum
            return coords.convertCoordFromWGS(midpoint, this.selecteddatum1)
          })
          .then (data => {

            // Print the calculated coordinate in the format of coordinate1
            this.result = this.$t('cdlines.midpoint') + ": " + coords.getTextFromCoord(data, this.selecteddatum1, 7, this.coordinate1);
            this.result += "<br>" + this.$t('cdlines.midpoint') + ": " + coords.printCoordinateFromDMS(midpoint, "N12 34.567 E1 23.456");

            // Distance (Pythagoras) is square root of delta-x ** 2 _ delta-y ** 2
            this.result += "<br>" + this.$t('cdlines.distance') + this.getLength(gridcoord1, gridcoord2).toFixed(0) + " m.";

            // Angle is the inverse tangens of delta-x / delta-y,  times 2*PI to convert to degrees
            this.result += "<br>"+ this.$t('cdlines.direction') + this.getDirection(gridcoord1, gridcoord2).toFixed(2) + "°";

          });

      } catch (e) {

        console.log(e);
        this.error = true;
        this.errormsg = this.$t('errors.incorrectcoords');

      }
    },

    doLine2: function () {
      // Reset error
      this.error = false;

      let coord1, coord2, coord3, gridcoord1, gridcoord2, gridcoord3, intersectionpoint, pmx, pmy;

      try {

        // Convert all coordinates to WGS
        let promises = [
          coords.convertCoordFromText(this.coordinate1, this.selecteddatum1, "WGS84"),
          coords.convertCoordFromText(this.coordinate2, this.selecteddatum2, "WGS84"),
          coords.convertCoordFromText(this.coordinate3, this.selecteddatum3, "WGS84")
        ]

        Promise.all(promises)
          .then (data => {

            coord1 = data[0];
            coord2 = data[1];
            coord3 = data[2];

            // Convert all coordinates to RD
            let promises = [
              coords.convertCoordFromLatLon (coord1, "WGS84", "RD"),
              coords.convertCoordFromLatLon (coord2, "WGS84", "RD"),
              coords.convertCoordFromLatLon (coord3, "WGS84", "RD")
            ]
            return Promise.all(promises);

          })
          .then (data => {

            gridcoord1 = data[0];
            gridcoord2 = data[1];
            gridcoord3 = data[2];

            // Get line thru 1 and 2
            let a = (gridcoord1.lat - gridcoord2.lat) / (gridcoord1.lon - gridcoord2.lon);
            let b = gridcoord1.lat - a * gridcoord1.lon;

            // Formula of line perpendicular on line 1 (line 2)
            let a2 = -1/a;
            let b2 = gridcoord3.lat - a2 * gridcoord3.lon;

            // Intersection poin when line1 and line 2 are equal
            pmx = (b2 - b) / (a - a2);
            pmy = a * pmx + b;
            return coords.convertCoordToWGS({ lon: pmx, lat:pmy }, "RD");

          })
          .then (data => {

            intersectionpoint = data;

            // Set markers
            coords.displayMarker(this.$store.state.L, this.$store.state.mymap, coord1, this.$t('labels.point') + " 1");
            coords.displayMarker(this.$store.state.L, this.$store.state.mymap, coord2, this.$t('labels.point') + " 2");
            coords.displayMarker(this.$store.state.L, this.$store.state.mymap, coord3, this.$t('labels.point') + " 3");
            coords.displayMarker(this.$store.state.L, this.$store.state.mymap, intersectionpoint, this.$t('cdlines.pointnearest'));

            // Draw a line on the map between Point 1 and 2
            this.$store.state.L.polyline([coord1, coord2], {color: 'red'}).addTo(this.$store.state.mymap);

            // Draw a line on the map between Point 1 and 2
            this.$store.state.L.polyline([coord3, intersectionpoint], {color: 'blue'}).addTo(this.$store.state.mymap);

            // Convert intersection point to input datum
            return coords.convertCoordFromWGS(intersectionpoint, this.selecteddatum1)
          })
          .then (data => {

            // Print the calculated coordinate in the format of coordinate1
            this.result = this.$t('cdlines.pointnearest') + coords.getTextFromCoord(data, this.selecteddatum1, 7, this.coordinate1);
            this.result += "<br>" + this.$t('cdlines.pointnearest') + coords.printCoordinateFromDMS(intersectionpoint, "N12 34.567 E1 23.456");

            this.result += "<br>"+ this.$t('cdlines.distance') + this.getLength({lon: pmx, lat:pmy}, gridcoord3).toFixed(0) + " m.";
            this.result += "<br>"+ this.$t('cdlines.direction') + this.getDirection({lon: pmx, lat:pmy}, gridcoord3).toFixed(2) + " degrees";

          })
          .catch (error => {
            throw (error)
          });

      } catch (e) {

        console.log(e);
        this.error = true;
        this.errormsg = this.$t('errors.incorrectcoords');

      }
    },

    doLine3: function () {
      // Reset error
      this.error = false;

      let coord1, coord2, coord3, coord4, gridcoord1, gridcoord2, gridcoord3, gridcoord4, intersectionpoint;

      try {

        // Convert all coordinates to WGS84
        let promises = [
          coords.convertCoordFromText(this.coordinate1, this.selecteddatum1, "WGS84"),
          coords.convertCoordFromText(this.coordinate2, this.selecteddatum2, "WGS84"),
          coords.convertCoordFromText(this.coordinate3, this.selecteddatum3, "WGS84"),
          coords.convertCoordFromText(this.coordinate4, this.selecteddatum4, "WGS84"),
        ]

        // Translate the inputed coordinates to WGS84 for display on map
        Promise.all(promises)        
          .then (data => {

            coord1 = data[0];
            coord2 = data[1];
            coord3 = data[2];
            coord4 = data[3];

            // Convert all coordinates to RD
            let promises = [
              coords.convertCoordFromLatLon (coord1, "WGS84", "RD"),
              coords.convertCoordFromLatLon (coord2, "WGS84", "RD"),
              coords.convertCoordFromLatLon (coord3, "WGS84", "RD"),
              coords.convertCoordFromLatLon (coord4, "WGS84", "RD")
            ];

            return Promise.all(promises);

          })
          .then (data => {

            gridcoord1 = data[0];
            gridcoord2 = data[1];
            gridcoord3 = data[2];
            gridcoord4 = data[3];

            // Get line thru 1 and 2
            let a = (gridcoord1.lat - gridcoord2.lat) / (gridcoord1.lon - gridcoord2.lon);
            let b = gridcoord1.lat - a * gridcoord1.lon;

            // Get line thru 3 and 4
            let a2 = (gridcoord3.lat - gridcoord4.lat) / (gridcoord3.lon - gridcoord4.lon);
            let b2 = gridcoord3.lat - a2 * gridcoord3.lon;

            // Intersection point when line1 and line 2 are equal
            let pmx = (b2 - b) / (a - a2);
            let pmy = a * pmx + b;

            // Convert intersection point to WGS
            return coords.convertCoordToWGS({ lon: pmx, lat:pmy }, "RD");

          })
          .then (data => {

            intersectionpoint = data;

            // Set markers
            coords.displayMarker(this.$store.state.L, this.$store.state.mymap, coord1, this.$t('labels.point') + " 1");
            coords.displayMarker(this.$store.state.L, this.$store.state.mymap, coord2, this.$t('labels.point') + " 2");
            coords.displayMarker(this.$store.state.L, this.$store.state.mymap, coord3, this.$t('labels.point') + " 3");
            coords.displayMarker(this.$store.state.L, this.$store.state.mymap, coord4, this.$t('labels.point') + " 4");
            coords.displayMarker(this.$store.state.L, this.$store.state.mymap, intersectionpoint, this.$t('cdlines.intersection'));

            // Draw a line on the map between Point 1 and 2 / 3 and 4
            this.$store.state.L.polyline([coord1, coord2], {color: 'red'}).addTo(this.$store.state.mymap);
            this.$store.state.L.polyline([coord3, coord4], {color: 'blue'}).addTo(this.$store.state.mymap);

            // Convert intersection point to input datum
            return coords.convertCoordFromWGS(intersectionpoint, this.selecteddatum1)

          })
          .then (data => {

            // Print the calculated coordinate in the format of coordinate1
            this.result = this.$t('cdlines.intersection') + coords.getTextFromCoord(data, this.selecteddatum1, 7, this.coordinate1);
            this.result += "<br>" + this.$t('cdlines.intersection') + coords.printCoordinateFromDMS(intersectionpoint, "N12 34.567 E1 23.456");

          })
          .catch (error => {
            throw(error)
          }) ;
       
      } catch (e) {

        console.log(e);
        this.error = true;
        this.errormsg = this.$t('errors.incorrectcoords');
        
      }
    },

  }
}
</script>
