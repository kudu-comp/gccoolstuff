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
      <div class="form-label mb-2">
        {{ $t('sequences.sel') }}
      </div>
      <div v-for="s in seqs">
        <div class="form-check">
          <input
            v-model="number"
            type="radio"
            :value="s.ref"
            class="form-check-input"
          >
          <label
            class="form-check-label"
          >{{ $t('sequences.'+s.ref) }}</label>
        </div>
      </div>
      <div 
        class="row"
        v-show="['hailstone', 'conway', 'revconway','kaprekar', 'palindrome'].indexOf(number) >= 0"
      >
        <label
          class="form-label md-size mt-2 mb-2"
          for="start"
        >{{ $t('sequences.start') }}</label>
        <input
          id="start"
          v-model="start"
          type="number"
          min="0"
          max="1000000"
          class="form-control md-size mt-2 mb-2"
        >
      </div>
      <div>
        <div class="form-label mb-2">
            {{ $t('sequences.stop') }}
        </div>
        <div class="form-check">
          <input
            id="stop1"
            v-model="stop"
            type="radio"
            value="stopiter"
            class="form-check-input"
          >
          <label
            class="form-check-label"
            for="stop1"
          >{{ $t('sequences.stopiter') }}</label>
        </div>
        <div class="form-check">
          <input
            id="stop3"
            v-model="stop"
            type="radio"
            value="stopat"
            class="form-check-input"
          >
          <label
            class="form-check-label"
            for="stop3"
          >{{ $t('sequences.stopat') }}</label>
        </div>
        <div class="form-check">
          <input
            id="stop2"
            v-model="stop"
            type="radio"
            value="stopend"
            class="form-check-input"
            :disabled="['hailstone','kaprekar','palindrome'].indexOf(number) < 0"
          >
          <label
            class="form-check-label"
            for="stop2"
          >{{ $t('sequences.stopend') }}</label>
        </div>
        <div class="row mt-2" v-show="stop === 'stopiter'">
          <label
            class="form-label md-size mb-2"
            for="niter"
          >{{ $t('sequences.niter') }}</label>
          <input
            id="niter"
            ref="niter"
            v-model="niter"
            type="number"
            min="0"
            max="1000000"
            class="form-control md-size mb-2"
          >
        </div>
        <div class="row mt-2" v-show="stop === 'stopat'">
          <label
            class="form-label md-size mb-2"
            for="n"
          >{{ $t('sequences.endat') }}</label>
          <input
            id="endat"
            v-model="endat"
            type="number"
            min="0"
            max="1000000"
            class="form-control md-size mb-2"
          >
        </div>
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
        <p>{{ $t('sequences.res1') }} {{ cntiter }}: {{ result }}.</p>
        <p>{{ $t('sequences.res2') }} </p>
        <div v-html="seq"></div>
      </div>
    </div>
  </div>
</template>

<script>

import * as mathtools from '@/scripts/mathtools.js'
import VCalculate from '../inputs/VCalculate.vue';

export default {
  name: 'mathtools',

  components : {
    VCalculate
  },

  mounted: function() {
    this.$refs.niter.focus();
    this.seqs = mathtools.sequences;
    console.log(this.seqs)
    if (this.$route.params.seq) {
      this.number = this.$route.params.seq;
    }  
  },
  
  data: function () {
    return {
      number: 'hailstone',
      niter: 1,
      start: 1,
      result: 0,
      seq: "",
      errormsg: "",
      stop: "stopiter",
      endat: 0,
      cntiter: 0,
      seqs: []
    }
  },

  methods: {
    sequence: function() {

      let seq = null;
      this.errormsg = "";
      this.result = "";
      if (this.stop === "stopat") this.niter = 0;
      if (this.stop === "stopiter") this.endat = 0;
      if (this.stop === "stopend") {
        this.count = 0;
        this.endat = 0;
      }

      try {

        switch (this.number) {
          case 'hailstone' :
            seq = mathtools.hailstone (this.start, this.niter, this.endat, this.stop === "stopend");
            break;
          case "golomb" :
            seq = mathtools.golomb (this.niter, this.endat);
            break;
          case "abundant" :
            seq = mathtools.abundant (this.niter, this.endat);
            break;
          case "deficient" :
            seq = mathtools.deficient (this.niter, this.endat);
            break;
          case "conway" :
            if (this.n > 50) {
              this.errormsg = this.$t('sequences.maxconway');
              return;
            }
            seq = mathtools.conway (this.start, this.niter, this.endat);
            break;
          case "revconway" :
            if (this.n > 50) {
              this.errormsg = this.$t('sequences.maxconway');
              return;
            }
            seq = mathtools.revconway (this.start, this.niter, this.endat);
            break;
          case "niven" :
            seq = mathtools.niven (this.niter, this.endat);
            break;
          case "kaprekar" :
            seq = mathtools.kaprekar (this.start, this.niter, this.endat, this.stop === "stopend");
            break;
          case "palindrome" :
            seq = mathtools.palindrome (this.start, this.niter, this.endat, this.stop === "stopend");
            break;      
        }

        this.cntiter = seq.cnt;
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
