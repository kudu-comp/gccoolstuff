<template> 
  <div class="custom-select-container" v-click-outside="closeDropdown">
    <div class="custom-select-trigger" @click="isDropdownOpen = !isDropdownOpen" :class="{ 'is-active': isDropdownOpen }">
      {{ selectedCategoryLabel }}
      <span class="chevron">▾</span>
    </div>
    <transition name="fade-slide">
      <div v-if="isDropdownOpen" class="custom-options-list">
        <div 
          v-for="k in keyboards" 
          :key="k.name" 
          class="custom-option" 
          :class="{ 'selected': keyboard === k.name }" 
          @click="updateKeyboard(k.name)"
        >
          {{ k.description }}
          <span v-if="keyboard === k.name" class="check">✓</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>

import { ref, computed, onMounted } from 'vue';
import * as keyBoardsScript from '@/scripts/keyboards.js';
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

// --- Props & Emits ---
const props = defineProps({
  keyboard: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:keyboard']);

// --- State ---
const keyboards = ref([]);
const isDropdownOpen = ref(false);

// --- Computed ---
const selectedCategoryLabel = computed(() => {
  // Check if categories exists and has items
  if (!keyboards.value || keyboards.value.length === 0) {
    return 'Loading...';
  }

  // Find the selected item matching the prop
  const found = keyboards.value.find(a => a.name === props.keyboard);

  // Return the label if found, otherwise a default placeholder
  return found ? found.description : 'Select a keyboard';
});

// --- Methods ---
const updateKeyboard = (value) => {
  emit('update:keyboard', value);
  isDropdownOpen.value = false; // Close the menu after selection
};

// --- Lifecycle ---
onMounted(() => {
  keyboards.value = keyBoardsScript.keyboards;
});

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.body.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  }
}

</script>
