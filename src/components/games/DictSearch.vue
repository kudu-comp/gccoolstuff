<template>
  <div class="d-flex flex-column mx-4">
    <!-- Section head / page title -->
    <div class="sectionhead">
      {{ $t('dictsearch.title') }}
    </div>
    <!-- Main page -->
    <div class="mainpage">
      <!-- Start with info block -->
      <div
        class="infoblock"
        v-html="$t('dictsearch.long')"
      />
      <!-- Form fields -->
      <v-language v-model:dict="dict" v-model:dictloading="dictloading" />
      <hr class="mb-2"/>
      <div class="row">
        <label
          class="form-label mb-2 md-size"
          for="searchstr"
        >{{$t('dictsearch.searchstr')}}</label>
        <input
          id="searchstr"
          v-model="searchstr"
          type="text"
          class="form-control md-size mb-2 me-2"
        >
      </div>
      <div class="row">
        <label
          class="form-label mb-2 md-size"
          for="yellows"
        >{{$t('dictsearch.yellows')}}</label>
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
        >{{$t('dictsearch.greys')}}</label>
        <input
          id="greys"
          v-model="greys"
          type="text"
          class="form-control md-size mb-2 me-2"
        >
      </div>
      <div class="row">
        <label for="maxlen" class="form-label md-size mb-2">{{$t('dictsearch.maxlength')}}</label>
        <input type="number" min="0" v-model="maxlen" id="maxlen" class="form-control md-size mb-2"/>
      </div>
      <div class="row">
        <label for="minlen" class="form-label md-size mb-2">{{$t('dictsearch.minlength')}}</label>
        <input type="number" min="0" v-model="minlen" id="minlen" class="form-control md-size mb-2"/>
      </div>
      <h4>{{ $t('dictsearch.searchfor') }}</h4>
      <div class="form-check">
        <input
          id="sf"
          v-model="sf"
          type="radio"
          value="1"
          class="form-check-input"
        >
        <label
          class="form-check-label"
          for="sf"
        >{{$t('dictsearch.pattern')}}</label>
      </div>
      <div class="form-check">
        <input
          id="sf"
          v-model="sf"
          type="radio"
          value="2"
          class="form-check-input"
        >
        <label
          class="form-check-label"
          for="sf"
        >{{$t('dictsearch.start')}}</label>
      </div>
      <div class="form-check">
        <input
          id="sf"
          v-model="sf"
          type="radio"
          value="3"
          class="form-check-input"
        >
        <label
          class="form-check-label"
          for="sf"
        >{{$t('dictsearch.end')}}</label>
      </div>
      <div class="form-check">
        <input
          id="sf"
          v-model="sf"
          type="radio"
          value="4"
          class="form-check-input"
        >
        <label
          class="form-check-label"
          for="sf"
        >{{$t('dictsearch.contains')}}</label>
      </div>
      <div class="form-check">
        <input
          id="sf"
          v-model="sf"
          type="radio"
          value="5"
          class="form-check-input"
        >
        <label
          class="form-check-label"
          for="sf"
        >{{$t('dictsearch.regex')}}</label>
      </div>
      <div class="form-check">
        <input
          id="sf"
          v-model="sf"
          type="radio"
          value="6"
          class="form-check-input"
        >
        <label
          class="form-check-label"
          for="sf"
        >{{$t('dictsearch.longest')}}</label>
      </div>
      <div class="form-check">
        <input
          id="sf"
          v-model="sf"
          type="radio"
          value="7"
          class="form-check-input"
        >
        <label
          class="form-check-label"
          for="sf"
        >{{$t('dictsearch.values')}}</label>
      </div>
      <button :disabled="dictloading" class="btn smsize mb-2" id="btn1" @click="dictsearch()"><i class="fa-solid fa-search me-2"></i>{{$t('buttons.search')}}</button>
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
import { wordValueSimple } from "@/scripts/texthelper.js";

