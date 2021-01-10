<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{$t('texttools.smartreplace.title')}}
    </div>
    <div class="mainpage">
      <div class="infoblock">
        {{$t('dialogsr.info')}}
      </div>
      <div class="form-inline">
        <label class="form-label col-sm-4 col-md-3 col-lg-2 mb-2" for="from">{{$t('dialogsr.orig')}}</label>
        <input type='text' id="from" name="from" ref="from" v-model="from" size="50" class="form-control mb-2" v-on:keyup="replaceInput">{{error1}}
      </div>
      <div class="form-inline">
        <label class="form-label col-sm-4 col-md-3 col-lg-2 mb-2" for="to">{{$t('dialogsr.repl')}}</label>
        <input type='text' id="to" name="to" ref="to" v-model="to" size="50" class="form-control mb-2" v-on:keyup="replaceInput">{{error2}}
      </div>
      <div class="form-inline">
        <label class="form-label col-sm-4 col-md-3 col-lg-2 mb-2" for="highlightflag">{{$t('dialogsr.highlight')}}</label>
        <select id="highlightflag" name="highlightflag" ref="highlightflag" v-model="highlightflag" class="form-control col-sm-4 col-md-3 col-lg-2 mb-2" @change="replaceInput">
          <option value="red">{{$t('highlights.red')}}</option>
          <option value="blue">{{$t('highlights.blue')}}</option>
          <option value="yellow">{{$t('highlights.yellow')}}</option>
          <option value="bold">{{$t('highlights.bold')}}</option>
          <option value="uppercase">{{$t('highlights.upper')}}</option>
        </select>
        <label class="form-label col-sm-4 col-md-3 col-lg-2 mb-2" for="language">{{$t('language')}}</label>
        <select id="language" name="language" ref="language" v-model="language" class="form-control col-sm-3 mb-2" @change="setLanguage">
          <option value="en">{{$t('languages.english')}}</option>
          <option value="nl">{{$t('languages.dutch')}}</option>
          <option value="de">{{$t('languages.german')}}</option>
          <option value="fr">{{$t('languages.french')}}</option>
          <option value="es">{{$t('languages.spanish')}}</option>
        </select>
      </div>
      <input type="button" id="analyze" name="analyze" :value="$t('dialogwv.replacediac')" class="btn btn-primary mb-2" v-on:click="removeDiacr">
      <div class="row">
        <div class="col-6">
          <div class="form-row mb-2">
            <textarea id="message" name="message" class="form-control" ref="message" :placeholder="$t('labels.message')" rows=10 cols=50 v-model='message' v-on:keyup="replaceInput"></textarea>
          </div>
        </div>
        <p class="col-6 result" v-html="result"></p>
        <div class="col-12">
          <div class="form-inline">
            <input type="button" id="hint" name="hint" :value="$t('dialogsr.get')" class="btn btn-primary mr-2 mb-2" v-on:click="printHints">
            <input type="button" id="hint" name="hint" :value="$t('dialogsr.apply')" class="btn btn-primary mb-2" v-on:click="applyHints">
          </div>
          <div>
            <div v-html="hints"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as textHelper from '@/scripts/texthelper.js'

export default {
  name: 'SmartReplace',

  props: {
    msg: String
  },

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
    for (let i=0; i<26; i++) this.percentages[i]= 0.00;
    this.setLanguage();
  },

  methods: {
    removeDiacr: function() {
      this.message = textHelper.removeDiacritics(this.message);
    },
    checkDouble: function (str) {
      for (var i=0; i < str.length; i++) {
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
      // Analyze input
      var countletters = [];
      var idx;
      for (let i=0; i < this.alphabet.length; i++) countletters[i]=0;
      for (let i=0; i < this.message.length; i++) {
        idx = this.alphabet.indexOf(this.message[i].toLowerCase());
        if (idx >= 0) countletters[idx]++;
      }
      this.percentages = [];
      for (let i=0; i < this.alphabet.length; i++) {
        this.percentages[i] = { char : this.alphabet[i], count : countletters[i] / this.message.length * 100 };
      }
      this.percentages.sort((a, b) => { if (a.count > b.count) return -1; else if (a.count < b.count) return 1; else return 0; });
      var html = "<table class='table table-sm table-bordered text-center'><tr><td>Letter</td>";
      for (let i = 0; i < this.freq.length; i++) html+="<td>" + this.freq[i] + "</td>";
      html += "</tr><tr><td>Frequency</td>";
      for (let i = 0; i < this.freqperc.length; i++) html+="<td>" + this.freqperc[i] + "</td>";
      html += "</tr><tr><td>Hint letters</td>";
      for (let i = 0; i < this.percentages.length; i++) html+="<td>" + this.percentages[i].char + "</td>";
      html += "</tr><tr><td>Hint freq</td>";
      for (let i = 0; i < this.percentages.length; i++) html+="<td>" + this.percentages[i].count.toFixed(1) + "</td>";
      html += "</tr></table>";
      this.hints = html;

    },
    applyHints : function () {
      this.printHints();
      // Fill from and to here
      this.from = this.freq.slice(0,8);
      this.to = "";
      for (let i=0; i<8; i++) this.to += this.percentages[i].char;
      this.replaceInput();
    },
    replaceInput: function() {
      this.error1 = "";
      this.error2 = "";
      this.from = this.from.toLowerCase();
      this.to = this.to.toLowerCase();
      if (this.to.length != this.from.length) {
        this.error1 = this.$t('dialogsr.errorlength');
        this.error2 = this.$t('dialogsr.errorlength');
      } else if (this.checkDouble(this.to)) {
        this.error2 = this.$t('dialogsr.errordouble');
      } else if (this.checkDouble(this.from)) {
        this.error1 = this.$t('dialogsr.errordouble');
      } else {
        var html = "";
        var idx = 0;
        for (var i=0; i < this.message.length; i++) {
          idx = this.to.indexOf(this.message[i].toLowerCase());
          if (idx >= 0) {
            switch (this.highlightflag) {
              case 'red' :
              case 'yellow' :
              case 'blue' :
                html += '<span style="color: ' + this.highlightflag + '">' + ((this.message[i].toUpperCase() == this.message[i]) ? this.from[idx].toUpperCase() : this.from[idx]) + '</span>';
                break;
              case 'bold' :
                html += '<b>' + ((this.message[i].toUpperCase() == this.message[i]) ? this.from[idx].toUpperCase() : this.from[idx]) + '</b>';
                break;
              case 'uppercase' :
                html += this.from[idx].toUpperCase();
                break;
            }
          } else {
            html += this.message[i];
          }
        }
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
