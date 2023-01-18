<template>
  <div class="va-item">
    <div class="va-item-header">
      <input
        v-show="!hidebutton"
        id="toggle"
        type="button"
        value="+|-"
        class="btn btn-sm btn-primary mr-2"
        @click="$emit('toggle')"
      >
      <slot name="header">
        <h2>Item header</h2>
      </slot>
    </div>
    <div
      v-show="showitem"
      class="va-item-content"
    >
      <slot name="content">
        <h2>Item content</h2>
      </slot>
    </div>
    <div class="va-item-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script>

export default {
  
  name: "VaItem",

  props: {

    // Hide would collapse the item
    showitem: Boolean,
    // Hide button hides the open/close button
    hidebutton: Boolean,

  },

  emits: [
    'toggle',
  ],

  data() {
    return {
      msg: "Accordian Item",
      errormsg: ""
    };
  },

  methods: {

    // Transition effect leaves a small piece of content
    // v-bind:style= "[visible ? 'max-height: 500px;' : 'max-height: 0px']"

  },

}
</script>

<style scoped>

.va-item {
  border-style: solid;
  border-color: #785E31;
  border-radius: 5px;
  margin-bottom: 5px;
}

.va-item-header {
  color: #E6D1AC;
  background-color: #785E31;
  text-align: left;
  font-size: 1.2em;
  padding: 5px;
}

.va-item-header a {
  color: #E6D1AC;
}

.va-item-content {
  font-size: 1.0em;
  padding: 5px;
  overflow-y: hidden;
}

</style>
