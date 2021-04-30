<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{$t('comptools.compbrainfuck.title')}}
    </div>
    <div class="mainpage">
      <div class="infoblock" v-html="$t('comptools.compbrainfuck.long')" />
      <div class="form-inline">
        <label class="form-label mb-2 mr-2" for="bfvar">{{$t('compbf.vars')}}</label>
        <select id="bfvar" class="custom-select mb-2 mr-2" style="width: 150px;" v-model='selBF'>
          <option v-for="(bfvar, index) in bfvars" :key="index" :value="index">{{bfvar}}</option>
        </select>
        <div class="custom-control custom-checkbox">
          <input type="checkbox" name="shorthand" id="shorthand" v-model="shorthand" class="custom-control-input mr-2 mb-2">
          <label for="shorthand" class="custom-control-label mb-2">{{$t('compbf.shorthand')}}</label>
        </div>
      </div>
      <div class="form-row mb-2">
        <textarea id="code" name="code" class="form-control" ref="code" :placeholder="$t('compbf.code')" rows=10 v-model='message'></textarea>
      </div>
      <div class="form-inline mb-2">
        <label class="form-label mr-2" for="input">{{$t('compbf.input')}}</label>
        <input type="text" id="input" name="input" class="form-control" size="40" ref="input" rows=10 v-model='input'>
      </div>
      <div class="form-inline">
        <input type="button" id="run" name="run" :value="$t('compbf.run')" class="btn btn-primary mb-2 mr-2" v-on:click="runBrainfuck">
      </div>
      <p v-show="error" class="errormsg mt-2">{{errormsg}}</p>
      <div class="card card-text p-2">{{result}}</div>
    </div>
  </div>
</template>

<script>
import * as bf from '@/scripts/brainfuck.js'

export default {

  name: 'CompBrainfuck',

  props: {
    msg: String,
  },

  data: function () {
    return {
      message: "",
      result : this.$t('labels.result'),
      selBF : 0,
      input: "",
      shorthand: false,
      bfvars: [],
      fill: "",
      error: false,
      errormsg: "",
      showinfo: true,
    }
  },

  mounted: function() {
    this.$refs.code.focus();
    this.bfvars = bf.vars;
  },

  methods: {

    // Translate the input
    runBrainfuck : function () {

      // Reset error flag
      this.error = false;
      let bfcode = "";

      try {
        
        // Run preprocessor if not plain brainfuck
        // Preprocessor removes comments (any character not brainfuck)
        // Preprocessor translates Trivial Brainfuck Substitutes to standard Brainfuck
        bfcode = bf.preprocess(this.message, this.selBF);
        
        // If shorthand is used expand before running the code
        if (this.shorthand) bfcode = bf.extendshorthand(bfcode)
        
        // Run the code
        this.result = bf.run(bfcode, this.input);

      } catch (e) {

        this.error = true;
        this.errormsg = this.$t('errors.genericerror');
        console.log(e);

      }
    },

  },
}
</script>

<style scoped>
</style>
