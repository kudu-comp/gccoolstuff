<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('palindrome.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('palindrome.long')"
      />
      <div class="row">
        <label
          class="form-label sm-size mb-2"
          for="start"
        >{{ $t('sequences.start') }}</label>
        <input
          id="start"
          ref="start"
          v-model="start"
          type="number"
          class="form-control mb-2 md-size me-2"
        >
        <v-calculate class="sm-size" id="getdec" @calculate="palindromeCounter"></v-calculate>
      </div>
      <p
        v-show="errormsg"
        class="errormsg mb-2"
      >
        {{ errormsg }}
      </p>
      <p class="resultbox" v-if="seq">
        {{ $t('palindrome.t1') }}
        {{ $t('palindrome.res1') }} {{ n }} {{ $t('palindrome.res2') }}<br>
        {{ $t('palindrome.res3') }} : &nbsp;
        {{ seq }}
      </p>
    </div>
  </div>
</template>

<script>
import VCalculate from '@/components/inputs/VCalculate.vue' 

export default {
  name: 'PalindromeCounter',

  components: {
    VCalculate
  },

  data: function () {
    return {
      start: 0,
      n: 0,
      seq: "",
      errormsg: "",
      showitem: true,
      hidebutton: true
    }
  },

  mounted: function() {
    this.$refs.start.focus();
  },

  methods: {
    
    palindromeCounter: function() {

      // Reset error flag
      this.errormsg = "";

      // Set counters and initial reversed number
      let cnt = 0;
      let s1 = this.start.toString();
      let s2 = s1.split("").reverse().join("");
      let sum;
      this.seq = this.start;

      // Stop after 100 iterations and raise error
      while (s1 != s2 && cnt <= 100) {
        sum = parseInt(s1) + parseInt(s2);
        s1 = sum.toString();
        s2 = s1.split("").reverse().join("");
        cnt++;
        this.seq += " - " + sum;
      }

      // Set the counter or show error messages if above 100
      if (cnt > 100) {
        this.errormsg = this.$t('palindrome.toomany');
      } else {
        this.n = cnt;
      }

    },
  },
}
</script>
