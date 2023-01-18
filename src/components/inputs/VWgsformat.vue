<template>
  <div class="form-inline">
    <label
      class="mr-2"
      for="wgsformat"
    >WGS84 format</label>
    <select
      id="wgsformat"
      class="custom-select"
      :value="format"
      @input="updateFormat($event.target.value)"
    >
      <option value="52.12345 4.56789">
        Example: 52.12345&deg; 4.56789&deg;
      </option>
      <option value="N52.12345 E4.56789">
        Example: N52.12345&deg; E4.56789&deg;
      </option>
      <option value="N52 12.345 E4 12.345">
        Example: N52&deg; 12.345' E4&deg; 56.789'
      </option>
      <option value="N52 12 34.567 E4 12 34.567">
        Example: N52&deg; 12' 34.567" E4&deg; 12' 34.567"
      </option>
      <option value="52 12 34.567 N 4 12 34.567 E">
        Example: 52&deg; 12' 34.567" N 4&deg; 12' 34.567 E"
      </option>
    </select>
  </div>
</template>

<script>
export default {
  props: ['format'],
  methods: {
    updateFormat: function (value) {
      this.$emit ('update:format', value);
    },
  }
}
</script>
