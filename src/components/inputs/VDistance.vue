<template>
  <div class="row">
    <label
      class="form-label sm-size mb-2"
      for="distance"
    >
      <slot name="label">{{ $t('labels.distance') }}</slot>
    </label>
    <input
      type="number"
      class="form-control md-size mb-2 me-2"
      id="distance"
      :value="dist"
      @input="updateDist($event.target.value)"
    >
    <select
      id="distunit"
      class="form-select sm-size mb-2"
      :value="unit"
      @input="updateUnit($event.target.value)"
    >
      <option value="1">
        Meter (m)
      </option>
      <option value="1000">
        Kilometer (km)
      </option>
      <option value="0.3048">
        Feet (ft)
      </option>
      <option value="1.0936133">
        Yard (yd)
      </option>
      <option value="1760">
        Mile intnl (mi)
      </option>
      <option value="1609.344">
        Mile US (mi)
      </option>
    </select>
  </div>
</template>

<script>
export default {

  props: {
    dist: {
      type: Number,
      required: true
    },
    unit: {
      type: Number,
      required: true
    }
  },

  emits: [
    'update:dist',
    'update:unit'
  ],

  methods: {
    updateDist: function (value) {
      this.$emit ('update:dist', value);
    },
    updateUnit: function (value) {
      this.$emit ('update:unit', value);
    }
  }

}
</script>
