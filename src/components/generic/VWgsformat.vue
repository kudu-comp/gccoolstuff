<template>
  <label
  >WGS84 Format</label>
  <div class="custom-select-container" v-click-outside="() => isDropdownOpen = false">
    <div class="custom-select-trigger" @click="isDropdownOpen = !isDropdownOpen" :class="{ 'is-active': isDropdownOpen }">
      {{ selectFormat }}
      <span class="chevron">▾</span>
    </div>
    <transition name="fade-slide">
      <div v-if="isDropdownOpen" class="custom-options-list">
        <div 
          v-for="option in formatOptions"
          class="custom-option" 
          :class="{ 'selected': format === option.value }" 
          :disabled="option.disabled"
          @click="$emit('update:format', option.value)"
        >
          {{ option.label }}
          <span v-if="datum ===  option.value" class="check">✓</span>
        </div>
      </div>
    </transition>
  </div>  
</template>

<script setup>

import { ref, computed } from 'vue'

const props = defineProps({
  format: {
    type: String,
    required: true
  }
})

const isDropdownOpen = ref(false);

const selectFormat = computed(() =>  {

  // Check if categories exists and has items
    if (!formatOptions || formatOptions.length === 0) {
      return 'Loading...'; 
    }
    
    // Find the selected item
    const found = formatOptions.find(a => a.value === props.format);
    isDropdownOpen.value = false;
    
    // Return the label if found, otherwise a default placeholder
    return found ? found.label : 'Select a datum';
  });

defineEmits(['update:format'])

const formatOptions = [
  {
    value: '52.12345 4.56789',
    label: 'Example: 52.12345° 4.56789°'
  },
  {
    value: 'N52.12345 E4.56789',
    label: 'Example: N52.12345° E4.56789°'
  },
  {
    value: 'N52 12.345 E4 12.345',
    label: "Example: N52° 12.345' E4° 56.789'"
  },
  {
    value: 'N52 12 34.567 E4 12 34.567',
    label: 'Example: N52° 12\' 34.567" E4° 12\' 34.567"'
  },
  {
    value: '52 12 34.567 N 4 12 34.567 E',
    label: 'Example: 52° 12\' 34.567" N 4° 12\' 34.567 E"'
  }
]
</script>