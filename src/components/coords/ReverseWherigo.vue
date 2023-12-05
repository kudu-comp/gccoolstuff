<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('coordinates.revwherigo.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('coordinates.revwherigo.long')"
      />
      <div class="form-row mb-2">
        <textarea
          id="message"
          ref="message"
          v-model="message"
          name="message"
          class="form-control"
          :placeholder="$t('labels.message')"
          rows="3"
        />
      </div>
      <v-show-on-map id="go" class="btn mr-2" @Show="solveReverse()" />
      <p
        v-show="errormsg"
        class="errormsg mt-2"
      >
        {{ errormsg }}
      </p>
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

import VMap from '@/components/inputs/VMap.vue';
import * as coords from '@/scripts/coords.js';
import VShowOnMap from '@/components/inputs/VShowOnMap.vue';

export default {

  name: 'ReverseWherigo',

  components: {
    VMap,
    VShowOnMap
  },

  data: function () {
    return {
      message: "",
      result : "",
      errormsg: "",
      format: 0,
      coordinate1: null
    }
  },

  mounted: function() {
    this.$refs.message.focus();
  },

  methods: {

    // https://www.geoclub.de/forum/t/reverse-wherigo-algorithmus.82124/

    reverseWherigo2Coord : function (d1, d2, d3) {

      let latSign, lonSign, latValue, lonValue;
      
      // Convert numbers to text if needed
      d1 = "" + d1; d1 = d1.padStart(6,'0');
      d2 = "" + d2; d2 = d2.padStart(6,'0');
      d3 = "" + d3; d3 = d3.padStart(6,'0'); 

      if (d1.length != 6 || d2.length != 6 || d3.length != 6) throw(this.$t('errors.invalidinput'))
      
      // Get signs of lat and lon
      switch (d1[3]) {
        case "1" : latSign = 1; lonSign = 1; break;
        case "2" : latSign = -1; lonSign = 1; break;
        case "3" : latSign = 1; lonSign = -1; break;
        case "4" : latSign = -1; lonSign = -1; break;
      }
      
      // Ordering of numbers is determenid by odd / even of 2 digits
      if ((parseInt(d3[1]) + parseInt(d3[4])) % 2 == 0) {
        latValue = d1[2] + d2[4] + d2[1] + d3[3] + d1[0] + d3[4] + d1[5];
        lonValue = d1[1] + d3[0] + d3[5] + d2[3] + d2[0] + d1[4] + d3[1] + d2[5];
      } else {
        latValue = d2[0] + d1[5] + d1[2] + d3[0] + d3[3] + d3[4] + d1[0];
        lonValue = d2[4] + d3[5] + d1[4] + d1[1] + d2[3] + d2[5] + d3[1] + d2[1]
      }
      
      // d2[2] and d3[2] contain checksums
      let c1, c2;
      if ((parseInt(d3[1]) + parseInt(d3[4])) % 2 == 0) {
        c1 = 11 - ((2*d1[3] + 4*d1[2] + 7*d2[1] + 8*d1[0] + 5*d1[5] +	6*d1[1] + 9*d2[0] + 3*d1[4]) % 11);
        c2 = 11 - ((6*d2[4] + 5*d3[3] + 9*d3[4] + 2*d3[0] + 7*d3[5] +	8*d2[3] + 3*d3[1] + 4*d2[5]) % 11);
        c1 = (c1 === 10) ? 0 : (c1 === 11) ? 5 : c1;
        c2 = (c2 === 10) ? 0 : (c2 === 11) ? 5 : c2;
      } else {
        c1 = 11 - ((2*d1[3] + 9*d2[0] + 5*d1[5] + 4*d1[2] + 8*d1[0] +	3*d1[4] + 6*d1[1] + 7*d2[1]) % 11);
        c2 = 11 - ((2*d3[0] + 5*d3[3] + 9*d3[4] + 6*d2[4] + 7*d3[5] +	8*d2[3] + 4*d2[5] + 3*d3[1]) % 11);
        c1 = (c1 === 10) ? 0 : (c1 === 11) ? 5 : c1;
        c2 = (c2 === 10) ? 0 : (c2 === 11) ? 5 : c2;
      }

      if ( c1 !== parseInt(d2[2]) || c2 !== parseInt(d3[2])) {
        throw(this.$t('errors.invalidchecksum'));
      }

      return {
        lat: latSign * latValue / 100000,
        lon: lonSign * lonValue / 100000,
      }

    },

    solveReverse : function () {

      // Reset
      this.errormsg = "";
      this.result = "";

      try {

        // Parse input
        let d = this.message.split(/[-\s,.]+/g);

        // Some error handling
        if (!d) throw (this.$t('errors.invalidinput'));
        if (d.length != 3) throw (this.$t('errors.invalidinput'));

        // Solve
        let c = this.reverseWherigo2Coord (d[0], d[1], d[2]);

        // Convert to different format
        this.result += coords.printCoordinateFromDMS (c, "N12.12345 E123.12345") + "<br>";
        this.result += coords.printCoordinateFromDMS (c, "N12 34.567 E123 45.678") + "<br>";
        this.result += coords.printCoordinateFromDMS (c, "N12 34 56.789 E123 45 67.678");

        // Display marker
        coords.displayMarker(this.$store.state.L, this.$store.state.mymap, c, this.$t('labels.point'));

      } catch (e) {
      
        console.log(e);
        this.errormsg = e;
        
      }

    }

  }

}

</script>