<template>
  <div class="d-flex flex-column mx-4">
    <!-- Section head / page title -->
    <div class="sectionhead">
      {{ $t('freqanal.title') }}
    </div>
    <!-- Main page -->
    <div class="mainpage">
      <!-- Start with info block -->
      <div
        class="infoblock"
        v-html="$t('freqanal.long')"
      />
      <!-- Form fields -->
      <div class="row">
        <label
          class="form-label mb-2 sm-size"
          for="text1"
        >{{$t('labels.alphabet')}}</label>
        <input
          id="text1"
          v-model="alphabet"
          type="text"
          class="form-control md-size mb-2 me-2"
        >
      </div>
      <div class="row">
        <label for="size" class="form-label sm-size mb-2">{{$t('freqanal.size')}}</label>
        <input type="number" min="1" max="6" v-model="size" id="size" class="form-control md-size mb-2"/>
      </div>
      <div class="form-check">
        <input
          id="slide"
          v-model="slide"
          type="checkbox"
          class="form-check-input me-2 mb-2"
        >
        <label
          for="slide"
          class="form-check-label mb-2"
        >{{ $t('freqanal.slide') }}</label>
      </div>
      <div class="form-check">
        <input
          id="bound"
          v-model="bound"
          type="checkbox"
          class="form-check-input me-2 mb-2"
        >
        <label
          for="bound"
          class="form-check-label mb-2"
        >{{ $t('freqanal.bound') }}</label>
      </div>
      <div class="form-check">
        <input
          id="showmissing"
          v-model="showmissing"
          type="checkbox"
          class="form-check-input me-2 mb-2"
        >
        <label
          for="showmissing"
          class="form-check-label mb-2"
        >{{ $t('freqanal.showmissing') }}</label>
      </div>
      <!-- Action buttons -->
      <v-calculate class="mb-2" id="calc" @calculate="genStats()"></v-calculate>
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
          ref="msg"
          v-model="msg"
          class="form-control"
          :placeholder="$t('labels.message')"
          rows="5"
        />
      </div>
      <!-- Result area or use v-html -->
      <div v-if="result" class="resultbox" v-html="result"></div>
    </div>
  </div>
</template>

<script>

import VCalculate from '@/components/inputs/VCalculate.vue';

export default {

  name: "FreqAnalysis",

  components: {
    VCalculate
  },

  data() {
    return {
      result: "",
      errormsg: "",
      alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      size: 2,
      slide: true,
      bound: true,
      showmissing: false,
      msg: ""
    };
  },

  mounted: function() {
    this.$refs.msg.focus();
  },
  
  methods: {

    findMissing: function (freq, str, n, size) {
      if (this.cntmissing > 1000) {
        return;
      }
      if (n === size) {
        // Test if missing
        let idx = freq.findIndex(
          (a) => a.ngram.localeCompare(str.toUpperCase()) == 0
        );
        if (idx < 0) {
          this.result += str + " ";
          this.cntmissing++;
        }
      } else {
        for (let i = 0; i < this.alphabet.length; i++) {
          this.findMissing(freq, (str + this.alphabet[i]), n + 1, size);
        }
      }
    },

    genNgrams: function (size) {
      // freq array with objects ngram, cnt
      let freq = [];

      // Start bigrams at beginning of each word
      let cntNgram = 0;
      let words = [];
      if (this.bound) {
        words = this.msg.matchAll(/[A-Z]+/gi);
      } else {
        words.push(new Array(this.msg.replace(/[^A-Z]+/gi, "")));
      }
      let shift = this.slide ? 1 : size;

      // Start counting
      for (const w of words) {
        for (let i = 0; i < w[0].length; i += shift) {
          let ngram = w[0].slice(i, i + size);
          if (ngram.length < size) continue;
          let idx = freq.findIndex(
            (a) => a.ngram.localeCompare(ngram.toUpperCase()) == 0
          );
          if (idx >= 0) {
            freq[idx].cnt++;
          } else {
            freq.push({ ngram: ngram.toUpperCase(), cnt: 1 });
          }
          cntNgram++;
        }
      }

      // Sort on frequence
      freq.sort((a, b) => {
        if (a.cnt > b.cnt) return -1;
        else if (a.cnt < b.cnt) return 1;
        else {
          if (a.ngram > b.ngram) return 1;
          else return -1;
        }
      });

      // Print table stats and header
      this.result =
        this.$t('freqanal.numfound') + freq.length.toString() + "<br>";
      this.result +=
        this.$t('freqanal.nummissing') + (this.alphabet.length ** size - freq.length).toString();
      this.result +=
        "<br><br><table><thead><th>N-gram</th><th>" + this.$t('labels.count') + "</th><th>" + this.$t('labels.perc') + "</th></thead>";

      // If show missing print something else and return
      if (this.showmissing) {
        this.result += "<b>"+ this.$t('freqanal.missing') + "</b><br>";
        this.findMissing(freq, "", 0, this.size);
        this.result += "<br><br>";
      }

      // Print table rows
      for (let e of freq) {
        this.result +=
          "<tr><td class='sm-size'>" +
          e.ngram +
          "</td><td class='sm-size' style='text-align:right'>" +
          e.cnt.toString() +
          "</td><td class='sm-size' style='text-align:right'>" +
          ((e.cnt / cntNgram) * 100).toFixed(2) +
          "%</tr>";
      }

      // Print end of table
      this.result += "</table>";
    },

    genStats: function () {
      // Reset
      this.errormsg = "";
      this.result = "";
      this.cntmissing = 0;

      // Generate n grams
      this.genNgrams(this.size);
    },
  },

};

</script>

<style scoped>
</style>
