<template>
  <div class="d-flex flex-column mx-4">
    <!-- Section head / page title -->
    <div class="sectionhead">
      {{ $t('cryptosolver.title') }}
    </div>
    <!-- Main page -->
    <div class="mainpage">
      <!-- Start with info block -->
      <div
        class="infoblock"
        v-html="$t('cryptosolver.long')"
      />
      <!-- Form fields -->
      <!-- Text input -->
      <div class="row">
        <label
          class="form-label mb-2 md-size"
          for="nums"
        >{{$t('cryptosolver.nums')}}</label>
        <input
          id="nums"
          v-model="nums"
          type="text"
          class="form-control md-size mb-2 me-2"
        >
      </div>
      <div class="row">
        <label for="outcome" class="form-label md-size mb-2">{{$t('cryptosolver.outcome')}}</label>
        <input type="number" min="0" v-model="outcome" id="outcome" class="form-control md-size mb-2"/>
      </div>
      <div class="form-check">
        <input
          id="useall"
          v-model="useall"
          type="checkbox"
          class="form-check-input me-2 mb-2"
        >
        <label
          for="useall"
          class="form-check-label mb-2"
        >{{ $t('cryptosolver.useall') }}</label>
      </div>
      <div class="form-check">
        <input
          id="allowneg"
          v-model="allowneg"
          type="checkbox"
          class="form-check-input me-2 mb-2"
        >
        <label
          for="allowneg"
          class="form-check-label mb-2"
        >{{ $t('cryptosolver.allowneg') }}</label>
      </div>
      <div class="form-check">
        <input
          id="allowdec"
          v-model="allowdec"
          type="checkbox"
          class="form-check-input me-2 mb-2"
        >
        <label
          for="allowdec"
          class="form-check-label mb-2"
        >{{ $t('cryptosolver.allowdec') }}</label>
      </div>
      <div class="form-check">
        <input
          id="allowadd"
          v-model="allowadd"
          type="checkbox"
          class="form-check-input me-2 mb-2"
        >
        <label
          for="allowadd"
          class="form-check-label mb-2"
        >{{ $t('cryptosolver.allowadd') }}</label>
      </div>
      <div class="form-check">
        <input
          id="allowsub"
          v-model="allowsub"
          type="checkbox"
          class="form-check-input me-2 mb-2"
        >
        <label
          for="allowsub"
          class="form-check-label mb-2"
        >{{ $t('cryptosolver.allowsub') }}</label>
      </div>
      <div class="form-check">
        <input
          id="allowmult"
          v-model="allowmult"
          type="checkbox"
          class="form-check-input me-2 mb-2"
        >
        <label
          for="allowmult"
          class="form-check-label mb-2"
        >{{ $t('cryptosolver.allowmult') }}</label>
      </div>
      <div class="form-check">
        <input
          id="allowdiv"
          v-model="allowdiv"
          type="checkbox"
          class="form-check-input me-2 mb-2"
        >
        <label
          for="allowdiv"
          class="form-check-label mb-2"
        >{{ $t('cryptosolver.allowdiv') }}</label>
      </div>
      <div class="form-check">
        <input
          id="allowmod"
          v-model="allowmod"
          type="checkbox"
          class="form-check-input me-2 mb-2"
        >
        <label
          for="allowmod"
          class="form-check-label mb-2"
        >{{ $t('cryptosolver.allowmod') }}</label>
      </div>
      <div class="form-check">
        <input
          id="allowpow"
          v-model="allowpow"
          type="checkbox"
          class="form-check-input me-2 mb-2"
        >
        <label
          for="allowpow"
          class="form-check-label mb-2"
        >{{ $t('cryptosolver.allowpow') }}</label>
      </div>
      <v-calculate class="mb-2" id="calc" @calculate="findCalculation()"></v-calculate>
      <!-- Error message -->
      <p
        v-show="errormsg"
        class="errormsg"
      >
        {{ errormsg }}
      </p>
      <!-- Result area or use v-html -->
      <div v-if="result" class="resultbox" v-html="result"></div>
    </div>
  </div>
</template>

<script>
import VCalculate from '@/components/inputs/VCalculate.vue' 

