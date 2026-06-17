<template>
  <button id="calc" class="btn btn-primary" @click="$emit('show')" :title="t('buttons.show')">
    {{t('buttons.show')}}
  </button>
</template>

<script setup>

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

defineEmits(['show'])

</script>