<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{$t('mathtools.primes.title')}}
    </div>
    <div class="mainpage">
      <div class="infoblock" v-html="$t('mathtools.primes.long')" />
      <div class="form-inline">
        <label class="form-label col-8 col-md-4 col-lg-3 col-xl-2 mb-2" for="pos">{{$t('mathprime.check')}}</label>
        <input type='number' min="1" max="9007199254740992" id="checkprime" ref="checkprime" v-model="checkprime" class="form-control mb-2 mr-2">
        <input type="button" id="check" name="check" :value="$t('buttons.calc')" class="btn btn-primary mb-2" v-on:click="checkPrime">
      </div>
      <div class="form-inline">
        <label class="form-label col-8 col-md-4 col-lg-3 col-xl-2 mb-2" for="pos">{{$t('mathprime.pos')}}</label>
        <input type='number' min="1" max="9007199254740992" id="pos" ref="pos" v-model="pos" class="form-control mb-2 mr-2">
        <input type="button" id="getprime" name="getprime" :value="$t('buttons.calc')" class="btn btn-primary mb-2" v-on:click="getPrime">
      </div>
      <div class="form-inline">
        <label class="form-label col-8 col-md-4 col-lg-3 col-xl-2 mb-2" for="pos">{{$t('mathprime.primepos')}}</label>
        <input type='number' min="1" max="9007199254740992" id="primepos" ref="primepos" v-model="primepos" class="form-control mb-2 mr-2">
        <input type="button" id="getpos" name="getpos" :value="$t('buttons.calc')" class="btn btn-primary mb-2" v-on:click="getPos">
      </div>
       <div class="form-inline">
        <label class="form-label col-8 col-md-4 col-lg-3 col-xl-2 mb-2" for="pos">{{$t('mathprime.primefact')}}</label>
        <input type='number' min="1" max="9007199254740992" id="primefact" ref="primefact" v-model="primefact" class="form-control mb-2 mr-2">
        <input type="button" id="primefact" :value="$t('buttons.calc')" class="btn btn-primary mb-2" v-on:click="primeFactors">
      </div>
      <p v-show="error" class="errormsg mb-2">{{errormsg}}</p>
      <va-item v-bind:showitem='true' v-bind:hidebutton='true'>
        <template v-slot:header>{{$t('labels.result')}}</template>
        <template v-slot:content>
          {{result}}
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

  props: {
    msg: String
  },

  components: {
    VaItem,
  },

  data: function () {
    return {
      error: false,
      errormsg: "",
      pos: 1,
      primepos: 1,
      checkprime: 1,
      primefact: 1,
      prime: 2,
      result: this.$t('labels.result'),
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
      this.result = this.$t('labels.result');
      this.error = false;
        
      if (this.checkprime > Number.MAX_SAFE_INTEGER) {

        this.error = true;
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
      this.error = false;
        
      if (this.checkprime > Number.MAX_SAFE_INTEGER) {

        this.error = true;
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
      this.error = false;

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
          this.error = true;
          this.errormsg = this.$t('errors.generic');
        });
    },

    // Get the position of a given prime
    getPos : function() {

      // Reset errors
      this.result = this.$t('labels.result');
      this.error = false;

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
            this.error = true;
            this.errormsg = this.$t('errors.generic');
        });
    },

  },
}
</script>

<style scoped>
</style>
