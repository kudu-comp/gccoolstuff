<template>
  <div>
    <div class="form-horizontal">
      <label
      >{{ $t('labels.search') }}</label>
      <input
        type="text"
        ref="searchInput"
        :value="search"
        @input="updateSearch($event.target.value)"
      >
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Define Props
const props = defineProps({
  search: {
    type: String,
    required: true
  }
})

// Define Emits
const emit = defineEmits(['update:search'])

// Template Ref for the input element
const searchInput = ref(null)

// Lifecycle hook to focus on mount
onMounted(() => {
  if (searchInput.value) {
    searchInput.value.focus()
  }
})

// Method to handle updates
const updateSearch = (value) => {
  emit('update:search', value)
}
</script>

<style scoped>
</style>>

<style scoped>
</style>
