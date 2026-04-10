<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('plotcoord.title') }}
    </div>
    <div class="mainpage">
      <div>
        <div
          class="infoblock"
          v-html="$t('plotcoord.long')"
        />
        <div class="row mb-2">
          <label
            class="form-label sm-size mb-2"
            for="from"
          >{{ $t('labels.coordformat') }}</label>
          <v-datums
            id="from"
            v-model:datum="from"
            class="md-size mb-2"
          />
        </div>
        <v-show-on-map id="go" class="btn mb-2 me-2" @Show="makeMap()" />
        <div class="form-check custom-checkbox mb-2 me-2">
          <input
            id="showmarkers"
            v-model="showmarkers"
            type="checkbox"
            class="form-check-input"
          >
          <label
            for="showmarkers"
            class="form-check-label"
          >{{ $t('mapmaker.showmark') }}</label>
        </div>
        <div class="form-check mb-2 me-2">
          <input
            id="showlabels"
            v-model="showlabels"
            type="checkbox"
            class="form-check-input"
          >
          <label
            for="showlabels"
            class="form-check-label"
          >{{ $t('mapmaker.showlabel') }}</label>
        </div>
        <div class="form-check mb-2 me-2">
          <input
            id="drawlines"
            v-model="drawlines"
            type="checkbox"
            class="form-check-input"
          >
          <label
            for="drawlines"
            class="form-check-label"
          >{{ $t('plotcoord.drawlines') }}</label>
        </div>
        <div class="form-check mb-2 me-2">
          <input
            id="fillpoly"
            v-model="fillpoly"
            type="checkbox"
            class="form-check-input"
          >
          <label
            for="fillpoly"
            class="form-check-label"
          >{{ $t('plotcoord.fillpoly') }}</label>
        </div>
      </div>
      <div class="row mb-2">
        <div class="col-6">
          <textarea
            id="coordfrom"
            v-model="coordfrom"
            class="form-control mt-2"
            :placeholder="$t('mapmaker.phcoord')"
            rows="5"
          />
        </div>
        <div class="col-6">
          <textarea
            id="labels"
            v-model="labels"
            class="form-control mt-2"
            :placeholder="$t('mapmaker.phlabel')"
            rows="5"
          />
        </div>
      </div>
      <div
        v-show="errormsg"
        class="errormsg"
      >
        {{ errormsg }}
      </div>
      <v-map v-model:mylocation="coordfrom" />
    </div>
  </div>
</template>

<script>
import * as coords from '@/scripts/coords.js';
import VMap from '@/components/inputs/VMap.vue'
import VDatums from '@/components/inputs/VDatums.vue';
import VShowOnMap from '@/components/inputs/VShowOnMap.vue';
import L from 'leaflet';

export default {
  name: 'plotcoord',

  components: {
    VDatums,
    VMap,
    VShowOnMap
  },

  data: function() {
    return {
      errormsg: "",
      from: "WGS84",
      coordfrom : "",
      labels: "",
      drawlines: true,
      fillpoly: false,
      showlabels: false,
      showmarkers: false,
      drawlines: true,
      fillpoly: false
    }
  },

  methods: {

    // Convert the coordinates
    makeMap: function() {

      // Reset error flag
      this.errormsg = "" ;
      this.result = "";
      let c = [];
      let promises = [];

      // No input
      if (!this.coordfrom) {
        this.errormsg = this.$t('errors.nocoords');
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
        this.errormsg = this.$t('mapmaker.error1');
        return;
      }

      // Convert all points to WGS84
      for (let i = 0; i < input.length; i++) {
        console.log(input[i]);
        promises.push(coords.convertCoordFromText(input[i], this.from, 'WGS84'));
      }

      Promise.all(promises)
        .then( points => {

          for (let i = 0; i < points.length; i++) {

            // Fill the array for polylines
            c.push( { lon: points[i].lon, lat: points[i].lat } );
      
            // Add a marker to the map for each coordinate
            if (this.showmarkers) {
              let marker = new L.marker(points[i]).addTo(this.$store.state.mymap);

              // Create a popup that doesn't close and bind it to the marker
              if (this.showlabels) {
                let p = new L.Popup({ autoClose: false, closeOnClick: false })
                      .setContent(markertext[i])
                      .setLatLng(points);
                marker.bindPopup(p).openPopup();
              }
            }

          }
          // Draw polylines if requested
          if (this.drawlines) {
            c.push(c[0]);
            if (this.fillpoly) {
              L.polygon(c, {color: 'red', fillColor: 'red', fillOpacity: 0.5}).addTo(this.$store.state.mymap);   
            } else {
              L.polyline(c, {color: 'red'}).addTo(this.$store.state.mymap);
            }
      }

        })
        .catch((error) => {
          console.error('Error ', error);
          this.errormsg = this.$t('errors.incorrectcoords');
        });

    },
  },
}
</script>
