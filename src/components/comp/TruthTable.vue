<template>
  <div class="d-flex flex-column mx-4">
    <!-- Section head / page title -->
    <div class="sectionhead">
      {{ $t('truthtable.title') }}
    </div>
    <!-- Main page -->
    <div class="mainpage">
      <!-- Start with info block -->
      <div
        class="infoblock"
        v-html="$t('truthtable.long')"
      />
      <!-- Form fields -->
      <!-- Text input -->
      <div class="row">
        <label for="expr" class="form-label mb-2 md-size">{{$t('truthtable.expr')}}</label>
        <input
          id="expr"
          class="form-control mb-2 lg-size"
          type="text"
          v-model="expr"
          placeholder="e.g.: a and b or c and not d"
        />
      </div>
      <!-- Action buttons -->
      <v-calculate class="mb-2" id="calc" @calculate="calculate()"></v-calculate>
      <!-- Error message -->
      <p
        v-show="errormsg"
        class="errormsg"
      >
        {{ errormsg }}
      </p>
      <div v-if="result" class="resultbox" v-html="result" />
    </div>
  </div>
</template>

<script>

import VCalculate from '@/components/inputs/VCalculate.vue'
import { evaluate } from "mathjs";

export default {

  name: "TruthTable",

  components: {
    VCalculate
  },

  data() {
    return {
      result: "",
      errormsg: "",
      text1: "",
      num1: 0,
      sel1: "0",
      chk1: false,
      msg: ""
    };
  },

  methods: {

    nextOption: function (scope, cnt) {
      if (cnt == this.vararr.length) {
        // We got enough variables now
        let vars = {};
        this.result += "<tr>";

        // Build object with variables for mathjs.evaluate
        // Print all values true or false
        for (let i = 0; i < scope.length; i++) {
          vars[this.vararr[i]] = scope[i];
          this.result += "<td>" + scope[i] + "</td>";
        }

        // Evaluate expression with mathjs and print result
        let result = evaluate(this.cleanexpr, vars);
        this.result += "<td>" + result + "</td></tr>";
      } else {
        // Not enough variables yet
        // Try next var being false
        scope[cnt] = false;
        this.nextOption(scope, cnt + 1);
        // Try next var being true
        scope[cnt] = true;
        this.nextOption(scope, cnt + 1);
      }
    },

    calculate: function () {
      // Reset
      this.result = "";
      this.errormsg = "";
      this.vararr = [];
      this.cleanexpr = this.expr.trim();

      // Check input
      if (this.cleanexpr == "") {
        this.errormsg = this.$t('errors.noinput');
      }
      
      // Replace logical operators with literal versions
      let repls = [
        // Programming
        [/&&/gi, " and "],
        [/\|\|/gi, " or "],
        [/~/gi, " not "],
        // Boolean logic
        [/∧/gi, " and "],
        [/∨/gi, " or "],
        [/¬/gi, " not "],
        // Algabraic
        [/\*/gi, " and "],
        [/\+/gi, " or "],
        [/!/gi, " not "],
      ];
      for (let r of repls) {
        this.cleanexpr = this.cleanexpr.replace(r[0], r[1]);
      }

      // Build the vararr, anything that is not and, xor, or, not is a Variable
      let tmp = this.cleanexpr.matchAll(/\b(\S+)\b/g);
      for (let t of tmp) {
        if (t[0].toUpperCase() === "AND") continue;
        if (t[0].toUpperCase() === "OR") continue;
        if (t[0].toUpperCase() === "NOT") continue;
        if (t[0].toUpperCase() === "XOR") continue;
        this.vararr.push(t[0]);
      }

      let optarr = this.vararr.map((s) => false);

      // Print the table header
      this.result = "<table class='table table-striped'><thead><tr>";
      for (let i = 0; i < this.vararr.length; i++) {
        this.result += "<th scope='col'>" + this.vararr[i] + "</th>";
      }
      this.result += "<th>" + this.expr + "</th></tr></thead>";

      // Try all combinations
      this.nextOption(optarr, 0);

      // Close table
      this.result += "</table>";
    },

  },
};

</script>

<style scoped>
</style>
