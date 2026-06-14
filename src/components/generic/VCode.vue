<script setup>
import { ref, computed } from 'vue';

// 1. Assign props to a variable to access them in script
const props = defineProps({
  code: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:code'])

// 2. Define the missing ref for the dropdown state
const isDropdownOpen = ref(false)

const codeOptions = [
  { label: 'Text (UTF8/UTF16)', value: 'UTF16' },
  { label: '--- Numbers ---', disabled: true },
  { label: 'Binary (0,1)', value: 'Binary' },
  { label: 'Octal (0-7)', value: 'Octal' },
  { label: 'Decimal (0-9)', value: 'Decimal' },
  { label: 'Hexadecimal (0-F)', value: 'Hexadecimal' },
  { label: '--- Older codepages & alt codes ---', disabled: true },
  { label: 'Text Ascii', value: 'ASCII' },
  { label: 'Windows Western European (CP1252)', value: 'CP1252' },
  { label: 'Original IBM Hardware (CP437)', value: 'CP437' },
  { label: 'MS DOS Western European(CP850)', value: 'CP850' },
  { label: 'MS DOS Eastern European (CP852)', value: 'CP852' },
  { label: 'MS DOS Turkish codepage (CP857)', value: 'CP857' },
  { label: 'MS DOS Cyrillic codepage (CP866)', value: 'CP866' },
  { label: 'Atari ASCII variant (ATASCII)', value: 'ATASCII' },
  { label: 'EBCDIC character set', value: 'EBCDIC' },
  { label: '--- Telegraphy & telex ---', disabled: true },
  { label: 'Baudot code (ITA-1)', value: 'Baudotcode' },
  { label: 'Baudot code (ITA-1) - reversed', value: 'BaudotcodeR' },
  { label: 'Murray code (ITA-2)', value: 'Murraycode' },
  { label: 'Murray code (ITA-2) - reversed', value: 'MurraycodeR' },
  { label: 'Murray Cyrillic (MTK-2)', value: 'MurrayMTK2' },
  { label: 'Murray Cyrillic (MTK-2) - reversed', value: 'MurrayMTK2R' }
]

const selectedCategoryLabel = computed(() => {
  // Use props.code instead of code.value
  const found = codeOptions.find(a => a.value === props.code);
  return found ? found.label : 'Select a category';
});

// 3. Create a selection function to handle closing the dropdown
const selectOption = (option) => {
  if (option.disabled) return;
  
  emit('update:code', option.value);
  isDropdownOpen.value = false;
};
</script>

<template>
  <div class="custom-select-container" v-click-outside="() => isDropdownOpen = false">
    <div 
      class="custom-select-trigger" 
      @click="isDropdownOpen = !isDropdownOpen" 
      :class="{ 'is-active': isDropdownOpen }"
    >
      {{ selectedCategoryLabel }}
      <span class="chevron">▾</span>
    </div>

    <transition name="fade-slide">
      <div v-if="isDropdownOpen" class="custom-options-list">
        <div 
          v-for="option in codeOptions" 
          :key="option.value || option.label" 
          class="custom-option" 
          :class="{ 
            'selected': props.code === option.value, 
            'is-disabled': option.disabled 
          }" 
          @click="selectOption(option)"
        >
          {{ option.label }}
          <span v-if="props.code === option.value" class="check">✓</span>
        </div>
      </div>
    </transition>
  </div>
</template>