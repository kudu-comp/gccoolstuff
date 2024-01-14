<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('baseconv.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('baseconv.long')"
      />
      <div class="row">
        <label
          class="form-label md-size mb-2"
          for="base1"
        >{{ $t('baseconv.base1') }}</label>
        <input
          id="base1"
          v-model="base1"
          type="number"
          min="2"
          max="36"
          class="form-control sm-size mb-2"
        >
        <div class="lg-size">
          <input
            id="basestr1"
            v-model="basestr1"
            type="text"
            class="form-control mb-2"
          >
        </div>
      </div>
      <div class="row">
        <label
          class="form-label md-size mb-2"
          for="base2"
        >{{ $t('baseconv.base2') }}</label>
        <input
          id="base2"
          v-model="base2"
          type="number"
          min="2"
          max="36"
          class="form-control sm-size mb-2"
        >
        <div class="lg-size">
          <input
            id="basestr2"
            v-model="basestr2"
            type="text"
            class="form-control mb-2"
          >
        </div>
      </div>
      <button id="convert" class="btn mb-2" @click="toConvert()">
        {{ $t('buttons.convert') }}
      </button>
      <textarea
        id="message"
        ref="message"
        v-model="message"
        class="form-control mb-2"
        placeholder="Message"
        rows="5"
      />
      <div class="resultbox" v-if="result">
        {{ result }}      
      </div>
      <p
        v-show="errormsg"
        class="errormsg"
      >
        {{ errormsg }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MathBase',

  data: function () {
    return {
      title: "Base convertor",
      message: "",
      result: "",
      basestr1: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      basestr2: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      base1: 2,
      base2: 10,
      phpurl: window.location.protocol + "//" + window.location.hostname + "/cipher-toolkit/encoderdecoder.php",
      errormsg: ""
    }
  },

  mounted: function() {
    this.$refs.message.focus();
  },

  methods: {

    // Convert the base using the ciphertoolkit
    toConvert: function() {
      this.errormsg = "";
      let data = {
        alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        enordecode: "encode",
        cipher: 'Baseconvertor',
        key1: this.basestr1.slice(0, this.base1),
        key2: this.basestr2.slice(0, this.base2),
        message: this.message,
        transmessage: this.result,
      };

      // Call the script on the server
      fetch(this.phpurl, {
          method: 'POST',
          body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
          this.message = data.message;
          this.result = data.transmessage;
        })
        .catch((error) => {
          console.error('Error ', error);
          this.errormsg = this.$t('errors.generic')
        });
    },

  },
}
</script>

<style scoped>
</style>
