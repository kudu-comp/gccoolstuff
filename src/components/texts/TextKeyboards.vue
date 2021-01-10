<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{$t('texttools.keyboards.title')}}
    </div>
    <div class="mainpage">
      <div class="infoblock">
        {{$t('dialogkb.info')}}
      </div>
      <div class="form-inline">
        <label class="form-label mb-2 mr-2" for="keyboards">{{$t('dialogkb.inputkb')}}</label>
        <v-keyboards class="mb-2" id="keyboards" v-model:keyboard="fromkeyboard"></v-keyboards>
      </div>
      <div>
        <div class="form-row mb-2">
          <textarea id="message" name="message" class="form-control" ref="message" :placeholder="$t('labels.message')" rows=10 v-model='message' @input="translateKeyboard"></textarea>
        </div>
        <div class="form-inline">
          <input type="button" id="convert" name="convert" :value="$t('buttons.convert')" class="btn btn-primary mb-2 mr-2" v-on:click="translateKeyboard">
          <label class="form-label mb-2 mr-2" for="keyboards2">{{$t('dialogkb.outputkb')}}</label>
          <v-keyboards class="mb-2" id="keyboards2" v-model:keyboard="tokeyboard" @change="translateKeyboard"></v-keyboards>
        </div>
      </div>
      <div class="card card-text p-2">{{result}}</div>
      <p v-show="error" class="errormsg mt-2">{{errormsg}}</p>
    </div>
  </div>
</template>

<script>
import VKeyboards from '@/components/inputs/VKeyboards.vue'
import * as keyboards from '@/scripts/keyboards.js'

export default {
  name: 'TextKeyboards',

  props: {
    msg: String,
  },

  data: function () {
    return {
      message: "",
      result : this.$t('labels.result'),
      fromkeyboard : "QWERTY",
      tokeyboard: "DVORAK2",
      error: false,
      errormsg: "",
    }
  },

  components: {
    VKeyboards,
  },

  mounted: function() {
    this.$refs.message.focus();
  },

  methods: {

    // Translate form one keyboard to another
    translateKeyboard : function () {

      // Reset error flag
      this.error = false;

      try {
        // Convert the input
        this.result = keyboards.convertKeyboard (this.message, this.fromkeyboard, this.tokeyboard);
      } catch (e) {
        this.error = true;
        this.errormsg = this.$t('dialogkb.error');
        console.log(e);
      }
    },

  },
}
</script>

<style scoped>
</style>
