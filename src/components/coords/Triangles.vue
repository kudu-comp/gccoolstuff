<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('triangles.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('triangles.long')"
      />
      <v-coord
        v-model:coord="coordinate1"
        v-model:datum="selecteddatum1"
        class="mb-2"
      >
        <template #label>
          {{ $t('labels.point') }} 1
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
      </v-coord>
      <v-show-on-map id="go" class="btn mr-2" @Show="getPoints()" />
      <div
        v-show="errormsg"
        class="errormsg"
      >
        {{ errormsg }}
      </div>
      <div
        v-if="result"
        class="resultbox"
        v-html="result"
      />
      <v-map v-model:mylocation="coordinate1" />
    </div>
  </div>
</template>

<script>

import VCoord from '@/components/inputs/VCoord.vue';
import VMap from '@/components/inputs/VMap.vue'
import * as coords from '@/scripts/coords.js';
import VShowOnMap from '@/components/inputs/VShowOnMap.vue';
import L from "leaflet";

export default {
  name: 'Triangles',

  components: {
    VCoord,
    VMap,
    VShowOnMap
  },

  data: function () {
    return {
      coordinate1: "",
      coordinate2: "",
      coordinate3: "",
      selecteddatum1: "WGS84",
      selecteddatum2: "WGS84",
      selecteddatum3: "WGS84",
      result: "",
      errormsg: "",
      phpurl: window.location.protocol + "//"  + window.location.hostname + "/coordcalc/coordcalc.php",
    }
  },

  methods: {

    getPoints: function () {

      // Reset error
      this.errormsg = "";
      this.result = "";
      let coord1, coord2, coord3, gridcoord1, gridcoord2, gridcoord3;

      try {

        // Translate the inputed coordinates to WGS84 for display on map
        coords.convertCoordFromText(this.coordinate1, this.selecteddatum1, "WGS84")
          .then (data => {
            coord1 = data;
            return coords.convertCoordFromText(this.coordinate2, this.selecteddatum2, "WGS84");
          })
          .then (data => {
            coord2 = data;
            return coords.convertCoordFromText(this.coordinate3, this.selecteddatum3, "WGS84");
          })
          .then (data => {
            coord3 = data;
            return coords.convertCoordFromLatLon (coord1, "WGS84", "RD");
          })
          .then (data => {
            gridcoord1 = data;
            return coords.convertCoordFromLatLon (coord2, "WGS84", "RD");
          })
          .then (data => {
            gridcoord2 = data;
            return coords.convertCoordFromLatLon (coord3, "WGS84", "RD");
          })
          .then (data => {
            gridcoord3 = data;

            // Set markers
            coords.displayMarker(this.$store.state.mymap, coord1, this.$t('labels.point')+ " 1");
            coords.displayMarker(this.$store.state.mymap, coord2, this.$t('labels.point')+ " 2");
            coords.displayMarker(this.$store.state.mymap, coord3, this.$t('labels.point')+ " 3");

            // Draw Triangle
            L.polyline([coord1, coord2, coord3, coord1], {color: 'red'}).addTo(this.$store.state.mymap);

            let inputdata = {
              calc: 'triangle',
              p1: {x : gridcoord1.lon, y: gridcoord1.lat },
              p2: {x : gridcoord2.lon, y: gridcoord2.lat },
              p3: {x : gridcoord3.lon, y: gridcoord3.lat },
            };

            // Call PHP script on server
            fetch(this.phpurl, {
                method: 'POST',
                body: JSON.stringify(inputdata)
              })
              .then(response => response.json())
              .then(data => {

                  // Print and plot the results
                  this.result = this.$t('labels.surface') + ": " + data.surface.toFixed(0) + "m";
                  this.result += "<br>" + this.$t('labels.circumference') + ": "  + data.circumference.toFixed(0) + "m<sup>2</sup>";

                  // Convert all triangle points to WGS84
                  let promises = [
                    coords.convertCoordToWGS( {lat: data.centroid.y, lon: data.centroid.x}, "RD"),
                    coords.convertCoordToWGS( {lat: data.orthocenter.y, lon: data.orthocenter.x}, "RD"),
                    coords.convertCoordToWGS( {lat: data.incenter.y, lon: data.incenter.x}, "RD"),
                    coords.convertCoordToWGS( {lat: data.circumcenter.y, lon: data.circumcenter.x}, "RD"),
                    coords.convertCoordToWGS( {lat: data.ninepointcenter.y, lon: data.ninepointcenter.x}, "RD")
                  ];

                  let centroid, orthocenter, incenter, circumcenter, ninepointcenter;

                  Promise.all(promises)
                    .then( points => {

                      centroid = points[0];
                      orthocenter = points[1];
                      incenter = points[2];
                      circumcenter = points[3];
                      ninepointcenter = points[4];
                      
                      // Convert all triangle points to selected datum
                      let promises2 = [
                        coords.convertCoordFromWGS(centroid, this.selecteddatum1),
                        coords.convertCoordFromWGS(orthocenter, this.selecteddatum1),
                        coords.convertCoordFromWGS(incenter, this.selecteddatum1),
                        coords.convertCoordFromWGS(circumcenter, this.selecteddatum1),
                        coords.convertCoordFromWGS(ninepointcenter, this.selecteddatum1)
                      ]

                      return Promise.all(promises2)

                    })
                    .then ( points => {

                      // Print results
                      this.result += "<br>" + this.$t('triangles.centroid') + ": " + coords.getTextFromCoord(points[0], this.selecteddatum1, 7, this.coordinate1);
                      this.result += this.$t('triangles.or') + coords.printCoordinateFromDMS(centroid, "N12 34.567 E1 23.456");
                      this.result += "<br>"+ this.$t('triangles.orthocenter') + ": " + coords.getTextFromCoord(points[1], this.selecteddatum1, 7, this.coordinate1);
                      this.result += this.$t('triangles.or') + coords.printCoordinateFromDMS(orthocenter, "N12 34.567 E1 23.456");
                      this.result += "<br>"+ this.$t('triangles.incenter') + ": " + coords.getTextFromCoord(points[2], this.selecteddatum1, 7, this.coordinate1);
                      this.result += this.$t('triangles.or') + coords.printCoordinateFromDMS(incenter, "N12 34.567 E1 23.456");
                      this.result += "<br>"+ this.$t('triangles.circumcenter') + ": " + coords.getTextFromCoord(points[3], this.selecteddatum1, 7, this.coordinate1);
                      this.result += this.$t('triangles.or') + coords.printCoordinateFromDMS(circumcenter, "N12 34.567 E1 23.456");
                      this.result += "<br>"+ this.$t('triangles.ninepoint') + ": " + coords.getTextFromCoord(points[4], this.selecteddatum1, 7, this.coordinate1);
                      this.result += this.$t('triangles.or') + coords.printCoordinateFromDMS(ninepointcenter, "N12 34.567 E1 23.456");

                      // Display markers
                      coords.displayMarker(this.$store.state.mymap, centroid, this.$t('triangles.centroid'));
                      coords.displayMarker(this.$store.state.mymap, orthocenter, this.$t('triangles.orthocenter'));
                      coords.displayMarker(this.$store.state.mymap, incenter, this.$t('triangles.incenter'));
                      coords.displayMarker(this.$store.state.mymap, circumcenter, this.$t('triangles.circumcenter'));
                      coords.displayMarker(this.$store.state.mymap, ninepointcenter, this.$t('triangles.ninepoint'));

                    })

              })
              .catch((error) => {

                  console.error('Error ', error);
                  this.errormsg = this.$t('errors.incorrectcoords');

              });

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
