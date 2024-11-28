<template>
  <div v-show="isActive" class="tab-content">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
  },

  inject: ["addTab"],

  data() {
    return {
      isActive: false,
    };
  },

  created() {
    this.addTab({
      title: this.title,
      tabbuttonclass: "tab-button",
      disabled: false,
      select: (active) => {
        this.isActive = active;
      },
    });
  },
};
</script>
