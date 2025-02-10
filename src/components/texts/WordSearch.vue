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
      <v-language v-model:dict="dict" v-model:dictloading="dictloading" />
      <hr class="mb-2"/>
      <!-- Part 1 -->
      <div class="row">
        <label for="len" class="form-label md-size mb-2">{{$t('wordsearch.length')}}</label>
        <input type="number" min="0" v-model="len" id="len" class="form-control md-size mb-2"/>
      </div>
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
      <button :disabled="dictloading" class="btn smsize mb-2" id="btn1" @click="findwordsearch()">{{$t('wordsearch.searchpattern')}}</button>
      <!-- Part 2 -->
      <hr class="mb-2"/>
      <div class="row">
        <label
          class="form-label mb-2 md-size"
          for="letters"
        >{{$t('wordsearch.letters')}}</label>
        <input
          id="letters"
          v-model="chunk"
          type="text"
          class="form-control md-size mb-2 me-2"
        >
      </div>
      <button :disabled="dictloading" class="btn sm-size mb-2 me-2" id="btn2" @click="findLongest()">{{$t('wordsearch.searchlongest')}}</button>
      <button :disabled="dictloading" class="btn sm-size mb-2 me-2" id="btn3" @click="findStart()">{{$t('wordsearch.searchstart')}}</button>
      <button :disabled="dictloading" class="btn sm-size mb-2 me-2" id="btn4" @click="findEnd()">{{$t('wordsearch.searchend')}}</button>
      <button :disabled="dictloading" class="btn sm-size mb-2" id="btn5" @click="findContains()">{{$t('wordsearch.searchcontains')}}</button>
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

    nextTry(word) {

      // Check if we have too many words
      if (this.cnt > this.maxcnt) {
        this.errormsg = this.$t("wordsearch.toomany");
        return;
      }

      if (word.length === this.wordsearch.length) {
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
      this.wordsearch = this.dict.cleanStr(this.wordsearch.trim());
      this.yellows = this.dict.cleanStr(this.yellows.trim());
      this.greys = this.dict.cleanStr(this.greys.trim());
      this.finds = [];

      // Checks
      if (this.len !== this.wordsearch.length) {
        this.errormsg = this.$t("wordsearch.errpattern");
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
      this.result = h2.length + this.$t("wordsearch.wordsfound") + "<br><br>";
      for (let f of h2) {
        this.result += f + "<br>";
      }

    },

    nextTryLongest: function (anagram) {
      // Build the string for the anagram
      let hword = "";
      for (let i = 0; i < anagram.length; i++) hword += this.base[anagram[i]];

      // Find the anagram
      let fullmatch = this.dict.findWord(hword);
      // Check if the anagram is the start of a word, empty always good
      let partmatch = fullmatch.word
        ? this.dict.compStr(
            this.dict.cleanStr(fullmatch.word.slice(0, hword.length)),
            this.dict.cleanStr(hword)
          ) === 0
        : true;

      // What we got here is not even the start of a word
      if (!partmatch) return;

      // We got a find that's longer
      if (fullmatch.fnd && hword.length > this.lword.length) {
        this.lword = hword;
      }

      if (anagram.length === this.base.length) return;

      // Continue for longer words
      for (let i = 0; i < this.base.length; i++) {
        // For permutations without replacements skip i if already used
        if (anagram.indexOf(i) >= 0) continue;
        anagram.push(i);
        this.nextTryLongest(anagram);
        anagram.pop();
      }
    },
    
    findLongest: function () {
      // Reset
      this.result = "";
      this.errormsg = "";

      // First remove whitespace and diacretics from input
      this.chunk = this.dict.cleanStr(this.chunk.replace(/\s/g, ""));
      this.base = this.chunk;

      // Start generating
      this.lword = "";
      this.nextTryLongest([]);

      this.result = this.$t("wordsearch.longest") + this.lword;
    },

    findStart: function () {
      // Reset
      this.chunk = this.dict.cleanStr(this.chunk.replace(/\s/g, ""));
      this.result = this.$t("wordsearch.starting") + this.chunk + "<br><br>";
      this.errormsg = "";
      let cnt = 0;

      // Find the first word starting with the given txt
      let fnd = this.dict.findWord(this.dict.cleanStr(this.chunk));
      let pos = fnd.pos;

      // Keep going until we reach the end or are at a word that starts differently
      while (
        pos < this.dict.words.length &&
        this.dict.words[pos].slice(0, this.chunk.length) === this.chunk
      ) {
        this.result += this.dict.words[pos++] + "<br>";
        cnt++;
      }

      this.result += "<br>" + cnt + this.$t("wordsearch.wordsfound") + "<br>";
    },

    findEnd: function () {
      // Reset
      this.chunk = this.dict.cleanStr(this.chunk.replace(/\s/g, ""));
      this.result = this.$t("wordsearch.ending") + this.chunk + "<br><br>";
      this.errormsg = "";
      let cnt = 0;

      // Find the first word starting with the given txt
      let len = -this.chunk.length;

      // Scan the dictionary one by one
      for (let i = 0; i < this.dict.words.length; i++) {
        if (this.dict.words[i].slice(len) === this.chunk) {
          this.result += this.dict.words[i] + "<br>";
          cnt++;
        }
      }

      this.result += "<br>" + cnt + this.$t("wordsearch.wordsfound") + "<br>";
    },

    findContains: function () {
      // Reset
      this.chunk = this.dict.cleanStr(this.chunk.replace(/\s/g, ""));
      this.result = this.$t("wordsearch.containing") + this.chunk + "<br><br>";
      this.errormsg = "";
      let cnt = 0;

      // Scan the dictionary one by one
      for (let i = 0; i < this.dict.words.length; i++) {
        if (this.dict.words[i].indexOf(this.chunk) >= 0) {
          this.result += this.dict.words[i] + "<br>";
          cnt++;
        }
      }

      this.result += "<br>" + cnt + this.$t("wordsearch.wordsfound") + "<br>";
    },


  },
};

</script>

<style scoped>
</style>
