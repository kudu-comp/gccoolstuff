<template>
  <div class="form-inline">
    <!-- <label for="listofalpha" class="form-label mr-2">Keyboards</label> -->
    <select
      class="custom-select"
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
  </div>
</template>

<script>
import * as keyBoards from '@/scripts/keyboards.js';

export default {
  props: ['keyboard'],
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
