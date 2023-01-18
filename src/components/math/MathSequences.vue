<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('mathtools.sequences.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('mathtools.sequences.long')"
      />
      <div>
        <label
          class="form-label"
          for="number"
        >{{ $t('mathseq.sel') }}</label>
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
          >{{ $t('mathseq.hailstone') }}</label>
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
          >{{ $t('mathseq.conway') }}</label>
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
          >{{ $t('mathseq.revconway') }}</label>
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
          >{{ $t('mathseq.golomb') }}</label>
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
          >{{ $t('mathseq.niven') }}</label>
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
          >{{ $t('mathseq.abundant') }}</label>
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
          >{{ $t('mathseq.deficient') }}</label>
        </div>
      </div>
      <div class="form-inline mt-2">
        <label
          class="form-label mr-2 mb-2"
          for="n"
        >{{ $t('mathseq.niter') }}</label>
        <input
          id="n"
          ref="n"
          v-model="n"
          type="number"
          min="0"
          max="1000000"
          class="form-control mr-2 mb-2"
        >
        <label
          class="form-label mr-2 mb-2"
          for="start"
        >{{ $t('mathseq.start') }}</label>
        <input
          v-show="number == 'hail' || number == 'cwy' || number == 'revcwy'"
          id="start"
          v-model="start"
          type="number"
          min="0"
          max="1000000"
          class="form-control mr-2 mb-2"
          @keyup.enter="sequence"
        >
        <input
          id="product"
          type="button"
          name="product"
          :value="$t('buttons.calc')"
          class="btn btn-primary mb-2"
          @click="sequence"
        >
      </div>
      <p
        v-show="errormsg"
        class="errormsg mb-2"
      >
        {{ errormsg }}.
      </p>
      <div
        v-if="result"
        class="resultbox"
      >
        <div class="monospace">
          <p>{{ $t('mathseq.res1') }} {{ n }}: {{ result }}.</p>
          <p>{{ $t('mathseq.res2') }} {{ seq }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import * as mathsequences from '@/scripts/mathsequences.js'

export default {
  name: 'MathSequences',

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

  mounted: function() {
    // Set input focus
    this.$refs.n.focus();
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
            seq = mathsequences.conway (this.start, this.n);
            break;
          case "revcwy" :
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
