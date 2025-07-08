<template>
  <div class="d-flex flex-column mx-4">
    <!-- Section head / page title -->
    <div class="sectionhead">
      {{ $t('piglatin.title') }}
    </div>
    <!-- Main page -->
    <div class="mainpage">
      <!-- Start with info block -->
      <div
        class="infoblock"
        v-html="$t('piglatin.long')"
      />
      <!-- Form fields -->
      <v-language v-model:dict="dict" v-model:dictloading="dictloading" />
      <label class="form-check-label mb-2">{{$t('piglatin.sel')}}</label>
      <div v-for="(a, index) in argots" class="form-check">
        <input
          :id="'radio' + idx"
          v-model="sel"
          type="radio"
          :value="index"
          class="form-check-input"
        />
        <label class="form-check-label" for="radio1">{{ a.name }}</label>
        <p>{{ a.descr }}</p>
      </div>
      <button :disabled="dictloading" class="btn mb-2 me-2 sm-size" id="encode" @click="encode()">{{$t('buttons.encode')}}</button>
      <button :disabled="dictloading" class="btn mb-2 sm-size" id="decode" @click="decode()">{{$t('buttons.decode')}}</button>
      <!-- Error message -->
      <p
        v-show="errormsg"
        class="errormsg"
      >
        {{ errormsg }}
      </p>
      <!-- Text area input -->
      <div class="mb-2">
        <textarea
          id="msg"
          v-model="msg"
          ref="msg"
          class="form-control"
          rows="5"
        />
      </div>
      <!-- Result area or use v-html -->
      <div v-if="result" class="resultbox" >
        {{ result }} 
      </div>
    </div>
  </div>
</template>

<script>

import VLanguage from "@/components/inputs/VLanguage.vue";
import { piglatin } from "@/scripts/piglatin.js";

export default {

  name: "PigLatin",

  components: {
    VLanguage   
  },

  data() {
    return {
      result: "",
      errormsg: "",
      dict: null,
      dict: {},
      dictloading: true,
      sel: 0,
      argots: null,
      msg: ""
    };
  },

  mounted() {
    this.argots = piglatin;
    this.$refs.msg.focus();
    if (this.$route.params.pig) {
      if (this.$route.params.pig >= "0" && this.$route.params.pig <= "7") this.sel = parseInt(this.$route.params.pig);
    }
  },

  methods: {

    decode: function () {
      // Reset
      this.result = "";
      this.errormsg = "";
      let words = this.msg.trim().match(/[^\s]+|[\s]+/gi);

      if (!words) {
        this.errormsg = "No input";
        return;
      }

      // Decode all the words
      console.log(this.dict.name)
      for (let w of words) {
        this.result += this.argots[this.sel].decodeWord(this.dict, w);
      }
    },

    encode: function () {
      // Reset
      this.result = "";
      this.errormsg = "";

      // Split in words and other stuff
      let words = this.msg.trim().match(/[^\s]+|[\s]+/gi);
      if (!words) {
        this.errormsg = "No input";
        return;
      }

      // Start generating
      for (let w of words) {
        this.result += this.argots[this.sel].encodeWord(this.dict, w);
      }
    },

  },
};

</script>

<style scoped>
</style>
