<template>
  <div class="row">
    <label
      class="form-label sm-size"
      for="var"
    >{{ $t('labels.variable') }}</label>
    <input
      type="text"
      size="1"
      class="form-control md-size "
      :value="variable"
      @input="updateVar($event.target.value)"
    >
    <label
      class="form-label sm-size "
      for="varoptions"
    >{{ $t('labels.option') }}</label>
    <input
      type="text"
      maxlength="20"
      class="form-control md-size "
      :value="varoptions"
      @input="updateVarOptions($event.target.value)"
    >
  </div>
</template>

<script>
export default {
  props: {
    variable: {
      type: String,
      required: true
    },
    varoptions: {
      type: String,
      required: true
    }
  },

  emits: [
    'update:variable',
  	'update:varoptions'
  ],

  methods: {

    updateVar: function (value) {
      this.$emit ('update:variable', value);
    },

    updateVarOptions: function (value) {
      this.$emit ('update:varoptions', value);
    }

  }
}
</script>
