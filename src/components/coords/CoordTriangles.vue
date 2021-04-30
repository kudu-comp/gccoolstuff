<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{$t('coordinates.triangles.title')}}
    </div>
    <div class="mainpage">
      <div class="infoblock" v-html="$t('coordinates.triangles.long')" />
      <v-coord v-model:coord="coordinate1" v-model:datum="selecteddatum1" class="mb-2">
        <template v-slot:label>{{$t('labels.point')}} 1</template>
      </v-coord>
      <v-coord v-model:coord="coordinate2" v-model:datum="selecteddatum2" class="mb-2">
        <template v-slot:label>{{$t('labels.point')}} 2</template>
      </v-coord>
      <v-coord v-model:coord="coordinate3" v-model:datum="selecteddatum3" class="mb-2">
        <template v-slot:label>{{$t('labels.point')}} 3</template>
      </v-coord>
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
      selecteddatum1: "WGS84",
      selecteddatum2: "WGS84",
      selecteddatum3: "WGS84",
      result: this.result = this.$t('labels.result'),
      error: false,
      errormsg: "",
      phpurl: window.location.protocol + "//"  + window.location.hostname + "/coordcalc/coordcalc.php",
    }
  },

  methods: {

    getPoints: function () {

      // Reset error
      this.error = false;
      this.result = this.$t('labels.result');

      try {

        // Translate the inputed coordinates to WGS84 for display on map
        let coord1 = coords.convertCoordFromText(this.coordinate1, this.selecteddatum1, "WGS84");
        let coord2 = coords.convertCoordFromText(this.coordinate2, this.selecteddatum2, "WGS84");
        let coord3 = coords.convertCoordFromText(this.coordinate3, this.selecteddatum3, "WGS84");

        // Getting grid coord using grid based coordinate to calculate projection
        let gridcoord1 =  coords.convertCoordFromLatLon (coord1, "WGS84", "RD");
        let gridcoord2 =  coords.convertCoordFromLatLon (coord2, "WGS84", "RD");
        let gridcoord3 =  coords.convertCoordFromLatLon (coord3, "WGS84", "RD");

        this.error = false;
        let data = {
          calc: 'triangle',
          p1: {x : gridcoord1.lon, y: gridcoord1.lat },
          p2: {x : gridcoord2.lon, y: gridcoord2.lat },
          p3: {x : gridcoord3.lon, y: gridcoord3.lat },
        };

        // Set markers
        coords.displayMarker(this.$store.state.L, this.$store.state.mymap, coord1, this.$t('labels.point')+ " 1");
        coords.displayMarker(this.$store.state.L, this.$store.state.mymap, coord2, this.$t('labels.point')+ " 2");
        coords.displayMarker(this.$store.state.L, this.$store.state.mymap, coord3, this.$t('labels.point')+ " 3");

        // Draw Triangle
        this.$store.state.L.polyline([coord1, coord2, coord3, coord1], {color: 'red'}).addTo(this.$store.state.mymap);

        // Call PHP script on server
        fetch(this.phpurl, {
            method: 'POST',
            body: JSON.stringify(data)
          })
          .then(response => response.json())
          .then(data => {

              // Print and plot the results
              this.result = this.$t('labels.surface') + ": " + data.surface.toFixed(0) + "m";
              this.result += "<br>" + this.$t('labels.circumference') + ": "  + data.circumference.toFixed(0) + "m<sup>2</sup>";

              // Convert points to WGS84
              let centroid = coords.convertCoordToWGS( {lat: data.centroid.y, lon: data.centroid.x}, "RD");
              let orthocenter = coords.convertCoordToWGS( {lat: data.orthocenter.y, lon: data.orthocenter.x}, "RD");
              let incenter = coords.convertCoordToWGS( {lat: data.incenter.y, lon: data.incenter.x}, "RD");
              let circumcenter = coords.convertCoordToWGS( {lat: data.circumcenter.y, lon: data.circumcenter.x}, "RD");
              let ninepointcenter = coords.convertCoordToWGS( {lat: data.ninepointcenter.y, lon: data.ninepointcenter.x}, "RD");

              // Print results
              this.result += "<br>" + this.$t('cdtriangles.centroid') + ": " + coords.getTextFromCoord(coords.convertCoordFromWGS(centroid, this.selecteddatum1), this.selecteddatum1, 7, this.coordinate1);
              this.result += this.$t('cdtriangles.or') + coords.printCoordinateFromDMS(centroid, "N12 34.567 E1 23.456");
              this.result += "<br>"+ this.$t('cdtriangles.orthocenter') + ": " + coords.getTextFromCoord(coords.convertCoordFromWGS(orthocenter, this.selecteddatum1), this.selecteddatum1, 7, this.coordinate1);
              this.result += this.$t('cdtriangles.or') + coords.printCoordinateFromDMS(orthocenter, "N12 34.567 E1 23.456");
              this.result += "<br>"+ this.$t('cdtriangles.incenter') + ": " + coords.getTextFromCoord(coords.convertCoordFromWGS(incenter, this.selecteddatum1), this.selecteddatum1, 7, this.coordinate1);
              this.result += this.$t('cdtriangles.or') + coords.printCoordinateFromDMS(incenter, "N12 34.567 E1 23.456");
              this.result += "<br>"+ this.$t('cdtriangles.circumcenter') + ": " + coords.getTextFromCoord(coords.convertCoordFromWGS(circumcenter, this.selecteddatum1), this.selecteddatum1, 7, this.coordinate1);
              this.result += this.$t('cdtriangles.or') + coords.printCoordinateFromDMS(circumcenter, "N12 34.567 E1 23.456");
              this.result += "<br>"+ this.$t('cdtriangles.ninepoint') + ": " + coords.getTextFromCoord(coords.convertCoordFromWGS(ninepointcenter, this.selecteddatum1), this.selecteddatum1, 7, this.coordinate1);
              this.result += this.$t('cdtriangles.or') + coords.printCoordinateFromDMS(ninepointcenter, "N12 34.567 E1 23.456");

              // Display markers
              coords.displayMarker(this.$store.state.L, this.$store.state.mymap, centroid, this.$t('cdtriangles.centroid'));
              coords.displayMarker(this.$store.state.L, this.$store.state.mymap, orthocenter, this.$t('cdtriangles.orthocenter'));
              coords.displayMarker(this.$store.state.L, this.$store.state.mymap, incenter, this.$t('cdtriangles.incenter'));
              coords.displayMarker(this.$store.state.L, this.$store.state.mymap, circumcenter, this.$t('cdtriangles.circumcenter'));
              coords.displayMarker(this.$store.state.L, this.$store.state.mymap, ninepointcenter, this.$t('cdtriangles.ninepoint'));

          })
          .catch((error) => {

              console.error('Error ', error);
              this.errormsg = this.$t('errors.incorrectcoords');
              this.error = true;

          });

        } catch (e) {

          console.log(e);
          this.error = true;
          this.errormsg = this.$t('errors.incorrectcoords');
          
        }

    },

  }
}
</script>
