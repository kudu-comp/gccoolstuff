<template>
  <div class="form-inline mb-2">
    <label class="form-label col-sm-3 col-md-2 col-lg-1" for="color">
      <slot name="label"></slot>
    </label>
    <div>
      <select id="color" class="custom-select" :value='color' @input="updateColor($event.target.value)">
        <option value="0" style="background-color: black; color: white">Black</option>
        <option value="1" style="background-color: brown; color: white">Brown</option>
        <option value="2" style="background-color: red; color: black">Red</option>
        <option value="3" style="background-color: orange; color: black">Orange</option>
        <option value="4" style="background-color: yellow; color: black">Yellow</option>
        <option value="5" style="background-color: green; color: black">Green</option>
        <option value="6" style="background-color: blue; color: white">Blue</option>
        <option value="7" style="background-color: violet; color: black">Violet</option>
        <option value="8" style="background-color: gray; color: black">Gray</option>
        <option value="9" style="background-color: white; color: black">White</option>
        <slot name="addcolors"></slot>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  props: ['color'],
  methods: {
    updateColor: function (value) {
      this.$emit ('update:color', value);
    },
  }
}
</script>
