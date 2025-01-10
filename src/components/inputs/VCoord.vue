<template>
  <div class="row">
    <label
      class="form-label sm-size mb-2"
      for="coordinput"
    >
      <slot name="label">{{ $t('labels.coordinate') }}</slot>
    </label>
    <input
      id="coordinput"
      ref="coordinput"
      type="text"
      class="form-control md-size mb-2 me-2"
      :value="coord"
      @input="updateCoord($event.target.value)"
    >
    <select
      id="coorddatum"
      class="form-select md-size mb-2"
      :value="datum"
      @input="updateDatum($event.target.value)"
    >
      <option value="WGS84">
        WGS84
      </option>
      <option value="EPSG:4269">
        NAD / North American Datum
      </option>
      <option value="UTM">
        UTM
      </option>
      <option value="MGRS">
        MGRS / US Military Grid
      </option>
      <option disabled>
        --- National grids ---
      </option>
      <option value="EPSG:27700">
        OSGB 1936 / British National Grid
      </option>
      <option value="OSGB">
        OSGB 1936 with zones
      </option>
      <option value="EPSG:5680">
        Gauss-Kruger (DHDN)
      </option>
      <option value="EPSG:28992">
        Dutch grid / RD
      </option>
      <option value="EPSG:2154">
        RGF93 / Lambert-93 France
      </option>
      <option value="EPSG:3812">
        Belgian Lambert 2008
      </option>
      <option value="EPSG:3857">
        Pseudo Mercator for online maps
      </option>
      <option disabled>
        --- Hashes and other stuff ---
      </option>
      <option value="QTH">
        Maidenhead / QTH locator
      </option>
      <option value="OLC">
        Open location code
      </option>
      <option value="Geohash">
        Geohash
      </option>
      <option value="MapcodeL">
        Mapcode local
      </option>
      <option value="MapcodeI">
        Mapcode international
      </option>
      <option value="Geohash36">
        Geohash 36
      </option>
      <option value="NAC">
        Natural Area Code
      </option>
      <option value="Geo3x3">
        Geo3x3
      </option>
      <option value="Csquare">
        C-Squares
      </option>
      <option value="Geohex">
        Geohex
      </option>
      <option disabled>
        --- Define your own ---
      </option>
      <option value="Proj4js">
        Proj4js definition
      </option>
    </select>
  </div>
</template>

<script>

export default {
  props: {
    coord: {
      type: String,
      required: true
    },
    datum: {
      type: String,
      required: true
    }
  },

  emits: [
    'update:coord',
    'update:datum'
  ],

  mounted: function() {
    this.$refs.coordinput.focus();
  },
  
  methods: {
    updateCoord: function (value) {
      this.$emit ('update:coord', value);
    },
    updateDatum: function (value) {
      this.$emit ('update:datum', value);
    }
  }
}
</script>
