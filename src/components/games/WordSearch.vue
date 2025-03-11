<template>
  <div class="d-flex flex-column mx-4">
    <!-- Section head / page title -->
    <div class="sectionhead">
      {{ $t('wordsearch.title') }}
    </div>
    <!-- Main page -->
    <div class="mainpage">
      <!-- Start with info block -->
      <div
        class="infoblock"
        v-html="$t('wordsearch.long')"
      />
      <!-- Form fields -->
      <label
          for="grid"
          class="form-label sm-size mb-2"
        >{{ $t('wordsearch.grid') }}
      </label>
      <div class="mb-2">
        <textarea
          id="grid"
          v-model="grid"
          style="font-family:'Courier New', Courier, monospace"
          class="form-control"
          rows="5"
        />
      </div>
      <label
          for="words"
          class="form-label sm-size mb-2"
        >{{ $t('wordsearch.words') }}
      </label>
      <div class="mb-2">
        <textarea
          id="words"
          v-model="words"
          style="font-family:'Courier New', Courier, monospace"
          class="form-control"
          rows="5"
        />
      </div>
      <!-- <v-calculate class="mb-2" id="calc" @calculate="doAction()"></v-calculate> -->
      <button class="btn mb-2" id="btn1" @click="solve()">
        <i class="fa-solid fa-puzzle-piece me-2"></i>{{$t('buttons.solve')}}
      </button>
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
      <div>
        <canvas id="puzzle"></canvas>
      </div>
    </div>
  </div>
</template>

<script>

export default {

  name: "WordSearch",

  components: {
        
  },

  data() {
    return {
      grid: "",
      words: "",
      gridarr: [],
      checkarr: [],
      nrow: 0,
      ncol: 0,
      result: "",
      errormsg: "",
      boxsize: 30,
      bgcolor : "#eeeeee",
      txtcolor : "#09776E",
      strikecolor : "#59e2d7",
      circlecolor: "#95a832"
    };
  },

  methods: {

    // Try word starting at position r, c
    tryPos: function (r, c, w) {
      // Try all direction but only if the word would fit
      for (let dir = 0; dir < 8; dir++) {
        switch (dir) {
          case 0: // North
            if (r - w.length < -1) continue;
            break;
          case 1: // Northeast
            if (r - w.length < -1 || c + w.length > this.ncol) continue;
            break;
          case 2: // East
            if (c + w.length > this.ncol) continue;
            break;
          case 3: // Southeast
            if (r + w.length > this.nrow || c + w.length > this.ncol) continue;
            break;
          case 4: // South
            if (r + w.length > this.nrow) continue;
            break;
          case 5: // Southwest
            if (r + w.length > this.nrow || c - w.length < -1) continue;
            break;
          case 6: // West
            if (c - w.length < -1) continue;
            break;
          case 7: // Northwest
            if (r - w.length < -1 || c - w.length < -1) continue;
            break;
        }
        if (this.tryDir(r, c, dir, w)) return true;
      }
      return false;
    },

    // Try word started at r,c in the given direction
    tryDir: function (r, c, dir, w) {
      // Check the word in the given direction NESW is 0 to 7
      let moves = [
        [-1, 0],
        [-1, 1],
        [0, 1],
        [1, 1],
        [1, 0],
        [1, -1],
        [0, -1],
        [-1, -1],
      ];
      for (let i = 1; i < w.length; i++) {
        if (this.gridarr[r + moves[dir][0] * i][c + moves[dir][1] * i] !== w[i])
          return false;
      }

      // Check if this was part of a longer word, these are already found
      // To do

      // Cross the used letters
      for (let i = 0; i < w.length; i++) {
        this.checkarr[r + moves[dir][0] * i][c + moves[dir][1] * i] = true;
      }
      // Strike through word
      this.strikethroughWord(
        r,
        c,
        r + moves[dir][0] * (w.length - 1),
        c + moves[dir][1] * (w.length - 1)
      );
      return true;
    },
    
    // Draw canvas
    drawCanvas: function () {
      let canvas = document.getElementById("puzzle");
      canvas.width = this.ncol * this.boxsize;
      canvas.height = this.nrow * this.boxsize;
      let ctx = canvas.getContext("2d");
      ctx.fillStyle = this.bgcolor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = this.txtcolor;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "32px courier";
      for (let r = 0; r < this.nrow; r++)
        for (let c = 0; c < this.ncol; c++)
          ctx.fillText(
            this.gridarr[r][c],
            (c + 0.5) * this.boxsize,
            (r + 0.5) * this.boxsize
          );
    },

    strikethroughWord: function (startr, startc, endr, endc) {
      let canvas = document.getElementById("puzzle");
      let ctx = canvas.getContext("2d");
      ctx.strokeStyle = this.strikecolor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo((startc + 0.5) * this.boxsize, (startr + 0.5) * this.boxsize);
      ctx.lineTo((endc + 0.5) * this.boxsize, (endr + 0.5) * this.boxsize);
      ctx.stroke();
    },

    circleRemainingLetters: function () {
      let canvas = document.getElementById("puzzle");
      let ctx = canvas.getContext("2d");
      ctx.strokeStyle = this.circlecolor;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "48px courier";
      for (let r = 0; r < this.nrow; r++)
        for (let c = 0; c < this.ncol; c++)
          if (!this.checkarr[r][c]) {
            ctx.beginPath();
            ctx.arc(
              (c + 0.5) * this.boxsize,
              (r + 0.5) * this.boxsize,
              this.boxsize * 0.47,
              0,
              2 * Math.PI
            );
            ctx.stroke();
          }
    },

    solve: function () {
      // Reset
      this.result = "";
      this.errormsg = "";
      this.gridarr = [];
      this.checkarr = [];

      // Split the grid in lines and check if each line has the same length
      let gridlines = this.grid
        .trim()
        .toUpperCase()
        .split(/[\n\r]/g);
      let h = gridlines[0].length;
      if (h === 0) {
        this.errormsg = this.$t('errors.noinput');
        return;
      }
      for (let i = 1; i < gridlines.length; i++) {
        if (gridlines[i].length !== h) {
          this.errormsg = this.$t("wordsearch.griderror");
          return;
        }
      }

      // Split each gridline into chars and fill the arrays
      for (let g of gridlines) {
        this.gridarr.push([...g]);
        this.checkarr.push([...g].map((e) => false));
      }
      this.nrow = this.gridarr.length;
      this.ncol = this.gridarr[0].length;
      console.log(this.nrow, this.ncol);

      // Build a list of words
      let words = this.words
        .trim()
        .toUpperCase()
        .split(/[\n\r]/g);
      // Sort the list descending so longer words come first
      words = words.sort().reverse();

      // Draw the puzzle
      this.drawCanvas();

      // Try to find all the words
      for (let w = 0; w < words.length; w++) {
        // Get starting positions
        let found = false;
        for (let r = 0; r < this.nrow && !found; r++)
          for (let c = 0; c < this.ncol && !found; c++)
            if (this.gridarr[r][c] === words[w][0]) {
              found = this.tryPos(r, c, words[w]);
            }

        // If word hasn't been found raise an error
        if (!found) {
          this.errormsg = words[w] + this.$t('wordsearch.notfound');
          return;
        }
      }

      // Print all the letters that are not checked
      this.circleRemainingLetters();
      this.result = this.$t('wordsearch.remletters');
      for (let r = 0; r < this.nrow; r++)
        for (let c = 0; c < this.ncol; c++)
          if (!this.checkarr[r][c]) this.result += this.gridarr[r][c];
    },
  },

};

</script>

<style scoped>
</style>
