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
      <div class="row">
        <label
          class="form-label mb-2 sm-size"
          for="selhash"
        >{{ $t('comphash.hashes') }} </label>
        <select
          id="selhash"
          v-model="selhash"
          class="form-select mb-2 sm-size"
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
      <v-calculate @calculate="hashMessage" />
      <textarea
        id="message"
        ref="message"
        v-model="message"
        class="form-control mb-2"
        :placeholder="$t('labels.message')"
        rows="5"
      />
      <p
        v-show="errormsg"
        class="errormsg mb-2"
      >
        {{ errormsg }}
      </p>
      <div
        v-if="result"
        class="resultbox"
      >
        {{ result }}
      </div>
      <div
        v-if="result"
        class="row mb-2"
      >
        <label
          class="form-label mb-2 md-size me-2"
          for="verify"
        >{{ $t('comphash.verify') }} </label>
        <input
          id="verify"
          v-model="verify"
          type="text"
          class="form-control xl-size"
        >
      </div>
    </div>
  </div>
</template>

<script>

import CryptoJS from 'crypto-js';
import VCalculate from '../inputs/VCalculate.vue';

export default {

  name: 'CompHashes',

  components: {
    VCalculate
  },

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

