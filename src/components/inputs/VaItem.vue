<template>
  <div class="va-item">
    <div class="va-item-header">
      <button v-show="!hidebutton" id="toggle" class="btn me-2"  @click="$emit('toggle')" >
        <span v-if="showitem">
          <i class="fa-solid fa-caret-down"></i>
        </span>
        <span v-if="!showitem">
          <i class="fa-solid fa-caret-right"></i>
        </span>
      </button>
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

</style>
