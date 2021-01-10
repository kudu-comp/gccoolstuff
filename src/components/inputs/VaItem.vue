<template>
  <div class="va-item">
    <div class="va-item-header">
      <input type="button" id="toggle" value="+|-" class="btn btn-sm btn-primary mr-2" v-on:click="$emit('toggle')" v-show="!hidebutton">
      <slot name="header">
        <h2>Item header</h2>
      </slot>
    </div>
    <div class="va-item-content" v-show='showitem'>
      <slot name="content">
        <h2>Item content</h2>
      </slot>
    </div>
    <div class="va-item-footer">
      <slot name="footer">
      </slot>
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

.va-item-content {
  font-size: 1.0em;
  padding: 5px;
  /* max-height: 500px;
  transition: max-height 0.5s ease-in 0.1s; */
  overflow-y: hidden;
}

</style>
