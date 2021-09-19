<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{$t('comptools.compdeadfish.title')}}
    </div>
    <div class="mainpage">
      <div class="infoblock" v-html="$t('comptools.compdeadfish.long')" />
      <div class="form-row">
        <textarea id="code" name="code" class="form-control mb-2" ref="code" :placeholder="$t('compbf.code')" rows=10 v-model='message'></textarea>
      </div>
      <div class="form-inline">
        <input type="button" id="run" name="run" :value="$t('compbf.run')" class="btn btn-primary mb-2 mr-2" v-on:click="runCode">
        <div class="custom-control custom-checkbox">
          <input type="checkbox" name="debug" id="debug" v-model="debug" class="custom-control-input mr-2 mb-2">
          <label for="debug" class="custom-control-label mb-2">{{$t('compbf.debug')}}</label>
        </div>
      </div>
      <p v-show="errormsg" class="errormsg mt-2">{{errormsg}}</p>
      <div class="card card-text p-2">{{result}}</div>
    </div>
  </div>
</template>

<script>

export default {

  name: 'CompDeadfish',

  props: {
    msg: String,
  },

  data: function () {
    return {
      message: "",
      result : this.$t('labels.result'),
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
