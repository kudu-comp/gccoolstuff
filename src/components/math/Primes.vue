<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('primes.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('primes.long')"
      />
      <div class="row">
        <label
          class="form-label md-size mb-2"
          for="pos"
        >{{ $t('primes.check') }}</label>
        <input
          id="checkprime"
          ref="checkprime"
          v-model="checkprime"
          type="number"
          min="1"
          max="9007199254740992"
          class="form-control md-size mb-2"
        >
        <v-calculate class="ms-2 sm-size" id="opt1" @calculate="checkPrime"></v-calculate>
      </div>
      <div class="row">
        <label
          class="form-label md-size mb-2"
          for="pos"
        >{{ $t('primes.pos') }}</label>
        <input
          id="pos"
          v-model="pos"
          type="number"
          min="1"
          max="9007199254740992"
          class="form-control mb-2 md-size"
        >
        <v-calculate class="ms-2 sm-size" id="opt2" @calculate="getPrime"></v-calculate>
      </div>
      <div class="row">
        <label
          class="form-label md-size mb-2"
          for="pos"
        >{{ $t('primes.primepos') }}</label>
        <input
          id="primepos"
          v-model="primepos"
          type="number"
          min="1"
          max="9007199254740992"
          class="form-control mb-2 md-size"
        >
        <v-calculate class="ms-2 sm-size" id="opt3" @calculate="getPos"></v-calculate>
      </div>
      <div class="row">
        <label
          class="form-label md-size mb-2"
          for="pos"
        >{{ $t('primes.primefact') }}</label>
        <input
          id="primefact"
          ref="primefact"
          v-model="primefact"
          type="number"
          min="1"
          max="9007199254740992"
          class="form-control mb-2 md-size"
        >
        <v-calculate class="ms-2 sm-size" id="opt4" @calculate="primeFactors"></v-calculate>
      </div>
      <p
        v-show="errormsg"
        class="errormsg mb-2"
      >
        {{ errormsg }}
      </p>
      <p class="resultbox" v-if="result">
        {{ result }}
      </p>
    </div>
  </div>
</template>

<script>
import * as mathtools from '@/scripts/mathtools.js'
import VCalculate from '@/components/inputs/VCalculate.vue'

export default {
  name: 'MathPrimes',

  components: {
    VCalculate
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
    this.$refs.checkprime.focus();
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
        
        let a = mathtools.primeFactorization (this.primefact);
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
        
        if (mathtools.checkprime(this.checkprime)) {
          this.result = this.checkprime + "  " +  this.$t('primes.isprime');
        } else {
          this.result = this.checkprime + "  " +  this.$t('primes.isnotprime');
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
            this.result = this.$t('primes.primeatpos') + " " + this.pos + "  " +  this.$t('primes.primeis') + " " + data.prime;
          else
            this.result = this.$t('primes.primenotfound')
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
            this.result = this.$t('primes.posofprime') + " " + this.primepos + "  " +  this.$t('primes.primeis') + " " + data.pos;
          else
            this.result = this.primepos + " " + this.$t('primes.isnotprime')
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
