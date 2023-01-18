<template>
  <div class="form-inline">
    <label
      class="form-label"
      for="var"
    >{{ $t('labels.variable') }}</label>
    <input
      type="text"
      size="1"
      class="form-control ml-2"
      :value="variable"
      @input="updateVar($event.target.value)"
    >
    <label
      class="form-label ml-2"
      for="varoptions"
    >{{ $t('labels.option') }}</label>
    <input
      type="text"
      maxlength="20"
      class="form-control ml-2"
      :value="varoptions"
      @input="updateVarOptions($event.target.value)"
    >
  </div>
</template>

<script>
export default {
  props: ['variable', 'varoptions'],
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
