<template>
  <button 
    id="download" 
    class="btn btn-primary" 
    :title="t('download')" 
    @click="downloadCanvas"
  >
    <svg class="svg-icon" viewBox="0 0 24 24">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
    {{ t('download') }}
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
  name: 'DownloadButton'
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

<i18n locale="en">
{
    "download": "Download"
}
</i18n>

<i18n locale="nl">
{
    "download": "Download"
}
</i18n>