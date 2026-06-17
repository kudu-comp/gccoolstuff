<template>
  <label
    ><slot name="label">{{ t('labels.angle') }}</slot>
  </label>
  <input
    id="coordinput"
    type="number"
    :value="angle"
    class="fixed-input"
    @input="$emit('update:angle', Number($event.target.value))"
  >
  <!-- <label
    ><slot name="label2">&nbsp;</slot>
  </label> -->
  <div class="custom-select-container" v-click-outside="() => isDropdownOpen = false">
    <div class="custom-select-trigger" @click="isDropdownOpen = !isDropdownOpen" :class="{ 'is-active': isDropdownOpen }">
      {{ selectUnit }}
      <span class="chevron">▾</span>
    </div>
    <transition name="fade-slide">
      <div v-if="isDropdownOpen" class="custom-options-list">
        <div 
          v-for="option in unitOptions"
          class="custom-option" 
          :class="{ 'selected': unit === option.value }" 
          :disabled="option.disabled"
          @click="$emit('update:unit', option.value)"
        >
          {{ option.label }}
          <span v-if="unit ===  option.value" class="check">✓</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>

import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const props = defineProps({
  angle: {
    type: [Number, String],
    required: true
  },
  unit: {
    type: [Number, String],
    required: true
  }
})

defineEmits(['update:angle', 'update:unit'])

// Reference for auto-focusing the input
const isDropdownOpen = ref(false);

const selectUnit = computed(() =>  {

  // Check if categories exists and has items
    if (!unitOptions || unitOptions.length === 0) {
      return 'Loading...'; 
    }
    
    // Find the selected item
    const found = unitOptions.find(a => a.value === props.unit);
    isDropdownOpen.value = false;
    
    // Return the label if found, otherwise a default placeholder
    return found ? found.label : 'Select a unit';
  });

  const unitOptions = [
  { label: 'Degrees (°)', value: 0.0174532925 },
  { label: 'Radians (rad)', value: 1 },
  { label: 'Gon (gon)', value: 0.0157079633 }
]
</script>

<style scoped>

.form-horizontal label{
  flex: 0 0 100px;
}
</style>