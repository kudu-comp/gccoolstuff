<template>
  <div class="texttoolbox">
    <TextTools msg="Toolbox for text"/>
  </div>
</template>

<script>
// @ is an alias to /src
import TextTools from '@/components/texts/TextTools.vue'

export default {
  name: 'TextToolbox',
  components: {
    TextTools
  }
}
</script>
