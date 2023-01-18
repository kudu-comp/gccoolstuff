<template>
  <div class="form-inline">
    <label
      class="form-label col-sm-3 col-md-2 col-lg-1 mb-2"
      for="distance"
    >
      <slot name="label">{{ $t('labels.distance') }}</slot>
    </label>
    <input
      type="text"
      class="form-control col-sm-5 col-md-4 col-lg-3 col-xl-2 mb-2"
      :value="dist"
      @input="updateDist($event.target.value)"
    >
    <div class="col-md-4 mb-2">
      <select
        class="custom-select"
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
