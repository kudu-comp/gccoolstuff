<template>
  <label
    for="var"
  >{{ t('labels.variable') }}</label>
  <input
    type="text"
    :value="variable"
    @input="updateVar($event.target.value)"
  >
  <label
    for="varoptions"
  >{{ t('labels.option') }}</label>
  <input
    type="text"
    :value="varoptions"
    @input="updateVarOptions($event.target.value)"
  >
</template>

<script setup>

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

// Define the props
const props = defineProps({
  variable: {
    type: String,
    required: true
  },
  varoptions: {
    type: String,
    required: true
  }
})

// Define the emits
const emit = defineEmits([
  'update:variable', 
  'update:varoptions'
])

// Define the methods
const updateVar = (value) => {
  emit('update:variable', value)
}

const updateVarOptions = (value) => {
  emit('update:varoptions', value)
}
</script>

<style scoped>

.form-horizontal label {
  flex: 0 0 100px;
}

</style>
