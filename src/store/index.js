import { createStore } from 'vuex'

export default createStore({
  state: {
    mapstyle: "streets-v11",
    accessToken: 'pk.eyJ1IjoiYWVybm91dCIsImEiOiJja2hnZTBqbzcwNzF3MnJvMXI0cG4zODE3In0.i7d9zHGVq46G2pIQw3JaFg',
    mapAttribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
  },
  mutations: {
    initMap (state, payload) {
      state.L = payload.L;
      state.mymap = payload.mymap;
    },
    setMapStyle (state, value) {
      state.mapstyle = value;
    },
  },
  actions: {
  },
  modules: {
  }
})
