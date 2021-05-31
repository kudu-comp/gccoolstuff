import { createStore } from 'vuex'

export default createStore({
  state: {
    accessToken: 'pk.eyJ1IjoiYWVybm91dCIsImEiOiJja2hnZTBqbzcwNzF3MnJvMXI0cG4zODE3In0.i7d9zHGVq46G2pIQw3JaFg',
    apikeyThunderforest: 'a023c97aa9874743a0d0825ed21b2276'
  },
  mutations: {
    initMap (state, payload) {
      state.L = payload.L;
      state.mymap = payload.mymap;
    },
  },
  actions: {
  },
  modules: {
  }
})
