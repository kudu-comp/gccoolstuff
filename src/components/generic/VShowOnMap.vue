<template>
  <button id="calc" class="btn btn-primary" @click="$emit('show')" :title="$t('buttons.show')">
    {{$t('buttons.show')}}
  </button>
</template>

<script setup>

defineEmits(['show'])

</script>