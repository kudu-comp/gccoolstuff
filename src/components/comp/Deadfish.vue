<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('deadfish.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('deadfish.long')"
      />
      <div class="form-check">
        <input
          id="debug"
          v-model="debug"
          type="checkbox"
          class="form-check-input me-2 mb-2"
        >
        <label
          for="debug"
          class="form-check-label mb-2"
        >{{ $t('brainfuck.debug') }}</label>
      </div>
      <button id="run" class="btn mb-2 me-2" @click="runCode()">
        {{ $t('brainfuck.run') }}
      </button>
      <div class="mb-2">
        <textarea
          id="code"
          ref="code"
          v-model="message"
          class="form-control mb-2"
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

export default {

  name: 'Deadfish',

  data: function () {
    return {
      message: "",
      result : "",
      errormsg: "",
      debug: false
    }
  },

  mounted: function() {
    this.$refs.code.focus();
  },

  methods: {

    // Translate the input
    runDeadfish : function (code) {

      /* Standard Deadfish   │   XKCD Variant   │    Meaning
        ─────────────────────┼──────────────────┼────────────────────────────────────
              i              │        x         │    Increment accumulator
              d              │        d         │    Decrement accumulator
              s              │        k         │    Square ( acc = acc * acc )
              o              │        c         │    Output accumulator, as a number
      */
        
      let acc = 0;
      let res = "";
      
      for (let c of code) {
        switch (c) {
          case "i" :
          case "x" :
            acc++;
            break;
          case "d" :
            acc--;
            break;
          case "s" :
          case "k" :
            acc *= acc;
            break;
          case "o" :
            res += acc + " ";
            break;
          default :
            res += "\n";
        }
        if (acc == 256 || acc == -1) acc = 0;
        if (this.debug) {
          console.log(`Command: ${c} - Accumulator after command: ${acc}`)
        }
      }
      return res;
    },

    runCode : function () {

      this.errormsg = "";
      
      try {
        
        this.result = this.runDeadfish(this.message);

      } catch (e) {

        this.errormsg = this.$t('errors.genericerror');
        console.log(e);

      }
    },

  },
}
</script>

<style scoped>
</style>
