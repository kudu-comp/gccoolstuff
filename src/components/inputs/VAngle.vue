<template>
  <div class="form-inline mb-2">
    <label
      class="form-label col-sm-3 col-md-2 col-lg-1"
      for="angle"
    >
      <slot name="label">{{ $t('labels.angle') }}</slot>
    </label>
    <input
      id="angle"
      type="text"
      class="form-control col-sm-5 col-md-4 col-lg-3 col-xl-2"
      :value="angle"
      @input="updateAngle($event.target.value)"
    >
    <div class="col-md-4">
      <select
        class="custom-select"
        :value="unit"
        @input="updateUnit($event.target.value)"
      >
        <option value="0.0174532925">
          Degrees (&deg;)
        </option>
        <option value="1">
          Radians (rad)
        </option>
        <option value="0.0157079633">
          Gon (gon)
        </option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  props: ['angle', 'unit'],
  methods: {
    updateAngle: function (value) {
      this.$emit ('update:angle', value);
    },
    updateUnit: function (value) {
      this.$emit ('update:unit', value);
    }
  }
}
</script>
