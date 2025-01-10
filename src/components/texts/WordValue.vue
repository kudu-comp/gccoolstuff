<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('wordvalue.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('wordvalue.long')"
      />
      <v-alphabets-ext
        id="listofalpha"
        v-model:alphabet="selectedalphabet"
        @change="wordValue"
      />
      <div class="form-check mb-2">
        <input
          id="reverse"
          v-model="reverse"
          type="checkbox"
          class="form-check-input"
          @change="wordValue"
        >
        <label
          for="reverse"
          class="form-check-label"
        >{{ $t('wordvalue.reverse') }}</label>
      </div>
      <div class="form-check mb-2">
        <input
          id="startatzero"
          v-model="startatzero"
          type="checkbox"
          class="form-check-input"
          @change="wordValue"
        >
        <label
          for="startatzero"
          class="form-check-label"
        >{{ $t('wordvalue.startzero') }}</label>
      </div>
      <v-calculate @calculate="wordValue" class="mb-2 me-2"/>
      <button
        id="replace"
        class="btn mb-2 me-2"
        @click="removeDiacr"
      >
        {{ $t('wordvalue.replacediac') }}
      </button>
      <button
        id="remove"
        class="btn mb-2 me-2"
        @click="showTable"
      >
        {{ $t('wordvalue.showhide') }}
      </button>
      <textarea
        id="message"
        ref="message"
        v-model="message"
        class="form-control mb-2"
        :placeholder="$t('labels.message')"
        rows="5"
        @input="wordValue"
      />
      <p
        v-show="errormsg"
        class="errormsg mb-2"
      >
        {{ errormsg }}.
      </p>
      <div v-show="showvalues">
        <table class="table table-borderless table-sm">
          <tr>
            <td
              v-for="s in values"
              :key="s"
            >
              {{ s[0] }}
            </td>
          </tr>
          <tr>
            <td
              v-for="s in values"
              :key="s"
            >
              {{ s[1] }}
            </td>
          </tr>
        </table>
      </div>
      <div
        v-if="result"
        class="resultbox"
        v-html="result"
      />
      <va-item
        :showitem="showinfo"
        @toggle="showinfo = !showinfo"
      >
        <template #header>
          {{ $t('wordvalue.someinfo') }}
        </template>
        <template #content>
          <div v-html="$t('wordvalue.someinfo2')" />
        </template>
      </va-item>
    </div>
  </div>
</template>

<script>
import * as textHelper from '@/scripts/texthelper.js';
import VAlphabetsExt from '@/components/inputs/VAlphabetsExt.vue'
import VaItem from '@/components/inputs/VaItem.vue'
import VCalculate from '@/components/inputs/VCalculate.vue'

export default {
  name: 'WordValue',

  components: {
    VAlphabetsExt,
    VaItem,
    VCalculate
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
      result : "",
      showinfo: true,
      errormsg: ""
    }
  },

  mounted: function() {
    this.$refs.message.focus();
  },

  methods: {

    // Remove diacritics
    removeDiacr: function() {
      this.message = textHelper.removeDiacritics(this.message);
      this.wordValue();
    },

    // Load the tablie with row 0 the letters and row 1 the values
    showTable: function () {
      this.values = textHelper.getTable(this.selectedalphabet, this.reverse, this.startatzero);
      this.showvalues = !this.showvalues;
    },

    // Calculate the word values and square root of the entire text and each word individually
    wordValue : function() {

      this.errormsg = "";
      this.result = "";

      try {

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
          if (i === 0) html += " style='color:#722727;'";
          html += "><th scope='row'>" + wordvalues[i].name + "</th><td class='text-center'>" + wordvalues[i].value + "</td><td class='text-center'>" + wordvalues[i].squareroot + "</td></tr>";
        }
        html += "</table>";
        this.result = html;

      } catch (e) {

        console.log(e);
        this.errormsg = this.$t('errors.generic');
        
      }      

    },
  },
}

</script>

<style scoped>
</style>
