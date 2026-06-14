<template>
  <div class="list-container">
    <div class="list-body">
      <TreeItem 
        v-for="(item, index) in items" 
        :key="index" 
        :item="item" 
        :depth="0"
      />
    </div>
  </div>
</template>

<script setup>
import TreeItem from './TreeItem.vue';

const props = defineProps({
  items: { type: Array, required: true }
});

// Helper to traverse the whole tree and update a property
const walkTree = (list, callback) => {
  list.forEach(item => {
    callback(item);
    if (item.children && item.children.length > 0) {
      walkTree(item.children, callback);
    }
  });
};

const expandAll = () => {
  walkTree(props.items, (item) => item.isExpanded = true);
};

const collapseAll = () => {
  walkTree(props.items, (item) => item.isExpanded = false);
};

const resetVisibility = () => {
  walkTree(props.items, (item) => item.isVisible = true);
};

// Expose functions to parent components
defineExpose({ expandAll, collapseAll, resetVisibility });
</script>

<style scoped>
.list-container {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-color);
}

.list-body {
  max-height: 800px;
  overflow-y: auto;
}
</style>