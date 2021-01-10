<template>
  <div>
    <div class="form-inline">
      <label class="form-label" for="search">{{$t('labels.search')}}</label>
      <input type="text" class="form-control ml-2" :value='search' @input="updateSearch($event.target.value)"/>
    </div>
  </div>
</template>

<script>

export default {
  props: ['search'],
  methods: {
    updateSearch: function (value) {
      this.$emit ('update:search', value);
    },
  }
}
</script>
