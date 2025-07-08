<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('lines.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('lines.long')"
      />
      <v-coord
        v-model:coord="coordinate1"
        v-model:datum="selecteddatum1"
        class="mb-2"
      >
        <template #label>
          {{ $t('labels.point') }} 1
        </template>
        <template #popup>
          <button 
            class="btn md-size mb-2 ms-2" 
            @click="modal1 = true"
          >
            {{ $t('linepointdir.pdir') }}
          </button>
        </template>   
      </v-coord>
      <v-coord
        v-model:coord="coordinate2"
        v-model:datum="selecteddatum2"
        class="mb-2"
      >
        <template #label>
          {{ $t('labels.point') }} 2
        </template>
      </v-coord>
      <v-coord
        v-model:coord="coordinate3"
        v-model:datum="selecteddatum3"
        class="mb-2"
      >
        <template #label>
          {{ $t('labels.point') }} 3
        </template>
        <template #popup>
          <button 
            class="btn md-size mb-2 ms-2" 
            @click="modal2 = true"
          >
            {{ $t('linepointdir.pdir') }}
          </button>
        </template>        </v-coord>
      <v-coord
        v-model:coord="coordinate4"
        v-model:datum="selecteddatum4"
        class="mb-2"
      >
        <template #label>
          {{ $t('labels.point') }} 4
        </template>
      </v-coord>
      <v-line-point-dir
        v-if="modal1"
        v-model:lat1="lat1"
        v-model:lon1="lon1"
        v-model:lat2="lat2"
        v-model:lon2="lon2"
        @close="createLine(lat1,lon1,lat2,lon2,1); modal1 = false"
      />
      <v-line-point-dir
        v-if="modal2"
        v-model:lat1="lat1"
        v-model:lon1="lon1"
        v-model:lat2="lat2"
        v-model:lon2="lon2"
        @close="createLine(lat1,lon1,lat2,lon2,2); modal2 = false"
      />
      <div>
        <label
          for="line1"
          class="col-10 col-md-8 col-lg-6"
        >{{ $t('lines.calc1') }}</label>
        <v-show-on-map id="line1" class="btn mb-2 me-2" @show="doLine1()" />
      </div>
      <div>
        <label
          for="line1"
          class="col-10 col-md-8 col-lg-6"
        >{{ $t('lines.calc2') }}</label>
        <v-show-on-map id="line2" class="btn mb-2 me-2" @show="doLine2()" />
      </div>
      <div>
        <label
          for="line1"
          class="col-10 col-md-8 col-lg-6"
        >{{ $t('lines.calc3') }}</label>
        <v-show-on-map id="line3" class="btn mb-2 me-2" @show="doLine3()" />
      </div>
      <div
        v-if="result"
        class="resultbox"
        v-html="result"
      />
      <div
        v-show="errormsg"
        class="errormsg"
      >
        {{ errormsg }}
      </div>
      <v-map v-model:mylocation="coordinate1" />
    </div>
  </div>
</template>

<script>

import VCoord from '@/components/inputs/VCoord.vue';
import VMap from '@/components/inputs/VMap.vue'
import * as coords from '@/scripts/coords.js';
import VShowOnMap from '@/components/inputs/VShowOnMap.vue';
import VLinePointDir from '@/components/inputs/VLinePointDir.vue';
import L from "leaflet";

export default {

  name: 'Lines',

  components: {
    VCoord,
    VMap,
    VShowOnMap,
    VLinePointDir
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
      result: "",
      errormsg: "",
      modal1: false,
      modal2: false,
      lat1: 0,
      lon1: 0,
      lat2: 0,
      lon2: 0
    }
  },

  methods: {

    createLine: function (lat1, lon1, lat2, lon2, line) {

      let coord1 = { lat: lat1, lon: lon1 };
      let coord2 = { lat: lat2, lon: lon2 };
      let coord = { lat: 0, lon: 0 };

      // Convert coordinate to selected datum
      let seldatum1 = (line === 2) ? this.selecteddatum3 : this.selecteddatum1;
      let seldatum2 = (line === 2) ? this.selecteddatum4 : this.selecteddatum2;

      coords.convertCoordFromLatLon (coord1, "RD", seldatum1)
        .then (data => {
          coord = data;
          if (line === 1) {
            this.coordinate1 = coords.getTextFromCoord(coord, seldatum1, 7);
          } else {
            this.coordinate3 = coords.getTextFromCoord(coord, seldatum1, 7);
          }
          return coords.convertCoordFromLatLon (coord2, "RD", seldatum2)
        })
        .then (data => {
          coord = data;
          if (line === 1) {
            this.coordinate2 = coords.getTextFromCoord(coord, seldatum2, 7);
          } else {
            this.coordinate4 = coords.getTextFromCoord(coord, seldatum2, 7);
          }
        })

    },  

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
      this.errormsg = "";
      this.result = "";
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
            coords.displayMarker(this.$store.state.mymap, coord1, this.$t('labels.point')+ " 1");
            coords.displayMarker(this.$store.state.mymap, coord2, this.$t('labels.point')+ " 2");
            coords.displayMarker(this.$store.state.mymap, midpoint, this.$t('lines.midpoint'));

            // Draw a line on the map
            L.polyline([coord1, coord2], {color: 'red'}).addTo(this.$store.state.mymap);

            // Convert midpoint to input datum
            return coords.convertCoordFromWGS(midpoint, this.selecteddatum1)
          })
          .then (data => {

            // Print the calculated coordinate in the format of coordinate1
            this.result = this.$t('lines.midpoint') + ": " + coords.getTextFromCoord(data, this.selecteddatum1, 7, this.coordinate1);
            this.result += "<br>" + this.$t('lines.midpoint') + ": " + coords.printCoordinateFromDMS(midpoint, "N12 34.567 E1 23.456");

            // Distance (Pythagoras) is square root of delta-x ** 2 _ delta-y ** 2
            this.result += "<br>" + this.$t('lines.distance') + this.getLength(gridcoord1, gridcoord2).toFixed(0) + " m.";

            // Angle is the inverse tangens of delta-x / delta-y,  times 2*PI to convert to degrees
            this.result += "<br>"+ this.$t('lines.direction') + this.getDirection(gridcoord1, gridcoord2).toFixed(2) + "°";

          });

      } catch (e) {

        console.log(e);
        this.errormsg = this.$t('errors.incorrectcoords');

      }
    },

    doLine2: function () {
      // Reset error
      this.errormsg = "";
      this.result = "";

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
            coords.displayMarker(this.$store.state.mymap, coord1, this.$t('labels.point') + " 1");
            coords.displayMarker(this.$store.state.mymap, coord2, this.$t('labels.point') + " 2");
            coords.displayMarker(this.$store.state.mymap, coord3, this.$t('labels.point') + " 3");
            coords.displayMarker(this.$store.state.mymap, intersectionpoint, this.$t('lines.pointnearest'));

            // Draw a line on the map between Point 1 and 2
            L.polyline([coord1, coord2], {color: 'red'}).addTo(this.$store.state.mymap);

            // Draw a line on the map between Point 1 and 2
            L.polyline([coord3, intersectionpoint], {color: 'blue'}).addTo(this.$store.state.mymap);

            // Convert intersection point to input datum
            return coords.convertCoordFromWGS(intersectionpoint, this.selecteddatum1)
          })
          .then (data => {

            // Print the calculated coordinate in the format of coordinate1
            this.result = this.$t('lines.pointnearest') + coords.getTextFromCoord(data, this.selecteddatum1, 7, this.coordinate1);
            this.result += "<br>" + this.$t('lines.pointnearest') + coords.printCoordinateFromDMS(intersectionpoint, "N12 34.567 E1 23.456");

            this.result += "<br>"+ this.$t('lines.distance') + this.getLength({lon: pmx, lat:pmy}, gridcoord3).toFixed(0) + " m.";
            this.result += "<br>"+ this.$t('lines.direction') + this.getDirection({lon: pmx, lat:pmy}, gridcoord3).toFixed(2) + " degrees";

          })
          .catch (e => {
            console.log(e);
            this.errormsg = this.$t('errors.incorrectcoords');
          });

      } catch (e) {

        console.log(e);
        this.errormsg = this.$t('errors.incorrectcoords');

      }
    },

    doLine3: function () {
      // Reset error
      this.errormsg = "";
      this.result = "";

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
            coords.displayMarker(this.$store.state.mymap, coord1, this.$t('labels.point') + " 1");
            coords.displayMarker(this.$store.state.mymap, coord2, this.$t('labels.point') + " 2");
            coords.displayMarker(this.$store.state.mymap, coord3, this.$t('labels.point') + " 3");
            coords.displayMarker(this.$store.state.mymap, coord4, this.$t('labels.point') + " 4");
            coords.displayMarker(this.$store.state.mymap, intersectionpoint, this.$t('lines.intersection'));

            // Draw a line on the map between Point 1 and 2 / 3 and 4
            L.polyline([coord1, coord2], {color: 'red'}).addTo(this.$store.state.mymap);
            L.polyline([coord3, coord4], {color: 'blue'}).addTo(this.$store.state.mymap);

            // Convert intersection point to input datum
            return coords.convertCoordFromWGS(intersectionpoint, this.selecteddatum1)

          })
          .then (data => {

            // Print the calculated coordinate in the format of coordinate1
            this.result = this.$t('lines.intersection') + coords.getTextFromCoord(data, this.selecteddatum1, 7, this.coordinate1);
            this.result += "<br>" + this.$t('lines.intersection') + coords.printCoordinateFromDMS(intersectionpoint, "N12 34.567 E1 23.456");

          })
          .catch (e => {
            console.log(e);
            this.errormsg = this.$t('errors.incorrectcoords');
          }) ;
       
      } catch (e) {

        console.log(e);
        this.errormsg = this.$t('errors.incorrectcoords');
        
      }
    },

  }
}
</script>
