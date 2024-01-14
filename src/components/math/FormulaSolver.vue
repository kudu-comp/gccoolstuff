<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('formulasolver.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('formulasolver.long')"
      />
      <div class="row">
        <label
          class="form-label sm-size mb-2"
          for="formula"
        >{{ $t('formulasolver.formula') }}</label>
        <input
          id="formula"
          v-model="formula"
          ref="formula"
          type="text"
          size="30"
          class="form-control lg-size mb-2"
        >
      </div>
      <div class="row">
        <label
          class="form-label sm-size mb-2"
          for="base"
        >{{ $t('formulasolver.base') }}</label>
        <input
          id="base"
          v-model="base"
          type="number"
          min="2"
          max="16"
          class="form-control md-size mb-2"
        >
        <div class="form-check ms-3">
          <input
            id="unique"
            v-model="unique"
            type="checkbox"
            name="unique"
            class="form-check-input mb-2 mr-2"
          >
          <label
            for="unique"
            class="form-check-label mb-2"
          >{{ $t('formulasolver.unique') }}</label>
        </div>
      </div>
      <v-calculate id="calc" @calculate="solveFormula"></v-calculate>
      <p
        v-show="errormsg"
        class="errormsg mb-2"
      >
        {{ errormsg }}
      </p>
      <div
        v-show="results.length > 0"
        class="mt-2"
      >
        {{ $t('sudoku.thereare') }} {{ results.length }} {{ $t('sudoku.sols') }}
        <div class="row mt-2 mb-2">
          <label
            for="listofresults"
            class="form-label sm-size"
          >{{ $t('sudoku.sols') }}</label>
          <select
            id="listofresults"
            v-model="selectedsolution"
            name="listofresults"
            class="form-control lg-size"
            @change="printSolution"
          >
            <option
              v-for="r in results"
              :key="r"
            >
              {{ result }}
            </option>
          </select>
        </div>
      </div>
      <div
        v-if="result"
        class="resultbox"
      >
        {{ result }}
      </div>
    </div>
  </div>
</template>

<script>

import { evalInfix } from '@/scripts/formulas.js'
import VCalculate from '@/components/inputs/VCalculate.vue'

export default {

  name: 'MathFormula',

  components : {
    VCalculate
  },

  data: function () {
    return {
      formula: "",
      varnames: "",
      base: 10,
      unique: true,
      errormsg: "",
      result: "",
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
        this.errormsg = this.$t('formulasolver.toomanyvars')
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
          this.result = this.$t('formulasolver.nosol');
        }

      } catch(e) {

        this.errormsg = this.$t('formulasolver.exprerror');
        console.log(e);

      }

    },
  },
}
</script>
