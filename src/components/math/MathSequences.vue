<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{$t('mathtools.sequences.title')}}
    </div>
    <div class="mainpage">
      <div class="infoblock" v-html="$t('mathtools.sequences.long')" />
      <div>
        <label class="form-label" for="number">{{$t('mathseq.sel')}}</label>
        <div class="form-check">
          <input type="radio" id="number3" name="number" value="hail" class="form-check-input" v-model="number">
          <label class="form-check-label" for="number2">{{$t('mathseq.hailstone')}}</label>
        </div>
        <div class="form-check">
          <input type="radio" id="number1" name="number" value="cwy" class="form-check-input" v-model="number">
          <label class="form-check-label" for="number1">{{$t('mathseq.conway')}}</label>
        </div>
        <div class="form-check">
          <input type="radio" id="number2" name="number" value="revcwy" class="form-check-input" v-model="number">
          <label class="form-check-label" for="number1">{{$t('mathseq.revconway')}}</label>
        </div>
        <div class="form-check">
          <input type="radio" id="number7" name="number" value="gol" class="form-check-input" v-model="number">
          <label class="form-check-label" for="number6">{{$t('mathseq.golomb')}}</label>
        </div>
        <div class="form-check">
          <input type="radio" id="number4" name="number" value="niv" class="form-check-input" v-model="number">
          <label class="form-check-label" for="number3">{{$t('mathseq.niven')}}</label>
        </div>
        <div class="form-check">
          <input type="radio" id="number5" name="number" value="abun" class="form-check-input" v-model="number">
          <label class="form-check-label" for="number4">{{$t('mathseq.abundant')}}</label>
        </div>
        <div class="form-check">
          <input type="radio" id="number6" name="number" value="defi" class="form-check-input" v-model="number">
          <label class="form-check-label" for="number5">{{$t('mathseq.deficient')}}</label>
        </div>
      </div>
      <div class="form-inline mt-2">
        <label class="form-label mr-2 mb-2" for="n">{{$t('mathseq.niter')}}</label>
        <input type='number' id="n" ref="n" v-model="n" min="0" max="1000000" class="form-control mr-2 mb-2">
        <label class="form-label mr-2 mb-2" for="start">{{$t('mathseq.start')}}</label>
        <input type='number' id="start" v-model="start" min="0" max="1000000" class="form-control mr-2 mb-2" v-show="number == 'hail' || number == 'cwy' || number == 'revcwy'" v-on:keyup.enter="sequence">
        <input type="button" id="product" name="product" :value="$t('buttons.calc')" class="btn btn-primary mb-2" v-on:click="sequence">
      </div>
      <p v-show="errormsg" class="errormsg mb-2">{{errormsg}}.</p>
      <div class="card card-text p-2">
        <div class="monospace">
          <p>{{$t('mathseq.res1')}} {{n}}: {{result}}.</p>
          <p>{{$t('mathseq.res2')}} {{seq}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import * as mathsequences from '@/scripts/mathsequences.js'

export default {
  name: 'MathSequences',

  props: {
    msg: String
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
