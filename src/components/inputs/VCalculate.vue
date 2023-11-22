<template>
  <button id="calc" class="btn mb-2 me-2" @click="calculate()">
    <i class="fa-solid fa-calculator"></i> {{$t('buttons.calc')}}
  </button>
</template>

<script>

export default {

  name: 'VCalculate',

  emits: [
    'calculate'
  ],

  methods: {
  
    calculate: function () {
      
      // Sent event
      this.$emit('calculate');
      
    },

  }
}
</script>
