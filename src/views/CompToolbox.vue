<template>
  <div class="comp">
    <CompTools msg="Computer toolbox"/>
  </div>
</template>

<script>
// @ is an alias to /src
import CompTools from '@/components/comp/CompTools.vue'

export default {
  name: 'CompToolbox',
  components: {
    CompTools
  }
}
</script>
