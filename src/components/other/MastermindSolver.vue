<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{$t('othertools.mmsolver.title')}}
    </div>
    <div class="mainpage">
      <div class="infoblock" v-html="$t('othertools.mmsolver.long')" />
      <div class="form-inline mb-2">
        <label for="npin" class="form-label mr-2">{{$t('mmsolver.npin')}}</label>
        <select name="npin" id="npin" ref="npin" class="form-control mr-2" v-model="npin">
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
        </select>
        <label for="ncolor" class="form-label mr-2">{{$t('mmsolver.ncolor')}}</label>
        <select name="ncolor" id="ncolor" class="form-control" v-model="ncolor">
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
        </select>
        <div class="custom-control custom-checkbox">
          <input type="checkbox" name="unique" id="unique" v-model="unique" class="custom-control-input ml-2">
          <label for="unique" class="custom-control-label ml-2">{{$t('mmsolver.unique')}}</label>
        </div>
      </div>
      <div class="mb-2">
        <table class="table-sm table-borderless">
          <thead><tr>
            <th scope="col">{{$t('mmsolver.pins')}}</th>
            <th scope="col">{{$t('mmsolver.pos')}}</th>
            <th scope="col">{{$t('mmsolver.col')}}</th>
          </tr></thead>
          <tr v-for="(str, index) in pins" :key="index">
            <td><input type="number" size="4" min="1" max="999999" v-model="pins[index]" class="form-control"/></td>
            <td><input type="number" size="1" min="1" max="9" v-model="pos[index]" class="form-control"/></td>
            <td><input type="number" size="1" min="1" max="9" v-model="col[index]" class="form-control"/></td>
          </tr>
        </table>
      </div>
      <div>
        <input type="button" id="solve" name="solve" :value="$t('sudoku.solve')" class="btn btn-primary mb-2 mr-2" v-on:click="solveMM">
        <input type="button" id="reset" name="reset" :value="$t('buttons.reset')" class="btn btn-primary mb-2 mr-2" v-on:click="resetMM">
      </div>
      <p v-show="error" class="errormsg">{{errormsg}}</p>
      <div class="mt-2" v-show="solved">
        {{$t('sudoku.thereare')}} {{results.length}} {{$t('sudoku.sols')}}
        <div class="form-inline mt-2 mb-2">
          <label for="listofresults" class="form-label mr-2">Solutions</label>
          <select name="listofresults" id="listofresults" class="form-control" v-model="selectedsolution" @change="printSolution">
            <option v-for="result in results" :key="result">{{result}}</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {

  name: 'MastermindSolver',

  props: {
    msg: String
  },

  data: function() {
    return {
      maxhints: 12,
      npin : 4,
      ncolor : 6,
      unique: false,
      // hints
      pins:[],
      pos: [],
      col: [],
      nhints: 0,
      error: false,
      errormsg: "",
      results: [],
      selectedsolution: "",
      solved: false,
      phpurl: window.location.protocol + "//"  + window.location.hostname + "/sudokusolver/sudokusolver.php",
    }
  },

  mounted: function() {
    this.$refs.npin.focus();
    this.resetMM();
  },

  methods: {

    // Reset the board
    resetMM: function() {
      for(let i = 0; i < this.maxhints; i++) {
        this.pins[i] = "";
        this.pos[i] = 0;
        this.col[i] = 0;
      }
    },

    // Print the selected solution from the dropdown
    printSolution : function() {
      for (let r=1; r <= this.npin; r++) {
        // Print each pin
      }
    },

    checkpins: function check (pins) {

      for (let i=0; i < this.nhints; i++) {

        // Reset pins for new match
        let temp = this.pins[i].split("");

        // Position and color match
        let pos = 0;
        for (let j=0; j < this.npin; j++) {
          if (temp[j] == pins[j]) {
            pos++;
            // Avoid counting again for color match
            temp[j] = "x";
          }
        }
        if (pos != this.pos[i]) return false;

        // Color only match
        let col = 0;
        for (let j=0; j < this.npin; j++) {
          // Numbers who have been matched on position must be skipped
          if (temp[j] == 'x') continue;
          let idx = temp.indexOf(pins[j]);
          if (idx >= 0) {
            col++;
            // Avoid counting again, do not set to x because that assumed it was matched on position
            temp[idx] = "y";
          }
        }
        if (col != this.col[i]) return false;

      }

      // All tests passed
      return true;

    },

    generatePins: function gen(s, np, nc, uniq, check, res) {

      // While the string is not the required length generate
      // recursive function calls
      if (s.length < np) {
        for (let p=1; p <= nc; p++) {
          if (uniq && s.indexOf(p) >= 0) continue;
          gen(s + p, np, nc, uniq, check, res);
        }
      } else {
        if (check(s)) {
          res.push(s);
        }
      }

    },

    // solve the mastermind puzzle
    solveMM : function () {

      // reset
      this.error = false;
      this.results = [];
      this.solved = false;

      // Check the hints
      for (let i=0; i < this.maxhints; i++) {

        // On first empty hint stop and set number of hints
        if (this.pins[i] === "") {
          this.nhints = i;
          break;
        }

        // Check if #pins is correct
        if (this.pins[i].length != this.npin) {
          this.error = true;
          this.errormsg = this.$t('mmsolver.invalidhint1');
          return;
        }

        // Check if pins are correct colors
        for (let j=0; j < this.npin; j++) {
          if (this.pins[i][j] < 1 ||  this.pins[i][j] > this.ncolor) {
            this.error = true;
            this.errormsg = this.$t('mmsolver.invalidhint2');
            return;
          }
        }

        // Check if pos and col are okay
        if ( parseInt(this.pos[i]) + parseInt(this.col[i]) > this.ncolor ) {
          this.error = true;
          this.errormsg = this.$t('mmsolver.invalidhint3');
          return;
        }
      }

      // Solve the puzzle
      this.generatePins("", this.npin, this.ncolor, this.unique, this.checkpins, this.results);

      // Print the results
      this.solved = true;

    },
  }
}
</script>

<style scoped>
</style>
