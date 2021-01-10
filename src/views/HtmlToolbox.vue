<template>
  <div class="htmltools">
    <HtmlParser msg="HTML toolbox"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HtmlParser from '@/components/HtmlParser.vue'

export default {
  name: 'HTMLToolbox',
  components: {
    HtmlParser
  }
}
</script>
