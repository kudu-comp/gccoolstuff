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
          for="from"
        >{{ $t('baseconv.from') }}</label>
        <input
          id="from"
          v-model="from"
          type="number"
          min="2"
          max="36"
          class="form-control sm-size mb-2"
        >
        <div class="lg-size">
          <input
            id="fromstr"
            v-model="fromstr"
            type="text"
            class="form-control mb-2"
          >
        </div>
      </div>
      <div class="row">
        <label
          class="form-label md-size mb-2"
          for="to"
        >{{ $t('baseconv.to') }}</label>
        <input
          id="to"
          v-model="to"
          type="number"
          min="2"
          max="36"
          class="form-control sm-size mb-2"
        >
        <div class="lg-size">
          <input
            id="tostr"
            v-model="tostr"
            type="text"
            class="form-control mb-2"
          >
        </div>
      </div>
      <button id="convert" class="btn mb-2" @click="toConvert()">
        {{ $t('buttons.convert') }}
      </button>
      <textarea
        id="input"
        ref="input"
        v-model="input"
        class="form-control mb-2"
        placeholder="input"
        rows="2"
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
      input: "",
      result: "",
      errormsg: "",
      fromstr: "",
      tostr: "",
      defstr: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      from: 2,
      to: 10,
    }
  },

  mounted: function() {
    this.$refs.input.focus();
  },

  methods: {

    // Convert the base using the ciphertoolkit
    toConvert: function() {

      // Reset
      this.result = "";
      this.errormsg = "";
      this.fromstr = this.fromstr.trim();
      this.tostr = this.tostr.trim();

      // Check input
      if (
        (this.fromstr !== "" && this.fromstr.length !== this.from) ||
        (this.tostr !== "" && this.tostr.length !== this.to)
      ) {
        this.errormsg = this.$t("baseconv.symbolserr");
        return;
      }
      if (!this.input) {
        this.errormsg = this.$t("errors.noinput");
        return;
      }

      // Parse numbers from input
      let nums = this.input.matchAll(/(\S+)/gi);
      let fromstr = this.fromstr.length > 0 ? this.fromstr : this.defstr;
      let tostr = this.tostr.length > 0 ? this.tostr : this.defstr;

      // Process all numbers
      for (let n of nums) {
        // Convert input string from custom symbols to 0-9A-Z
        let h = "";
        for (let c of n[0]) {
          h += this.defstr[fromstr.toUpperCase().indexOf(c.toUpperCase())];
        }

        // Convert
        h = parseInt(h, this.from).toString(this.to);
        if (isNaN(h)) {
          this.errormsg = this.$t("errors.unknowninput");
          this.result += " error ";
          continue;
        }
        let h2 = "";

        // Convert output string from 0-9A-Z to custom symbols
        for (let c of h) {
          h2 += tostr[this.defstr.indexOf(c.toUpperCase())];
        }

        if (!h2) {
          this.errormsg = this.$t("errors.unknowninput");
        } else {
          // Print output
          this.result += h2 + " ";
        }
      } 
    },
  },
}
</script>

<style scoped>
</style>
