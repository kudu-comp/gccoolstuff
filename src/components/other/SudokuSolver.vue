<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{$t('othertools.sudokusolver.title')}}
    </div>
    <div class="mainpage">
      <div class="infoblock" v-html="$t('othertools.sudokusolver.long')" />
      <div class="form-inline mb-2">
        <label for="sudokutype" class="form-label mr-2">{{$t('sudoku.type')}}</label>
        <select name="sudokutype" id="sudokutype" class="form-control mr-2" v-model="sudokutype" @change="changeType">
          <option value="Sudoku">Sudoku</option>
          <option value="SudokuX">Sudoku X</option>
        </select>
        <label for="sudokutype" class="form-label mr-2">{{$t('sudoku.size')}}</label>
        <select name="sudokutype" id="sudokutype" class="form-control" v-model="size" @change="changeSize">
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
      </div>
      <table id="sudokutable">
      </table>
      <div class="mt-2 mb-2 mr-2">{{$t('sudoku.alt')}}</div>
      <div class="form-inline mb-2">
        <input type='text' id="knownnumbers" name="knownnumbers" ref="knownnumbers" v-model="knownnumbers" size="50" class="form-control">
      </div>
      <div>
        <input type="button" id="solve" name="solve" :value="$t('sudoku.solve')" class="btn btn-primary mb-2 mr-2" v-on:click="solveSudoku">
        <input type="button" id="reset" name="reset" :value="$t('buttons.reset')" class="btn btn-primary mb-2 mr-2" v-on:click="resetSudoku">
      </div>
      <p v-show="errormsg" class="errormsg">{{errormsg}}</p>
      <div class="mb-2" v-show="solved">
        {{$t('sudoku.thereare')}} {{numberofsolutions}} {{$t('sudoku.sols')}}
        <div class="form-inline mb-2">
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
  name: 'SudokuSolver',

  props: {
    msg: String
  },

  data: function() {
    return {
      codes : "123456789ABCDEFG",
      errormsg: "",
      size : 3,
      size2 : 9,
      solved : false,
      sudokutype: "Sudoku",
      knownnumbers : "",
      numberofsolutions : "",
      results: "",
      selectedsolution: "",
      phpurl: window.location.protocol + "//"  + window.location.hostname + "/sudokusolver/sudokusolver.php",
    }
  },

  mounted: function() {
    this.generateTable();
    this.$refs.knownnumbers.focus();
  },

  methods: {

    // Dynamically generate the 3x3 or 4x4 table
    generateTable() {
      let tableElement = document.getElementById("sudokutable");
      for (let r=1; r <= this.size2; r++) {
        let newRow = document.createElement("tr");
        newRow.id = "sudokurow-" + r;
        tableElement.appendChild(newRow);
        for (let c=1; c <= this.size2; c++) {
          let newCell = document.createElement("td");
          newRow.appendChild(newCell);
          let newInput = document.createElement("input");
          newInput.type="text";
          newInput.size="1";
          newInput.id = "box-" + r + "-" + c;
          let classstr="form-control ";
          if (c % this.size == 0) classstr += "mr-2 ";
          if (r % this.size == 0) classstr += "mb-2";
          newInput.setAttribute("class", classstr)
          newCell.appendChild(newInput);
        }
      }
    },

    // Generate the strings with known numbers from the table
    generateKnownNumbers() {
      if (this.knownnumbers != "") return this.knownnumbers;
      let hints = "";
      for (let r=1; r <= this.size2; r++) {
        for (let c=1; c <= this.size2; c++) {
          let v = document.getElementById("box-"+r+"-"+c).value;
          if (v != "") hints = hints + this.codes[r-1] + this.codes[c-1] + this.codes[v-1]  + ',';
        }
      }
      hints = hints.slice(0, hints.length-1);
      return hints;
    },

    // Print the selected solution from the dropdown
    printSolution : function() {
      for (let r=1; r <= this.size2; r++)
        for (let c=1; c <= this.size2; c++) {
          document.getElementById(['box-'+r+"-"+c]).value = parseInt(this.codes.indexOf(this.selectedsolution[((r-1)*this.size2)+c-1])) + 1;
        }
    },

    // Change the Sudokytype and change the background of the X if needed
    changeType : function () {
      let bgcolor = "";
      if (this.sudokutype == "SudokuX") bgcolor = "lightgray";
      for (let i=1; i <= this.size2; i++) {
        document.getElementById("box-" + i + "-" + i).style.backgroundColor = bgcolor;
        document.getElementById("box-" + i + "-" + (this.size2 + 1 - i)).style.backgroundColor = bgcolor;
        document.getElementById("box-" + (this.size2 + 1 - i) + "-" + i).style.backgroundColor = bgcolor;
        document.getElementById("box-" + (this.size2 + 1 - i) + "-" + (this.size2 + 1 -i)).style.backgroundColor = bgcolor;
      }
    },

    // Switch between Sudoku sizes
    changeSize : function () {
      for (let r=1; r <= this.size2; r++) {
        document.getElementById("sudokurow-" + r).remove();
      }
      this.size2 = this.size**2;
      this.generateTable();
      this.changeType();
    },

    // Reset sudoku, clear all fields
    resetSudoku: function () {
      for (let r=1; r <= this.size2; r++)
        for (let c=1; c <= this.size2; c++) {
          document.getElementById(['box-'+r+"-"+c]).value = "";
        }
    },

    // Solve the sudoku by calling the PHP script on the server
    solveSudoku : function () {

      this.errormsg = "";
      this.solved = false;
      let data = {
        sudokutype: this.sudokutype,
        size: this.size,
        knownnumbers: this.generateKnownNumbers(),
      };
      
      fetch(this.phpurl, {
          method: 'POST',
          body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
          this.solved = true;
          this.results = data.results;
          this.numberofsolutions = data.numberofsolutions;
          this.selectedsolution = this.results[0];
          if (this.numberofsolutions > 0) this.printSolution();
        })
        .catch((error) => {
          console.error('Error ', error);
          this.errormsg = this.$t('sudoku.error');
        });
    },
    
  }
}
</script>

<style scoped>
</style>
