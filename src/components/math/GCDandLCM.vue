<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('gcdandlcm.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('gcdandlcm.long')"
      />
      <div class="row">
        <label
          class="form-label sm-size mb-2"
          for="input"
        >{{ $t('gcdandlcm.num') }}</label>
        <input
          id="input"
          v-model="input"
          type="text"
          ref="input"
          min="0"
          class="form-control md-size me-2 mb-2"
          @keyup.enter="getGCDandLCM"
        >
        <v-calculate id="getdec" class="sm-size mb-2" @calculate="getGCDandLCM"></v-calculate>
      </div>
      <p
        v-show="errormsg"
        class="errormsg mb-2"
      >
        {{ errormsg }}
      </p>
      <p class="resultbox">
        {{ $t('gcdandlcm.t1') }} <br>
        {{ $t('gcdandlcm.gcd') }} <strong>{{ gcd }}</strong>.<br>
        {{ $t('gcdandlcm.lcm') }} <strong>{{ lcm }}</strong>.
      </p>
      <p class="resultbox">
        {{ $t('gcdandlcm.t2') }}
        <table class="table table-sm table-borderless">
          <tr
            v-for="a in primes"
            :key="a"
            :value="a.n"
          >
            <td>{{ a.n }}</td><td>{{ a.primes }}</td>
          </tr>
        </table>
      </p>
    </div>
  </div>
</template>

<script>
import * as mathtools from '@/scripts/mathtools.js'
import VCalculate from '@/components/inputs/VCalculate.vue'

export default {
  name: 'MathGCDandLCM',

  components: {
    VCalculate
  },

  data: function () {
    return {
      input: "",
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
      let result = arr[0];

      // Take the GCD of two pairs
      for (let i = 1; i < n; i++)    {
          result = mathtools.gcd(arr[i], result);
          if(result == 1)
          {
             return 1;
          }
      }
      return result;

    },

    // Find the lowest common multiple
    findLCM: function (arr, n) {

      let result = arr[0];

      // Take the GCD of two pairs
      for (let i = 1; i < n; i++)    {
          result = mathtools.lcm(arr[i], result);
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
      this.errormsg = "";

      // Convert input to array of numbers
      let a = this.input.match(/[0-9]+/g);

      // Check for empty input
      if (a === null) {
        this.errormsg = this.$t('errors.noinput');
        return;
      }

      // Check for zeroes (GCD is undefined for zero)
      for (let i=0; i < a.length; i++) {
        if (parseInt(a[i]) == 0) {
          this.errormsg = this.$t('gcdandlcm.inperror');
          return;
        }
      }

      // Get GCD and LCM
      this.gcd = this.findGCD (a, a.length);
      this.lcm = this.findLCM (a, a.length);

      // List prime factors
      this.primes = [];
      for (let i=0; i < a.length; i++) {
        this.primes.push({ n: a[i], primes: mathtools.primeFactorizationString(parseInt(a[i])) });
      }
    },

  },
}

</script>
