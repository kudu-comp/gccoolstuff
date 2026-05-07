<template>
  <button id="calc" class="btn mb-2 me-2" @click="calculate()" :title="$t('buttons.show')">
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
