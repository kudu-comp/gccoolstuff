<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('substcipher.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('substcipher.long')"
      />
      <div class="row">
        <label
          class="form-label sm-size"
          for="from"
        >{{ $t('substcipher.orig') }}</label>
        <input
          id="from"
          ref="from"
          v-model="from"
          type="text"
          name="from"
          size="50"
          class="form-control lg-size mb-2"
          @keyup="replaceInput"
        >{{ error1 }}
      </div>
      <div class="row">
        <label
          class="form-label sm-size mb-2"
          for="to"
        >{{ $t('substcipher.repl') }}</label>
        <input
          id="to"
          ref="to"
          v-model="to"
          type="text"
          name="to"
          size="50"
          class="form-control lg-size mb-2"
          @keyup="replaceInput"
        >{{ error2 }}
      </div>
      <div class="row">
        <label
          class="form-label sm-size mb-2"
          for="highlightflag"
        >{{ $t('substcipher.highlight') }}</label>
        <select
          id="highlightflag"
          ref="highlightflag"
          v-model="highlightflag"
          name="highlightflag"
          class="form-select lg-size mb-2"
          @change="replaceInput"
        >
          <option value="red">
            {{ $t('colors.red') }}
          </option>
          <option value="blue">
            {{ $t('colors.blue') }}
          </option>
          <option value="yellow">
            {{ $t('colors.yellow') }}
          </option>
          <option value="bold">
            {{ $t('highlights.bold') }}
          </option>
          <option value="uppercase">
            {{ $t('highlights.upper') }}
          </option>
        </select>
      </div>
      <div class="row">
        <label
          class="form-label sm-size mb-2"
          for="language"
        >{{ $t('language') }}</label>
        <select
          id="language"
          ref="language"
          v-model="language"
          name="language"
          class="form-select lg-size mb-2"
          @change="setLanguage"
        >
          <option value="en">
            {{ $t('languages.english') }}
          </option>
          <option value="nl">
            {{ $t('languages.dutch') }}
          </option>
          <option value="de">
            {{ $t('languages.german') }}
          </option>
          <option value="fr">
            {{ $t('languages.french') }}
          </option>
          <option value="es">
            {{ $t('languages.spanish') }}
          </option>
        </select>
      </div>
      <div>
        <input
          id="remdiacr"
          type="button"
          :value="$t('wordvalue.replacediac')"
          class="btn mb-2"
          @click="removeDiacr"
        >
        <div class="form-check">
          <input
            id="reverse"
            v-model="casesens"
            type="checkbox"
            class="form-check-input me-2 mb-2"
            @change="wordValue"
          >
          <label
            for="reverse"
            class="form-check-label mb-2"
          >{{ $t('substcipher.casesens') }}</label>
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <div class="form-row mb-2">
            <textarea
              id="message"
              ref="message"
              v-model="message"
              class="form-control"
              :placeholder="$t('labels.message')"
              rows="5"
              @keyup="replaceInput"
            />
          </div>
        </div>
        <p
          class="col-6 resultbox"
          v-html="result"
        />
        <div class="col-12">
          <div class="form-inline">
            <input
              id="hint1"
              type="button"
              :value="$t('substcipher.get')"
              class="btn me-2 mb-2"
              @click="printHints"
            >
            <input
              id="hint2"
              type="button"
              :value="$t('substcipher.apply')"
              class="btn mb-2"
              @click="applyHints"
            >
          </div>
          <div>
            <div v-html="hints" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as textHelper from '@/scripts/texthelper.js'

export default {

  name: 'SubstCipher',

  components: {
    //No components
  },

  data: function () {
    return {
      alphabet : "",
      from: "",
      to: "",
      error1: "",
      error2: "",
      input: "",
      message: "",
      highlightflag: "red",
      casesens: false,
      result: "",
      percentages : [],
      freq : "",
      freqperc : [],
      hints: "",
      language : "nl",
    }
  },

  mounted: function() {
    this.$refs.message.focus();
    this.setLanguage();
  },

  methods: {

    removeDiacr: function() {
      this.message = textHelper.removeDiacritics(this.message);
    },

    checkDouble: function (str) {
      for (let i=0; i < str.length; i++) {
        if (str.indexOf(str[i], i+1) > 0) return true;
      }
      return false;
    },

    setLanguage: function () {

      switch (this.language) {
        case "nl" :
          this.alphabet = "abcdefghijklmnopqrstuvwxyz";
          this.freq     = "enatirodslgvhkmubpwjzcfxyq";
          this.freqperc = ["18.9", "10.0", "7.5", "6.8", "6.5", "6.4", "6.1", "6.0", "3.7", "3.6", "3.4", "2.9", "2.4","2.3","2.2",
            "2.0", "1.58", "1.57","1.52","1.46","1.39","1.24", "0.81","0.04","0.04","0.02"];
          break;
        case "en" :
          this.alphabet = "abcdefghijklmnopqrstuvwxyz";
          this.freq     = "etaoinshrdlucmwfgypbvkxjqz";
          this.freqperc = ["13.0", "9.1", "8.2", "7.5", "7.0", "6.7", "6.3", "6.1", "6.0", "4.3", "4.0", "2.8", "2.8", "2.4", "2.4",
            "2.2", "2.0", "2.0", "1.97", "1.49", "0.98", "0.77", "0.15", "0.15", "0.10", "0.08"];
          break;
        case "de" :
          this.alphabet = "abcdefghijklmnopqrstuvwxyzäöüß";
          this.freq     = "ensraitdhulgcomwbfkzüvpäößjyxq";
          this.freqperc = ["16.4", "9.8", "7.2", "7.0", "6.5", "6.5", "6.2", "5.1", "4.6", "4.2", "3.4", "3.0", "2.7", "2.6", "2.5",
            "1.9", "1.8", "1.7", "1.4", "1.1", "1.0", "0.9", "0.7", "0.6", "0.4", "0.3", "0.27", "0.04", "0.03", "0.02"];
          break;
        case "fr" :
          this.alphabet = "abcdefghijklmnopqrstuvwxyzàâœçéêèëîïôùû";
          this.freq     = "esaitnruoldcmpvéqfbghjàxzèêyçkûùâwîôœëï";
          this.freqperc = ["14.7", "7.9", "7.6", "7.5", "7.2", "7.1", "6.7", "6.3", "5.8", "5.5", "3.7", "3.3", "3.0", "2.5", "1.83",
            "1.05", "1.36", "1.06", "0.90", "0.87", "0.74", "0.61", "0.49", "0.43", "0.33", "0.27", "0.22", "0.13", "0.09", "0.07",
            "0.06", "0.06", "0.05", "0.05", "0.05", "0.02", "0.02", "0.01", "0.01"];
          break;
        case "es" :
          this.alphabet = "abcdefghijklmnopqrstuvwxyzáéíñóúü";
          this.freq     = "eaosrnidltcmupbgvyqóíhfájzéñxüwúk";
          this.freqperc = ["12.2", "11.5", "8.6", "8.0", "6.8", "6.7", "6.2", "5.0", "4.9", "4.6", "4.0", "3.1", "2.9", "2.5", "2.2", "1.77", "1.14",
            "1.00", "0.88", "0.83", "0.73", "0.70", "0.69", "0.50", "0.49", "0.46", "0.43", "0.31", "0.22", "0.17", "0.02", "0.01", "0,01"];
          break;
      }
    },

    printHints : function () {

      // Reset counts
      let countletters = [];
      let idx;
      let length = 0;

      // Get counts of all the letters / symbols in the encrypted text
      for (let i=0; i < this.message.length; i++) {

        // Ignore whitespace
        if (" \n\r\t".indexOf(this.message[i]) >= 0) continue;

        // Increase character count
        length++;

        // Did we already found this character?
        if (this.casesens)
          idx = countletters.findIndex( (c) => c.char == this.message[i] );
        else
          idx = countletters.findIndex( (c) => c.char == this.message[i].toLowerCase() );
        
        // If not add it to the countletters, else add 1    
        if (idx < 0)
          countletters.push({
            char : (this.casesens) ? this.message[i] : this.message[i].toLowerCase(), 
            count: 1
          });
        else 
          countletters[idx].count++

      }

      // Calculate percentages 
      this.percentages = new Array(countletters.length).fill(0.00);

      for (let i=0; i < countletters.length; i++) {
        this.percentages[i] = { char : countletters[i].char, count : countletters[i].count / length * 100 };
      }

      // Sort array with percentages descending
      this.percentages.sort((a, b) => { if (a.count > b.count) return -1; else if (a.count < b.count) return 1; else return 0; });
      
      // Print hints
      let html = "<table class='table table-sm table-bordered text-center'><tr><td>Letter</td>";
      for (let i = 0; i < this.freq.length; i++) html+="<td>" + this.freq[i] + "</td>";
      html += "</tr><tr><td>Frequency</td>";
      for (let i = 0; i < this.freqperc.length; i++) html+="<td>" + this.freqperc[i] + "</td>";
      html += "</tr><tr><td>Hint letters</td>";
      for (let i = 0; i < this.percentages.length; i++) html+="<td>" + this.percentages[i].char + "</td>";
      html += "</tr><tr><td>Hint freq</td>";
      for (let i = 0; i < this.percentages.length; i++) html+="<td>" + this.percentages[i].count.toFixed(1) + "</td>";
      html += "</tr></table>";
      this.hints += html;

    },

    applyHints : function () {

      // Calculate hints
      this.printHints();

      // Apply the first 8 hints
      this.from = this.freq.slice(0,8);
      this.to = "";
      for (let i=0; i < this.percentages.length; i++) this.to += this.percentages[i].char;
      this.replaceInput();

    },

    replaceInput: function() {

      // Reset errors and lowercase input
      this.error1 = "";
      this.error2 = "";
      let to = (!this.casesens) ? this.to.toLowerCase() : this.to;

      // Check inputs
      if (this.to.length != this.from.length) {
        this.error1 = this.$t('substcipher.errorlength');
        this.error2 = this.$t('substcipher.errorlength');
      } else if (this.checkDouble(this.to)) {
        this.error2 = this.$t('substcipher.errordouble');
      } else if (this.checkDouble(this.from)) {
        this.error1 = this.$t('substcipher.errordouble');
      } else {

        // Inputs is okay, replace starts here
        let html = "";
        let idx = 0;
        let c = "";

        for (let i=0; i < this.message.length; i++) {

          // Find the letter in the "to" array
          if (this.casesens) {
            // Case sensitive
            idx = to.indexOf(this.message[i]);
          } else {
            // Case insensitive, to was converted to lowercase, so lookup also lowercase
            idx = to.indexOf(this.message[i].toLowerCase());
          }

          // If found print with selected highlighting
          if (idx >= 0) {

            // If matching is casesinsensitive copy upper/lowercase from input
            c = (!this.casesens && (this.message[i] == this.message[i].toUpperCase())) ? this.from[idx].toUpperCase() : this.from[idx];

            // Apply highlighting
            switch (this.highlightflag) {
              case 'red' :
              case 'yellow' :
              case 'blue' :
                html += '<span style="color: ' + this.highlightflag + '">' + c + '</span>';
                break;
              case 'bold' :
                html += '<b>' + c + '</b>';
                break;
              case 'uppercase' :
                html += c.toUpperCase();
                break;
            }

          } else {

            // No match copy input but take care of characters that behave special in html
            if (this.message[i] == "<") {
              html += "&lt;"
            } else if (this.message[i] == ">") {
              html += "&gt;"
            } else if (this.message[i] == "&") {
              html += "&amp"
            } else if (this.message[i] == "\n") {
              html += "<br>"
            } else {
              html += this.message[i];
            }

          }
        }

        // Print the result
        this.result = html;
      }
    },
    
  },
}
</script>

<style scoped>
.result {
  word-wrap: break-word;
}
</style>
