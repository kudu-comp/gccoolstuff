<template>
<label v-if="title" class="dropdown-label">{{ title }}</label>

<div class="custom-select-container" v-click-outside="closeDropdown">
    <div 
    class="custom-select-trigger" 
    @click="isDropdownOpen = !isDropdownOpen" 
    :class="{ 'is-active': isDropdownOpen }"
    >
    {{ selectedOptionLabel }}
    <span class="chevron">▾</span>
    </div>

    <transition name="fade-slide">
    <div v-if="isDropdownOpen" class="custom-options-list">
        <div 
        v-for="option in options" 
        :key="option.value"
        class="custom-option" 
        :class="{ 
            'selected': modelValue === option.value,
            'is-disabled': option.disabled 
        }" 
        @click="selectOption(option)"
        >
        {{ option.label }}
        <span v-if="modelValue === option.value" class="check">✓</span>
        </div>
    </div>
    </transition>
</div>

</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number, Object],
    default: null
  },
  options: {
    type: Array,
    required: true,
    // Expected: [{ label: 'Arial', value: 'arial', disabled: true }]
  },
  title: { type: String, default: '' },
  placeholder: { type: String, default: 'Select an option' }
})

const emit = defineEmits(['update:modelValue', 'change'])
const isDropdownOpen = ref(false)

const selectedOptionLabel = computed(() => {
  if (!props.options || props.options.length === 0) return 'Loading...'
  const found = props.options.find(opt => opt.value === props.modelValue)
  return found ? found.label : props.placeholder
})

const selectOption = (option) => {
  // Prevent selection if the item is disabled
  if (option.disabled) return

  emit('update:modelValue', option.value)
  emit('change', option.value)
  isDropdownOpen.value = false
}

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

<style scoped>

.custom-select-container {
  position: relative;
  width: 100%;
}

.custom-select-trigger {
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--white);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
  transition: all 0.2s;
}

.custom-options-list {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  width: 100%;
  background: var(--white);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
  z-index: 1000;
  overflow: hidden;
}

.custom-option {
  padding: 0.8rem 1rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  transition: all 0.2s;
}

.custom-option:hover:not(.is-disabled) {
  background-color: var(--soft-green);
  color: var(--primary-green);
}

.custom-option.selected {
  background-color: var(--primary-green);
  color: var(--white);
}

.custom-option.is-disabled {
  color: #bbb;
  cursor: not-allowed;
  background-color: #fafafa;
  /* Ensure hover effect doesn't trigger */
  pointer-events: auto; 
}

.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.2s; }
.fade-slide-enter-from, .fade-slide-leave-to { opacity: 0; transform: translateY(-10px); }
</style>