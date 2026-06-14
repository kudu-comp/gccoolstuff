<!-- components/VCard.vue -->
<script setup>
import { ref } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: 'Card Title'
  },
  initialOpen: {
    type: Boolean,
    default: true
  }
});

const isExpanded = ref(props.initialOpen);

const toggle = () => {
  isExpanded.value = !isExpanded.value;
};
</script>

<template>
  <section class="v-card">
    <div class="v-card-header">
      <h2 class="card-title">{{ title }}</h2>

      <button 
        class="v-card-toggle" 
        @click="toggle" 
        :class="{ 'is-collapsed': !isExpanded }"
        aria-label="Toggle Card"
      >
        <span class="toggle-icon">{{ isExpanded ? '−' : '+' }}</span>
      </button>
    </div>

    <!-- 
      We use transition hooks to manage overflow. 
      When the animation is active, we clip. 
      When finished, we allow items to spill out.
    -->
    <transition name="collapse">
      <div v-if="isExpanded" class="v-card-body">
        <slot></slot>
      </div>
    </transition>
  </section>
</template>

<style scoped>

</style>