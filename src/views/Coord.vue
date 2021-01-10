<template>
  <div class="coord">
    <CoordToolbox msg="Coordinates toolbox"/>
  </div>
</template>

<script>
// @ is an alias to /src
import CoordToolbox from '@/components/coords/CoordToolbox.vue'

export default {
  name: 'Coord',
  components: {
    CoordToolbox
  }
}
</script>
