<template>
  <!-- <label for="listofalpha" class="form-label me-2">Keyboards</label> -->
  <select
    class="form-select lg-size"
    :value="keyboard"
    @input="updateKeyboard($event.target.value)"
  >
    <option
      v-for="k in keyboards"
      :key="k"
      :value="k.name"
    >
      {{ k.description }}
    </option>
  </select>
</template>

<script>
import * as keyBoards from '@/scripts/keyboards.js';

export default {

  props: {
    keyboard: {
      type: String,
      required: true
    }
  },
  
  emits: [
    'update:keyboard'
  ],

  data : function () {
    return {
      keyboards : null,
    }
  },

  mounted: function() {
    this.keyboards = keyBoards.keyboards;
  },

  methods: {
    updateKeyboard: function (value) {
      this.$emit ('update:keyboard', value);
    },
  }
  
}
</script>
