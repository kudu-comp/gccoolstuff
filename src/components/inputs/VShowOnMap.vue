<template>
  <button id="calc" class="btn mb-2 mr-2" @click="calculate()">
    <i class="fa-solid fa-map-location-dot"></i> {{$t('buttons.show')}}
  </button>
</template>

<script>

export default {

  name: 'VShowOnMap',

  emits: [
    'show'
  ],

  methods: {
  
    calculate: function () {
      
      // Sent event
      this.$emit('show');
      
    },

  }
}
</script>
