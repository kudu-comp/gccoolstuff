<template>
  <div class="d-flex flex-column mx-4">
    <!-- Section head / page title -->
    <div class="sectionhead">
      {{ $t('wordle.title') }}
    </div>
    <!-- Main page -->
    <div class="mainpage">
      <!-- Start with info block -->
      <div
        class="infoblock"
        v-html="$t('wordle.long')"
      />
      <!-- Form fields -->
      <v-language v-model:dict="dict" v-model:dictloading="dictloading" />
      <hr class="mb-2"/>
      <!-- Part 1 -->
      <div class="row">
        <label for="len" class="form-label md-size mb-2">{{$t('wordle.length')}}</label>
        <input type="number" min="0" v-model="len" id="len" class="form-control md-size mb-2"/>
      </div>
      <div class="row">
        <label
          class="form-label mb-2 md-size"
          for="wordle"
        >{{$t('wordle.pattern')}}</label>
        <input
          id="wordle"
          v-model="wordle"
          type="text"
          class="form-control md-size mb-2 me-2"
        >
      </div>
      <div class="row">
        <label
          class="form-label mb-2 md-size"
          for="yellows"
        >{{$t('wordle.yellows')}}</label>
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
        >{{$t('wordle.greys')}}</label>
        <input
          id="greys"
          v-model="greys"
          type="text"
          class="form-control md-size mb-2 me-2"
        >
      </div>
      <button :disabled="dictloading" class="btn sm-size mb-2" id="btn1" @click="findwordle()">
        <i class="fa-solid fa-puzzle-piece me-2"></i>{{$t('buttons.solve')}}
      </button>
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

  name: "wordle",

  components: {
    VLanguage  
  },

  data() {
    return {
      result: "",
      errormsg: "",
      wordle: "?????",
      letters: "",
      yellows: "",
      greys: "",
      len: 5,
      cnt: 0,
      maxcnt: 2500,
      finds: [],
      dict: {},
      dictloading: true,
      chunk: ""
    };
  },

  methods: {

    nextTry: function(word) {

      // Check if we have too many words
      if (this.cnt > this.maxcnt) {
        this.errormsg = this.$t("wordle.toomany");
        return;
      }

      if (word.length === this.wordle.length) {
        // Verify mandatory letters
        for (let i = 0; i < this.yellows.length; i++) {
          if (word.indexOf(this.yellows[i]) < 0) return;
        }
        // Check word
        let h = this.dict.find(word);
        if (h) {
          this.finds.push(word);
          this.cnt++;
        }
      } else {
        let pos = word.length;
        if (this.wordle[pos] === "?") {
          for (let j = 0; j < this.letters.length; j++) {
            this.nextTry(word + this.letters[j]);
          }
        } else {
          this.nextTry(word + this.wordle[pos]);
        }
      }
    },

    findwordle: function () {
      // Reset
      this.result = "";
      this.errormsg = "";
      this.cnt = 0;
      this.wordle = this.dict.cleanStr(this.wordle.trim());
      this.yellows = this.dict.cleanStr(this.yellows.trim());
      this.greys = this.dict.cleanStr(this.greys.trim());
      this.finds = [];

      // Checks
      if (this.len !== this.wordle.length) {
        this.errormsg = this.$t("wordle.errpattern");
        return;
      }

      // Build alphabet
      this.letters = this.dict.alphabet;
      for (let i = 0; i < this.greys.length; i++)
        this.letters = this.letters.replace(this.greys[i], "");

      this.nextTry("");

      // Due to duplicate letters we get duplicate finds, remove those
      let h2 = this.finds.filter(
        (item, index) => this.finds.indexOf(item) === index
      );
      h2 = h2.sort();
      
      // Print the finds
      this.result = h2.length + this.$t("wordle.wordsfound") + "<br><br>";
      for (let f of h2) {
        this.result += f + "<br>";
      }

    },

  },

};

</script>

<style scoped>
</style>
