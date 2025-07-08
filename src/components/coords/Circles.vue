<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('circles.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('circles.long')"
      />
      <v-coord
        v-model:coord="coordinate1"
        v-model:datum="selecteddatum1"
      >
        <template #label>
          {{ $t('labels.center') }} 1
        </template>
        <template #popup>
          <button 
            class="btn sm-size mb-2 ms-2" 
            @click="modal1 = true"
          >
            {{ $t('circles.from3p') }}
          </button>
        </template>     
      </v-coord>
      <v-distance
        v-model:dist="radius1"
        v-model:unit="unit1"
      >
        <template #label>
          {{ $t('labels.radius') }}
        </template>
      </v-distance>
      <v-coord
        v-model:coord="coordinate2"
        v-model:datum="selecteddatum2"
      >
        <template #label>
          {{ $t('labels.center') }} 2
        </template>
        <template #popup>
          <button 
            class="btn sm-size mb-2 ms-2" 
            @click="modal2 = true"
          >
            {{ $t('circles.from3p') }}
          </button>
        </template>    
      </v-coord>
      <v-distance
        v-model:dist="radius2"
        v-model:unit="unit2"
      >
        <template #label>
          {{ $t('labels.radius') }}
        </template>
      </v-distance>
      <v-circle3p
        v-if="modal1"
        v-model:lat="lat1"
        v-model:lon="lon1"
        v-model:radius="radius1"
        @close="createCenter(lat1,lon1,1); modal1 = false"
      />
      <v-circle3p
        v-if="modal2"
        v-model:lat="lat2"
        v-model:lon="lon2"
        v-model:radius="radius2"
        @close="createCenter(lat2,lon2,2); modal2 = false"
      />
      <v-show-on-map id="go" class="btn mb-2 me-2" @show="getPoints()" />
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
import VDistance from '@/components/inputs/VDistance.vue'
import * as coords from '@/scripts/coords.js';
import VShowOnMap from '@/components/inputs/VShowOnMap.vue'
import L from "leaflet";
import VCircle3p from '@/components/inputs/VCircle3p.vue';

export default {
  
  name: 'Circles',

  components: {
    VCoord,
    VMap,
    VDistance,
    VShowOnMap,
    VCircle3p
  },

  data: function () {
    return {
      coordinate1: "",
      coordinate2: "",
      selecteddatum1: "WGS84",
      selecteddatum2: "WGS84",
      radius1: 0,
      unit1: 1,
      modal1: false,
      radius2: 0,
      unit2: 1,
      modal2: false,
      result: "",
      errormsg: "",
      phpurl: window.location.protocol + "//"  + window.location.hostname + "/coordcalc/coordcalc.php",
      // Vars for popup circle3p
      lat1 : 0,
      lon1: 0,
      lat2: 0,
      lon2: 0
    }
  },

  methods: {

    createCenter: function (lat, lon, h) {

      // Create center coordinate from lat and lon provided in RD by circle3p component
      let coord = { lat: lat, lon: lon };
      // Convert coordinate to selected datum
      let seldatum = (h === 2) ? this.selecteddatum2 : this.selecteddatum1;
      console.log("seldatum", seldatum);
      coords.convertCoordFromLatLon (coord, "RD", seldatum)
        .then (data => {
          coord = data;
          if (h === 2) {
            this.coordinate2 = coords.getTextFromCoord(coord, seldatum, 7);
          } else {
            this.coordinate1 = coords.getTextFromCoord(coord, seldatum, 7);
          }
        })
    },

    getPoints: function () {

      // Reset error
      this.errormsg = "";
      this.result = "";

      let coord1, coord2, gridcoord1, gridcoord2;

      // If there is no 2nd circle just show the first one
      if (this.coordinate2 === "") {
        let r = this.radius1 * this.unit1;
        coords.convertCoordFromText(this.coordinate1, this.selecteddatum1, "WGS84")
          .then (data => {
            coord1 = data;
            coords.displayMarker(this.$store.state.mymap, coord1, "Center 1");
            L.circle(coord1, {
                  color: "#E72E1C",
                  fillColor: "#EC7F74",
                  fillOpacity: 0.5,
                  radius: r
                }).addTo(this.$store.state.mymap);
            this.result = this.$t('circles.surf') + "1: " + (r*Math.PI^2).toFixed(2) + " m<br>";
            this.result += this.$t('circles.circ') + "1: " + (r*2*Math.PI).toFixed(2) + " m<sup>2</sup><br>";
          })
        this.errormsg = this.$t('circles.nocircle2');
        return;
      }

      try {

        coords.convertCoordFromText(this.coordinate1, this.selecteddatum1, "WGS84")
          .then (data => {
            coord1 = data;
            return coords.convertCoordFromText(this.coordinate2, this.selecteddatum2, "WGS84");
          })
          .then (data => {
            coord2 = data;
            return coords.convertCoordFromLatLon (coord1, "WGS84", "RD");
          })
          .then (data => {
            gridcoord1 = data;
            return coords.convertCoordFromLatLon (coord2, "WGS84", "RD");
          })
          .then (data => {
            gridcoord2 = data;

            let r1 = this.radius1 * this.unit1;
            let r2 = this.radius2 * this.unit2;

            // Set markers
            coords.displayMarker(this.$store.state.mymap, coord1, "Center 1");
            coords.displayMarker(this.$store.state.mymap, coord2, "Center 2");

            // Draw circles
            L.circle(coord1, {
              color: "#E72E1C",
              fillColor: "#EC7F74",
              fillOpacity: 0.5,
              radius: r1
            }).addTo(this.$store.state.mymap);
            L.circle(coord2, {
              color: "#E72E1C",
              fillColor: "#EC7F74",
              fillOpacity: 0.5,
              radius: r2
            }).addTo(this.$store.state.mymap);

            let inputdata = {
              calc: 'circle',
              c1: {x : gridcoord1.lon, y: gridcoord1.lat, rad: r1},
              c2: {x : gridcoord2.lon, y: gridcoord2.lat, rad: r2 },
            };

            // Call PHP script to calculate circles intersection points
            return fetch(this.phpurl, {
              method: 'POST',
              body: JSON.stringify(inputdata)
            })
            .then (response => response.json())
            .then (data => {

              // First print area and circumference of both circles
              this.result = this.$t('circles.surf') + "1: " + data.c1.surface.toFixed(0) + " m<br>";
              this.result += this.$t('circles.circ') + "1: " + data.c1.circumference.toFixed(0) + " m<sup>2</sup><br>";
              this.result += this.$t('circles.surf') + "2: " + data.c2.surface.toFixed(0) + " m<br>";
              this.result += this.$t('circles.circ') + "2: " + data.c2.circumference.toFixed(0) + " m<sup>2</sup><br>";

              // If circles intersect print coordinates of intersection points
              if (data.intersect) {

                // Convert points to WGS84
                let p1, p2, convp1, convp2;
                coords.convertCoordToWGS( {lat: data.p1.y, lon: data.p1.x}, "RD")
                  .then (datap1 => {
                    p1 = datap1;
                    return coords.convertCoordToWGS( {lat: data.p2.y, lon: data.p2.x}, "RD");
                  })
                  .then (datap2 => {
                    p2 = datap2;
                    // Convert p1 to input datum
                    return coords.convertCoordFromWGS(p1, this.selecteddatum1)
                  })
                  .then (datacp1 => {
                    convp1 = datacp1;
                    // Convert p2 to input data
                    return coords.convertCoordFromWGS(p2, this.selecteddatum1)
                  })
                  .then (datacp2 => {

                    convp2 = datacp2;
                    this.result += this.$t('circles.ip') + " 1: " + coords.getTextFromCoord(convp1, this.selecteddatum1, 7, this.coordinate1);
                    this.result += this.$t('circles.or') + coords.printCoordinateFromDMS(p1, "N12 34.567 E1 23.456");
                    this.result += "<br>" + this.$t('circles.ip') + " 2: " + coords.getTextFromCoord(convp2, this.selecteddatum1, 7, this.coordinate1);
                    this.result += this.$t('circles.or') + coords.printCoordinateFromDMS(p2, "N12 34.567 E1 23.456");
                    this.result += "<br>" + this.$t('circles.distance') + ": " + data.distance.toFixed(0) + "m";
                    this.result += "<br>" + this.$t('circles.ia') + ": " + data.area.toFixed(0) + "m<sup>2</sup>";

                    // Display markers
                    coords.displayMarker(this.$store.state.mymap, p1, this.$t('circles.ip') + " 1");
                    coords.displayMarker(this.$store.state.mymap, p2, this.$t('circles.ip') + " 2");

                  })
                  .catch (e => {

                    this.errormsg = this.$t('errors.incorrectcoords');
                    console.error(e.message);

                  });
                
              } else {

                // No intersection one circle is inside the other or they don't overlap at all
                this.result += this.$t('circles.ni');
                this.result += "<br>" + this.$t('circles.ia') + ": " + data.area.toFixed(0) + "m<sup>2</sup>";

              }

          })
            .catch ( (error) => {

              console.error('Error ', error);
              this.errormsg = this.$t('errors.incorrectcoords');
              
            });

          })
          .catch ( (error) => {
            console.error('Error ', error);
            this.errormsg = this.$t('errors.incorrectcoords');
          });

        } catch (e) {

          console.log(e);
          this.errormsg =  this.$t('errors.incorrectcoords');
          
        }

    },

  }
}
</script>
