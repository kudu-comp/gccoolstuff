<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('numberprop.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('numberprop.long')"
      />
      <div class="row">
        <label
          class="form-label sm-size mb-2"
          for="n"
        >{{ $t('numberprop.num') }}</label>
        <input
          id="n"
          ref="n"
          v-model="n"
          type="number"
          min="1"
          max="1000000000"
          class="form-control md-size mb-2 me-2"
          @keyup.enter="getProperties"
        >
        <v-calculate class="sm-size" @calculate = "getProperties" :disabled="working"></v-calculate>
        <div v-if="working" class="spinner-border ms-2" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <p
        v-show="errormsg"
        class="errormsg mb-2"
      >
        {{ errormsg }}
      </p>
      <h4>
        {{ $t('numberprop.t1') }}
      </h4>
      <table>
        <tr v-for="p in props" :key="p.ref">
          <td v-if="p.ref">
            <div v-show="p.value">
              &#x2713;
            </div><div v-show="!p.value">
              &#x2717;
            </div>
          </td>
          <td v-if="p.ref">{{ $t('numberprop.' + p.ref) }}</td>
          <td v-if="p.txt" colspan="2"><h6>{{ $t('numberprop.' + p.txt) }}</h6></td>
        </tr>          
      </table>
    </div>
  </div>
</template>

<script>

import VCalculate from '@/components/inputs/VCalculate.vue';
import * as mathtools from '../../scripts/mathtools';

export default {
  name: 'MathProperties',

  components: {
    VCalculate
  },

  data: function () {
    return {
      n: 0,
      result: 0,
      working: false,
      props : [
        { txt: "oddoreven"},
        { ref: "even", func: function(n) { return n % 2 === 0; }, value: false},
        { ref: "odd",  func: function(n) { return n % 2 === 1; }, value: false},
        // Prime related properties
        { txt: "primerel"},
        { ref: "prime",func: function(n) { return mathtools.checkprime(n); }, value: false},
        { ref: "comp",func: function(n) { return !mathtools.checkprime(n); }, value: false},
        { ref: "bi",func: function(n) { return mathtools.isbiprime(n); }, value: false},
        // Properties related to divisors
        { txt: "divrel"},
        { ref: "abun", func: function(n) { return mathtools.isabundant(n); }, value: false},
        { ref: "perfect", func: function(n) { return mathtools.isperfect(n); }, value: false},
        { ref: "defi",  func: function(n) { return mathtools.isdeficient(n); }, value: false},
        { ref: "pow", func: function(n) { return mathtools.ispowerful(n); }, value: false},
        { ref: "sqfree", func: function(n) { return mathtools.issquarefree(n); }, value: false},
        // Properties related to 2D shapes or polygonal numbers
        { txt: "polygonal"},
        { ref: "tri", func: function(n) { return mathtools.istriangular(n); }, value: false},
        { ref: "squa", func: function(n) { return mathtools.issquare(n); }, value: false},
        { ref: "penta", func: function(n) { return mathtools.ispentagonal(n); }, value: false},
        { ref: "hexa", func: function(n) { return mathtools.ishexagonal(n); }, value: false},
        { ref: "hepta", func: function(n) { return mathtools.isheptagonal(n); }, value: false},
        { ref: "octa", func: function(n) { return mathtools.isoctagonal(n); }, value: false},
        { ref: "nona", func: function(n) { return mathtools.isnonagonal(n); }, value: false},
        { ref: "deca", func: function(n) { return mathtools.isdecagonal(n); }, value: false},
        { ref: "star", func: function(n) { return mathtools.isstar(n); }, value: false},
        // Properties related to binary form
        { txt: "binrel"},
        { ref: "evil", func: function(n) { return mathtools.isevil(n); }, value: false},
        { ref: "odious", func: function(n) { return mathtools.isodious(n); }, value: false},
        // Properties related to 3D shapes or polyhedral nunbers
        { txt: "polyhedral"},
        { ref: "tethed", func: function(n) { return mathtools.istetrahedral(n); }, value: false},
        { ref: "sqpyr", func: function(n) { return mathtools.issquarepyramidal(n); }, value: false},
        { ref: "cube", func: function(n) { return mathtools.iscube(n); }, value: false},
        // Various other properties 
        { txt: "others"},
        { ref: "fib", func: function(n) { return mathtools.isfibonacci(n); }, value: false},
        { ref: "pal", func: function(n) { return mathtools.ispalindrome(n); }, value: false},
        { ref: "narc", func: function(n) { return mathtools.isnarcistic(n); }, value: false},
        { ref: "niven", func: function(n) { return mathtools.isniven(n); }, value: false},
        { ref: "kap", func: function(n) { return mathtools.iskaprekar(n); }, value: false},
        { ref: "lucky", func: function(n) { return mathtools.islucky(n); }, value: false},
        { ref: "happ", func: function(n) { return mathtools.ishappy(n); }, value: false},
        { ref: "asp", func: function(n) { return mathtools.isaspiring(n); }, value: false},
      ],
      errormsg: ""
    }
  },

  mounted: function() {
    this.$refs.n.focus();
  },

  methods: {

    getProperties: function() {

      // Reset error
      this.errormsg = "";
      this.working = true

      // Check if n is too big
      if (this.n > 1000000000) {
          this.errormsg = this.$t('numberprop.toobig');
          return;
      }

      // Update all properties
      for (let p of this.props) {
        if (p.ref) p.value = p.func(this.n);
      }
      this.working = false;

      
    },
  },
}
</script>

