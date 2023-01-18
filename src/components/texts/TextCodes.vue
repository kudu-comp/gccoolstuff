<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('texttools.charcodes.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('texttools.charcodes.long')"
      />
      <div class="form-inline">
        <label
          class="form-label mb-2 mr-2"
          for="codes"
        >{{ $t('txtcodes.input') }}</label>
        <v-code
          id="codes"
          v-model:code="selectedcode"
          class="mb-2"
        />
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
      <div class="form-inline">
        <input
          id="convert"
          type="button"
          name="convert"
          :value="$t('buttons.convert')"
          class="btn btn-primary mb-2 mr-2"
          @click="translateInput"
        >
        <label
          class="form-label mb-2 mr-2"
          for="codes"
        >{{ $t('txtcodes.output') }}</label>
        <v-code
          id="codes"
          v-model:code="selectedoutput"
          class="mb-2"
          @change="translateInput"
        />
      </div>
      <p
        v-show="errormsg"
        class="errormsg mt-2"
      >
        {{ errormsg }}
      </p>
      <div
        v-if="result"
        class="resultbox"
      >
        {{ result }}
      </div>
      <va-item
        :showitem="showinfo"
        @toggle="showinfo = !showinfo"
      >
        <template #header>
          {{ $t('txtcodes.someinfo') }}
        </template>
        <template #content>
          <div v-html="$t('txtcodes.someinfo2')" />
        </template>
      </va-item>
    </div>
  </div>
</template>

<script>
import VCode from '@/components/inputs/VCode.vue'
import * as baudotcode from '@/scripts/baudotcode.js'
import * as codepages from '@/scripts/codepages.js'
import { codePoints, fromCodePoint } from 'utf16-char-codes'
import VaItem from '@/components/inputs/VaItem.vue'

export default {

  name: 'TextCodes',

  components: {
    VCode,
    VaItem,
  },

  data: function () {
    return {
      message: "",
      result : this.$t('labels.result'),
      selectedcode : "Decimal",
      selectedoutput: "UTF16",
      errormsg: "",
      showinfo: true,
    }
  },

  mounted: function() {
    this.$refs.message.focus();
  },

  methods: {

    // Decide if input is read one by one or divided by whitespace
    getMany: function (s) {
      switch (s) {
        case "Baudotcode" :
        case "BaudotcodeR" :
        case "Murraycode" :
        case "MurraycodeR" :
        case "MurrayMTK2" :
        case "MurrayMTK2R" :
        case "Binary" :
        case "Octal" :
        case "Decimal" :
        case "Hexadecimal" :
          return true;
        default :
          return false;
      }
    },

    // Convert the intermediate result (a decimal number) to the requested output
    decimalToOutput : function (w) {
      // If input is -1 a control character has been used and output is empty
      if (w == -1) return "";

      // Convert to w to the requested output
      switch (this.selectedoutput) {

        case "Baudotcode" :
          // Input is decimal value of ASCII character to be converted Baudotcode (could be two)
          return baudotcode.baudotASCIIToCode(w);

        case "BaudotcodeR" :
          // Input is decimal value of ASCII character to be converted Baudotcode (could be two)
          return baudotcode.baudotReversedASCIIToCode(w);

        case "Murraycode" :
          // Input is decimal value of ASCII character to be converted Baudotcode (could be two)
          return baudotcode.murrayASCIIToCode(w);

        case "MurraycodeR" :
          // Input is decimal value of ASCII character to be converted Baudotcode (could be two)
          return baudotcode.murrayReversedASCIIToCode(w);

        case "MurrayMTK2" :
          // Input is decimal value of ASCII character to be converted Baudotcode (could be two)
          return baudotcode.murrayMTK2ASCIIToCode(w);

        case "MurrayMTK2R" :
          // Input is decimal value of ASCII character to be converted Baudotcode (could be two)
          return baudotcode.murrayMTK2ReversedASCIIToCode(w);

        case "UTF16" :
          // Input is a decimal number of the UTF character, fromCodePoint comes from the utf-16 lib
          return [fromCodePoint(w)];

        case "Binary" :
          // Input is a decimal number to be converted to binary
          return [w.toString(2)];

        case "Octal" :
          // Input is a decimal number to be converted to octal
          return [w.toString(8)];

        case "Decimal" :
          // Input is a decimal number
          return [w.toString(10)];

        case "Hexadecimal" :
          // Input is a decimal number to be converted to hex
          return [w.toString(16)];

        default :
          // Default find the codepage in codepages.js
          var cp = codepages.findCodepage(this.selectedoutput);
          if (cp >= 0)
            return [codepages.codeToChar(parseInt(w), cp)];
          else {
            // This should never happen
            this.errormsg = this.$t('errors.generic');
            return [""];
          }
      }
    },

    // Convert the input to the intermediate result (a decimal number)
    inputToDecimal : function (w) {

      switch (this.selectedcode) {

        case "Baudotcode" :
          // Input is a binary string representing the baudotcode
          // Or returns -1 for a control character
          return baudotcode.baudotCodeToASCII(w);

        case "BaudotcodeR" :
          // Input is a binary string representing the baudotcode
          // Or returns -1 for a control character
            return baudotcode.baudotReversedCodeToASCII(w);

        case "Murraycode" :
          // Input is a binary string representing the baudotcode
          // Or returns -1 for a control character
          return baudotcode.murrayCodeToASCII(w);

        case "MurraycodeR" :
          // Input is a binary string representing the baudotcode
          // Or returns -1 for a control character
          return baudotcode.murrayReversedCodeToASCII(w);

        case "MurrayMTK2" :
          // Input is a binary string representing the baudotcode
          // Or returns -1 for a control character
          return baudotcode.murrayMTK2ToASCII(w);

        case "MurrayMTK2R" :
          // Input is a binary string representing the baudotcode
          // Or returns -1 for a control character
          return baudotcode.murrayMTK2ReversedCodeToASCII(w);

        case "UTF16" :
          // input is an UTF character
          // codePoints returns an array of integers, but we always have only one
          return codePoints(w)[0];

        case "Binary" :
          // Input is a binary number convert to decimal
          return parseInt(w, 2);

        case "Octal" :
          // Input is a octal number convert to decimal
          return parseInt(w, 8);

        case "Decimal" :
          // Input is a binary number convert to decimal
          return parseInt(w);

        case "Hexadecimal" :
          // Input is a binary number convert to decimal
          return parseInt(w, 16);

        default :
          // This should never happen
          var cp = codepages.findCodepage(this.selectedcode)
          if (cp >= 0)
            return codepages.charToCode(w, cp);
          else {
            this.errormsg = this.$t('errors.generic');
            return -1;
          }
      }
    },

    // Translate the input
    translateInput : function () {

      // Reset error flag and reset baudotcode flag to letters
      this.errormsg = "" ;
      baudotcode.reset();

      try {
        
        // Break down input in words
        this.message = this.message.trim();
        let words;
        if (!this.getMany(this.selectedcode)) {
          words = this.message.match(/./gu);
        } else {
          words = this.message.split(/[,.\s]+/g);
        }

        // For each word convert and add to the output
        // Baudotcode and Murraycode might output two strings, so arrays are used
        this.result = "";
        for (let i=0; i < words.length; i++) {
          let inp = this.inputToDecimal(words[i]);
          let outp = this.decimalToOutput(inp);
          for (let i=0; i < outp.length; i++) {
            this.result += outp[i] + " ";
          }
        }

      } catch (e) {

        this.errormsg = this.$t('errors.invalidinput');
        console.log(e);

      }
    },
  },
}
</script>

<style scoped>
</style>