export default {

  name: "DictSearch",

  components: {
    VLanguage  
  },

  data() {
    return {
      result: "",
      errormsg: "",
      searchstr: "",
      letters: "",
      yellows: "",
      greys: "",
      maxlen: 0,
      minlen: 0,
      maxl: 0,
      minl: 0,
      cnt: 0,
      maxcnt: 2500,
      finds: [],
      dict: {},
      dictloading: true,
      sf: "1",
      chunk: ""
    };
  },

  methods: {

    dictsearch: function() {

      // Reset and clear inputs
      this.result = "";
      this.errormsg = "";
      this.cnt = 0;
      this.searchstr = this.dict.cleanStr(this.searchstr.trim());
      this.yellows = this.dict.cleanStr(this.yellows.trim());
      this.greys = this.dict.cleanStr(this.greys.trim());
      this.letters = this.dict.alphabet;
      this.finds = [];
      this.minl = (this.minlen < 1) ? 1 : this.minlen;
      this.maxl = (this.maxlen === 0) ? 99999 : this.maxlen;      

      switch (parseInt(this.sf)) {
        case 1:
          this.findPattern();
          break;
        case 2:
          this.findStart();
          break;
        case 3:
          this.findEnd();
          break;
        case 4:
          this.findContains();
          break;
        case 5:
          this.findRegex();
          break;
        case 6:
          this.findLongest();
          break;
        case 7:
          this.findWordValue();
          break;
      }

    },

    nextTry: function (word) {

      console.log("x: ",word);

      // Check if we have too many words
      if (this.cnt > this.maxcnt) {
        this.errormsg = this.$t("dictsearch.toomany");
        return;
      }

      if (word.length === this.searchstr.length) {
        // Verify mandatory letters
        for (let i = 0; i < this.yellows.length; i++) {searchstr
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
        if (this.searchstr[pos] === "?") {
          for (let j = 0; j < this.letters.length; j++) {
            this.nextTry(word + this.letters[j]);
          }
        } else {
          this.nextTry(word + this.searchstr[pos]);
        }
      }
    },

    findPattern: function () {

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
      this.result = h2.length + this.$t("dictsearch.wordsfound") + "<br><br>";
      for (let f of h2) {
        this.result += f + "<br>";
      }

    },

    nextTryLongest: function (anagram) {
      // Build the string for the anagram
      let hword = "";
      for (let i = 0; i < anagram.length; i++) hword += this.searchstr[anagram[i]];

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

      if (anagram.length === this.searchstr.length) return;

      // Continue for longer words
      for (let i = 0; i < this.searchstr.length; i++) {
        // For permutations without replacements skip i if already used
        if (anagram.indexOf(i) >= 0) continue;
        anagram.push(i);
        this.nextTryLongest(anagram);
        anagram.pop();
      }
    },
    
    findLongest: function () {
    
      // Start generating
      this.lword = "";
      this.nextTryLongest([]);
      this.result = this.lword;

    },

    findStart: function () {

      let cnt = 0;

      // Find the first word starting with the given txt
      let fnd = this.dict.findWord(this.searchstr);
      let pos = fnd.pos;

      // Keep going until we reach the end or are at a word that starts differently
      while (
        pos < this.dict.words.length &&
        this.dict.words[pos].slice(0, this.searchstr.length) === this.searchstr
      ) {
        if (this.dict.words[pos].length <= this.maxl && this.dict.words[pos].length >= this.minl) this.result += this.dict.words[pos] + "<br>";
        pos++;
        cnt++;
      }

      this.result = cnt + this.$t("dictsearch.wordsfound") + "<br><br>" + this.result;
    },

    findEnd: function () {

      let cnt = 0;

      // Find the first word starting with the given txt
      let len = -this.searchstr.length;

      // Scan the dictionary one by one
      for (let i = 0; i < this.dict.words.length; i++) {
        if (this.dict.words[i].slice(len) === this.searchstr && this.dict.words[i].length <= this.maxl && this.dict.words[i].length >= this.minl) {
          this.result += this.dict.words[i] + "<br>";
          cnt++;
        }
      }

      this.result = cnt + this.$t("dictsearch.wordsfound") + "<br><br>" + this.result;
    },

    findContains: function () {

      let cnt = 0;

      // Scan the dictionary one by one
      for (let i = 0; i < this.dict.words.length; i++) {
        if (this.dict.words[i].indexOf(this.searchstr) >= 0 && this.dict.words[i].length <= this.maxl && this.dict.words[i].length >= this.minl) {
          this.result += this.dict.words[i] + "<br>";
          cnt++;
        }
      }

      this.result = cnt + this.$t("dictsearch.wordsfound") + "<br><br>" + this.result;
    },

    findRegex: function () {

      let cnt = 0;
      let regex = new RegExp(this.searchstr);

      if (!regex || this.searchstr.length === 0) {
        this.errormsg = this.$t("errors.noinput");
        return;
      }

      // Scan the dictionary one by one
      for (let i = 0; i < this.dict.words.length; i++) {
        if (this.dict.words[i].match(regex) && this.dict.words[i].length <= this.maxl && this.dict.words[i].length >= this.minl) {
          this.result += this.dict.words[i] + "<br>";
          cnt++;
        }
      }

      this.result = cnt + this.$t("dictsearch.wordsfound") + "<br><br>" + this.result;
    },

    findWordValue: function () {

      let cnt = 0;
      let wv = parseInt(this.searchstr);

      if (!wv || wv === 0) {
        this.errormsg = this.$t("errors.noinput");
        return;
      }

      // Scan the dictionary one by one
      for (let i = 0; i < this.dict.words.length; i++) {
        if (wordValueSimple(this.dict.words[i], this.dict.alphabet) === wv){
          this.result += this.dict.words[i] + "<br>";
          cnt++;
        }
      }

      this.result = cnt + this.$t("dictsearch.wordsfound") + "<br><br>" + this.result;
    }

  },
};

</script>

<style scoped>
</style>
