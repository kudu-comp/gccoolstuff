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
      <div class="form-inline">
        <label
          class="form-label mb-2 mr-2"
          for="keyboards"
        >{{ $t('txtkeyb.inputkb') }}</label>
        <v-keyboards
          id="keyboards"
          v-model:keyboard="fromkeyboard"
          class="mb-2"
        />
      </div>
      <div>
        <div class="form-row mb-2">
          <textarea
            id="message"
            ref="message"
            v-model="message"
            name="message"
            class="form-control"
            :placeholder="$t('labels.message')"
            rows="10"
            @input="translateKeyboard"
          />
        </div>
        <div class="form-inline">
          <input
            id="convert"
            type="button"
            name="convert"
            :value="$t('buttons.convert')"
            class="btn btn-primary mb-2 mr-2"
            @click="translateKeyboard"
          >
          <label
            class="form-label mb-2 mr-2"
            for="keyboards2"
          >{{ $t('txtkeyb.outputkb') }}</label>
          <v-keyboards
            id="keyboards2"
            v-model:keyboard="tokeyboard"
            class="mb-2"
            @change="translateKeyboard"
          />
        </div>
      </div>
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
