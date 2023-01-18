<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('texttools.texttonumbers.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('texttools.texttonumbers.long')"
      />
      <div
        ref="listofalpha"
        class="form-inline mb-2"
      >
        <v-alphabets v-model:alphabet="selectedalphabet" />
      </div>
      <div class="form-inline">
        <div class="custom-control custom-checkbox">
          <input
            id="reverse"
            v-model="reverse"
            type="checkbox"
            name="reverse"
            class="custom-control-input mb-2 mr-2"
          >
          <label
            for="reverse"
            class="custom-control-label mb-2 mr-2"
          >{{ $t('txtwordval.reverse') }}</label>
        </div>
        <div class="custom-control custom-checkbox">
          <input
            id="startatzero"
            v-model="startatzero"
            type="checkbox"
            name="startatzero"
            class="custom-control-input mb-2 mr-2"
          >
          <label
            for="startatzero"
            class="custom-control-label mb-2 mr-2"
          >{{ $t('txtwordval.startzero') }}</label>
        </div>
        <div class="custom-control custom-checkbox">
          <input
            id="leadzero"
            v-model="leadzero"
            type="checkbox"
            name="leadzero"
            class="custom-control-input mb-2 mr-2"
          >
          <label
            for="leadzero"
            class="custom-control-label mb-2"
          >{{ $t('txttonum.leadzero') }}</label>
        </div>
      </div>
      <div class="form-row mb-2">
        <textarea
          id="message"
          ref="message"
          v-model="message"
          name="message"
          class="form-control"
          :placeholder="$t('labels.message')"
          rows="10"
        />
      </div>
      <input
        id="texttonumbers"
        type="button"
        name="texttonumbers"
        :value="$t('txttonum.btnttn')"
        class="btn btn-primary mb-2 mr-2"
        @click="textToNumbers"
      >
      <input
        id="numberstotext"
        type="button"
        name="numberstotext"
        :value="$t('txttonum.btnntt')"
        class="btn btn-primary mb-2 mr-2"
        @click="numbersToText"
      >
      <input
        id="remove"
        type="button"
        name="remove"
        :value="$t('txtwordval.replacediac')"
        class="btn btn-primary mb-2"
        @click="removeDiacr"
      >
      <div
        v-if="result"
        class="resultbox"
      >
        {{ result }}
      </div>
    </div>
  </div>
</template>

<script>
import * as textHelper from '@/scripts/texthelper.js';
import VAlphabets from '@/components/inputs/VAlphabets.vue'

export default {
  name: 'TextAnalyze',

  components: {
    VAlphabets,
  },

  data: function () {
    return {
      message: "",
      selectedalphabet: "English",
      reverse : false,
      startatzero : false,
      leadzero: false,
      result : "",
    }
  },

  mounted: function() {
    this.$refs.listofalpha.focus();
  },

  methods: {

    // Ruthless replace all diacritics
    removeDiacr: function() {
      this.message = textHelper.removeDiacritics(this.message);
    },

    // Convert text to numbers
    textToNumbers : function () {

      // Reset
      this.errormsg = "";
      this.result = "";
      
      // Get the selected alphabet using the name
      let alpha = textHelper.getAlphabet(this.selectedalphabet);
      let mod = Math.floor(alpha.length / 10);
      if (this.startatzero) mod--;
      let html = "";
      let idx = 0;
      for (let i=0; i < this.message.length; i++) {
        idx = alpha.indexOf(this.message[i].toUpperCase());
        if (idx >= 0) {
          //if (!this.reverse && this.startatzedo) do nothing
          if (!this.reverse && !this.startatzero) idx++;
          if (this.reverse && this.startatzero) idx = alpha.length - idx - 1;
          if (this.reverse && !this.startatzero) idx = alpha.length - idx;
          if (!this.leadzero)
            (idx <= mod) ? html+= "0" + idx.toFixed(0) : html+= idx.toFixed(0);
          else
            (idx <= 9) ? html+= "0" + idx.toFixed(0) : html+= idx.toFixed(0);
        } else {
          html += this.message[i];
        }
      }
      this.result = html;
    },

    // Convert numbers to text
    numbersToText : function() {

      // Reset
      this.errormsg = "";
      this.result = "";

      let alpha = textHelper.getAlphabet(this.selectedalphabet);
      let mod = Math.floor(alpha.length / 10);
      if (this.startatzero) mod--;
      let html = "";
      let d1 = 0;
      let d2 = 0;
      let pos = 0;
      for (let i=0; i < this.message.length; i++) {
        if ("0123456789".indexOf(this.message[i]) >= 0) {
          d1 = parseInt(this.message[i]);
          if (d1 <= mod) {
            d2 = parseInt(this.message[++i]);
            // If last number accept one digit always
            pos = (d2) ? d1 * 10 + d2 : d1;
          } else {
            pos = d1;
          }
          //if (!this.reverse && this.startatzedo) do nothing
          if (!this.reverse && !this.startatzero) pos--;
          if (this.reverse && this.startatzero) pos = alpha.length - pos - 1;
          if (this.reverse && !this.startatzero) pos = alpha.length - pos;
          html += alpha[pos];
        } else {
          html += this.message[i];
        }
      }
      this.result = html;
    },

  },
}
</script>

<style scoped>
</style>
