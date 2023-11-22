<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('texttools.keyboards.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('texttools.keyboards.long')"
      />
      <div class="row">
        <label
          class="form-label mb-2 sm-size"
          for="keyboards"
        >{{ $t('txtkeyb.inputkb') }}</label>
        <v-keyboards
          id="keyboards"
          v-model:keyboard="fromkeyboard"
          class="mb-2"
          @change="translateKeyboard"
        />
      </div>
      <div class="row">
        <label
          class="form-label mb-2 sm-size"
          for="keyboards2"
        >{{ $t('txtkeyb.outputkb') }}</label>
        <v-keyboards
          id="keyboards2"
          v-model:keyboard="tokeyboard"
          class="mb-2"
          @change="translateKeyboard"
        />
      </div>
      <button id="convert" class="btn mb-2"  @click="translateKeyboard">
        {{ $t('buttons.convert') }}
      </button>
      <textarea
        id="message"
        ref="message"
        v-model="message"
        class="form-control mb-2"
        :placeholder="$t('labels.message')"
        rows="5"
        @input="translateKeyboard"
      />
      <p
        v-show="errormsg"
        class="errormsg mt-2"
      >
        {{ errormsg }}
      </p>
      <div
        v-if="result"
        class="resultbox"
      >
        {{ result }}
      </div>
    </div>
  </div>
</template>

<script>
import VKeyboards from '@/components/inputs/VKeyboards.vue'
import * as keyboards from '@/scripts/keyboards.js'

export default {
  name: 'TextKeyboards',

  components: {
    VKeyboards,
  },

  data: function () {
    return {
      message: "",
      result : "",
      fromkeyboard : "QWERTY",
      tokeyboard: "DVORAK2",
      errormsg: "",
    }
  },

  mounted: function() {
    this.$refs.message.focus();
  },

  methods: {

    // Translate form one keyboard to another
    translateKeyboard : function () {

      // Reset error flag
      this.errormsg = "";
      this.result = "";

      try {
        // Convert the input
        this.result = keyboards.convertKeyboard (this.message, this.fromkeyboard, this.tokeyboard);
      } catch (e) {
        this.errormsg = this.$t('txtkeyb.error');
        console.log(e);
      }
    },

  },
}
</script>

<style scoped>
</style>
