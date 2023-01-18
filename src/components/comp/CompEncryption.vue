<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('comptools.encryption.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('comptools.encryption.long')"
      />
      <div class="form-inline">
        <label
          class="form-label mb-2 mr-2"
          for="selenc"
        >{{ $t('compenc.codes') }} </label>
        <select
          id="selenc"
          v-model="selenc"
          class="custom-select mb-2 mr-2"
        >
          <option value="Okto3">
            Okto3
          </option>
          <option value="AES">
            AES
          </option>
          <option value="DES">
            DES
          </option>
          <option value="TripleDES">
            TripleDES
          </option>
          <option value="Rabbit">
            Rabbit
          </option>
          <option value="RC4">
            RC4
          </option>
          <option value="RC4Drop">
            RC4Drop
          </option>
        </select>
      </div>
      <div
        v-show="selenc != 'Okto3'"
        class="form-inline"
      >
        <label class="form-label mb-2 mr-2">{{ $t('compenc.advanced') }}</label>
        <label
          class="form-label mb-2 mr-2"
          for="selmode"
        >{{ $t('compenc.modes') }} </label>
        <select
          id="selmode"
          v-model="selmode"
          class="custom-select mb-2 mr-2"
        >
          <option value="0">
            CBC
          </option>
          <option value="1">
            CFB
          </option>
          <option value="2">
            CTR
          </option>
          <option value="3">
            OFB
          </option>
          <option value="4">
            ECB
          </option>
        </select>
        <label
          class="form-label mb-2 mr-2"
          for="selpad"
        >{{ $t('compenc.padding') }} </label>
        <select
          id="selpad"
          v-model="selpad"
          class="custom-select mb-2 mr-2"
        >
          <option value="0">
            Pkcs7
          </option>
          <option value="1">
            Iso97971
          </option>
          <option value="2">
            AnsiX923
          </option>
          <option value="3">
            Iso10126
          </option>
          <option value="4">
            ZeroPadding
          </option>
          <option value="5">
            NoPadding
          </option>
        </select>
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
      <div class="form-inline mb-2">
        <label
          class="form-label mr-2"
          for="key"
        >{{ $t('compenc.key') }}</label>
        <input
          id="key"
          ref="key"
          v-model="key"
          type="text"
          name="key"
          class="form-control"
          size="40"
        >
      </div>
      <div class="form-inline">
        <input
          id="encrypt"
          type="button"
          :value="$t('buttons.encode')"
          class="btn btn-primary mb-2 mr-2"
          @click="encryptMessage"
        >
        <input
          id="decrypt"
          type="button"
          :value="$t('buttons.decode')"
          class="btn btn-primary mb-2 mr-2"
          @click="decryptMessage"
        >
      </div>
      <p
        v-show="errormsg"
        class="errormsg mt-2"
      >
        {{ errormsg }}
      </p>
      <div
        v-if="result"
        class="form-row mb-2"
      >
        <textarea
          id="coded"
          ref="coded"
          v-model="result"
          class="form-control"
          :placeholder="$t('compenc.coded')"
          rows="10"
        />
      </div>
    </div>
  </div>
</template>

<script>

import CryptoJS from 'crypto-js';

export default {

  name: 'CompBinToText',

  data: function () {
    return {
      message: "",
      result : "",
      errormsg: "",
      selenc : "Okto3",
      selmode: 0,
      selpad: 0,
      key: "",
      modes: [CryptoJS.mode.CBC, CryptoJS.mode.CFB, CryptoJS.mode.CTR, CryptoJS.mode.OFB, CryptoJS.mode.ECB],
      pads: [CryptoJS.pad.Pkcs7, CryptoJS.pad.Iso97971, CryptoJS.pad.AnsiX923, CryptoJS.pad.Iso10126, CryptoJS.pad.ZeroPadding, CryptoJS.pad.NoPadding]
    }
  },

  mounted: function() {
    this.$refs.message.focus();
    if (this.$route.params.enc) this.selenc = this.$route.params.enc;
  },

  methods: {

    // Encrypt Okto3
    encryptOkto3 : function (message, key) {

      if (key.length<10) return message;
      let result = "";
      
      // Number of chars to encode at a time
      let blocksize = Math.round(key.length / 6);
      
      // Loop over message
      let x = 0;
      while (x < message.length) {

        let num = 0;
        
        // Get the ASCII based value of the text
        for (let i = 0;  i < blocksize && (x+i) < message.length; i++) 
          num = (num << 8) + message.charCodeAt(x + i);

        // Perform the Okto math on the calculated value
        for (let z = 0; z < key.length; z++) {

          switch (z % 4) {
            case 0 :
              num += key.charCodeAt(z);
              break;
            case 1 :
              num /= key.charCodeAt(z);
              break;
            case 2 :
              num -= key.charCodeAt(z);
              break;
            case 3 :
              num *= 500.005 * key.charCodeAt(z);
          }

        }

        result += num.toFixed(8) + "\n";
        x += blocksize;

      }

      return result.slice(0,-1);

    },

    // Decrupt Okto3
    decryptOkto3 : function (message, key) {

      if (key.length < 10) return message;
      let result = "";
      
      // Number of chars to encode at a time
      let blocksize = Math.round(key.length / 6);
      
      // Split message
      let numbers = message.match(/[-0-9.,]+/g);
      console.log(message);
      console.log(numbers);
      
      // For each number
      for (let n of numbers) {
          
        // Do the reverse math in reverse order
        n = parseFloat(n);
        for (let z = key.length-1; z >=0; z--) {
        
          switch (z % 4) {
            case 0 : 
              n -= key.charCodeAt(z);
              break;
            case 1 : 
              n *= key.charCodeAt(z);
              break;
            case 2 : 
              n += key.charCodeAt(z);
              break;
            case 3 : 
              n /=  (500.005 * key.charCodeAt(z));
              break;        	
          }
        }    
        n = Math.round(n);

        // Get the text
        let tmp = ""
        for (let i = 0; i < blocksize && n>0; i++) {
          tmp = String.fromCharCode(n % 256) + tmp;
          n = Math.floor(n / 256);
        }
        result += tmp;
        
      }
        
      return result

    },

    // Encrypt the message
    encryptMessage : function () {

      // Reset error flag
      this.errormsg = "";
      this.result = "";
      let options = { 
        mode: this.modes[this.selmode],
        padding: this.pads[this.selpad]
      }
      
      try {

        switch (this.selenc) {

          case "Okto3" :
            if (this.key.length <10) {
              this.errormsg = this.$t('compenc.keytooshort')            
            } else {
              this.result = this.encryptOkto3 (this.message, this.key);
            }
            break;
          case "AES" :
            this.result = CryptoJS.AES.encrypt(this.message, this.key, options).toString();
            break;
          case "DES" :
            this.result = CryptoJS.DES.encrypt(this.message, this.key, options).toString();
            break;
          case "TripleDES" :
            this.result = CryptoJS.TripleDES.encrypt(this.message, this.key, options).toString();
            break;
          case "Rabbit" :
            this.result = CryptoJS.Rabbit.encrypt(this.message, this.key, options).toString();
            break;
          case "RC4" :
            this.result = CryptoJS.RC4.encrypt(this.message, this.key, options).toString();
            break;
          case "RC4Drop" :
            this.result = CryptoJS.RC4Drop.encrypt(this.message, this.key, options).toString();
            break;
          default :
            // Unknown, raise error
        }

      } catch (e) {

        this.errormsg = this.$t('errors.genericerror');
        console.log(e);

      }
    },

    // Decrypt
    decryptMessage : function () {

      // Reset error flag
      this.errormsg = "";
      this.message = "";
      let options = { 
        mode: this.modes[this.selmode],
        padding: this.pads[this.selpad]
      }

      try {

        switch (this.selenc) {

          case "Okto3" :
            if (this.key.length <10) {
              this.errormsg = this.$t('compenc.keytooshort')            
            } else {
              this.message = this.decryptOkto3 (this.result, this.key);
            }
            break;
          case "AES" :
            this.message = CryptoJS.AES.decrypt (this.result, this.key, options).toString(CryptoJS.enc.Utf8);
            break;
          case "DES" :
            this.message = CryptoJS.DES.decrypt (this.result, this.key, options).toString(CryptoJS.enc.Utf8);
            break;
          case "TripleDES" :
            this.message = CryptoJS.TripleDES.decrypt (this.result, this.key, options).toString(CryptoJS.enc.Utf8);
            break;
          case "Rabbit" :
            this.message = CryptoJS.Rabbit.decrypt (this.result, this.key, options).toString(CryptoJS.enc.Utf8);
            break;
          case "RC4" :
            this.message = CryptoJS.RC4.decrypt (this.result, this.key, options).toString(CryptoJS.enc.Utf8);
            break;
          case "RC4Drop" :
            this.message = CryptoJS.RC4Drop.decrypt (this.result, this.key, options).toString(CryptoJS.enc.Utf8);
            break;
          default :
            // Unknown, raise error
        }

      } catch (e) {

        this.errormsg = this.$t('errors.genericerror');
        console.log(e);

      }
    },


  },
}
</script>

<style scoped>
</style>
