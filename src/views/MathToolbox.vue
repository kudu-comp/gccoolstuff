<template>
  <div class="math">
    <Mathtools msg="Mathematical toolbox"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Mathtools from '@/components/math/Mathtools.vue'

export default {
  name: 'MathToolbox',
  components: {
    Mathtools
  }
}
</script>
