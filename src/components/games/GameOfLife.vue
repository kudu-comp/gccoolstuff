<template>
  <div class="d-flex flex-column mx-4">
    <!-- Section head / page title -->
    <div class="sectionhead">
      {{ $t('gameoflife.title') }}
    </div>
    <!-- Main page -->
    <div class="mainpage">
      <!-- Start with info block -->
      <div
        class="infoblock"
        v-html="$t('gameoflife.long')"
      />
      <!-- Form fields -->
      <div class="row">
        <div class="col-md-4">
          <div class="row">
            <label for="sel" class="form-label sm-size mb-2">{{ $t('gameoflife.fillgrid') }}</label>
            <select v-model="sel" id="sel" ref="sel" class="form-control sm-size mb-2">
              <option value="0">{{ $t('gameoflife.empty') }}</option>
              <option value="1">{{ $t('gameoflife.random') }}</option>
              <option value="2">{{ $t('gameoflife.rndsym') }}</option>
            </select>
          </div>
          <div class="row">
            <label for="rows" class="form-label sm-size mb-2">{{ $t('gameoflife.rows') }}</label>
            <input
              id="rows"
              type="number"
              v-model="rows"
              class="form-control sm-size mb-2"
              min="0"
            />
          </div>
          <div class="row">
            <label for="cols" class="form-label sm-size mb-2">{{ $t('gameoflife.cols') }}</label>
            <input
              id="cols"
              type="number"
              v-model="cols"
              class="form-control sm-size mb-2"
              min="0"
            />
          </div>
          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input mb-2"
              id="chgrules"
              v-model="chgrules"
              @cupdate="chgrules = !chgrules"
            />
            <label for="chgrules" class="form-check-label mb-2">{{ $t('gameoflife.chgrules') }}</label>
          </div>
          <div class="row" v-show="chgrules">
            <label for="diebelow" class="form-label sm-size mb-2">{{ $t('gameoflife.diebelow') }}</label>
            <input
              id="diebelow"
              type="number"
              v-model="diebelow"
              class="form-control sm-size mb-2"
              min="0"
            />
          </div>
          <div class="row" v-show="chgrules">
            <label for="dieabove" class="form-label sm-size mb-2">{{ $t('gameoflife.dieabove') }}</label>
            <input
              id="dieabove"
              type="number"
              v-model="dieabove"
              class="form-control sm-size mb-2"
              min="0"
            />
          </div>
          <div class="row" v-show="chgrules">
            <label for="bornabove" class="form-label sm-size mb-2">{{ $t('gameoflife.bornabove') }}</label>
            <input
              id="bornabove"
              type="number"
              v-model="bornabove"
              class="form-control sm-size mb-2"
              min="0"
            />
          </div>
          <div class="row" v-show="chgrules">
            <label for="bornbelow" class="form-label sm-size mb-2">{{ $t('gameoflife.bornbelow') }}</label>
            <input
              id="bornbelow"
              type="number"
              v-model="bornbelow"
              class="form-control sm-size mb-2"
              min="0"
            />
          </div>
          <button @click="fillGrid()" class="btn mb-2 me-2">{{ $t('gameoflife.newgrid') }}</button>
          <button @click="step()" class="btn mb-2 me-2">{{ $t('gameoflife.step') }}</button>
          <p
            v-show="errormsg"
            class="errormsg"
          >
            {{ errormsg }}
          </p>
        </div>
        <div class="col-md-8">
          <div v-if="result" class="resultbox" v-html="result"></div>
          <canvas id="grid" @click="cellClicked"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

const szCell = 25;

