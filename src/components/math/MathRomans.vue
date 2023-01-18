<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('mathtools.romans.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('mathtools.romans.long')"
      />
      <div class="form-row mb-2">
        <textarea
          id="message"
          ref="input"
          v-model="input"
          name="input"
          class="form-control"
          :placeholder="$t('labels.number')"
          rows="1"
        />
      </div>
      <input
        id="romantodec"
        type="button"
        name="romantodec"
        :value="$t('mathroman.btnrtd')"
        class="btn btn-primary mb-2 mr-2"
        @click="romanToDec"
      >
      <input
        id="dectoroman"
        type="button"
        name="dectoroman"
        :value="$t('mathroman.btndtr')"
        class="btn btn-primary mb-2 mr-2"
        @click="decToRoman"
      >
      <p
        v-show="errormsg"
        class="errormsg mb-2"
      >
        {{ errormsg }}
      </p>
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

export default {
  name: 'MathRomans',

  data: function () {
    return {
      input: "",
      result: "",
      ints: [1000, 500, 100, 50, 10, 5, 1],
      romans: ["M", "D", "C", "L", "X", "V", "I"]
    }
  },

  methods: {

    // Convert text to numbers
    romanToDec : function () {

      // Reset
      this.errormsg = "";
      this.result = "";

      // Convert input to array of roman numbers
      let a = this.input.match(/[MDCLXVI]+/ig);

      // Check for empty input
      if (a === null) {
        this.errormsg = this.$t('mathroman.notroman');
        return;
      }
      
      for (const elem of a) {

        // Process letters one by one look backwards if needed
        let h = 0;
        for (let i=0; i < elem.length; i++) {
          let c = elem[i].toUpperCase();
          let i1 = this.romans.indexOf(c);
          let i2 = i>0 ? this.romans.indexOf(elem[i-1].toUpperCase()) : -1;
          if (i2 > i1) {
            h += this.ints[i1] - 2*this.ints[i2];
          } else {
            h += this.ints[i1];
          }
        }
        this.result += h + " ";

      }

    },

    // Convert numbers to text
    decToRoman : function() {

      /// Reset interpreter
      this.result = "";
      this.errormsg = "";

      // Convert input to array of numbers
      let a = this.input.match(/[0-9]+/g);

      // Check for empty or invalid input
      if (a === null) {
        this.errormsg = this.$t('mathroman.invalidint');
        return;
      }
      
      for (const elem of a) {

        // Parse integer and check range
        let h2 = parseInt(elem);

        if (h2 > 3999 || h2 < 1) {
          this.errormsg = this.$t('mathroman.invalidint');
          continue;          
        }

        // Process 1000, 100, 10, 1 loop
        for (let i=0; i < this.ints.length; i+=2) {
          let h1 = Math.trunc(h2 / this.ints[i]);
          if (h1 == 0) continue;
          if (h1 == 9) {
            this.result += this.romans[i] + this.romans[i-2];
          } else if (h1 == 4) {
            this.result += this.romans[i] + this.romans[i-1];
          } else {
            if (h1 >= 5) {
              this.result += this.romans[i-1];
              h1 -= 5
            }
            for (let j=0; j < h1; j++) this.result += this.romans[i];
          }
          h2 %= this.ints[i];
        }
        this.result += " ";

      }
      
    },

  },
}
</script>

<style scoped>
</style>
