<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('mathtools.primes.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('mathtools.primes.long')"
      />
      <div class="form-inline">
        <label
          class="form-label col-8 col-md-4 col-lg-3 col-xl-2 mb-2"
          for="pos"
        >{{ $t('mathprime.check') }}</label>
        <input
          id="checkprime"
          ref="checkprime"
          v-model="checkprime"
          type="number"
          min="1"
          max="9007199254740992"
          class="form-control mb-2 mr-2"
        >
        <input
          id="check"
          type="button"
          name="check"
          :value="$t('buttons.calc')"
          class="btn btn-primary mb-2"
          @click="checkPrime"
        >
      </div>
      <div class="form-inline">
        <label
          class="form-label col-8 col-md-4 col-lg-3 col-xl-2 mb-2"
          for="pos"
        >{{ $t('mathprime.pos') }}</label>
        <input
          id="pos"
          ref="pos"
          v-model="pos"
          type="number"
          min="1"
          max="9007199254740992"
          class="form-control mb-2 mr-2"
        >
        <input
          id="getprime"
          type="button"
          name="getprime"
          :value="$t('buttons.calc')"
          class="btn btn-primary mb-2"
          @click="getPrime"
        >
      </div>
      <div class="form-inline">
        <label
          class="form-label col-8 col-md-4 col-lg-3 col-xl-2 mb-2"
          for="pos"
        >{{ $t('mathprime.primepos') }}</label>
        <input
          id="primepos"
          ref="primepos"
          v-model="primepos"
          type="number"
          min="1"
          max="9007199254740992"
          class="form-control mb-2 mr-2"
        >
        <input
          id="getpos"
          type="button"
          name="getpos"
          :value="$t('buttons.calc')"
          class="btn btn-primary mb-2"
          @click="getPos"
        >
      </div>
      <div class="form-inline">
        <label
          class="form-label col-8 col-md-4 col-lg-3 col-xl-2 mb-2"
          for="pos"
        >{{ $t('mathprime.primefact') }}</label>
        <input
          id="primefact"
          ref="primefact"
          v-model="primefact"
          type="number"
          min="1"
          max="9007199254740992"
          class="form-control mb-2 mr-2"
        >
        <input
          id="primefact"
          type="button"
          :value="$t('buttons.calc')"
          class="btn btn-primary mb-2"
          @click="primeFactors"
        >
      </div>
      <p
        v-show="errormsg"
        class="errormsg mb-2"
      >
        {{ errormsg }}
      </p>
      <va-item
        :showitem="true"
        :hidebutton="true"
      >
        <template #header>
          {{ $t('labels.result') }}
        </template>
        <template #content>
          {{ result }}
        </template>
      </va-item>
    </div>
  </div>
</template>

<script>

import VaItem from '@/components/inputs/VaItem.vue'
import * as mathsequences from '@/scripts/mathsequences.js'

export default {
  name: 'MathPrimes',

  components: {
    VaItem,
  },

  data: function () {
    return {
      errormsg: "",
      pos: 1,
      primepos: 1,
      checkprime: 1,
      primefact: 1,
      prime: 2,
      result: "",
      phpurl: window.location.protocol + "//"  + window.location.hostname + "/math/primes.php",
    }
  },

  mounted: function() {
    this.$refs.pos.focus();
  },

  methods: {

    // Decompose in primefactors
    primeFactors: function () {

      // Reset errors
      this.result = "";
      this.errormsg = "";
        
      if (this.checkprime > Number.MAX_SAFE_INTEGER) {

        this.errormsg = this.$t('errors.toobig');

      } else {
        
        let a = mathsequences.primeFactorization (this.primefact);
        this.result = "";
        for (let p of a) this.result += p + " - ";
        this.result = this.result.slice(0, -3)

      }

    },


    // Check prime
    checkPrime: function () {

      // Reset errors
      this.result = this.$t('labels.result');
      this.errormsg = "";
        
      if (this.checkprime > Number.MAX_SAFE_INTEGER) {

        this.errormsg = this.$t('errors.toobig');

      } else {
        
        if (mathsequences.checkprime(this.checkprime)) {
          this.result = this.checkprime + "  " +  this.$t('mathprime.isprime');
        } else {
          this.result = this.checkprime + "  " +  this.$t('mathprime.isnotprime');
        }

      }

    },

    // Get the prime at a given position
    getPrime : function() {

      // Reset errors
      this.result = this.$t('labels.result');
      this.errormsg = "";

      let data = {
        action: "get",
        pos: this.pos
      };

      // Call php script on server
      fetch(this.phpurl, {
          method: 'POST',
          body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
          if (data.prime > 0)
            this.result = this.$t('mathprime.primeatpos') + " " + this.pos + "  " +  this.$t('mathprime.primeis') + " " + data.prime;
          else
            this.result = this.$t('mathprime.primenotfound')
        })
        .catch((error) => {
          console.error('Error ', error);
          this.errormsg = this.$t('errors.generic');
        });
    },

    // Get the position of a given prime
    getPos : function() {

      // Reset errors
      this.result = this.$t('labels.result');
      this.errormsg = "";

      let data = {
        action: "pos",
        prime: this.primepos
      };

      // Call php script on server
      fetch(this.phpurl, {
          method: 'POST',
          body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
          if (data.pos > 0)
            this.result = this.$t('mathprime.posofprime') + " " + this.primepos + "  " +  this.$t('mathprime.primeis') + " " + data.pos;
          else
            this.result = this.primepos + " " + this.$t('mathprime.isnotprime')
        })
        .catch((error) => {
            console.error('Error ', error);
            this.errormsg = this.$t('errors.generic');
        });
    },

  },
}
</script>

<style scoped>
</style>