export default {

  name: "CryptoSolver",

  components: {
    VCalculate
  },

  data() {
    return {
      useall: true,
      outcome: null,
      nums: "",
      result: "",
      calc: "",
      errormsg: "",
      found: false,
      allowneg: false,
      allowdec: false,
      allowadd: true,
      allowsub: true,
      allowmult: true,
      allowdiv: true,
      allowmod: false,
      allowpow: false
    };
  },

  methods: {

    nextTry: function (a, calc) {
      // Take two numbers apply the the basic operation, create a new array and try again
      if (this.found) return;
      if (a.length === 1) {
        if (a[0] === this.outcome) {
          // We got a match
          this.result = this.$t('cryptosolver.found') + this.outcome + "<br>" + calc;
          this.found = true;
        }
      }
      for (let i = 0; i < a.length; i++) {
        // If we don't need to use all numbers see if we got one
        if (!this.useall && a[i] === this.outcome) {
          this.result = "Found " + this.outcome + "<br>" + calc;
          this.found = true;
          return;
        }
        // Try add, multiply, substract (no negative numbers) and divide (no decimals)
        for (let j = i + 1; j < a.length; j++) {
          let h = [];
          // Build the array with unused numbers
          for (let k = 0; k < a.length; k++) {
            if (k !== i && k !== j) h.push(a[k]);
          }
          // Try addition
          if (this.allowadd) {
            h.push(a[i] + a[j]);
            this.nextTry(
              h,
              calc + a[i] + " + " + a[j] + " = " + (a[i] + a[j]) + "<br>"
            );
            h.pop();
          }
          // Try multiple
          if (this.allowmult) {
            h.push(a[i] * a[j]);
            this.nextTry(
              h,
              calc + a[i] + " x " + a[j] + " = " + a[i] * a[j] + "<br>"
            );
            h.pop();
          }
          // Try substract i - j
          if (this.allowsub && (this.allowneg || a[i] > a[j])) {
            h.push(a[i] - a[j]);
            this.nextTry(
              h,
              calc + a[i] + " - " + a[j] + " = " + (a[i] - a[j]) + "<br>"
            );
            h.pop();
          }
          // Try substract j - i
          if (this.allowsub && (this.allowneg || a[j] > a[i])) {
            h.push(a[j] - a[i]);
            this.nextTry(
              h,
              calc + a[j] + " - " + a[i] + " = " + (a[j] - a[i]) + "<br>"
            );
            h.pop();
          }
          // Try division i / j
          if (this.allowdiv && (this.allowdec || a[i] % a[j] === 0)) {
            h.push(a[i] / a[j]);
            this.nextTry(
              h,
              calc + a[i] + " : " + a[j] + " = " + a[i] / a[j] + "<br>"
            );
            h.pop();
          }
          // Try division j / i
          if (this.allowdiv && (this.allowdec || a[j] % a[i] === 0)) {
            h.push(a[j] / a[i]);
            this.nextTry(
              h,
              calc + a[j] + " : " + a[i] + " = " + a[j] / a[i] + "<br>"
            );
            h.pop();
          }
          // Try mod i % j
          if (this.allowmod) {
            h.push(a[i] % a[j]);
            this.nextTry(
              h,
              calc + a[i] + " % " + a[j] + " = " + a[i] % a[j] + "<br>"
            );
            h.pop();
          }
          // Try mod j % i
          if (this.allowmod) {
            h.push(a[j] % a[i]);
            this.nextTry(
              h,
              calc + a[j] + " % " + a[i] + " = " + a[j] % a[i] + "<br>"
            );
            h.pop();
          }
          // Try power i ** j
          if (this.allowpow) {
            h.push(a[i] ** a[j]);
            this.nextTry(
              h,
              calc + a[i] + " ^ " + a[j] + " = " + a[i] ** a[j] + "<br>"
            );
            h.pop();
          }
          // Try power j ** i
          if (this.allowpow) {
            h.push(a[j] ** a[i]);
            this.nextTry(
              h,
              calc + a[i] + " ^ " + a[i] + " = " + a[j] ** a[i] + "<br>"
            );
            h.pop();
          }
        }
      }
    },

    findCalculation: function () {

      // Reset
      this.result = "";
      this.errormsg = "";
      this.found = false;
      if (!this.outcome) {
        this.errormsg = this.$t('cryptosolver.nooutcome');
        return;
      }

      // Parse numbers form the input and convert to integers
      let h = this.nums.match(/([!0-9]+)/g);
      if (!h) {
        this.errormsg = this.$t('cryptosolver.nonums');
        return;
      }
      let numbers = h.map((e) => parseInt(e));
      if (!numbers || numbers.length === 0) {
        this.errormsg = this.$t('cryptosolver.nonums');
        return;
      }

      this.nextTry(numbers, "");
      if (!this.found) {
        this.result = this.$t('cryptosolver.nosolution');
      }
    },

  },
};

</script>

<style scoped>
</style>
