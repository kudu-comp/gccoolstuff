<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{$t('coordinates.revwherigo.title')}}
    </div>
    <div class="mainpage">
      <div class="infoblock" v-html="$t('coordinates.revwherigo.long')" />
      <div class="form-row mb-2">
        <textarea id="message" name="message" class="form-control" ref="message" :placeholder="$t('labels.message')" rows=10 v-model='message'></textarea>
      </div>
      <input type="button" id="enc" name="enc" :value="$t('buttons.convert')" class="btn btn-primary mb-2 mr-2" v-on:click="solveReverse">
      <div class="card card-text p-2" v-html="result" />
      <p v-show="errormsg" class="errormsg mt-2">{{errormsg}}</p>
    </div>
  </div>
</template>

<script>

import * as coords from '@/scripts/coords.js';

export default {

  name: 'ReverseWherigo',

  data: function () {
    return {
      message: "",
      result : this.$t('labels.result'),
      errormsg: "",
      format: 0,
      
    }
  },

  mounted: function() {
    this.$refs.message.focus();
  },

  methods: {

    reverseWherigo2Coord : function (d1, d2, d3) {

      let latSign, lonSign, latValue, lonValue;
      
      // Convert numbers to text if needed
      d1 = "" + d1; d1 = d1.padStart(6,'0');
      d2 = "" + d2; d2 = d2.padStart(6,'0');
      d3 = "" + d3; d3 = d3.padStart(6,'0'); 
      
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
      
      // d2[2] and d3[2] are ignored they contain checksums
      
      return {
        lat: latSign * latValue / 100000,
        lon: lonSign * lonValue / 100000
      }

    },

    solveReverse : function () {

      // Reset
      this.errormsg = "";
      this.result = "";

      try {

        // Parse input
        let d = this.message.split(/[-\s,.]+/g);
        console.log(d);

        // Some error handling

        // Solve
        let c = this.reverseWherigo2Coord (d[0], d[1], d[2]);
        console.log(c);

        // Convert to different format
        this.result += coords.printCoordinateFromDMS (c, "N12.12345 E123.12345") + "<br>";
        this.result += coords.printCoordinateFromDMS (c, "N12 34.567 E123 45.678") + "<br>";
        this.result += coords.printCoordinateFromDMS (c, "N12 34 56.789 E123 45 67.678");

      } catch (e) {
      
        console.log(e);
        this.errormsg = e;
        
      }

    }

  }

}

</script>