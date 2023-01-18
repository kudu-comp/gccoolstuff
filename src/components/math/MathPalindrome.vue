<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('mathtools.palindrome.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('mathtools.palindrome.long')"
      />
      <div class="form-inline">
        <label
          class="form-label mr-2 mb-2"
          for="x"
        >{{ $t('dialogseq.start') }}</label>
        <input
          id="start"
          ref="start"
          v-model="start"
          type="number"
          name="start"
          class="form-control mb-2 mr-2"
        >
        <input
          id="palindrome"
          type="button"
          name="palindrome"
          :value="$t('buttons.calc')"
          class="btn btn-primary mb-2"
          @click="palindromeCounter"
        >
      </div>
      <p
        v-show="errormsg"
        class="errormsg mb-2"
      >
        {{ errormsg }}
      </p>
      <va-item
        :showitem="showitem"
        :hidebutton="hidebutton"
      >
        <template #header>
          {{ $t('mathpali.t1') }}
        </template>
        <template #content>
          {{ $t('mathpali.res1') }} {{ n }} {{ $t('mathpali.res2') }}<br>
          {{ $t('mathpali.res3') }} <br>
          {{ seq }}
        </template>
      </va-item>
    </div>
  </div>
</template>

<script>
import VaItem from '@/components/inputs/VaItem.vue'

export default {
  name: 'PalindromeCounter',

  components: {
    VaItem,
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
        this.errormsg = this.$t('mathpali.toomany');
      } else {
        this.n = cnt;
      }

    },
  },
}
</script>
