<template>
  <button 
    id="download" 
    class="btn btn-primary" 
    :title="t('buttons.download')" 
    @click="downloadCanvas"
  >
    {{ t('buttons.download') }}
  </button>
</template>

<script setup>

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

// Props definition
const props = defineProps({
  canvas: {
    type: Object, // Changed from String to Object to support the Canvas element
    required: true
  }
});

defineOptions({
  name: 'VDownload'
});

const downloadCanvas = () => {
  // Ensure the canvas exists before trying to export
  if (!props.canvas || typeof props.canvas.toDataURL !== 'function') {
    console.error("VDownload: Provided prop is not a valid canvas element.");
    return;
  }

  // Create a temporary link element
  const link = document.createElement('a');
  link.download = 'download.png';
  
  // Convert canvas content to image data
  link.href = props.canvas.toDataURL('image/png');
  
  // Trigger the download
  link.click();
  
  // Clean up is automatic as 'link' goes out of scope, 
  // no need for 'link.delete' (which was invalid syntax)
};
</script>