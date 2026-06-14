<template>
  <div v-if="item.isVisible !== false" class="tree-item">
    <div 
      class="item-content" 
      :style="{ paddingLeft: `${depth * 20}px` }"
    >
      <!-- Toggle Icon -->
      <span class="icon-wrapper" @click.stop="toggle">
        <template v-if="hasChildren">
          <!-- Show Down arrow if expanded, Right arrow if collapsed -->
          <svg v-if="item.isExpanded" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </template>
      </span>

      <a :href="item.link" class="item-link">
        {{ item.name }}
      </a>
    </div>

    <!-- Children render if the item is expanded -->
    <div v-if="hasChildren && item.isExpanded" class="item-children">
      <TreeItem 
        v-for="(child, index) in item.children" 
        :key="index" 
        :item="child" 
        :depth="depth + 1"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  item: { type: Object, required: true },
  depth: { type: Number, default: 0 }
});

const hasChildren = computed(() => {
  return props.item.children && 
         props.item.children.filter(c => c.isVisible !== false).length > 0;
});

const toggle = () => {
  if (hasChildren.value) {
    // Manually toggle the property on the object
    props.item.isExpanded = !props.item.isExpanded;
  }
};
</script>

<style scoped>
.tree-item { font-family: sans-serif; border-bottom: 1px solid var(--border-color); }
.item-content { display: flex; align-items: center; padding: 5px; }
.icon-wrapper { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; cursor: pointer; margin-right: 4px; color: #666; }
.item-link { text-decoration: none; font-size: 14px; }
.item-children { background-color: rgba(0, 0, 0, 0.02); }
</style>