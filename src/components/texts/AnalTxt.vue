<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('analtxt.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('analtxt.long')"
      />
      <div class="form-row mb-2">
        <input
          id="analyze"
          type="button"
          :value="$t('analtxt.analyze')"
          class="btn mb-2 me-2"
          @click="analyzeText"
        >
        <input
          id="repldiacr"
          type="button"
          :value="$t('wordvalue.replacediac')"
          class="btn mb-2"
          @click="removeDiacr"
        >
        <textarea
          id="message"
          ref="message"
          v-model="message"
          class="form-control"
          :placeholder="$t('labels.message')"
          rows="5"
          @input="analyzeText"
        />
      </div>
      <table class="table table-sm">
        <tr><td>{{ $t('analtxt.nwords') }}</td><td>{{ totalwords }}</td></tr>
        <tr><td>{{ $t('analtxt.nlines') }}</td><td>{{ totallines }}</td></tr>
        <tr><td>{{ $t('analtxt.nchar') }}</td><td>{{ totalchar }}</td></tr>
        <tr><td>{{ $t('analtxt.nalpha') }}</td><td>{{ totalalphabet }}</td></tr>
        <tr><td>{{ $t('analtxt.ndigit') }}</td><td>{{ totaldigit }}</td></tr>
        <tr><td>{{ $t('analtxt.nwhite') }}</td><td>{{ totalwhite }}</td></tr>
        <tr><td>{{ $t('analtxt.nupper') }}</td><td>{{ totaluppercase }}</td></tr>
        <tr><td>{{ $t('analtxt.nlower') }}</td><td>{{ totallowercase }}</td></tr>
        <tr><td>{{ $t('analtxt.nnonalpha') }}</td><td>{{ totalnonalphabet }}</td></tr>
        <tr><td>{{ $t('analtxt.nnonwhite') }}</td><td>{{ totalnonwhite }}</td></tr>
      </table>
      <div
        v-if="result"
        class="resultbox"
        v-html="result"
      />
    </div>
  </div>
</template>

<script>
import * as textHelper from '@/scripts/texthelper.js';

export default {

  name: 'AnalTxt',

  data: function () {
    return {
      message: "",
      result: "",
      totalchar : 0,
      totalwords : 0,
      totallines: 0,
      totalwhite : 0,
      totalnonwhite : 0,
      totalalphabet : 0,
      totaluppercase : 0,
      totallowercase : 0,
      totalnonalphabet : 0,
      totaldigit : 0,
    }
  },

  mounted: function() {
    this.$refs.message.focus();
  },

  methods: {

    // Remove diacritics from input and replace with a-z equivalent
    removeDiacr: function() {
      this.message = textHelper.removeDiacritics(this.message);
    },

    // Analyze the input
    analyzeText: function() {

      // Definition of uppercase, lowercase and digits
      const UpperCaseAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const LowerCaseAlphabet = "abcdefghijklmnopqrstuvwxyz";
      const DigitAlphabet = "0123456789";

      // Reset the array with counters
      let lowerchararr = [];
      let upperchararr = [];
      let digitarr = [];
      let freqarr = [];

      // Reset all individual counters
      this.totalchar = 0;
      this.totalwhite = 0;
      this.totalnonwhite = 0;
      this.totalalphabet = 0;
      this.totaluppercase = 0;
      this.totallowercase = 0;
      this.totalnonalphabet = 0;
      this.totaldigit = 0;

      // Use regex to count words and lines
      this.totalwords = this.message.trim().match(/[^\s]+/g).length;
      this.totallines = this.message.match(/[^\r\n.]+/g).length;

      // Init arrays for uppercase, lowercase and digits
      for (let i=0; i < UpperCaseAlphabet.length; i++) upperchararr[i] = 0;
      for (let i=0; i < LowerCaseAlphabet.length; i++) lowerchararr[i] = 0;
      for (let i=0; i < DigitAlphabet.length; i++) digitarr[i] = 0;

      // Start scanning the message
      let idx = 0;
      for (let i = 0; i <  this.message.length; i++) {

        // Increase total number of characters
        this.totalchar++;

        // First see if this uppercase
        idx = UpperCaseAlphabet.indexOf(this.message[i]);
        if (idx >= 0) {
          // Uppercase letters
          upperchararr[idx]++;
          this.totalalphabet++;
          this.totaluppercase++;

        } else if (" \n\r\t".indexOf(this.message[i]) >= 0) {
          // If it is not uppercase check for white space
          this.totalwhite++;

        } else if ((idx = LowerCaseAlphabet.indexOf(this.message[i])) >= 0) {
          // If it is not uppercase or whitespace check for lowercase
          idx = LowerCaseAlphabet.indexOf(this.message[i]);
          lowerchararr[idx]++;
          this.totalalphabet++;

        } else if ((idx = DigitAlphabet.indexOf(this.message[i])) >= 0) {
          // If it is not uppercase or whitespace or lowercase check for digits
          digitarr[idx]++;
          this.totaldigit++;

        } else {
          // Other characters see if we already have this one
          idx = freqarr.findIndex( (element) => element.char == this.message[i]);
          if (idx >=0) {

            freqarr[idx].count++;
          } else {
            freqarr.push ({ char : this.message[i], count : 1, perc : 0.0 });
          }
        }
      }

      // Calculate some totals
      this.totalnonalphabet = this.totalchar - this.totalalphabet - this.totalwhite;
      this.totallowercase = this.totalalphabet - this.totaluppercase;
      this.totalnonwhite = this.totalchar - this.totalwhite;

      // Print alphabets
      let html = "<table class='table table-sm table-bordered text-center'><thead><tr><th scope='col'>" + this.$t('analtxt.letter') + "</th>";
      for (let i = 0; i < UpperCaseAlphabet.length; i++) html+="<th scope='col'>" + UpperCaseAlphabet[i] + "</th>";
      html += "</tr></thead><tr><td>" + this.$t('analtxt.count') + "</td>";
      for (let i = 0; i < lowerchararr.length; i++) html+="<td>" + (lowerchararr[i]+upperchararr[i]) + "</td>";
      html += "</tr><tr><td># " + this.$t('analtxt.upper') + "</td>";
      for (let i = 0; i < upperchararr.length; i++) html+="<td>" + upperchararr[i] + "</td>";
      html += "</tr><tr><td># "+ this.$t('analtxt.lower') + "</td>";
      for (let i = 0; i < lowerchararr.length; i++) html+="<td>" + lowerchararr[i] + "</td>";
      html += "</tr><tr><td>" + this.$t('analtxt.perc') + "</td>";
      for (let i = 0; i < upperchararr.length; i++) html+="<td>" + ((lowerchararr[i]+upperchararr[i])*100 / this.totalchar).toFixed(1) + "%</td>";
      html += "</tr></table>";

      // Print digits
      html +=  "<table class='table table-sm table-bordered text-center mt-2'><thead><tr><th scope='col'>" + this.$t('analtxt.digit') + "</th>";
      for (let i = 0; i < DigitAlphabet.length; i++) html+="<th scope='col'>" + DigitAlphabet[i] + "</th>";
      html += "</tr></thead><tr><td>" + this.$t('analtxt.count') + "</td>";
      for (let i = 0; i < digitarr.length; i++) html+="<td>" + digitarr[i] + "</td>";
      html += "</tr><tr><td>" + this.$t('analtxt.perc') + "</td>";
      for (let i = 0; i < digitarr.length; i++) html+="<td>" + (digitarr[i]*100 / this.totalchar).toFixed(1) + "%</td>";
      html += "</tr></table>";

      // Sort array and calculate percentages
      freqarr.sort((a, b) => { if (a.char > b.char) return 1; else if (a.char < b.char) return -1; else return 0; });
      for (let i=0; i < freqarr.length; i++) freqarr[i].perc = freqarr[i].count * 100 / this.totalchar;

      // Generate table with html
      html += "<table class='table table-sm table-bordered text-center'><thead><tr><th scope='col'>" + this.$t('analtxt.symbol') + "</th>";
      for (let i = 0; i < freqarr.length; i++) html+="<th scope='col'>" + freqarr[i].char + "</th>";
      html += "</tr></thead><tr><td>" + this.$t('analtxt.count') + "</td>";
      for (let i = 0; i < freqarr.length; i++) html+="<td>" + freqarr[i].count + "</td>";
      html += "</tr><tr><td>" + this.$t('analtxt.perc') + "</td>";
      for (let i = 0; i < freqarr.length; i++) html+="<td>" + freqarr[i].perc.toFixed(1) + "%</td>";
      html += "</tr></table>";

      // Print the results
      this.result = html;

    },

  },
}
</script>

<style scoped>
</style>
