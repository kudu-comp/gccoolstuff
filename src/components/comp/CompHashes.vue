<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('comptools.hashes.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('comptools.hashes.long')"
      />
      <div class="form-inline">
        <label
          class="form-label mb-2 mr-2"
          for="selenc"
        >{{ $t('comphash.hashes') }} </label>
        <select
          id="selhash"
          v-model="selhash"
          class="custom-select mb-2 mr-2"
        >
          <option value="MD5">
            MD5
          </option>
          <option value="SHA1">
            SHA-1
          </option>
          <option value="SHA256">
            SHA-2 (SHA256)
          </option>
          <option value="SHA512">
            SHA-2 (SHA512)
          </option>
          <option value="SHA3">
            SHA-3
          </option>
          <option value="RIPEMD160">
            RIPEMD160
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
          rows="5"
        />
      </div>
      <div class="form-inline">
        <input
          id="calc"
          type="button"
          name="calc"
          :value="$t('buttons.calc')"
          class="btn btn-primary mb-2 mr-2"
          @click="hashMessage"
        >
      </div>
      <p
        v-show="errormsg"
        class="errormsg mb-2"
      >
        {{ errormsg }}
      </p>
      <div
        v-if="result"
        class="card card-text p-2"
      >
        {{ result }}
      </div>
      <div
        v-if="result"
        class="form-row mb-2"
      >
        <label
          class="form-label mb-2 mr-2"
          for="verify"
        >{{ $t('comphash.verify') }} </label>
        <input
          id="verify"
          v-model="verify"
          type="text"
          name="verify"
          class="form-control"
          rows="5/"
        >
      </div>
    </div>
  </div>
</template>

<script>

import CryptoJS from 'crypto-js';

export default {

  name: 'CompHashes',

  data: function () {
    return {
      message: "",
      result : "",
      verify: "",
      errormsg: "",
      selhash : "SHA1"
    }
  },

  mounted: function() {
    this.$refs.message.focus();
    if (this.$route.params.hash) this.selhash = this.$route.params.hash;
  },

  methods: {

    // Encrypt the message
    hashMessage : function () {

      // Reset error flag
      this.errormsg = "";
      this.result = "";
      
      try {

        switch (this.selhash) {

          case "MD5" :
            this.result = CryptoJS.MD5 (this.message).toString(CryptoJS.enc.Hex);
            break;
          case "SHA1" :
            this.result = CryptoJS.SHA1 (this.message).toString(CryptoJS.enc.Hex);
            break;
          case "SHA256" :
            this.result = CryptoJS.SHA256 (this.message).toString(CryptoJS.enc.Hex);
            break;
          case "SHA512" :
            this.result = CryptoJS.SHA512 (this.message).toString(CryptoJS.enc.Hex);
            break;
          case "SHA3" :
            this.result = CryptoJS.SHA3 (this.message).toString(CryptoJS.enc.Hex);
            break;
          case "RIPEMD160" :
            this.result = CryptoJS.RIPEMD160 (this.message).toString(CryptoJS.enc.Hex);
            break;
          default :
            // Unknown, raise error
        }

        if (this.verify) {

          if (this.verify == this.result)
            this.errormsg = this.$t('comphash.errorok')
          else
            this.errormsg = this.$t('comphash.errornok')
        }

      } catch (e) {

        this.errormsg = this.$t('errors.genericerror');
        console.log(e);

      }
    }

  }
  
}
</script>

