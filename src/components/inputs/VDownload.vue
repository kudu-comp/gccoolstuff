<template>
  <input
    id="download"
    type="button"
    :value="$t('buttons.download')"
    class="btn btn-primary mb-2 mr-2"
    @click="downloadCanvas()"
  >
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
