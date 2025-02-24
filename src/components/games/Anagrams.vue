<template>
  <div class="d-flex flex-column mx-4">
    <!-- Section head / page title -->
    <div class="sectionhead">
      {{ $t('anagrams.title') }}
    </div>
    <!-- Main page -->
    <div class="mainpage">
      <!-- Start with info block -->
      <div
        class="infoblock"
        v-html="$t('anagrams.long')"
      />
      <!-- Form fields -->
      <v-language v-model:dict="dict" v-model:dictloading="dictloading" />
      <div class="row mt-2">
        <label
          class="form-label mb-2 md-size"
          for="letters"
        >{{$t('anagrams.letters')}}</label>
        <input
          id="letters"
          v-model="letters"
          type="text"
          class="form-control md-size mb-2 me-2"
        >
      </div>
      <div class="row">
        <label
          class="form-label mb-2 md-size"
          for="maxw"
        >{{$t('anagrams.maxw')}}</label>
        <input
          id="maxw"
          v-model="maxw"
          type="number"
          class="form-control md-size mb-2 me-2"
          min="1"
        >
      </div>
      <div class="row">
        <label
          class="form-label mb-2 md-size"
          for="minl"
        >{{$t('anagrams.minl')}}</label>
        <input
          id="minl"
          v-model="minl"
          type="number"
          class="form-control md-size mb-2 me-2"
          min="1"	
        >
      </div>
      <div class="row">
        <label
          class="form-label mb-2 md-size"
          for="maxl"
        >{{$t('anagrams.maxl')}}</label>
        <input
          id="maxl"
          v-model="maxl"
          type="number"
          class="form-control md-size mb-2 me-2"
          min="1"	
        >
      </div>
      <!-- Action buttons -->
      <button :disabled="dictloading" class="btn sm-size mb-2" id="btn1" @click="anagrams()"><i class="fa-solid fa-search me-2"></i>{{$t('buttons.search')}}</button>
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

  name: "Anagrams",

  components: {
    VLanguage  
  },

  data() {
    return {
      result: "",
      errormsg: "",
      letters: "",
      maxw: 1,
      minl: 1,
      maxl: 999,
      dict: {},
      dictloading: true,
      finds: [],
      maxcnt: 2500,
      base: ""
    };
  },

  methods: {

    nextTry: function (anagram, wordbreaks, start) {

      // Check if we have too many finds
      if (this.finds.length > this.maxcnt) {
        this.errormsg = this.$t("anagrams.toomany");
        return;
      }

      // Build the string for the anagram
      let hword = "";
      for (let i = start; i < anagram.length; i++)
        hword += this.base[anagram[i]];

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

      // We got a find
      if (
        fullmatch.fnd &&
        anagram.length === this.base.length &&
        hword.length >= this.minl
      ) {
        hword = "";
        // Make the anagram
        for (let j = 0; j < this.base.length; j++)
          hword += this.base[anagram[j]];
        // Insert spaces
        for (let j = 1; j < wordbreaks.length; j++) {
          hword =
            hword.slice(0, wordbreaks[j]) + " " + hword.slice(wordbreaks[j]);
        }
        // Add result to finds
        this.finds.push(hword);
        return;
      }

      // If max word length is exceeded, stop
      if (hword.length >= this.maxl) return;

      // What we got is the start of a word or full word
      // If multiple words start with a new word
      if (
        fullmatch.fnd &&
        this.maxw > wordbreaks.length &&
        hword.length >= this.minl
      ) {
        wordbreaks.push(anagram.length);
        for (let i = 0; i < this.base.length; i++) {
          // For permutations without replacements skip i if already used
          if (anagram.indexOf(i) >= 0) continue;
          anagram.push(i);
          this.nextTry(anagram, wordbreaks, anagram.length - 1);
          anagram.pop();
        }
        wordbreaks.pop();
      }

      // Continue for longer words
      for (let i = 0; i < this.base.length; i++) {
        // For permutations without replacements skip i if already used
        if (anagram.indexOf(i) >= 0) continue;
        anagram.push(i);
        this.nextTry(anagram, wordbreaks, start);
        anagram.pop();
      }
    },

    anagrams: function () {
      // Reset
      this.result = "";
      this.errormsg = "";

      // Anagrams
      // First remove whitespace and diacretics from input
      this.base = this.dict.cleanStr(this.letters.replace(/\s/g, ""));

      // Start generating
      this.finds = [];
      for (let i = 0; i < this.base.length; i++) {
        this.nextTry([i], [0], 0);
      }
      // this.nextTry([], [0], 0);

      // Due to duplicate letters we get duplicate finds, remove those
      let h2 = this.finds.filter(
        (item, index) => this.finds.indexOf(item) === index
      );
      h2 = h2.sort();

      // Print the finds
      this.result = h2.length + this.$t("anagrams.wordsfound") + "<br><br>";
      for (let f of h2) {
        this.result += f + "<br>";
      }
    }

  },
};

</script>

<style scoped>
</style>
