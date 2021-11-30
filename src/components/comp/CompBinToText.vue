<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{$t('comptools.compbintotext.title')}}
    </div>
    <div class="mainpage">
      <div class="infoblock" v-html="$t('comptools.compbintotext.long')" />
      <div class="form-inline">
        <label class="form-label mb-2 mr-2" for="selenc">{{$t('compbintotext.selfrom')}} </label>
        <select class="custom-select mb-2 mr-2" v-model="selfromenc" id="selfromenc" @change="selFromEncoding">
          <option value="b85">Ascii85 (a.k.a. Base85)</option>
          <option value="b32">Base32 (e.g. RFC4648)</option>
          <option value="b58">Base58 (e.g. Bitcoin)</option>
          <option value="b64">Base64 (Base64 and uuencode)</option>
          <option value="b91">Base91</option>
          <option value="bin">Binary number</option>
          <option value="dec">Decimal number</option>
          <option value="hex">Hexadecimal number (a.k.a. Base16)</option>
          <option value="txt">Text (ASCII UTF8)</option>
        </select>
      </div>
      <div class="form-inline mb-2" v-show="fromtables">
        <label class="form-label mb-2 mr-2" for="table">{{$t('compbintotext.selfromtable')}}</label>
        <select class="custom-select mb-2 mr-2" v-model="selfromtable" id="table">
          <option v-for="tb in fromtables" :key="tb" :value="tb.value">{{tb.name}}</option>
        </select>
        <p>
          {{selfromtable}}
        </p>
      </div>
      <div class="form-row mb-2">
        <textarea id="message" name="message" class="form-control" ref="message" :placeholder="$t('labels.message')" rows=10 v-model='message'></textarea>
      </div>
      <div class="form-inline">
        <input type="button" id="bcdfrom" name="bcdfrom" :value="$t('buttons.convert')" class="btn btn-primary mb-2 mr-2" v-on:click="convertBase">
        <label class="form-label mb-2 mr-2" for="selenc">{{$t('compbintotext.selto')}} </label>
        <select class="custom-select mb-2 mr-2" v-model="seltoenc" id="seltoenc" @change="selToEncoding">
          <option value="b85">Ascii85 (a.k.a. Base85)</option>
          <option value="b32">Base32 (e.g. RFC4648)</option>
          <option value="b58">Base58 (e.g. Bitcoin)</option>
          <option value="b64">Base64 (Base64 and uuencode)</option>
          <option value="b91">Base91</option>
          <option value="bin">Binary number</option>
          <option value="dec">Decimal number</option>
          <option value="hex">Hexadecimal number (a.k.a. Base16)</option>
          <option value="txt">Text (ASCII UTF8)</option>
        </select>
      </div>
      <div class="form-inline mb-2" v-show="totables">
        <label class="form-label mb-2 mr-2" for="table">{{$t('compbintotext.seltotable')}} </label>
        <select class="custom-select mb-2 mr-2" v-model="seltotable" id="table">
          <option v-for="tb in totables" :key="tb" :value="tb.value">{{tb.name}}</option>
        </select>
        <p>
          {{seltotable}}
        </p>
      </div>
      <p v-show="errormsg" class="errormsg mt-2">{{errormsg}}</p>
      <div v-if="result" class="resultbox">{{result}}</div>
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

  name: 'CompBinToText',

  props: {
    msg: String,
  },

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
    this.$refs.message.focus();
    this.fromtables = null;
    this.selfromtable = "";
    this.totables = bt.base64encodings;
    this.seltotable = this.totables[0].value;
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
        console.log(buffer);

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
