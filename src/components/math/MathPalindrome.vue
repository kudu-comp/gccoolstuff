<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{$t('mathtools.palindrome.title')}}
    </div>
    <div class="mainpage">
      <div class="infoblock">
        {{$t('dialogpali.info')}}
      </div>
      <div class="mb-2">

      </div>
      <div class="form-inline">
        <label class="form-label mr-2 mb-2" for="x">Start with</label>
        <input type='number' id="start" name="start" ref="start" v-model="start" class="form-control mb-2 mr-2">
        <input type="button" id="palindrome" name="palindrome" value="Palindrome counter" class="btn btn-primary mb-2" v-on:click="palindromeCounter">
      </div>
      <p v-show="error" class="errormsg mb-2">{{errormsg}}</p>
      <va-item v-bind:showitem='showitem' v-bind:hidebutton='hidebutton'>
        <template v-slot:header>{{$t('dialogpali.t1')}}</template>
        <template v-slot:content>
          {{$t('dialogpali.res1')}} {{n}} {{$t('dialogpali.res2')}}<br>
          {{$t('dialogpali.res3')}} <br>
          {{seq}}
        </template>
      </va-item>
    </div>
  </div>
</template>

<script>
import VaItem from '@/components/inputs/VaItem.vue'

export default {
  name: 'PalindromeCounter',

  props: {
    msg: String
  },

  components: {
    VaItem,
  },

  data: function () {
    return {
      start: 0,
      n: 0,
      seq: "",
      error: false,
      errormsg: "",
      phpurl: window.location.protocol + "//" + window.location.hostname + "/math/palindromecounter.php",
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
      this.error = false;

      // Set counters and initial reversed number
      let cnt = 0;
      let s1 = this.start.toString();
      let s2 = this.start.split("").reverse().join("");
      let n;
      this.seq = this.start;

      // Stop after 100 iterations and raise error
      while (s1 != s2 && cnt <= 100) {
        n = parseInt(s1) + parseInt(s2);
        s1 = n.toString();
        s2 = s1.split("").reverse().join("");
        cnt++
        this.seq += " - " + n;
      }

      // Set the counter or show error messages if above 100
      if (cnt > 100) {
        this.error = true;
        this.errormsg = this.$t('dialogpali.toomany');
      } else {
        this.n = cnt;
      }

    },
  },
}
</script>
