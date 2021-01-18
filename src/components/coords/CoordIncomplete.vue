<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{$t('coordinates.incomplete.title')}}
    </div>
    <div class="mainpage">
      <div class="infoblock">
        {{$t('dialogic.intro')}}
      </div>
      <v-coord v-model:coord="coordinate" v-model:datum="selecteddatum"></v-coord>
      <v-variable v-model:variable="var1" v-model:varoptions="var1options" class="mb-2"></v-variable>
      <v-variable v-model:variable="var2" v-model:varoptions="var2options" class="mb-2"></v-variable>
      <v-variable v-model:variable="var3" v-model:varoptions="var3options" class="mb-2"></v-variable>
      <v-variable v-model:variable="var4" v-model:varoptions="var4options" class="mb-2"></v-variable>
      <input type="button" id="project" name="project" :value="$t('dialogic.button')" class="btn btn-primary mr-2" v-on:click="showCoordinates()">
      <div v-show="error" class="errormsg mt-2">{{errormsg}}</div>
      <v-map v-model:mylocation="coordinate"/>
    </div>
  </div>
</template>

<script>

import VCoord from '@/components/inputs/VCoord.vue';
import VMap from '@/components/inputs/VMap.vue'
import VVariable from '@/components/inputs/VVariable.vue';
import * as coords from '@/scripts/coords.js';

export default {

  name: 'CoordIncomplete',

  components: {
    VCoord,
    VVariable,
    VMap,
  },

  data: function () {
    return {
      coordinate: "",
      selecteddatum: "WGS84",
      var1: "a",
      var1options: "0123456789",
      var2: "b",
      var2options: "0123456789",
      var3: "c",
      var3options: "0123456789",
      var4: "d",
      var4options: "0123456789",
      error: false,
      errormsg: "",
    }
  },

  methods: {

    // Show the possible coordinates
    showCoordinates: function () {

      // Initialize
      this.error = false;

      try {

        // Initialize variables and regular expressions
        let newcoord;
        let coord;
        let marker;
        let vars;
        let regex1 = new RegExp (this.var1, "g");
        let regex2 = new RegExp (this.var2, "g");
        let regex3 = new RegExp (this.var3, "g");
        let regex4 = new RegExp (this.var4, "g");

        // Check if var 1 to 4 are present and verify max number of coordinates
        let useVar1 = (this.coordinate.indexOf(this.var1) >= 0);
        let useVar2 = (this.coordinate.indexOf(this.var2) >= 0);
        let useVar3 = (this.coordinate.indexOf(this.var3) >= 0);
        let useVar4 = (this.coordinate.indexOf(this.var4) >= 0);
        let totaloptions = ((useVar1) ? this.var1options.length : 1) *
                ((useVar2) ? this.var2options.length : 1) *
                ((useVar3) ? this.var3options.length : 1) *
                ((useVar4) ? this.var4options.length : 1);

        if (totaloptions > 500) {

          this.error = true;
          this.errormsg = this.$t('dialogic.error1')
          
        } else {

          // For each of the candidates try all options
          // v == 0 is added to ensure each loop is executed at least once
          for (let v1 = 0; (useVar1 && v1 < this.var1options.length) || (v1 == 0); v1++) {
            for (let v2 = 0; (useVar2 && v2 < this.var2options.length) || (v2 == 0); v2++) {
              for (let v3 = 0; (useVar3 && v3 < this.var3options.length) || (v3 == 0); v3++) {
                for (let v4 = 0; (useVar4 && v4 < this.var4options.length) || (v4 == 0); v4++) {
                  newcoord = this.coordinate;
                  vars = "";
                  if (useVar1) { newcoord = newcoord.replace(regex1, this.var1options[v1]); vars += this.var1 + "=" + this.var1options[v1] + " "; }
                  if (useVar2) { newcoord = newcoord.replace(regex2, this.var2options[v2]); vars += this.var2 + "=" + this.var2options[v2] + " "; }
                  if (useVar3) { newcoord = newcoord.replace(regex3, this.var3options[v3]); vars += this.var3 + "=" + this.var3options[v3] + " "; }
                  if (useVar4) { newcoord = newcoord.replace(regex4, this.var4options[v4]); vars += this.var4 + "=" + this.var4options[v4] + " "; }

                  // Set a marker on the map
                  coord = coords.convertCoordFromText(newcoord, this.selecteddatum, "WGS84");
                  marker = this.$store.state.L.marker(coord).addTo(this.$store.state.mymap);
                  marker.bindPopup(newcoord + " " + vars).openPopup();
                }
              }
            }
          }
          
        }
        
      } catch (e) {

        console.log(e);
        this.error = true;
        this.errormsg = this.$t('errors.incorrectcoords');

      }
    },
  },
}
</script>
