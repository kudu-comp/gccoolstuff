<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('convert.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('convert.long')"
      />
      <div class="row mb-2">
        <div class="col-6">
          <label
            class="form-label sm-size"
            for="from"
          >{{ $t('labels.from') }}</label>
          <v-datums
            id="from"
            v-model:datum="from"
            class="md-size"
          />
        </div>
        <div class="col-6">
          <label
            class="form-label sm-size"
            for="to"
          >{{ $t('labels.to') }}</label>
          <v-datums
            id="to"
            v-model:datum="to"
            @change="convertCoordinates"
            class="md-size"
          />
        </div>
      </div>
      <div class="row mb-2">
        <div class="col-6">
          <button
            id="convert"
            class="btn"
            @click="convertCoordinates"
          >
            {{ $t('buttons.convert') }}
          </button>
        </div>
        <div class="col-6">
          <v-wgsformat
            id="wgsformat"
            v-model:format="wgsformat"
            @change="convertCoordinates"
          />
        </div>
      </div>
      <div class="row mb-2">
        <div class="col-6">
          <textarea
            id="coordfrom"
            ref="coordfrom"
            v-model="coordfrom"
            class="form-control mt-2"
            :placeholder="$t('convert.phfrom')"
            rows="5"
            cols="20"
          />
        </div>
        <div class="col-6">
          <textarea
            id="result"
            v-model="result"
            class="form-control mt-2"
            :placeholder="$t('convert.phto')"
            rows="5"
            cols="20"
          />
        </div>
        <div
          v-show="to == 'Proj4js' || from == 'Proj4js'"
          v-html="$t('convert.proj4jsmsg')"
        />
        <div
          v-show="to == 'Proj4js' || from == 'Proj4js'"
          class="form-inline mt-2"
        >
          <label
            class="form-label"
            for="proj4jsdef"
          >{{ $t('convert.proj4jslabel') }}</label>
          <input
            id="proj4jsdef"
            v-model="proj4jsdef"
            type="text"
            size="80"
            class="form-control ms-2"
          >
        </div>
      </div>
      <div
        v-show="errormsg"
        class="errormsg mb-2"
      >
        {{ errormsg }}
      </div>
      <v-map v-model:mylocation="coordfrom" />
    </div>
  </div>
</template>

<script>
import * as coords from '@/scripts/coords.js';
import VDatums from '@/components/inputs/VDatums.vue';
import VWgsformat from '@/components/inputs/VWgsformat.vue'
import VMap from '@/components/inputs/VMap.vue'

export default {
  name: 'Convert',

  components: {
    VDatums,
    VWgsformat,
    VMap,
  },

  data: function() {
    return {
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

  mounted: function() {
    this.$refs.coordfrom.focus();
  },

  methods: {

    // Convert the coordinates
    convertCoordinates: function() {

      // Reset
      this.result = "";
      this.errormsg = "";
    
      // No input
      if (this.coordfrom == null) { this.errormsg = this.$t('errors.nocoords'); return; }
      if (this.coordfrom == "") { this.errormsg = this.$t('errors.nocoords'); return; }

      // Convert coordinate to what3words no longer supported in free API plan
      if (this.to === "W3W") {
        this.result = "No longer supported\nfree of charge\nby what3words.com.";
        return;
      }

      // Get all the lines form input and convert them one by one
      let input = this.coordfrom.match(/[^\r\n]+/g);

      // Clear map of markers
      // this.mymap.eachLayer((layer) => {
      //     layer.remove();
      // });

      // Parse input line by line
      this.count = 0;
      let promises = [];

      try {

        // Convert each coordinate
        // Create a promise for each coordinaat
        for (let i = 0; i < input.length; i++)
          promises.push (coords.convertCoordFromText(input[i], this.from, this.to, this.proj4jsdef));

        // If all promises are resolved write output
        Promise.all (promises)
          .then( convcoords => {

            // Add the converted coordinate to output
            for (let c of convcoords)
              this.result += coords.getTextFromCoord(c, this.to, 7, this.wgsformat) + "\n";

          })
          .catch ( (e) => {

            this.errormsg = this.$t('errors.incorrectcoords');
            console.log(e);

          });

        // Create promises to generate coordinates for markers
        promises = [];
        for (let i = 0; i < input.length; i++)
          promises.push (coords.convertCoordFromText(input[i], this.from, 'WGS84', this.proj4jsdef));

        // If all promises are resolved display markers
        Promise.all(promises)
          .then ( mapcoords => {

            for (let m of mapcoords)
              coords.displayMarker(this.$store.state.mymap, m, this.$t('labels.point') + ++this.count);

          })
          .catch ( (e) => {

            this.errormsg = this.$t('errors.incorrectcoords');
            console.log(e);

          });

      } catch(e) {

        this.errormsg = this.$t('errors.incorrectcoords');
        console.log(e);

      }
    },

  },
}
</script>
