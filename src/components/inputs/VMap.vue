<template>
  <div id="mapid" />
</template>

<script>

import * as coords from '@/scripts/coords.js';

export default {
  props: {
    mylocation: {
      type: String,
      required: true
    }
  },

  emits: [
    'update:mylocation'
  ],

  data: function() {
    return {
      L: null,
      mymap: null,
      baseMaps: null,
      locButton: null
    }
  },

  // mount map
  mounted: function() {
    
    this.L = window.L;

    // Create the tile layers base map object
    this.baseMaps = {
      "OpenStreetMap" : this.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }),
      "Streets" : this.L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: this.$store.state.accessToken
      }),
      "Satellite": this.L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/satellite-v9',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: this.$store.state.accessToken
      }),
      "Cyclemap" : this.L.tileLayer('https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey={accessToken}', {
        attribution: 'Maps &copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, Data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
        tileSize: 512,
        zoomOffset: -1,
        accessToken: this.$store.state.apikeyThunderforest
      }),
      "Transport" : this.L.tileLayer('https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey={accessToken}', {
        attribution: 'Maps &copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, Data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
        tileSize: 512,
        zoomOffset: -1,
        accessToken: this.$store.state.apikeyThunderforest
      }),
      "Satellite/Streets": this.L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/satellite-streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: this.$store.state.accessToken
      }),
      "Landscape" : this.L.tileLayer('https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey={accessToken}', {
        attribution: 'Maps &copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, Data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
        tileSize: 512,
        zoomOffset: -1,
        accessToken: this.$store.state.apikeyThunderforest
      }),
      "Outdoors": this.L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/outdoors-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: this.$store.state.accessToken
      })
    }
    
    // Create the map and add the default layer
    this.mymap = this.L.map('mapid', {
      center : [52.40983, 4.72280],
      zoom: 13,
      layers: this.baseMaps["OpenStreetMap"]
    });

    // Add layer control
    this.L.control.layers(this.baseMaps, null).addTo(this.mymap);
    this.L.control.scale().addTo(this.mymap);

    // Update global map vars for use in other places
    this.$store.commit('initMap', {L: this.L, mymap: this.mymap} );

    // Add fullscreen control (from leaflet-fullscreen, see index.html)
    this.mymap.addControl(new this.L.Control.Fullscreen());

    // Add event listener for click on map
    this.mymap.on('click', (e) => {
      //alert (e.latlng.lat.toFixed(5) + " " + e.latlng.lng.toFixed(5));  
      this.$emit('update:mylocation', e.latlng.lat.toFixed(5) + " " + e.latlng.lng.toFixed(5))
    })

    // Use easybutton to add get location button
    this.L.easyButton('fa-map-marker-alt', () => {
      coords.geoFindMe()
        .then ((position) => {
          coords.displayMarker(this.L, this.mymap, [position.coords.latitude, position.coords.longitude], "Your Location")
          this.$emit('update:mylocation', position.coords.latitude.toFixed(5) + " " + position.coords.longitude.toFixed(5));
        })
        .catch ((e) => {
          this.error = true;
          this.errormsg = e;
        });
    }).addTo(this.mymap);

    

  },

  methods: {

  }

}
</script>

<style scoped>
#mapid {
  height: 600px;
}

.leaflet-grab {
  cursor: crosshair;
}

.leaflet-dragging .leaflet-grab {
  cursor: move;
}

.mapbtn {
  background-color: white !important;
  color: black !important;
  font-size: 20px !important;
  width: 50px !important;
  height: 50px !important;
  line-height: 50px !important;
  border-width: 2px;
  border-style: solid;
  border-radius: 5px;
}

</style>
