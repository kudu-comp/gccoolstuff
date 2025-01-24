<template>
  <div class="d-flex flex-column mx-4">
    <!-- Section head / page title -->
    <div class="sectionhead">
      {{ $t('wordsearch.title') }}
    </div>
    <!-- Main page -->
    <div class="mainpage">
      <!-- Start with info block -->
      <div
        class="infoblock"
        v-html="$t('wordsearch.long')"
      />
      <!-- Form fields -->
      <div class="row">
        <v-language v-model:dict="dict" />
      </div>
      <!-- Number input -->
      <div class="row">
        <label for="len" class="form-label md-size mb-2">{{$t('wordsearch.length')}}</label>
        <input type="number" min="0" v-model="len" id="len" class="form-control md-size mb-2"/>
      </div>
      <!-- Text input -->
      <div class="row">
        <label
          class="form-label mb-2 md-size"
          for="wordsearch"
        >{{$t('wordsearch.pattern')}}</label>
        <input
          id="wordsearch"
          v-model="wordsearch"
          type="text"
          class="form-control md-size mb-2 me-2"
        >
      </div>
      <div class="row">
        <label
          class="form-label mb-2 md-size"
          for="yellows"
        >{{$t('wordsearch.yellows')}}</label>
        <input
          id="yellows"
          v-model="yellows"
          type="text"
          class="form-control md-size mb-2 me-2"
        >
      </div>
      <div class="row">
        <label
          class="form-label mb-2 md-size"
          for="greys"
        >{{$t('wordsearch.greys')}}</label>
        <input
          id="greys"
          v-model="greys"
          type="text"
          class="form-control md-size mb-2 me-2"
        >
      </div>
      <!-- Action buttons -->
      <button class="btn mb-2" id="btn1" @click="findwordsearch()">{{$t('buttons.search')}}</button>
      <!-- Error message -->
      <p
        v-show="errormsg"
        class="errormsg"
      >
        {{ errormsg }}
      </p>
      <!-- Result area or use v-html -->
      <div v-if="result" class="resultbox" v-html="result" />
    </div>
  </div>
</template>

<script>

import VLanguage from "@/components/inputs/VLanguage.vue";

export default {

  name: "wordsearch",

  components: {
    VLanguage  
  },

  data() {
    return {
      result: "",
      errormsg: "",
      wordsearch: "?????",
      yellows: "",
      greys: "",
      len: 5,
      cnt: 0,
      dict: {}
    };
  },

  methods: {

    nextTry(word) {
      // console.log(this.dict.name);
      if (word.length === this.wordsearch.length) {
        // Verify mandatory letters
        for (let i = 0; i < this.yellows.length; i++) {
          if (word.indexOf(this.yellows[i]) < 0) return;
        }
        // Check word
        let h = this.dict.find(word.toLowerCase());
        if (h) {
          this.result += word + "<br>";
          this.cnt++;
        }
      } else {
        let pos = word.length;
        if (this.wordsearch[pos] === "?") {
          for (let j = 0; j < this.letters.length; j++) {
            this.nextTry(word + this.letters[j]);
          }
        } else {
          this.nextTry(word + this.wordsearch[pos]);
        }
      }
    },

    findwordsearch: function () {
      // Reset
      this.result = "";
      this.errormsg = "";
      this.cnt = 0;

      // Checks
      if (this.len !== this.wordsearch.length) {
        this.errormsg = this.$t("wordsearch.errpattern");
        return;
      }

      // Build alphabet
      this.letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      for (let i = 0; i < this.greys.length; i++)
        this.letters = this.letters.replace(this.greys[i], "");

      this.nextTry("");

      this.result += "<br>" + this.cnt + this.$t("wordsearch.wordsfound");
    },

  },
};

</script>

<style scoped>
</style>
