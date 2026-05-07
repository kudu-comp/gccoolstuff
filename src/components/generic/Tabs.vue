<template>
  <div>
    <button
      v-for="tab in tabs"
      :key="tab.title"
      :disabled="tab.disabled"
      :class="tab.tabbuttonclass"
      @click="selectTab(tab.title)"
    >
      {{ tab.title }}
    </button>
    <slot />
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabs: [],
    };
  },

  provide() {
    return {
      addTab: (tab) => {
        const count = this.tabs.push(tab);
        if (count === 1) {
          this.tabs[0].tabbuttonclass = "tab-button tab-active";
          this.tabs[0].select(true);
        }
      },
    };
  },

  methods: {
    selectTab(title) {
      for (let t of this.tabs) {
        t.select(t.title === title);
        t.tabbuttonclass =
          t.title === title ? "tab-button tab-active" : "tab-button";
      }
    },

    disableTab(title) {
      for (let t of this.tabs) {
        if (t.title === title) t.disabled = true;
      }
    },

    enableTab(title) {
      for (let t of this.tabs) {
        if (t.title === title) t.disabled = false;
      }
    },

    enableAllTabs() {
      for (let t of this.tabs) {
        t.disabled = false;
      }
    },
  },
};
</script>
