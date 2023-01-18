<template>
  <div>
    <div class="form-inline">
      <label
        class="form-label mr-2 mb-2"
        for="search"
      >{{ $t('labels.search') }}</label>
      <input
        type="text"
        class="form-control mr-2 mb-2"
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

  methods: {
    updateSearch: function (value) {
      this.$emit ('update:search', value);
    },
  }
}
</script>
