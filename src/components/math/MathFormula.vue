<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{$t('mathtools.formulasolver.title')}}
    </div>
    <div class="mainpage">
      <div class="infoblock" v-html="$t('mathtools.formulasolver.long')"></div>
      <div class="form-inline">
        <label class="form-label mr-2 mb-2" for="x">{{$t('mathcrypta.formula')}}</label>
        <input type="text" size="30" id="formula" name="formula" ref="formula" v-model="formula" class="form-control mb-2">
      </div>
      <div class="form-inline">
        <input type="button" id="calc" name="calc" :value="$t('buttons.calc')" class="btn btn-primary mb-2 mr-2" v-on:click="solveFormula">
        <label class="form-label mr-2 mb-2" for="base">{{$t('mathcrypta.base')}}</label>
        <input type="number" min="2" max="16" id="base" name="base" v-model="base" class="form-control mb-2 mr-2">
        <div class="custom-control custom-checkbox">
          <input type="checkbox" name="unique" id="unique" v-model="unique" class="custom-control-input mb-2 mr-2">
          <label for="unique" class="custom-control-label mb-2">{{$t('mathcrypta.unique')}}</label>
        </div>
      </div>
      <p v-show="errormsg" class="errormsg mb-2">{{errormsg}}</p>
      <div class="mt-2" v-show="results.length > 0">
        {{$t('sudoku.thereare')}} {{results.length}} {{$t('sudoku.sols')}}
        <div class="form-inline mt-2 mb-2">
          <label for="listofresults" class="form-label mr-2">{{$t('sudoku.sols')}}</label>
          <select name="listofresults" id="listofresults" class="form-control" v-model="selectedsolution" @change="printSolution">
            <option v-for="result in results" :key="result">{{result}}</option>
          </select>
        </div>
      </div>
      <div class="card card-text p-2">
        {{result}}
      </div>
    </div>
  </div>
</template>

<script>

import { evalInfix } from '@/scripts/formulas.js'

export default {

  name: 'FormulaSolver',

  props: {
    msg: String
  },

  data: function () {
    return {
      formula: "",
      varnames: "",
      base: 10,
      unique: true,
      errormsg: "",
      result: this.$t('labels.result'),
      results: [],
      selectedsolution: ""
    }
  },

  mounted: function() {
    this.$refs.formula.focus();
  },

  methods: {

    // Testers
    // 1. THIS + IS + TOO = FUNNY
    // 2. HOW + SWEET + COFFEE = TASTES
    // 3. CHECK + THE = TIRES

    printSolution: function () {
      
      // Print solution selected from the dropdown
      this.result = "";
      let sol = [...this.selectedsolution];
      for (let i=0; i < this.varnames.length; i++) {
        this.result += this.varnames[i] + "=" + "0123456789abcdef".indexOf(sol[i]) + " | ";
      }

      // Print the formula
      let ucform = this.formula.toUpperCase();

      // Replace variables with values
      for (let i=0; i < this.varnames.length; i++) {
        ucform = ucform.replaceAll(this.varnames[i], sol[i]);
      }
      this.result += ucform;

    },

    checkSolution: function check (vars) {

      let ucform = this.formula.toUpperCase();

      // Replace variables with values
      for (let v = 0; v < vars.length; v++) {
        ucform = ucform.replaceAll(this.varnames[v], vars[v]);
      }

      // Evaluate formula
      // Get left and right hand side of the formula

      let sides = ucform.match(/[^=]+/g);
      const lefthand = sides[0];
      const righthand = sides[1];

      return evalInfix(lefthand) == evalInfix(righthand);

    },

    genVars: function gen (depth, vars, uniq, base, res, check) {

      const digit = "0123456789abcdef";

      // While there are still numbers to generate
      if (depth < vars.length) {
      
        for (let v=0; v < base; v++) {

          if (uniq && vars.indexOf(digit[v]) >= 0) continue;
          vars[depth] = digit[v];
          gen(depth + 1, vars, uniq, base, res, check);
          vars[depth] = "";

        }

      } else {

        if (check(vars)) {
          res.push(vars.join(""));
        }

      }

    },

    solveFormula: function() {

      // Reset everything
      this.result = "";
      this.errormsg = "";
      this.results = [];
      this.varnames = [];

      // Find unknown in formula
      for (let c of this.formula.toUpperCase()) {
        if (this.varnames.indexOf(c) < 0 && "ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(c.toUpperCase()) >= 0 ) this.varnames += c
      }
    
      if (this.varnames.length > this.base) {
        this.errormsg = this.$t('mathcrypta.toomanyvars')
      }

      // Generate candidates
      try {

        // Create an array with var names (will be replaced with values)
        let vars = [...this.varnames];
        this.genVars(0, vars, this.unique, this.base, this.results, this.checkSolution);

        if (this.results.length > 0) {
          this.selectedsolution = this.results[0];
          this.printSolution();
        } else {
          this.result = this.$t('mathcrypta.nosol');
        }

      } catch(e) {

        this.errormsg = this.$t('mathcrypta.exprerror');
        console.log(e);

      }

    },
  },
}
</script>
