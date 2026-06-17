<template>
  <label
  >{{ t('labels.alphabet') }}</label>
  <div class="custom-select-container" v-click-outside="() => isDropdownOpen = false">
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
  if (!alphabets.value || alphabets.value.length === 0) {
    return 'Loading...';
  }
  
  const found = alphabets.value.find(a => a.name === props.alphabet);
  
  // Return the label if found, otherwise a default placeholder
  return found ? found.name : 'Select a category';
});

// --- Methods ---
const selectAlphabet = (name) => {
  emit('update:alphabet', name);
  isDropdownOpen.value = false; // Close dropdown after selection
};

// --- Lifecycle ---
onMounted(() => {
  alphabets.value = textHelper.alphabets;
});
</script>
