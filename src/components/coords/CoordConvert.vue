<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{$t('coordinates.convert.title')}}
    </div>
    <div class="mainpage">
      <div class="infoblock" v-html="$t('coordinates.convert.long')" />
      <div class="row">
        <div class="col-6">
          <div class="form-row mb-2">
            <label class="form-label col-sm-4 col-md-2 col-lg-1" for="from">{{$t('labels.from')}}</label>
            <v-datums class="col-sm-8 col-md-6 col-lg-4" id="from" v-model:datum="from"></v-datums>
          </div>
        </div>
        <div class="col-6">
          <div class="form-row mb-2">
            <label class="form-label col-sm-4 col-md-2 col-lg-1" for="to">{{$t('labels.to')}}</label>
            <v-datums class="col-sm-8 col-md-6 col-lg-4" id="to" v-model:datum="to" @change="convertCoordinates"></v-datums>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <input type="button" id="encode" name="encode" :value="$t('buttons.convert')" class="btn btn-primary mr-2" v-on:click="convertCoordinates">
        </div>
        <div class="col-6">
          <v-wgsformat id="wgsformat" v-model:format="wgsformat" @change="convertCoordinates"></v-wgsformat>
        </div>
      </div>
      <div class="row mb-2">
        <div class="col-6">
          <textarea id="coordfrom" name="coordfrom" class="form-control mt-2" ref="x" :placeholder="$t('cdconvert.phfrom')" rows=10 cols=20 v-model='coordfrom'></textarea>
        </div>
        <div class="col-6">
          <textarea id="result" name="result" class="form-control mt-2" ref="x" :placeholder="$t('cdconvert.phto')" rows=10 cols=20 v-model='result'></textarea>
        </div>
        <div v-show="to == 'Proj4js' || from == 'Proj4js'" v-html="$t('cdconvert.proj4jsmsg')"></div>
        <div class="form-inline mt-2" v-show="to == 'Proj4js' || from == 'Proj4js'">
          <label class="form-label" for="key1">{{$t('cdconvert.proj4jslabel')}}</label>
          <input type='text' id="proj4jsdef" name="proj4jsdef" ref="proj4jsdef" v-model="proj4jsdef" size="80" class="form-control ml-2">
        </div>
      </div>
      <div class="errormsg" v-show="error">{{errormsg}}</div>
      <v-map v-model:mylocation="coordfrom"/>
    </div>
  </div>
</template>

<script>
import * as coords from '@/scripts/coords.js';
import VDatums from '@/components/inputs/VDatums.vue';
import VWgsformat from '@/components/inputs/VWgsformat.vue'
import VMap from '@/components/inputs/VMap.vue'

export default {
  name: 'CoordConvert',

  props: {
    msg: String
  },

  data: function() {
    return {
      error : false,
      errormsg: "",
      coordfrom : "",
      to: "WGS84",
      from: "WGS84",
      result: "",
      proj4jsdef: "",
      count : 0,
      wgsformat : "N52 12.345 E4 12.345"
    }
  },

  components: {
    VDatums,
    VWgsformat,
    VMap,
  },

  methods: {

    // Convert the coordinates
    convertCoordinates: function() {

      // No input
      if (this.coordfrom == null) { this.error = true; this.errormsg = this.$t('errors.nocoords'); return; }
      if (this.coordfrom == "") { this.error = true; this.errormsg = this.$t('errors.nocoords'); return; }

      // Get all the lines form input and convert them one by one
      let input = this.coordfrom.match(/[^\r\n]+/g);

      // Clear map of markers
      // this.mymap.eachLayer((layer) => {
      //     layer.remove();
      // });

      // Parse input line by line
      this.result = "";
      this.count = 0;
      this.error = false;

      // Convert each coordinate
      for (let i = 0; i < input.length; i++) {

        this.count++;
        try {

          this.result += coords.getTextFromCoord(coords.convertCoordFromText(input[i], this.from, this.to, this.proj4jsdef), this.to, 7, this.wgsformat) + "\n";

          // Add a marker to the map for each coordinaat
          let mapcoord = coords.convertCoordFromText(input[i], this.from, 'WGS84', this.proj4jsdef);
          coords.displayMarker(this.$store.state.L, this.$store.state.mymap, mapcoord, "Point " + this.count);

        } catch(e) {

          this.error = true;
          this.errormsg = this.$t('errors.incorrectcoords');
          console.log(e);

        }
      }
    },
  },
}
</script>
