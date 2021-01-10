<template>
  <div class="cipher">
    <Encoderdecoder msg="Encode or decode ciphers"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Encoderdecoder from '@/components/Encoderdecoder.vue'

export default {
  name: 'Cipher',
  components: {
    Encoderdecoder
  }
}
</script>
