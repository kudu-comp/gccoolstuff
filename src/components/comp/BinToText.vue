<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('bintotext.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('bintotext.long')"
      />
      <div class="row">
        <label
          class="form-label mb-2 sm-size"
          for="selfromenc"
        >{{ $t('bintotext.selfrom') }} </label>
        <select
          id="selfromenc"
          v-model="selfromenc"
          class="form-select mb-2 md-size"
          @change="selFromEncoding"
        >
          <option value="b85">
            Ascii85 (a.k.a. Base85)
          </option>
          <option value="b32">
            Base32 (e.g. RFC4648)
          </option>
          <option value="b58">
            Base58 (e.g. Bitcoin)
          </option>
          <option value="b64">
            Base64 (Base64 and uuencode)
          </option>
          <option value="b91">
            Base91
          </option>
          <option value="bin">
            Binary number
          </option>
          <option value="dec">
            Decimal number
          </option>
          <option value="hex">
            Hexadecimal number (a.k.a. Base16)
          </option>
          <option value="txt">
            Text (ASCII UTF8)
          </option>
        </select>
      </div>
      <div
        v-show="fromtables"
        class="row mb-2"
      >
        <label
          class="form-label mb-2 sm-size"
          for="fromtable"
        >{{ $t('bintotext.selfromtable') }}</label>
        <select
          id="fromtable"
          v-model="selfromtable"
          class="form-select mb-2 md-size"
        >
          <option
            v-for="tb in fromtables"
            :key="tb"
            :value="tb.value"
          >
            {{ tb.name }}
          </option>
        </select>
        <p class="xl-size">
          {{ selfromtable }}
        </p>
      </div>
      <div class="row">
        <label
          class="form-label mb-2 sm-size"
          for="seltoenc"
        >{{ $t('bintotext.selto') }} </label>
        <select
          id="seltoenc"
          v-model="seltoenc"
          class="form-select mb-2 md-size"
          @change="selToEncoding"
        >
          <option value="b85">
            Ascii85 (a.k.a. Base85)
          </option>
          <option value="b32">
            Base32 (e.g. RFC4648)
          </option>
          <option value="b58">
            Base58 (e.g. Bitcoin)
          </option>
          <option value="b64">
            Base64 (Base64 and uuencode)
          </option>
          <option value="b91">
            Base91
          </option>
          <option value="bin">
            Binary number
          </option>
          <option value="dec">
            Decimal number
          </option>
          <option value="hex">
            Hexadecimal number (a.k.a. Base16)
          </option>
          <option value="txt">
            Text (ASCII UTF8)
          </option>
        </select>
      </div>
      <div
        v-show="totables"
        class="row mb-2"
      >
        <label
          class="form-label mb-2 sm-size"
          for="totable"
        >{{ $t('bintotext.seltotable') }} </label>
        <select
          id="totable"
          v-model="seltotable"
          class="form-select mb-2 md-size"
        >
          <option
            v-for="tb in totables"
            :key="tb"
            :value="tb.value"
          >
            {{ tb.name }}
          </option>
        </select>
        <p class="xl-size">
          {{ seltotable }}
        </p>
      </div>
      <button id="convert" class="btn mb-2"  @click="convertBase">{{ $t('buttons.convert') }}</button>
      <p
        v-show="errormsg"
        class="errormsg mt-2"
      >
        {{ errormsg }}
      </p>
      <div class="form-row mb-2">
        <textarea
          id="message"
          v-model="message"
          ref="message"
          class="form-control"
          :placeholder="$t('labels.message')"
          rows="5"
        />
      </div>
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

// Import binary to text encoding tools
// For info see https://en.wikipedia.org/wiki/Binary-to-text_encoding
// Add this one https://en.wikipedia.org/wiki/Base62?
// Get ideas from https://cryptii.com/pipes/urldecode

import * as bt from '@/scripts/bintotext.js'

export default {

  name: 'BinToText',

  data: function () {
    return {
      message: "",
      result : "",
      basefrom: "bin",
      baseto: "bin",
      errormsg: "",
      seltoenc : "b64",
      totables : [],
      seltotable: "",
      selfromenc : "txt",
      fromtables: [],
      selfromtable: ""
    }
  },

  mounted: function() {
    this.fromtables = null;
    this.selfromtable = "";
    this.totables = bt.base64encodings;
    this.seltotable = this.totables[0].value;
    this.$refs.message.focus();
  },

  methods: {

    // Translate the input
    selFromEncoding : function () {

      this.fromtables = null;
      
      switch (this.selfromenc) {
        case "b58" : this.fromtables = bt.base58encodings; break;
        case "b32" : this.fromtables = bt.base32encodings; break;
        case "b64" : this.fromtables = bt.base64encodings; break;
        case "b85" : this.fromtables = bt.ascii85encodings; break;
        case "b91" : this.fromtables = bt.base91encodings; break;
      }
      
      if (this.fromtables) this.selfromtable = this.fromtables[0].value;
      
    },

    selToEncoding : function () {

      this.totables = null;
      
      switch (this.seltoenc) {
        case "b58" : this.totables = bt.base58encodings; break;
        case "b32" : this.totables = bt.base32encodings; break;
        case "b64" : this.totables = bt.base64encodings; break;
        case "b85" : this.totables = bt.ascii85encodings; break;
        case "b91" : this.totables = bt.base91encodings; break;
      }
      
      if (this.totables) this.seltotable = this.totables[0].value;

    },

    // Translate the input
    convertBase : function () {

      // Reset error flag
      this.errormsg = "";
      this.result = "";
      let buffer = [];

      try {
        
        // For each word convert and add to the output
        switch (this.selfromenc) {
          case "bin" :
            buffer = bt.binaryToBuffer(this.message);
            break;
          case "hex" :
            buffer = bt.hexToBuffer(this.message);
            break;
          case "dec" :
            buffer = bt.decimalToBuffer(this.message);
            break;
          case "txt" :
            buffer = bt.textToBuffer(this.message);
            break;
          case "b32" :
            buffer = bt.base32ToBuffer(this.message, this.selfromtable);
            break;
          case "b58" :
            buffer = bt.base58ToBuffer(this.message, this.selfromtable);
            break;
          case "b64" :
            buffer = bt.base64ToBuffer(this.message, this.selfromtable);
            break;
          case "b85" :
            buffer = bt.ascii85ToBuffer(this.message, this.selfromtable);
            break;
          case "b91" :
            buffer = bt.base91ToBuffer(this.message, this.selfromtable);
            break;
        }

        switch (this.seltoenc) {
          case "bin" :
            this.result = bt.bufferToBinary(buffer);
            break;
          case "hex" :
            this.result = bt.bufferToHex(buffer);
            break;
          case "dec" :
            this.result = bt.bufferToDecimal(buffer);
            break;
          case "txt" :
            this.result = bt.bufferToText(buffer);
            break;
          case "b32" :
            this.result = bt.bufferToBase32(buffer, this.seltotable);
            break;
          case "b58" :
            this.result = bt.bufferToBase58(buffer, this.seltotable);
            break;
          case "b64" :
            this.result = bt.bufferToBase64(buffer, this.seltotable);
            break;
          case "b85" :
            this.result = bt.bufferToAscii85(buffer, this.seltotable);
            break;
          case "b91" :
            this.result = bt.bufferToBase91(buffer, this.seltotable);
            break;
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
