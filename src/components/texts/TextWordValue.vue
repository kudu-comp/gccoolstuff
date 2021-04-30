<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{$t('texttools.wordvalue.title')}}
    </div>
    <div class="mainpage">
      <div class="infoblock" v-html="$t('texttools.wordvalue.long')" />
      <div class="form-inline mb-2">
        <v-alphabets-ext id="listofalpha" ref="listofalpha" v-model:alphabet="selectedalphabet" @change="wordValue"></v-alphabets-ext>
      </div>
      <div class="form-inline">
        <div class="custom-control custom-checkbox">
          <input type="checkbox" name="reverse" id="reverse" v-model="reverse" class="custom-control-input mr-2 mb-2" @change="wordValue">
          <label for="reverse" class="custom-control-label mb-2">{{$t('txtwordval.reverse')}}</label>
        </div>
        <div class="custom-control custom-checkbox">
          <input type="checkbox" name="startatzero" id="startatzero" v-model="startatzero" class="custom-control-input mr-2 mb-2" @change="wordValue">
          <label for="startatzero" class="custom-control-label mb-2">{{$t('txtwordval.startzero')}}</label>
        </div>
      </div>
      <div class="form-row mb-2">
        <textarea id="message" name="message" class="form-control" ref="message" :placeholder="$t('labels.message')" rows=10 v-model='message' @input="wordValue"></textarea>
      </div>
      <input type="button" id="analyze" name="analyze" :value="$t('buttons.calc')" class="btn btn-primary mb-2 mr-2" v-on:click="wordValue">
      <input type="button" id="remove" name="remove" :value="$t('txtwordval.replacediac')" class="btn btn-primary mb-2 mr-2" v-on:click="removeDiacr">
      <input type="button" id="remove" name="remove" :value="$t('txtwordval.showhide')" class="btn btn-primary mb-2 mr-2" v-on:click="showTable">
      <p v-show="error" class="errormsg mb-2">{{errormsg}}.</p>
      <div v-show="showvalues">
        <table class="table table-borderless table-sm">
          <tr><td v-for="s in values" :key="s">{{s[0]}}</td></tr>
          <tr><td v-for="s in values" :key="s">{{s[1]}}</td></tr>
        </table>
      </div>
      <div v-html="result" class = "card card-text p-2"></div>
      <va-item v-bind:showitem='showinfo' v-on:toggle='showinfo = !showinfo'>
        <template v-slot:header>{{$t('txtwordval.someinfo')}}</template>
        <template v-slot:content><div v-html="$t('txtwordval.someinfo2')"></div></template>
      </va-item>
    </div>
  </div>
</template>

<script>
import * as textHelper from '@/scripts/texthelper.js';
import VAlphabetsExt from '@/components/inputs/VAlphabetsExt.vue'
import VaItem from '@/components/inputs/VaItem.vue'

export default {
  name: 'TextAnalyze',

  props: {
    msg: String,
  },

  data: function () {
    return {
      showvalues: false,
      values: null,
      message: "",
      alphabets: "",
      selectedalphabet: "English",
      reverse : false,
      startatzero : false,
      result : this.$t('labels.result'),
      showinfo: true,
      error: false,
      errormsg: ""
    }
  },

  components: {
    VAlphabetsExt,
    VaItem,
  },

  mounted: function() {
    // this.$refs.listofalpha.focus();
  },

  methods: {

    // Remove diacritics
    removeDiacr: function() {
      this.message = textHelper.removeDiacritics(this.message);
    },

    // Load the tablie with row 0 the letters and row 1 the values
    showTable: function () {
      this.values = textHelper.getTable(this.selectedalphabet, this.reverse, this.startatzero);
      this.showvalues = !this.showvalues;
    },

    // Calculate the word values and square root of the entire text and each word individually
    wordValue : function() {

      // Check if we need to display table with values first
      if (this.showvalues) { this.showTable(); this.showvalues = !this.showvalues }

      // Do nothing if message is empty
      if (this.message.length == 0) return;

      //  Calculate value of the entire text
      let value = textHelper.wordValue(this.message, this.reverse, this.startatzero, this.selectedalphabet);
      let wordvalues = [ { name : "All text", value : value, squareroot : textHelper.squareRoot(value)} ];

      // Split message in words
      let words = this.message.match(/([^\s.,:;]+)/ug);

      // Calculate values for each word, skip values of 0
      for (let i=0; i < words.length; i++) {
        value = textHelper.wordValue(words[i], this.reverse, this.startatzero, this.selectedalphabet);
        if (value > 0) wordvalues.push ( { name : words[i], value : value, squareroot : textHelper.squareRoot(value)} );
      }

      // Display table with all values
      let html = "<table class='table table-sm table-striped'><thead><tr><th scope='col'>Word(s)</th><th class='text-center' scope='col'>Value</th><th class='text-center' scope='col'>Square root</th></tr></thead>";
      for (let i = 0; i < wordvalues.length; i++) {
        html += "<tr";
        if (i==0) html += " style='color:red'";
        html += "><th scope='row'>" + wordvalues[i].name + "</th><td class='text-center'>" + wordvalues[i].value + "</td><td class='text-center'>" + wordvalues[i].squareroot + "</td></tr>";
      }
      html += "</table>";
      this.result = html;

    },
  },
}

</script>

<style scoped>
</style>
