<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('coordinates.w3w.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('coordinates.w3w.long')"
      />
      <v-coord
        v-model:coord="coordinate1"
        v-model:datum="selecteddatum1"
        class="mr-2"
      />
      <div class="form-inline">
        <label
          class="form-label mr-2 mb-2"
          for="language"
        >{{ $t('cdw3w.languages') }}</label>
        <select
          id="language"
          v-model="sellanguage"
          class="custom-select mr-2 mb-2"
        >
          <option value="en">
            English
          </option>
          <option value="nl">
            Nederlands
          </option>
          <option value="de">
            Deutsch
          </option>
          <option value="es">
            Espagnol
          </option>
          <option value="fr">
            Français
          </option>
        </select>
        <input
          id="calc1"
          type="button"
          :value="$t('cdw3w.convertto')"
          class="btn btn-primary mb-2"
          @click="doConv()"
        >
      </div>
      <hr class="mt-0 mb-2">
      <div class="form-inline">
        <label
          class="form-label mr-2 mb-2"
          for="str"
        >{{ $t('cdw3w.w3wcode') }}</label>
        <input
          id="str"
          v-model="str"
          type="text"
          size="30"
          class="form-control mr-2 mb-2"
        >
        <input
          id="calc2"
          type="button"
          :value="$t('cdw3w.convertfrom')"
          class="btn btn-primary mr-2 mb-2"
          @click="doConv2()"
        >
        <v-datums
          id="from"
          v-model:datum="selecteddatum2"
          class="mb-2"
        />
      </div>
      <hr class="mt-0 mb-2">
      <div class="form-inline">
        <label
          class="form-label mr-2 mb-2"
          for="str2"
        >{{ $t('cdw3w.w3wsugg') }}</label>
        <input
          id="str2"
          v-model="str2"
          type="text"
          size="30"
          class="form-control mr-2 mb-2"
        >
        <label
          class="form-label mr-2 mb-2"
          for="country"
        >{{ $t('cdw3w.countries') }}</label>
        <input
          id="country"
          v-model="country"
          type="text"
          size="30"
          class="form-control mr-2 mb-2"
        >
        <input
          id="calc2"
          type="button"
          :value="$t('cdw3w.suggest')"
          class="btn btn-primary mb-2"
          @click="suggestW3W()"
        >
      </div>
      <v-coord
        v-model:coord="coordfocus"
        v-model:datum="datumfocus"
        class="mr-2 mb-2"
      >
        <template #label>
          {{ $t('cdw3w.focus') }}
        </template>
      </v-coord>
      <v-coord
        v-model:coord="coordclip"
        v-model:datum="datumclip"
        class="mr-2 mb-2"
      >
        <template #label>
          {{ $t('cdw3w.clip') }}
        </template>
      </v-coord>
      <v-distance
        v-model:dist="clipradius"
        v-model:unit="clipunit"
      >
        <template #label>
          {{ $t('labels.radius') }}
        </template>
      </v-distance>
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
import VDatums from '@/components/inputs/VDatums.vue';
import VMap from '@/components/inputs/VMap.vue';
import VDistance from '@/components/inputs/VDistance.vue'
import * as coords from '@/scripts/coords.js';
import * as w3w from '@/scripts/what3words.js';

export default {

  name: 'CoordW3W',

  components: {
    VCoord,
    VDatums,
    VDistance,
    VMap,
  },

  data: function () {
    return {
      coordinate1: "",
      selecteddatum1: "WGS84",
      sellanguage: "en",
      str: "",
      selecteddatum2: "WGS84",
      str2: "",
      coordfocus: "",
      datumfocus: "WGS84",
      coordclip: "",
      datumclip: "WGS84",
      clipradius: 0,
      clipunit: 1,
      country: "NL,DE,BE,GB",
      result: "",
      errormsg: ""
    }
  },

  methods: {

    doConv: function () {

      // Reset error
      this.errormsg = "";
      this.result = "";

      // Convert input to WGS84
      coords.convertCoordFromText(this.coordinate1, this.selecteddatum1, "WGS84")
        .then (data => {

          // Set Marker
          coords.displayMarker(this.$store.state.L, this.$store.state.mymap, data, this.$t('labels.point'));

          // Convert to W3W with the selected language
          return w3w.wgs84ToW3W(data, this.sellanguage)

        })
        .then (data => {

          this.result = data;

        })
        .catch (error => {

          this.errormsg = this.$t('errors.incorrectcoords');
          console.log(error);

        });
        
    },

    doConv2: function () {

      // Reset error
      this.errormsg = "";
      this.result = "";

      // Convert input to WGS84
      w3w.W3WToWgs84(coords.getCoordFromText(this.str, "W3W").s)
        .then (data => {

          // Set Marker
          coords.displayMarker(this.$store.state.L, this.$store.state.mymap, data, this.$t('labels.point'));

          // Convert to W3W with the selected language
          return coords.convertCoordFromWGS(data, this.selecteddatum2)

        })
        .then (data => {

          this.result = coords.getTextFromCoord(data, "WGS84", 7, "N12 34.567 E1 23.456");

        })
        .catch (error => {

          console.log(error);
          this.errormsg = this.$t('errors.incorrectcoords');

        });
    },

    suggestW3W: function () {

      // Check 3 words are given
      let words = this.str2.split(/[.,\s]/g);
      if (words.length != 3) {
        this.errormsg = this.$t('cdw3w.err3words');
        return;
      } else {
        this.str2 = words[0] + "." + words[1] + "." + words[2];
      }

      let clip = (this.coordclip);
      let focus = (this.coordfocus);
      let promises = [];
      let suggestions = [];
      this.result = "<table class='table table-sm table-bordered text-center'><thead><th>" + this.$t('labels.coordinate') + "</th><th>" + this.$t('cdw3w.words') + 
                    "</th><th>" + this.$t('cdw3w.country') + "</th><th>" + this.$t('cdw3w.nearest') + "</th></thead>";
      this.errormsg = "";

      if (focus) {
        promises.push(coords.convertCoordFromText(this.coordfocus, this.datumfocus, "WGS84"))
      } else {
        promises.push("No focus");
      }
      if (clip) {
        promises.push(coords.convertCoordFromText(this.coordclip, this.datumclip, "WGS84"))
      }

      Promise.all(promises)
        .then( data => {

          let h1 = "";
          if (focus) h1 = data[0];
          let h2 = "";
          if (clip) h2 = data[1];
          let rad = 0;
          if (clip) rad = this.clipradius * this.clipunit / 1000;
          return w3w.W3WSuggest (this.str2, h1, h2, rad, this.sellanguage, this.country) 

        })
        .then( data => {

          suggestions = data;

          // Calculate the coordinates for all suggestions
          let promises = [];
          for (let s of data) {
            promises.push( coords.convertCoordFromText(s.words, "W3W", "WGS84"))
          }

          return Promise.all(promises)

        })
        .then( data => {

          let i = 0;
          for (let s of suggestions) {
            this.result += "<tr><td>" + coords.getTextFromCoord(data[i], "WGS84", 7, "N12 34.567 E1 23.456") +
                           "</td><td>" + s.words + "</td><td>" + s.country + "</td><td>" + s.nearestPlace + "</td></tr>";
            coords.displayMarker(this.$store.state.L, this.$store.state.mymap, data[i++], s.words);
          }

          this.result += "</table>";

        })
        .catch( error => {
          console.log(error);
          this.errormsg = this.$t('errors.incorrectcoords');
        })
    }

  }
}
</script>
