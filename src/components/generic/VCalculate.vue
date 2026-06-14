<template>
  <button class="btn btn-primary" :title="$t('buttons.calc')" @click="calculate()">
    {{$t('buttons.calc')}}
  </button>
</template>

<script setup>
defineOptions({
  name: 'VCalculate'
})

const emit = defineEmits(['calculate'])

const calculate = () => {
  // Emit the event to the parent
  emit('calculate')
}
</script>
