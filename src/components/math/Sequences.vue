<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('sequences.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('sequences.long')"
      />
      <div>
        <span class="form-label">{{ $t('sequences.sel') }}</span>
        <div class="form-check">
          <input
            id="number3"
            v-model="number"
            type="radio"
            name="number"
            value="hail"
            class="form-check-input"
          >
          <label
            class="form-check-label"
            for="number2"
          >{{ $t('sequences.hailstone') }}</label>
        </div>
        <div class="form-check">
          <input
            id="number1"
            v-model="number"
            type="radio"
            name="number"
            value="cwy"
            class="form-check-input"
          >
          <label
            class="form-check-label"
            for="number1"
          >{{ $t('sequences.conway') }}</label>
        </div>
        <div class="form-check">
          <input
            id="number2"
            v-model="number"
            type="radio"
            name="number"
            value="revcwy"
            class="form-check-input"
          >
          <label
            class="form-check-label"
            for="number1"
          >{{ $t('sequences.revconway') }}</label>
        </div>
        <div class="form-check">
          <input
            id="number7"
            v-model="number"
            type="radio"
            name="number"
            value="gol"
            class="form-check-input"
          >
          <label
            class="form-check-label"
            for="number6"
          >{{ $t('sequences.golomb') }}</label>
        </div>
        <div class="form-check">
          <input
            id="number4"
            v-model="number"
            type="radio"
            name="number"
            value="niv"
            class="form-check-input"
          >
          <label
            class="form-check-label"
            for="number3"
          >{{ $t('sequences.niven') }}</label>
        </div>
        <div class="form-check">
          <input
            id="number5"
            v-model="number"
            type="radio"
            name="number"
            value="abun"
            class="form-check-input"
          >
          <label
            class="form-check-label"
            for="number4"
          >{{ $t('sequences.abundant') }}</label>
        </div>
        <div class="form-check">
          <input
            id="number6"
            v-model="number"
            type="radio"
            name="number"
            value="defi"
            class="form-check-input"
          >
          <label
            class="form-check-label"
            for="number5"
          >{{ $t('sequences.deficient') }}</label>
        </div>
      </div>
      <div class="row mt-2">
        <label
          class="form-label md-size mb-2"
          for="n"
        >{{ $t('sequences.niter') }}</label>
        <input
          id="n"
          v-model="n"
          type="number"
          min="0"
          max="1000000"
          class="form-control md-size mb-2"
        >
      </div>
      <div 
        class="row"
        v-show="number == 'hail' || number == 'cwy' || number == 'revcwy'"
      >
        <label
          class="form-label md-size mb-2"
          for="start"
        >{{ $t('sequences.start') }}</label>
        <input
          id="start"
          v-model="start"
          type="number"
          min="0"
          max="1000000"
          class="form-control md-size mb-2"
        >
      </div>
      <v-calculate @calculate="sequence"/>
      <p
        v-show="errormsg"
        class="errormsg mb-2"
      >
        {{ errormsg }}.
      </p>
      <div
        v-if="result"
        class="resultbox monospace"
      >
        <p>{{ $t('sequences.res1') }} {{ n }}: {{ result }}.</p>
        <p>{{ $t('sequences.res2') }} {{ seq }}</p>
      </div>
    </div>
  </div>
</template>

<script>

import * as mathsequences from '@/scripts/mathsequences.js'
import VCalculate from '../inputs/VCalculate.vue';

export default {
  name: 'MathSequences',

  components : {
    VCalculate
  },

  data: function () {
    return {
      number: 'hail',
      n: 1,
      start: 1,
      result: 0,
      seq: "",
      errormsg: "",
    }
  },

  methods: {
    sequence: function() {

      let seq = null;
      this.errormsg = "";
      this.result = "";

      try {

        switch (this.number) {
          case 'hail' :
            seq = mathsequences.hailstone (this.start, this.n);
            break;
          case "gol" :
            seq = mathsequences.golomb (this.n);
            break;
          case "abun" :
            seq = mathsequences.abundant (this.n);
            break;
          case "defi" :
            seq = mathsequences.deficient (this.n);
            break;
          case "cwy" :
            if (this.n > 50) {
              this.errormsg = this.$t('sequences.maxconway');
              return;
            }
            seq = mathsequences.conway (this.start, this.n);
            break;
          case "revcwy" :
            if (this.n > 50) {
              this.errormsg = this.$t('sequences.maxconway');
              return;
            }
            seq = mathsequences.revconway (this.start, this.n);
            break;
          case "niv" :
            seq = mathsequences.niven (this.n);
            break;
        }
        this.result = seq.n;
        this.seq = seq.seq;
        
      } catch (error) {

          console.error('Error ', error);
          this.errormsg = this.$t('errors.generic');

      }
      
    },
  },
}
</script>

<style scoped>

.monospace {
  font-family: "Lucida Console", Courier, monospace;
}

</style>
