<template>
  <div class="row mb-2">
    <label
      class="form-label sm-size"
      for="angle"
    >
      <slot name="label">{{ $t('labels.angle') }}</slot>
    </label>
    <input
      id="angle"
      type="text"
      class="form-control md-size me-2"
      :value="angle"
      @input="updateAngle($event.target.value)"
    >
    <select
      id="angleunit"
      class="form-select sm-size"
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
</template>

<script>
export default {

  props: {
    angle: {
      type: Number,
      required: true
    },
    unit: {
      type: Number,
      required: true
    }
  },

  emits: [
    'update:angle',
    'update:unit'
  ],

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
