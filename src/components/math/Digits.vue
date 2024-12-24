<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('digits.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('digits.long')"
      />
      <div>
        <span
          class="form-label"
        >{{ $t('digits.sel') }}</span>
        <div class="form-check">
          <input
            id="number1"
            v-model="number"
            type="radio"
            name="number"
            value="pi"
            class="form-check-input"
          >
          <label
            class="form-check-label"
            for="number1"
          >{{ $t('digits.pi') }}</label>
        </div>
        <div class="form-check">
          <input
            id="number2"
            v-model="number"
            type="radio"
            name="number"
            value="e"
            class="form-check-input"
          >
          <label
            class="form-check-label"
            for="number2"
          >{{ $t('digits.e') }}</label>
        </div>
        <div class="form-check">
          <input
            id="number3"
            v-model="number"
            type="radio"
            name="number"
            value="tau"
            class="form-check-input"
          >
          <label
            class="form-check-label"
            for="number3"
          >{{ $t('digits.tau') }}</label>
        </div>
        <div class="form-check">
          <input
            id="number4"
            v-model="number"
            type="radio"
            name="number"
            value="phi"
            class="form-check-input"
          >
          <label
            class="form-check-label"
            for="number4"
          >{{ $t('digits.phi') }}</label>
        </div>
        <div class="form-check">
          <input
            id="number5"
            v-model="number"
            type="radio"
            name="number"
            value="euler"
            class="form-check-input"
          >
          <label
            class="form-check-label"
            for="number5"
          >{{ $t('digits.euler') }}</label>
        </div>
        <div class="form-check">
          <input
            id="number6"
            v-model="number"
            type="radio"
            name="number"
            value="sqrt2"
            class="form-check-input"
          >
          <label
            class="form-check-label"
            for="number6"
          >{{ $t('digits.sq2') }}</label>
        </div>
        <div class="form-check">
          <input
            id="number7"
            v-model="number"
            type="radio"
            name="number"
            value="sqrt3"
            class="form-check-input"
          >
          <label
            class="form-check-label"
            for="number7"
          >{{ $t('digits.sq3') }}</label>
        </div>
        <div class="form-check">
          <input
            id="number8"
            v-model="number"
            type="radio"
            name="number"
            value="zeta3"
            class="form-check-input"
          >
          <label
            class="form-check-label"
            for="number8"
          >{{ $t('digits.zeta3') }}</label>
        </div>
        <div class="form-check">
          <input
            id="number9"
            v-model="number"
            type="radio"
            name="number"
            value="gauss"
            class="form-check-input"
          >
          <label
            class="form-check-label"
            for="number9"
          >{{ $t('digits.gauss') }}</label>
        </div>
        <div class="form-check">
          <input
            id="number10"
            v-model="number"
            type="radio"
            name="number"
            value="lemni"
            class="form-check-input"
          >
          <label
            class="form-check-label"
            for="number10"
          >{{ $t('digits.lemni') }}</label>
        </div>
        <div class="form-check">
          <input
            id="number11"
            v-model="number"
            type="radio"
            name="number"
            value="cat"
            class="form-check-input"
          >
          <label
            class="form-check-label"
            for="number11"
          >{{ $t('digits.cat') }}</label>
        </div>
        <div class="form-check">
          <input
            id="number12"
            v-model="number"
            type="radio"
            name="number12"
            value="champ"
            class="form-check-input"
          >
          <label
            class="form-check-label"
            for="number12"
          >{{ $t('digits.champ') }}</label>
        </div>
      </div>
      <div class="row mt-2">
        <label
          class="form-label md-size mb-2"
          for="start"
        >{{ $t('digits.from') }}</label>
        <input
          id="start"
          v-model="start"
          ref="start"
          type="number"
          min="0"
          max="1000000"
          class="form-control mb-2 md-size"
        >
      </div>
      <div class="row">
        <label
          class="form-label mb-2  md-size"
          for="end"
        >{{ $t('digits.to') }}</label>
        <input
          id="end"
          v-model="end"
          type="number"
          min="0"
          max="1000000"
          class="form-control mb-2  md-size"
          @keyup.enter="getDigits"
        >
      </div>
      <v-calculate id="getdec" @calculate="getDigits"></v-calculate>
      <p
        v-show="errormsg"
        class="errormsg"
      >
        {{ errormsg }}
      </p>
      <div
        v-if="result"
        class="resultbox"
      >
        {{ $t('digits.res1') }} {{ start }} {{ $t('digits.res2') }} {{ end }} {{ $t('digits.res3') }} {{ result }}.
      </div>
    </div>
  </div>
</template>

<script>

import VCalculate from '@/components/inputs/VCalculate.vue' 

export default {
  name: 'MathDigits',

  components: {
    VCalculate
  },

  data: function () {
    return {
      number: "pi",
      start: 1,
      end: 1,
      errormsg: "",
      result: "",
      phpurl: window.location.protocol + "//"  + window.location.hostname + "/math/getdigits.php",
      // squareroots: [2,3,5,6,7,8,10,11,12,13,14,15]
      // <select class="custom-select" v-model="sqrt">
      //   <option v-for="s in squareroots" :key="s" :value="s" width="50px">{{s}}</option>
      // </select>

    }
  },

  mounted: function() {
    this.$refs.start.focus();
  },

  methods: {

    // Get the digits
    getDigits: function() {
      this.errormsg = "";
      
      let data = {
        number: this.number,
        start: this.start,
        end: this.end,
        n: this.n,
      };

      // Call script on server
      fetch(this.phpurl, {
          method: 'POST',
          body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            this.result = data.result;
            // console.log('Success', data)
        })
        .catch((error) => {
            console.error('Error ', error);
            this.errormsg = this.$t('errors.generic');
        });
    },

  },
}
</script>