export default {

  name: "GameOfLife",

  data() {
    return {
      sel: "0",
      rows: 10,
      cols: 10,
      diebelow: 2,
      dieabove: 3,
      bornabove: 3,
      bornbelow: 3,
      errormsg: "",
      game: null,
      result: "",
      gen: 0,
      cellsalive: 0,
      cvs: null,
      chgrules: false
    };
  },

  mounted: function () {
    this.$refs.sel.focus();
    this.cvs = document.getElementById("grid");
    this.fillGrid();
  },

  methods: {

    cellClicked: function (event) {
      let c = Math.trunc(event.offsetX / szCell);
      let r = Math.trunc(event.offsetY / szCell);
      if (this.game[r + 1][c + 1] === 0) {
        this.game[r + 1][c + 1] = 1;
      } else {
        this.game[r + 1][c + 1] = 0;
      }
      this.drawGame();
    },

    drawGame: function () {
      this.result = this.$t('gameoflife.gen') + this.gen.toString() + "<br>";
      this.result += this.$t('gameoflife.cellsalive') + this.cellsalive.toString();

      // Recalculate width and height based on current size and ratio
      // let szCell = this.cvs.width / this.rows;

      // Draw a grid on the canvas
      let ctx = this.cvs.getContext("2d");
      ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, this.cvs.width, this.cvs.height);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#aaaaaa";
      for (let i = 0; i <= this.rows; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * szCell);
        ctx.lineTo(this.cvs.width, i * szCell);
        ctx.stroke();
      }
      for (let i = 0; i <= this.cols; i++) {
        ctx.beginPath();
        ctx.moveTo(i * szCell, 0);
        ctx.lineTo(i * szCell, this.cvs.height);
        ctx.stroke();
      }

      // Color each cell
      ctx.fillStyle = "#09776E";
      for (let r = 1; r <= this.rows; r++) {
        for (let c = 1; c <= this.cols; c++) {
          if (this.game[r][c] === 1) {
            ctx.fillRect((c - 1) * szCell, (r - 1) * szCell, szCell, szCell);
          }
          //this.result += this.game[r][c] === 1 ? "x" : "-";
        }
        // this.result += "<br>";
      }
    },

    fillGrid: function () {
      this.gen = 0;
      this.cellsalive = 0;
      this.cvs.width = szCell * this.cols;
      this.cvs.height = szCell * this.rows;
      let maxcells = 0;

      this.game = new Array(this.rows + 2)
        .fill(null)
        .map(() => new Array(this.cols + 2).fill(0));

      switch (this.sel) {
        case "0":
          break;
        case "1":
          maxcells = Math.trunc(0.5 * this.cols * this.rows);
          for (let i = 0; i < maxcells; i++) {
            let x = Math.trunc(Math.random() * this.cols * this.rows);
            let c = x % this.cols;
            let r = Math.trunc(x / this.cols);
            this.game[r + 1][c + 1] = 1;
          }
          break;
        case "2":
          maxcells = Math.trunc(0.125 * this.cols * this.rows);
          let co = Math.round(this.cols / 2);
          let ro = Math.round(this.rows / 2);
          for (let i = 0; i < maxcells; i++) {
            let x = Math.trunc(Math.random() * co * ro);
            let c = x % co;
            let r = Math.trunc(x / co);
            this.game[r + 1][c + 1] = 1;
            this.game[r + 1][this.cols - c] = 1;
            this.game[this.rows - r][c + 1] = 1;
            this.game[this.rows - r][this.cols - c] = 1;
          }
          break;
      }

      // Count cells alive
      for (let r = 1; r <= this.rows; r++) {
        for (let c = 1; c <= this.cols; c++) {
          if (this.game[r + 1][c + 1] === 1) this.cellsalive++;
        }
      }
      this.drawGame();
    },

    step: function () {
      // Create an empty grid first
      let newGame = new Array(this.rows + 2)
        .fill(null)
        .map(() => new Array(this.cols + 2).fill(0));

      this.cellsalive = 0;
      for (let r = 1; r <= this.rows; r++) {
        for (let c = 1; c <= this.cols; c++) {
          let cnt =
            this.game[r - 1][c - 1] +
            this.game[r - 1][c] +
            this.game[r - 1][c + 1] +
            this.game[r][c - 1] +
            this.game[r][c + 1] +
            this.game[r + 1][c - 1] +
            this.game[r + 1][c] +
            this.game[r + 1][c + 1];
          if (
            this.game[r][c] === 1 &&
            cnt >= this.diebelow &&
            cnt <= this.dieabove
          ) {
            newGame[r][c] = 1;
            this.cellsalive++;
          }
          if (
            this.game[r][c] === 0 &&
            cnt >= this.bornabove &&
            cnt <= this.bornbelow
          ) {
            newGame[r][c] = 1;
            this.cellsalive++;
          }
        }
      }
      this.gen++;
      this.game = newGame;
      this.drawGame();
    }

  },
};

</script>

<style scoped>
</style>
