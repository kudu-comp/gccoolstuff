<template>
  <div class="d-flex flex-column mx-4">
    <!-- Section head / page title -->
    <div class="sectionhead">
      {{ $t('equations.title') }}
    </div>
    <!-- Main page -->
    <div class="mainpage">
      <!-- Start with info block -->
      <div
        class="infoblock"
        v-html="$t('equations.long')"
      />
      <!-- Form fields -->
      <div class="row">
        <label for="size" class="form-label sm-size mb-2"
          >{{$t('equations.numvar')}}</label
        >
        <input
          id="size"
          ref="size"
          type="number"
          max="26"
          v-model="size"
          class="form-control sm-size mb-2"
          min="1"
          @change="changeSize()"
        />
      </div>
      <!-- Insert table here -->
      <table id="eqs" />
      <!-- Select output format -->
      <label class="form-label">{{$t('equations.output')}}</label>
      <div>
        <div class="form-check form-check-inline">
          <input
            id="format1"
            v-model="format"
            type="radio"
            value="1"
            class="form-check-input mb-2"
          />
          <label class="form-check-label mb-2" for="number1">{{$t('equations.fractions')}}</label>
        </div>
        <div class="form-check form-check-inline">
          <input
            id="format2"
            v-model="format"
            type="radio"
            value="2"
            class="form-check-input mb-2"
          />
          <label class="form-check-label mb-2" for="number1">{{$t('equations.decimals')}}</label>
        </div>
      </div>
      <!-- Action buttons -->
      <v-calculate class="mb-2" id="calc" @calculate="solve()"></v-calculate>
      <!-- Error message -->
      <p
        v-show="errormsg"
        class="errormsg"
      >
        {{ errormsg }}
      </p>
      <!-- Result area or use v-html -->
      <div v-if="result" class="resultbox" >
        {{ result }} 
      </div>
    </div>
  </div>
</template>

<script>

import VCalculate from '@/components/inputs/VCalculate.vue' 
import { fraction, lusolve, format, floor, subtract, isZero } from "mathjs";

export default {

  name: "Equations",

  components: {
    VCalculate
  },

  data() {
    return {
      size: 2,
      oldsize: 2,
      result: "",
      format: "1",
      varname: "xyzabcdefghijklmnopqrstuvw",
      result: "",
      errormsg: ""
    };
  },

  // Generate the table when mounted
  mounted: function () {
    this.generateTable();
    this.$refs.size.focus();
  },

  methods: {

    // Dynamically generate the HTML table for the equations
    generateTable() {
      let tableElement = document.getElementById("eqs");
      for (let r = 1; r <= this.size; r++) {
        let newRow = document.createElement("tr");
        newRow.id = "eqs-" + r;
        tableElement.appendChild(newRow);
        for (let c = 1; c <= this.size; c++) {
          let newCell = document.createElement("td");
          newRow.appendChild(newCell);
          let newInput = document.createElement("input");
          newInput.type = "text";
          newInput.id = "eqs-" + r + "-" + c;
          newInput.size = 1;
          newInput.setAttribute("class", "form-control mb-2");
          newCell.appendChild(newInput);
          let newLabel = document.createElement("td");
          newLabel.style = "padding: 0px 10px 0px 10px;"
          newLabel.innerHTML =
            this.varname[c - 1] + (c === this.size ? " = " : " + ");
          //newLabel.setAttribute("class", "form-label mb-2 me-2");
          newRow.appendChild(newLabel);
        }
        let newInput = document.createElement("input");
        newInput.type = "text";
        newInput.size = "1";
        newInput.id = "eqs-val-" + r;
        newRow.appendChild(newInput);
        newInput.setAttribute("class", "form-control mb-2");
      }
    },

    // When size changes clear old table and generate new one
    changeSize: function () {
      // Check size
      if (this.size < 1 || this.size > 26) {
        this.errormsg = "Size must be between 1 and 26";
        return;
      }
      for (let r = 1; r <= this.oldsize; r++) {
        document.getElementById("eqs-" + r).remove();
      }
      this.oldsize = this.size;
      this.generateTable();
    },

    // Read the equations and return matrix with coefficients and vector with constants
    generateMatrix(coefs, cons) {
      for (let r = 1; r <= this.size; r++) {
        coefs[r - 1] = [];
        let v = document.getElementById("eqs-val-" + r).value;
        cons[r - 1] = v === "" ? 0 : fraction(v);
        for (let c = 1; c <= this.size; c++) {
          let v = document.getElementById("eqs-" + r + "-" + c).value;
          coefs[r - 1][c - 1] = v === "" ? 0 : fraction(v);
        }
      }
    },

    // Main function
    solve: function () {
      // Reset
      this.result = "";
      this.errormsg = "";
      let ns, rs;

      // Get coefficients and constants
      let coefs = [];
      let cons = [];
      this.generateMatrix(coefs, cons);

      // Solve, catch error when something goes wrong
      try {
        let sols = lusolve(coefs, cons);

        // Printing solutions if any
        if (sols) {
          for (let i = 0; i < this.size; i++) {
            if (this.format === "1") {
              let n = floor(sols[i][0]);
              let r = subtract(sols[i][0], n);
              ns = isZero(n) != 0 ? "" : format(n, { fraction: "decimal" });
              rs = isZero(r) != 0 ? "" : format(r, { fraction: "ratio" });
              if (ns === "" && rs === "") ns = "0";
            } else {
              ns = format(sols[i][0], {
                fraction: "decimal",
                notation: "fixed",
                precision: 5,
              });
              rs = "";
            }
            this.result += this.varname[i] + " = " + ns + " " + rs + " / ";
          }
          this.result = this.result.slice(0, -3);
        } else {
          this.result = this.$t("equations.nosol");
        }
      } catch (e) {
        console.log(e);
        this.result = this.$t("equations.nosol");
      }
    },

  },
};

</script>

<style scoped>
</style>
