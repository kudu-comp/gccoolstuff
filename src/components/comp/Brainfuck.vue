<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('brainfuck.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('brainfuck.long')"
      />
      <div class="row">
        <label
          class="form-label mb-2 md-size"
          for="bfvar"
        >{{ $t('brainfuck.vars') }}</label>
        <select
          id="bfvar"
          v-model="selBF"
          class="form-select mb-2 md-size"
          style="width: 150px;"
        >
          <option
            v-for="(bfvar, index) in bfvars"
            :key="index"
            :value="index"
          >
            {{ bfvar }}
          </option>
        </select>
      </div>
      <div class="row">
        <label
          class="form-label mb-2 md-size"
          for="input"
        >{{ $t('brainfuck.input') }}</label>
        <input
          id="input"
          v-model="input"
          type="text"
          class="form-control mb-2 lg-size"
        >
      </div>
      <div class="form-check">
        <input
          id="shorthand"
          v-model="shorthand"
          type="checkbox"
          class="form-check-input me-2 mb-2"
        >
        <label
          for="shorthand"
          class="form-check-label mb-2"
        >{{ $t('brainfuck.shorthand') }}</label>
      </div>
      <input
        id="run"
        type="button"
        :value="$t('brainfuck.run')"
        class="btn mb-2 me-2"
        @click="runBrainfuck"
      >
      <div class="mb-2">
        <textarea
          id="code"
          ref="code"
          v-model="message"
          class="form-control"
          :placeholder="$t('brainfuck.code')"
          rows="5"
        />
      </div>
      <p
        v-show="errormsg"
        class="errormsg mt-2"
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
import * as bf from '@/scripts/brainfuck.js'

export default {

  name: 'Brainfuck',

  data: function () {
    return {
      message: "",
      result : "",
      selBF : 0,
      input: "",
      shorthand: false,
      bfvars: [],
      fill: "",
      errormsg: ""
    }
  },

  mounted: function() {
    this.$refs.code.focus();
    this.bfvars = bf.vars;
    if (this.$route.params.bfvar) {
      for (let i = 0; i < this.bfvars.length; i++)
        if (this.bfvars[i] == this.$route.params.bfvar) this.selBF = i;
    }
  },

  methods: {

    // Translate the input
    runBrainfuck : function () {

      // Reset error flag
      this.errormsg = "";
      let bfcode = "";

      try {
        
        // Run preprocessor if not plain brainfuck
        // Preprocessor removes comments (any character not brainfuck)
        // Preprocessor translates Trivial Brainfuck Substitutes to standard Brainfuck
        bfcode = bf.preprocess(this.message, this.selBF);
        
        // If shorthand is used expand before running the code
        if (this.shorthand) bfcode = bf.extendshorthand(bfcode)
        
        // Run the code
        this.result = bf.run(bfcode, this.input);

      } catch (e) {

        this.errormsg = this.$t('errors.generic');
        console.log(e);

      }
    },

  },
}
</script>

<style scoped>
</style>
