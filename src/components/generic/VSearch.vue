<template>
  <div>
    <div class="row">
      <label
        class="form-label sm-size mb-2"
        for="search"
      >{{ $t('labels.search') }}</label>
      <input
        type="text"
        id="search"
        ref="search"
        class="form-control lg-size mb-2"
        :value="search"
        @input="updateSearch($event.target.value)"
      >
    </div>
  </div>
</template>

<script>

export default {
  props: {
    search: {
      type: String,
      required: true
    }
  },

  emits: [
    'update:search'
  ],
  
  mounted: function() {
    this.$refs.search.focus();
  },

  methods: {
    updateSearch: function (value) {
      this.$emit ('update:search', value);
    },
  }
}
</script>

<style scoped>
</style>
