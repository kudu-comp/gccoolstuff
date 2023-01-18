<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('mathtools.baseconvert.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('mathtools.baseconvert.long')"
      />
      <div class="form-inline mb-2">
        <label
          class="form-label col-sm-6 col-md-2"
          for="base1"
        >{{ $t('mathbase.base1') }}</label>
        <input
          id="base1"
          ref="base1"
          v-model="base1"
          type="number"
          name="base1"
          min="2"
          max="36"
          class="form-control col-sm-6 col-md-2"
        >
        <div class="col-md-4 p-2">
          <input
            id="basestr1"
            ref="basestr1"
            v-model="basestr1"
            type="text"
            name="basestr1"
            size="50"
            class="form-control"
          >
        </div>
      </div>
      <div class="form-inline mb-2">
        <label
          class="form-label col-sm-6 col-md-2"
          for="base2"
        >{{ $t('mathbase.base2') }}</label>
        <input
          id="base2"
          ref="base2"
          v-model="base2"
          type="number"
          name="base2"
          min="2"
          max="36"
          class="form-control col-sm-6 col-md-2"
        >
        <div class="col-md-4 p-2">
          <input
            id="basestr2"
            ref="basestr2"
            v-model="basestr2"
            type="text"
            name="basestr2"
            size="50"
            class="form-control"
          >
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <input
            id="convert"
            type="button"
            name="convert"
            :value="$t('buttons.convert')"
            class="btn btn-primary mb-2 mr-2"
            @click="toConvert('encode')"
          >
          <div class="form-group">
            <textarea
              id="message"
              ref="message"
              v-model="message"
              name="message"
              class="form-control"
              placeholder="Message"
              rows="10"
              cols="50"
            />
          </div>
        </div>
        <div class="col-6">
          <input
            id="convert"
            type="button"
            name="convert"
            :value="$t('buttons.convert')"
            class="btn btn-primary mb-2 mr-2"
            @click="toConvert('decode')"
          >
          <div class="form-group">
            <textarea
              id="translatedmessage"
              ref="translatedmessage"
              v-model="translatedmessage"
              name="translatedmessage"
              class="form-control"
              placeholder="Translation"
              cols="50"
              rows="10"
            />
          </div>
        </div>
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
      translatedmessage: "",
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
    toConvert: function(enordecode) {
      this.errormsg = "";
      let data = {
        alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        enordecode: enordecode,
        cipher: 'Baseconvertor',
        key1: this.basestr1.slice(0, this.base1),
        key2: this.basestr2.slice(0, this.base2),
        message: this.message,
        transmessage: this.translatedmessage,
      };

      // Call the script on the server
      fetch(this.phpurl, {
          method: 'POST',
          body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
          this.message = data.message;
          this.translatedmessage = data.transmessage;
          // console.log('Success', data)
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
