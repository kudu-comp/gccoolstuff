<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{$t('coordinates.mapmaker.title')}}
    </div>
    <div class="mainpage">
      <div>
        <div class="infoblock">
          {{$t('dialogmm.info')}}
        </div>
        <div class="form-row mb-2">
          <label class="form-label mr-2" for="from">{{$t('labels.coordformat')}}</label>
          <v-datums id="from" class="mr-2" v-model:datum="from"></v-datums>
          <input type="button" id="encode" name="encode" :value="$t('dialogmm.makemap')" class="btn btn-primary" v-on:click="makeMap">
        </div>
        <div class="form-row mb-2">
          <div class="custom-control custom-checkbox mr-2">
            <input type="checkbox" name="showmarkers" id="showmarkers" v-model="showmarkers" class="custom-control-input">
            <label for="showmarkers" class="custom-control-label">{{$t('dialogmm.showmark')}}</label>
          </div>
          <div class="custom-control custom-checkbox  mr-2">
            <input type="checkbox" name="showlabels" id="showlabels" v-model="showlabels" class="custom-control-input">
            <label for="showlabels" class="custom-control-label">{{$t('dialogmm.showlabel')}}</label>
          </div>
          <div class="custom-control custom-checkbox  mr-2">
            <input type="checkbox" name="drawcircles" id="drawcircles" v-model="drawcircles" class="custom-control-input">
            <label for="drawcircles" class="custom-control-label">{{$t('dialogmm.drawcircle')}}</label>
          </div>
          <div>
            <v-distance v-model:dist="dist" v-model:unit="unit">
              <template v-slot:label>
                <label class="form-label" for="distance">{{$t('labels.radius')}}</label>
              </template>
            </v-distance>
          </div>
        </div>
      </div>
      <div class="row mb-2">
        <div class="col-6">
          <textarea id="coordfrom" name="coordfrom" class="form-control mt-2" ref="x" :placeholder="$t('dialogmm.phcoord')" rows=10 cols=20 v-model='coordfrom'></textarea>
        </div>
        <div class="col-6">
          <textarea id="labels" name="labels" class="form-control mt-2" ref="x" :placeholder="$t('dialogmm.phlabel')" rows=10 cols=20 v-model='labels'></textarea>
        </div>
      </div>
      <div class="errormsg" v-show="error">{{errormsg}}</div>
      <v-map v-model:mylocation="coordfrom" />
    </div>
  </div>
</template>

<script>
import * as coords from '@/scripts/coords.js';
import VMap from '@/components/inputs/VMap.vue'
import VDatums from '@/components/inputs/VDatums.vue';
import VDistance from '@/components/inputs/VDistance.vue';

export default {
  name: 'CoordConvert',

  props: {
    msg: String
  },

  data: function() {
    return {
      error : false,
      errormsg: "",
      from: "WGS84",
      coordfrom : "",
      labels: "",
      drawcircles: false,
      showlabels: true,
      showmarkers: true,
      unit: 1,
      dist: 165,
    }
  },

  components: {
    VDatums,
    VDistance,
    VMap,
  },

  methods: {

    // Convert the coordinates
    makeMap: function() {

      // Reset error flag
      this.error = false;

      // No input
      if (!this.coordfrom) {
        this.errormsg = this.$t('errors.nocoords');
        this.error = true;
        return;
      }

      // If there are no labels default to coordinates
      if (!this.labels) {
        this.labels = this.coordfrom;
      }

      // Get all the lines form input and convert them one by one
      let input = this.coordfrom.match(/[^\r\n]+/g);
      let markertext = this.labels.match(/[^\r\n]+/g);

      // Check if there are enough Labels
      if (input.length != markertext.length) {
        this.errormsg = this.$t('dialogmm.error1');
        this.error = true;
        return;
      }

      // Parse input line by line
      for (let i = 0; i < input.length; i++) {

        try {

          // Get the coordinates
          let mapcoord = coords.convertCoordFromText(input[i], this.from, 'WGS84');

          // Add a marker to the map for each coordinate
          if (this.showmarkers) {
            let marker = this.$store.state.L.marker(mapcoord).addTo(this.$store.state.mymap);

            // Create a popup that doesn't close and bind it to the marker
            if (this.showlabels) {
              let p = new this.$store.state.L.Popup({ autoClose: false, closeOnClick: false })
                    .setContent(markertext[i])
                    .setLatLng(mapcoord);
              marker.bindPopup(p).openPopup();
            }
          }

          // Draw circles if requested
          if (this.drawcircles) {
            this.$store.state.L.circle(mapcoord, {
              color: "#E72E1C",
              fillColor: "#EC7F74",
              fillOpacity: 0.5,
              radius: this.dist * this.unit
            }).addTo(this.$store.state.mymap);
          }

        } catch(e) {

          this.error = true;
          this.errormsg = this.$t('errors.incorrectcoords')
          console.log(e);
          
        }
      }
    },
  },
}
</script>
