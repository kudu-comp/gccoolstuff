<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('mmsolver.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('mmsolver.long')"
      />
      <div class="row">
        <label
          for="npin"
          class="form-label sm-size mb-2"
        >{{ $t('mmsolver.npin') }}</label>
        <select
          id="npin"
          ref="npin"
          v-model="npin"
          class="form-control sm-size mb-2"
        >
          <option value="3">
            3
          </option>
          <option value="4">
            4
          </option>
          <option value="5">
            5
          </option>
          <option value="6">
            6
          </option>
        </select>
      </div>
      <div class="row">
        <label
          for="ncolor"
          class="form-label sm-size mb-2"
        >{{ $t('mmsolver.ncolor') }}</label>
        <select
          id="ncolor"
          v-model="ncolor"
          class="form-control sm-size mb-2"
        >
          <option value="4">
            4
          </option>
          <option value="5">
            5
          </option>
          <option value="6">
            6
          </option>
          <option value="7">
            7
          </option>
          <option value="8">
            8
          </option>
          <option value="9">
            9
          </option>
        </select>
      </div>
      <div class="form-check">
        <input
          id="unique"
          v-model="unique"
          type="checkbox"
          class="form-check-input"
        >
        <label
          for="unique"
          class="form-check-label"
        >{{ $t('mmsolver.unique') }}</label>
      </div>
      <div class="mb-2">
        <table class="table-sm table-borderless">
          <thead>
            <tr>
              <th scope="col">
                {{ $t('mmsolver.pins') }}
              </th>
              <th scope="col">
                {{ $t('mmsolver.pos') }}
              </th>
              <th scope="col">
                {{ $t('mmsolver.col') }}
              </th>
            </tr>
          </thead>
          <tr
            v-for="(str, index) in pins"
            :key="index"
          >
            <td>
              <input
                v-model="pins[index]"
                type="text"
                size="4"
                min="1"
                max="999999"
                class="form-control"
              >
            </td>
            <td>
              <input
                v-model="pos[index]"
                type="number"
                size="1"
                min="1"
                max="9"
                class="form-control"
              >
            </td>
            <td>
              <input
                v-model="col[index]"
                type="number"
                size="1"
                min="1"
                max="9"
                class="form-control"
              >
            </td>
          </tr>
        </table>
      </div>
      <button id="solve" class="btn mb-2 me-2" @click="solveMM">
        {{ $t('sudokusolv.solve') }}
      </button>
      <button id="reset" class="btn mb-2" @click="resetMM">
        {{ $t('buttons.reset') }}
      </button>
      <p
        v-show="errormsg"
        class="errormsg"
      >
        {{ errormsg }}
      </p>
      <div
        v-show="solved"
        class="mt-2"
      >
        <span style="font-weight: bold;">
          {{ $t('sudokusolv.thereare') }} {{ results.length }} {{ $t('sudokusolv.sols') }}
        </span>
        <div class="form-inline mt-2 mb-2">
          <select
            id="listofresults"
            v-model="selectedsolution"
            size="10"
            class="form-select"
          >
            <option
              v-for="result in results"
              :key="result"
            >
              {{ result }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {

  name: 'MastermindSolver',

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
      errormsg: "",
      results: [],
      selectedsolution: "",
      solved: false
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
      this.errormsg = "";
      this.results = [];
      this.solved = false;

      // Check the hints
      for (let i=0; i < this.maxhints; i++) {

        // console.log(this.pins[i]);

        // On first empty hint stop and set number of hints
        if (this.pins[i].length === 0) {
          this.nhints = i;
          break;
        }

        // Check if #pins is correct
        if (this.pins[i].length !== this.npin) {
          this.errormsg = this.$t('mmsolver.invalidhint1');
          return;
        }

        // Check if pins are correct colors
        for (let j=0; j < this.npin; j++) {
          if (this.pins[i][j] < 1 ||  this.pins[i][j] > this.ncolor) {
            this.errormsg = this.$t('mmsolver.invalidhint2');
            return;
          }
        }

        // Check if pos and col are okay
        if ( parseInt(this.pos[i]) + parseInt(this.col[i]) > this.ncolor ) {
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
