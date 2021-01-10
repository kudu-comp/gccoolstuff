<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{$t('mathtools.primegcdlcm.title')}}
    </div>
    <div class="mainpage">
      <div class="infoblock">
        {{$t('dialoggcd.info')}}
      </div>
      <div class="form-inline">
        <label class="form-label col-sm-5 col-md-2 mb-2" for="input">{{$t('dialoggcd.num')}}</label>
        <input type='text' id="input" name="input" ref="input" v-model="input" min="0" class="form-control col-sm-7 col-md-6 mb-2 mr-2" v-on:keyup.enter="getGCDandLCM">
        <input type="button" id="gcdlcm" name="gcdlcm" :value="$t('buttons.calc')" class="col-md-2 btn btn-primary mb-2" v-on:click="getGCDandLCM">
      </div>
      <p v-show="error" class="errormsg mb-2">{{errormsg}}</p>
      <va-item v-bind:showitem='showitem' v-bind:hidebutton='hidebutton'>
        <template v-slot:header>{{$t('dialoggcd.t1')}}</template>
        <template v-slot:content>
          {{$t('dialoggcd.gcd')}} <strong>{{gcd}}</strong>.<br>
          {{$t('dialoggcd.lcm')}} <strong>{{lcm}}</strong>.
        </template>
      </va-item>
      <va-item v-bind:showitem='showitem' v-bind:hidebutton='hidebutton'>
        <template v-slot:header>{{$t('dialoggcd.t2')}}</template>
        <template v-slot:content>
          <table class="table table-sm table-borderless">
            <tr v-for="a in primes" :key="a" :value="a.n"><td>{{a.n}}</td><td>{{a.primes}}</td></tr>
          </table>
        </template>
      </va-item>
    </div>
  </div>
</template>

<script>
import * as mathsequences from '@/scripts/mathsequences.js'
import VaItem from '@/components/inputs/VaItem.vue'

export default {
  name: 'MathGCDandLCM',

  props: {
    msg: String
  },

  components: {
    VaItem,
  },

  data: function () {
    return {
      input: "",
      error: false,
      errormsg: "",
      gcd: 0,
      lcm: 0,
      primes: [],
      showitem: true,
      hidebutton: true
    }
  },

  mounted: function() {
    this.$refs.input.focus();
  },

  methods: {

    // Function to find gcd of array of numbers
    findGCD: function (arr, n) {
      var result = arr[0];

      // Take the GCD of two pairs
      for (let i = 1; i < n; i++)    {
          result = mathsequences.gcd(arr[i], result);
          if(result == 1)
          {
             return 1;
          }
      }
      return result;

    },

    // Find the lowest common multiple
    findLCM: function (arr, n) {

      var result = arr[0];

      // Take the GCD of two pairs
      for (let i = 1; i < n; i++)    {
          result = mathsequences.lcm(arr[i], result);
          if(result == 1)
          {
             return 1;
          }
      }
      return result;

    },

    // Function called when pressing go
    getGCDandLCM: function() {

      // Reset error flag
      this.error = false;

      // Convert input to array of numbers
      var a = this.input.match(/[0-9]+/g);

      // Check for empty input
      if (a === null) {
        this.error = true;
        this.errormsg = this.$t('errors.noinput');
        return;
      }

      // Check for zeroes (GCD is undefined for zero)
      for (let i=0; i < a.length; i++) {
        if (parseInt(a[i]) == 0) {
          this.error = true;
          this.errormsg = this.$t('dialoggcd.inperror');
          return;
        }
      }

      this.gcd = this.findGCD (a, a.length);
      this.lcm = this.findLCM (a, a.length);

      // List prime factors
      this.primes = [];
      for (let i=0; i < a.length; i++) {
        this.primes.push({ n: a[i], primes: mathsequences.primeFactorizationString(parseInt(a[i])) });
      }
    },

  },
}

</script>
