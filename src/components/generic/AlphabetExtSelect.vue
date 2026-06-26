<template>
  <div class="input-wrapper">
    <label
    >{{ t('labels.alphabet') }}</label>
    <div class="custom-select-container" v-click-outside="closeDropdown">
      <div class="custom-select-trigger" @click="isDropdownOpen = !isDropdownOpen" :class="{ 'is-active': isDropdownOpen }">
        {{ selectedCategoryLabel }}
        <span class="chevron">▾</span>
      </div>
      <transition name="fade-slide">
        <div v-if="isDropdownOpen" class="custom-options-list">
          <div 
            v-for="a in alphabets" 
            :key="a.name" 
            class="custom-option" 
            :class="{ 'selected': alphabet === a.name }" 
            @click="selectAlphabet(a.name)"
          >
            {{ a.name }} - {{ a.alphabet }}
            <span v-if="alphabet === a.name" class="check">✓</span>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import * as textHelper from '@/scripts/texthelper.js';
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const props = defineProps({
  alphabet: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:alphabet']);

// --- State ---
const alphabets = ref([]);
const isDropdownOpen = ref(false);

// --- Computed ---
const selectedCategoryLabel = computed(() => {
  // Check if alphabets exists and has items
  if (!alphabets.value || alphabets.value.length === 0) {
    return 'Loading...';
  }

  // Find the selected item matching the prop
  const found = alphabets.value.find(a => a.name === props.alphabet);

  // Return the label if found, otherwise a default placeholder
  return found ? found.name : 'Select a category';
});

// --- Methods ---
const selectAlphabet = (name) => {
  emit('update:alphabet', name);
  isDropdownOpen.value = false; // Close the dropdown after selection
};

// --- Lifecycle ---
onMounted(() => {
  alphabets.value = textHelper.getExtAlphabets();
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
