<template>
  <div class="d-flex flex-row-reverse">
    <div class="form-inline">
      <label class="form-label mb-2 mr-2" for="coordinput">{{$t('dialogmap.mapstyle')}}</label>
      <select class="custom-select mb-2 mr-2" v-model='mapstyle' @input="updateMap($event.target.value)">
        <option value="streets-v11">{{$t('dialogmap.street')}}</option>
        <option value="satellite-v9">{{$t('dialogmap.satellite')}}</option>
        <option value="hikebike">{{$t('dialogmap.hikebike')}}</option>
        <option value="satellite-streets-v11">{{$t('dialogmap.satstreet')}}</option>
        <option value="outdoors-v11">{{$t('dialogmap.outdoors')}}</option>
        <option value="transport">{{$t('dialogmap.transport')}}</option>
        <option value="cyclemap">{{$t('dialogmap.cyclemap')}}</option>
        <option value="landscape">{{$t('dialogmap.landscape')}}</option>
        <option value="outdoors">{{$t('dialogmap.outdoors2')}}</option>
        <option value="light-v10">{{$t('dialogmap.light')}}</option>
        <option value="dark-v10">{{$t('dialogmap.dark')}}</option>
      </select>
      <input type="button" id="getlocation" :value="$t('dialogmap.getloc')" class="btn btn-primary mb-2 " v-on:click="getLocation()">
    </div>
  </div>
  <div id="mapid"></div>
</template>

<script>

import * as coords from '@/scripts/coords.js';

export default {
  props: ["mylocation"],

  // data
  data: function() {
    return {
      mapstyle: this.$store.state.mapstyle,
      L: null,
      mymap: null,
    }
  },

  // mount map
  mounted: function() {
    this.L = window.L;
    this.mymap = this.L.map('mapid').setView([52.40983, 4.72280], 13);
    this.L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: this.$store.state.mapAttribution,
        maxZoom: 18,
        id: 'mapbox/' + this.$store.state.mapstyle,
        tileSize: 512,
        zoomOffset: -1,
        accessToken: this.$store.state.accessToken
    }).addTo(this.mymap);

    // Update global map vars for use in other
    this.$store.commit('initMap', {L: this.L, mymap: this.mymap} );

    // Add event listener for click on map
    this.mymap.on('click', (e) => {
      //alert (e.latlng.lat.toFixed(5) + " " + e.latlng.lng.toFixed(5));  
      this.$emit('update:mylocation', e.latlng.lat.toFixed(5) + " " + e.latlng.lng.toFixed(5))
    })

  },

  methods: {

    // Get location from browser
    getLocation: function () {
      coords.geoFindMe()
        .then ((position) => {
          coords.displayMarker(this.L, this.mymap, [position.coords.latitude, position.coords.longitude], "Your Location")
          this.$emit('update:mylocation', position.coords.latitude.toFixed(5) + " " + position.coords.longitude.toFixed(5));
        })
        .catch ((e) => {
          this.error = true;
          this.errormsg = e;
        });
    },

    updateMap: function (value) {
      // Update state variable mapstyle
      this.$store.commit('setMapStyle', value);

      // Retrieve current Tilelayer from store and remove from map
      // currentTileLayer.removeFrom(this.mymap)


      switch (value) {
        case "hikebike" :

          this.L.tileLayer('https://tiles.wmflabs.org/hikebike/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(this.mymap);
          break;

        case "transport" :

          this.L.tileLayer('https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey={accessToken}', {
            attribution: this.$store.state.mapAttribution,
            maxZoom: 18,
            tileSize: 512,
            zoomOffset: -1,
            accessToken: this.$store.state.apikeyThunderforest
          }).addTo(this.mymap);
          break;

        case "landscape" :

          this.L.tileLayer('https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey={accessToken}', {
            attribution: this.$store.state.mapAttribution,
            maxZoom: 18,
            tileSize: 512,
            zoomOffset: -1,
            accessToken: this.$store.state.apikeyThunderforest
          }).addTo(this.mymap);
          break;

        case "outdoors" :

          this.L.tileLayer('https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey={accessToken}', {
            attribution: this.$store.state.mapAttribution,
            maxZoom: 18,
            tileSize: 512,
            zoomOffset: -1,
            accessToken: this.$store.state.apikeyThunderforest
          }).addTo(this.mymap);
          break;

        case "cyclemap" :

          this.L.tileLayer('https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey={accessToken}', {
            attribution: this.$store.state.mapAttribution,
            maxZoom: 18,
            tileSize: 512,
            zoomOffset: -1,
            accessToken: this.$store.state.apikeyThunderforest
          }).addTo(this.mymap);
          break;

        default :

          this.L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: this.$store.state.mapAttribution,
            maxZoom: 18,
            id: 'mapbox/' + this.$store.state.mapstyle,
            tileSize: 512,
            zoomOffset: -1,
            accessToken: this.$store.state.accessToken
          }).addTo(this.mymap);

      } // end switch

      // currentTileLayer.addTo(this.mymap)
    },

  }
}
</script>

<style scoped>
#mapid {
  height: 600px;
}
</style>
