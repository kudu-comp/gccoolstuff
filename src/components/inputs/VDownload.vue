<template>
  <button id="download" class="btn mb-2 me-2" @click="downloadCanvas()">
    <i class="fa-solid fa-download"></i> {{$t('buttons.download')}}
  </button>
</template>

<script>

export default {

  name: 'VDownload',

  props: {
    canvas: {
      type: String,
      required: true
    }
  },

  methods: {
  
    downloadCanvas: function () {
      
      // Download canvas
      const link = document.createElement('a');
      link.download = 'download.png';
      link.href = this.canvas.toDataURL();
      link.click();
      link.delete;
      
    },

  }
}
</script>
